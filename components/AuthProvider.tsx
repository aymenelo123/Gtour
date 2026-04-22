"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
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

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Prevent concurrent profile fetches
  const fetchingRef = useRef<boolean>(false);

  const fetchProfile = async (userId: string) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (!error.message?.includes('Lock "lock:sb-')) {
          console.error("Error fetching profile:", error);
        }
        return;
      }

      setProfile(data);
    } catch (err: any) {
      if (!err.message?.includes('Lock broken by another request') && !err.message?.includes('Lock "lock:sb-')) {
        console.error("Unexpected error fetching profile:", err);
      }
    } finally {
      fetchingRef.current = false;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      setIsLoading(true);
      await fetchProfile(user.id);
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id);
          }
          setIsLoading(false);
        }
      } catch (err: any) {
        if (!err.message?.includes('Lock broken by another request') && !err.message?.includes('Lock "lock:sb-')) {
          console.error("Error initializing auth:", err);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        // slight delay to prevent absolute collision on fast refreshes
        setTimeout(async () => {
          await fetchProfile(newSession.user.id);
        }, 50);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, profile, session, isLoading, refreshProfile, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
