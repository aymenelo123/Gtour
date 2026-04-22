import { mockGames } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ZapIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

export default function HouseMode() {
  const houseEvents = [
    { id: 1, game: "fc25", title: "فز بفارق 3 أهداف", odds: 2.5, opponent: "بوت محترف" },
    { id: 2, game: "cs2", title: "الوصول لـ 15 قتلة قبل البوت", odds: 1.8, opponent: "بوت النخبة" },
    { id: 3, game: "rl", title: "الفوز دون تلقي أي هدف", odds: 3.2, opponent: "بوت البطل" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <div className="flex flex-col items-center text-center gap-4 py-8 mb-4 bg-gradient-to-br from-red-900/20 to-background border border-red-900/50 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <ShieldAlert className="text-red-500 w-16 h-16 animate-pulse" />
        <h1 className="text-4xl font-black text-white z-10 w-full relative">
          اللعب ضد <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">المنصة</span>
        </h1>
        <p className="text-muted-foreground max-w-xl z-10">
          تحديات فردية ضد بوتات المنصة بخيارات رهانات ومضاعفات ثابتة (Fixed Odds). هل لديك المهارة لهزيمة الآلة؟
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {houseEvents.map((event) => {
          const gameInfo = mockGames.find(g => g.id === event.game);
          return (
            <Card key={event.id} className="bg-card border-border hover:border-red-500/50 transition-colors group relative overflow-hidden">
              <div className="absolute -right-10 -top-10 bg-red-500/20 blur-3xl w-32 h-32 pointer-events-none group-hover:bg-red-500/40 transition-colors" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-red-400 border-red-900/50 bg-red-900/20">
                    ضد {event.opponent}
                  </Badge>
                  <span className="text-2xl text-slate-400">
                    {gameInfo && gameInfo.iconName && (() => {
                      const Icon = LucideIcons[gameInfo.iconName as keyof typeof LucideIcons] as React.ElementType;
                      return Icon ? <Icon className="w-8 h-8" /> : null;
                    })()}
                  </span>
                </div>
                <CardTitle className="text-xl text-white mt-4 leading-relaxed">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 my-6 bg-background rounded-lg border border-border p-4">
                  <div className="w-full text-center">
                    <p className="text-xs text-muted-foreground mb-1">المضاعف</p>
                    <p className="text-3xl font-black text-white">x{event.odds}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="w-full h-12 bg-white/5 hover:bg-white/10 text-white border border-white/10">
                    الرهان بـ 10 DA
                  </Button>
                  <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    <ZapIcon size={16} className="ml-2" />
                    تحدي المنصة
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
