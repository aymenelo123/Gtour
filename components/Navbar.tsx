"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAudio } from "./AudioProvider";
import { Volume2, VolumeX, Wallet, UserCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const { isMuted, toggleMute } = useAudio();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBalance = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // سحب الرصيد من جدول profiles كما طلبت
        const { data, error } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', session.user.id)
          .single();
          
        if (isMounted) {
          if (data && data.balance !== undefined) {
            setBalance(data.balance);
          } else {
            // كخيار احتياطي إذا لم يكن الجدول مجهزاً بالرصيد
            setBalance(session.user.user_metadata?.balance ?? 0);
          }
        }
      }
    };

    fetchBalance();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchBalance();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/rooms", label: "غرف 1 ضد 1" },
    { href: "/tournaments", label: "البطولات" },
    { href: "/house", label: "ضد المنصة" },
  ];

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
            <Link href="/wallet">
              <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-md hover:border-primary transition-all cursor-pointer">
                <Wallet size={16} className="text-secondary" />
                <span className="text-sm font-bold text-foreground">
                  ${balance !== null ? balance.toFixed(2) : "0.00"}
                </span>
              </div>
            </Link>
            <Link href="/login">
              <Button size="sm" className="gap-2 bg-red-600 hover:bg-red-700 text-white border border-white/50 hover:border-white font-bold shadow-[0_0_10px_rgba(220,38,38,0.3)] hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all">
                <UserCircle size={16} />
                تسجيل الدخول
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
