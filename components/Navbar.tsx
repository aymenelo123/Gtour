"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAudio } from "./AudioProvider";
import { useAuth } from "./AuthProvider";
import { useWallet } from "@/context/WalletContext";
import { Volume2, VolumeX, Wallet, UserCircle, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMuted, toggleMute } = useAudio();
  const { user, profile, isLoading, signOut, refreshProfile } = useAuth();
  const { balance } = useWallet();
  const [imageError, setImageError] = useState(false);
  const [animateBalance, setAnimateBalance] = useState(false);

  useEffect(() => {
    setAnimateBalance(true);
    const timeout = setTimeout(() => setAnimateBalance(false), 300);
    return () => clearTimeout(timeout);
  }, [balance]);

  useEffect(() => {
    if (!user) return;

    // Realtime subscription to keep balance in sync with database
    const channel = supabase
      .channel("navbar-profile-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        () => {
          refreshProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refreshProfile]);

  useEffect(() => {
    setImageError(false);
  }, [profile?.avatar_url]);

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/rooms", label: "غرف 1 ضد 1" },
    { href: "/tournaments", label: "البطولات" },
    { href: "/house", label: "ضد المنصة" },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const displayBalance = balance;

  return (
    <nav className="fixed top-0 w-full z-50 bg-card border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                ArenaBet
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-bold transition-colors hover:text-accent ${
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMute}
              className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
              aria-label="Toggle sound"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-24 h-8 bg-slate-800/50 rounded-md animate-pulse"></div>
                <div className="w-8 h-8 bg-slate-800/50 rounded-full animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                {profile?.is_admin && (
                  <Link href="/dashboard/admin/deposits" className="hidden lg:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-red-500 transition-colors mr-2">
                    <ShieldCheck size={16} />
                    <span>إدارة الإيداعات</span>
                  </Link>
                )}

                <Link href="/dashboard/deposit" className="hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-emerald-500 transition-colors mr-2">
                  <Wallet size={16} />
                  <span>شحن الرصيد</span>
                </Link>

                <Link href="/dashboard">
                  <div className={`flex items-center gap-2 bg-background border px-3 py-1.5 rounded-md hover:border-primary transition-all cursor-pointer ${animateBalance ? 'border-primary shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105' : 'border-border'}`}>
                    <Wallet size={16} className={`transition-colors ${animateBalance ? 'text-primary' : 'text-secondary'}`} />
                    <span className={`text-sm font-bold transition-colors ${animateBalance ? 'text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'text-foreground'}`}>
                      {displayBalance.toFixed(2)} DA
                    </span>
                  </div>
                </Link>
                
                <div className="flex items-center gap-2 mr-2">
                  <Link href="/dashboard/settings" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
                    {profile?.avatar_url && !imageError ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[#2A3441] group-hover:border-primary transition-colors">
                         <img 
                           src={profile.avatar_url} 
                           alt="Avatar" 
                           className="w-full h-full object-cover" 
                           onError={() => setImageError(true)}
                         />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-[#2A3441] flex items-center justify-center group-hover:border-primary transition-colors">
                        <UserCircle className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-300 hidden sm:inline-block group-hover:text-white transition-colors">
                      {profile?.username || user.email?.split('@')[0]}
                    </span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    title="تسجيل الخروج"
                  >
                    <LogOut size={18} />
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="gap-2 bg-red-600 hover:bg-red-700 text-white border border-white/50 hover:border-white font-bold shadow-[0_0_10px_rgba(220,38,38,0.3)] hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all">
                  <UserCircle size={16} />
                  تسجيل الدخول
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
