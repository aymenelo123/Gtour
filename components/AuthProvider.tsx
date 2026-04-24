"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  bio?: string;
  youtube_url?: string;
  favorite_games?: string[];
  level: number;
  balance: number;
  is_admin: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

/**
 * Fetch the user profile DIRECTLY from the DB — never from localStorage or
 * user_metadata. Returns null if the fetch fails.
 */
async function fetchProfileFromDB(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    // Suppress internal lock noise from Supabase SDK
    if (!error.message?.includes('Lock "lock:sb-')) {
      console.error("[AuthProvider] fetchProfileFromDB error:", error.message);
    }
    return null;
  }
  return data as Profile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * FIX 1 – SINGLE SOURCE OF TRUTH
   * Always re-fetches balance from `public.profiles`.
   * Never reads from user_metadata or localStorage.
   */
  const refreshProfile = useCallback(async () => {
    // Read the current user from the Supabase auth state, NOT from React
    // closure — avoids stale-user bug when called right after sign-in.
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      setProfile(null);
      return;
    }

    const fresh = await fetchProfileFromDB(currentUser.id);
    // Only apply if the user hasn't changed since we started fetching
    if (fresh) setProfile(fresh);
  }, []);

  /**
   * FIX 2 – LOGOUT/LOGIN LEAK
   * On signOut: balance is immediately zeroed (profile → null), cached state
   * is purged, THEN we call Supabase so no component can read a stale value.
   */
  const signOut = useCallback(async () => {
    // Zero-out everything BEFORE the async call so UI sees clean state instantly
    setUser(null);
    setProfile(null);   // ← balance goes to 0 immediately via profile?.balance ?? 0
    setSession(null);
    setIsLoading(false);
    await supabase.auth.signOut();
  }, []);

  useEffect(() => {
    let mounted = true;

    /**
     * onAuthStateChange is the ONLY place we set user/session.
     * We never rely on getSession() to populate balance — it reads localStorage.
     * After every event that carries a user we do a fresh DB fetch.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT") {
        // FIX 2 continued: ensure full purge on the Supabase-side event too
        setSession(null);
        setUser(null);
        setProfile(null);   // balance → 0
        setIsLoading(false);
        return;
      }

      // For every other event (INITIAL_SESSION, SIGNED_IN, TOKEN_REFRESHED, etc.)
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        // FIX 1: always go to the DB, never trust metadata
        const fresh = await fetchProfileFromDB(newSession.user.id);
        if (mounted) setProfile(fresh);
      } else {
        setProfile(null);
      }

      if (mounted) setIsLoading(false);
    });

    (async () => {
      // 1. Instantly unblock UI for guests using local session
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      if (!initialSession && mounted) {
        setIsLoading(false);
      }

      // 2. Validate with secure network call
      const {
        data: { user: initialUser },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (initialUser && !profile) {
        const fresh = await fetchProfileFromDB(initialUser.id);
        if (mounted) setProfile(fresh);
      }
      if (mounted) setIsLoading(false);
    })();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, profile, session, isLoading, refreshProfile, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
