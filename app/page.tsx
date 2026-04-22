"use client";

import * as LucideIcons from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useWallet } from "@/context/WalletContext";
import { toast } from "sonner";
import { mockGames, mockMatches, mockTournaments, mockRecentResults } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trophy, Swords, Zap, Search, Gamepad as GamepadIcon } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { balance, deductBalance } = useWallet();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E1217] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/10 opacity-50 animate-pulse pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center gap-6">
          <Badge variant="outline" className="text-secondary border-secondary/50 bg-secondary/10 px-4 py-1 text-sm">
            🔥 الموسم الثامن متاح الآن
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-2xl">
            العب. راهن. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">اربح حقيقياً.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mt-4">
            انضم إلى أكبر منصة عربية لتحديات الرياضات الإلكترونية. تنافس مع ملايين اللاعبين في ألعابك المفضلة واربح جوائز نقدية فورية.
          </p>
          <div className="flex gap-4 mt-8">
            <div className="relative group">
              <span className="absolute inset-0 bg-purple-500 rounded-lg opacity-20 animate-ping" />
              <Link href="/rooms" className="relative z-10 w-full block">
                <Button 
                  size="lg" 
                  className="w-full h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(83,74,183,0.5)]"
                >
                  <Search className="ml-2 w-5 h-5" />
                  ابحث عن منافس
                </Button>
              </Link>
            </div>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-border hover:bg-white/5">
              كيف يعمل؟
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-16">
        
        {/* Game Selector */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="text-secondary" />
              اختر لعبتك
            </h2>
          </div>
          <ScrollArea className="w-full whitespace-nowrap rounded-lg pb-4">
            <div className="flex w-max space-x-4 space-x-reverse p-1">
              {mockGames.map((game) => {
                const Icon = LucideIcons[game.iconName as keyof typeof LucideIcons] as React.ElementType;
                return (
                  <Link
                    key={game.id}
                    href={`/rooms?game=${game.id}`}
                    className={`flex flex-col items-center justify-center gap-3 w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br ${game.gradient} hover:-translate-y-2 hover:scale-105 hover:brightness-110 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden relative group`}
                  >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    <div className="relative z-10 text-white drop-shadow-md">
                      {Icon ? <Icon className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} /> : <GamepadIcon className="w-12 h-12" />}
                    </div>
                    <span className="font-bold text-white text-sm md:text-base relative z-10 drop-shadow-md">{game.title}</span>
                  </Link>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        {/* Live Matches Grid */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Swords className="text-primary" />
              تحديات مفتوحة
            </h2>
            <Button variant="ghost" className="text-secondary hover:text-secondary/80">عرض الكل</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockMatches.map((match) => (
              <Card key={match.id} className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-[0_10px_30px_rgba(99,102,241,0.2)] transition-all duration-300 group">
                <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -ml-10 -mt-10 group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {mockGames.find(g => g.id === match.game)?.title}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-mono">ID: #{match.id}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 my-6">
                    <Avatar className="h-16 w-16 border-2 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                      <AvatarImage src={match.avatar} />
                      <AvatarFallback>{match.player.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{match.player}</h3>
                      <p className="text-sm text-muted-foreground">يبحث عن خصم</p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300"
                    onClick={() => {
                      if (balance < match.amount) {
                        toast.error('رصيد غير كافٍ. يرجى شحن محفظتك.', {
                          className: 'border-red-500/50 bg-red-950/90 text-white'
                        });
                        return;
                      }
                      
                      if (deductBalance(match.amount)) {
                        toast.success(`تم خصم ${match.amount} DA. جاري الدخول للحلبة...`, {
                          className: 'border-indigo-500/50 bg-indigo-950/90 text-white'
                        });
                        router.push(`/rooms/${match.id}`);
                      }
                    }}
                  >
                    العب مقابل {match.amount} DA
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tournaments Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="text-yellow-500" />
              البطولات القادمة
            </h2>
            <Button variant="ghost" className="text-secondary hover:text-secondary/80">عرض الكل</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTournaments.map((tournament) => (
              <Card key={tournament.id} className="bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(251,191,36,0.15)] hover:border-yellow-500/30 group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-yellow-500/10 transition-all pointer-events-none" />
                <CardHeader className="relative z-10 border-b border-white/5 pb-4">
                  <CardTitle className="text-xl text-white group-hover:text-yellow-400 transition-colors">{tournament.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{tournament.game} • {tournament.startsAt}</p>
                </CardHeader>
                <CardContent className="relative z-10 pt-4">
                  <div className="bg-black/20 rounded-lg p-4 mb-4 flex justify-between items-center border border-white/5">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">مجموع الجوائز</p>
                      <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">{tournament.prizePool} DA</p>
                    </div>
                    <div className="w-[1px] h-10 bg-white/10" />
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">رسوم الدخول</p>
                      <p className="text-lg font-bold text-white">{tournament.entryFee} DA</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-400 font-medium">التسجيل</span>
                       <span className="text-white font-mono font-bold tracking-widest">{tournament.currentSlots}<span className="text-slate-500 font-normal">/{tournament.maxSlots}</span></span>
                    </div>
                    <Progress value={(tournament.currentSlots / tournament.maxSlots) * 100} className="h-3 bg-white/5 border border-white/10 rounded-full overflow-hidden" indicatorClassName="bg-gradient-to-r from-yellow-500 to-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                  </div>
                </CardContent>
                <CardFooter className="relative z-10 bg-black/10 pt-4 border-t border-white/5">
                  <Button className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.4)] hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] transition-all duration-300 font-bold text-base h-12 border-0">
                    سجل الآن
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Results Ticker */}
      <div className="w-full bg-background border-t border-border mt-8 py-3 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">النتائج الأخيرة:</span>
          <div className="flex gap-6 animate-pulse overflow-hidden w-full">
            {mockRecentResults.map((result) => (
              <div key={result.id} className="flex items-center gap-2 whitespace-nowrap bg-card px-3 py-1 rounded-md border border-border text-sm">
                <span className="font-bold text-white">{result.winner}</span>
                <span className="text-muted-foreground">فاز بـ</span>
                <span className="text-secondary font-bold">{result.amount} DA</span>
                <span className="text-xs text-muted-foreground mr-2">({result.time})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
