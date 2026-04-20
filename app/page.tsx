"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { mockGames, mockMatches, mockTournaments, mockRecentResults } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trophy, Swords, Zap, Search } from "lucide-react";

export default function Home() {
  const router = useRouter();
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
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-lg">
            العب. راهن. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">اربح حقيقياً.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mt-4">
            انضم إلى أكبر منصة عربية لتحديات الرياضات الإلكترونية. تنافس مع ملايين اللاعبين في ألعابك المفضلة واربح جوائز نقدية فورية.
          </p>
          <div className="flex gap-4 mt-8">
            <Button size="lg" className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(83,74,183,0.5)]">
              <Search className="ml-2 w-5 h-5" />
              ابحث عن منافس
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-border hover:bg-white/5">
              كيف يعمل؟
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-16">
        
        {/* Game Selector */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            <Zap className="text-secondary" />
            اختر لعبتك
          </h2>
          <ScrollArea className="w-full whitespace-nowrap rounded-lg">
            <div className="flex w-max space-x-4 space-x-reverse p-1">
              {mockGames.map((game) => (
                <button
                  key={game.id}
                  className="flex items-center gap-3 bg-card border border-border hover:border-primary hover:shadow-[0_0_15px_rgba(83,74,183,0.3)] transition-all rounded-full px-6 py-3"
                >
                  <span className="text-2xl">{game.icon}</span>
                  <span className="font-bold text-white">{game.title}</span>
                </button>
              ))}
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
              <Card key={match.id} className="bg-card border-border hover:border-primary/50 transition-colors group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary border-none">
                      {mockGames.find(g => g.id === match.game)?.title}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-mono">ID: #{match.id}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 my-6">
                    <Avatar className="h-16 w-16 border-2 border-primary/50">
                      <AvatarImage src={match.avatar} />
                      <AvatarFallback>{match.player.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-white">{match.player}</h3>
                      <p className="text-sm text-muted-foreground">يبحث عن خصم</p>
                    </div>
                  </div>
                  
                  <Button className="w-full h-12 text-lg font-bold bg-white/5 hover:bg-primary text-white border border-white/10 group-hover:border-primary shadow-[0_0_10px_rgba(83,74,183,0)] group-hover:shadow-[0_0_15px_rgba(83,74,183,0.4)] transition-all">
                    العب مقابل ${match.amount}
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
              <Card key={tournament.id} className="bg-card border-border overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                <CardHeader>
                  <CardTitle className="text-xl text-white">{tournament.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{tournament.game} • {tournament.startsAt}</p>
                </CardHeader>
                <CardContent>
                  <div className="bg-background rounded-lg p-4 mb-4 flex justify-between items-center border border-border">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">مجموع الجوائز</p>
                      <p className="text-xl font-black text-secondary">${tournament.prizePool}</p>
                    </div>
                    <div className="w-[1px] h-10 bg-border" />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">رسوم الدخول</p>
                      <p className="text-lg font-bold text-white">${tournament.entryFee}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">التسجيل</span>
                      <span className="text-white font-mono">{tournament.currentSlots}/{tournament.maxSlots}</span>
                    </div>
                    <Progress value={(tournament.currentSlots / tournament.maxSlots) * 100} className="h-2 bg-secondary/20" indicatorClassName="bg-secondary" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/80">
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
                <span className="text-secondary font-bold">${result.amount}</span>
                <span className="text-xs text-muted-foreground mr-2">({result.time})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
