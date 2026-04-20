import { mockTournaments } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Calendar } from "lucide-react";

export default function Tournaments() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Trophy className="text-yellow-500 w-8 h-8" /> البطولات
          </h1>
          <p className="text-muted-foreground mt-2">شارك في بطولات رسمية وتنافس على جوائز كبرى</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {mockTournaments.map((tournament) => (
          <Card key={tournament.id} className="bg-card border-border overflow-hidden relative group hover:border-primary/50 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/20 transition-all pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row h-full">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{tournament.title}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar size={14} />
                      {tournament.startsAt}
                    </div>
                  </div>
                  <span className="bg-white/10 text-white px-3 py-1 rounded-sm text-sm font-bold border border-white/20">
                    {tournament.game}
                  </span>
                </div>
                
                <div className="bg-background rounded-lg p-4 my-6 flex justify-between items-center border border-border">
                  <div className="text-center w-full">
                    <p className="text-sm text-muted-foreground mb-1">الجائزة الكبرى</p>
                    <p className="text-2xl font-black text-yellow-500">${tournament.prizePool}</p>
                  </div>
                  <div className="w-[1px] h-12 bg-border mx-4" />
                  <div className="text-center w-full">
                    <p className="text-sm text-muted-foreground mb-1">الاشتراك</p>
                    <p className="text-xl font-bold text-white">${tournament.entryFee}</p>
                  </div>
                </div>

                <div className="space-y-2 mt-auto">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">عدد المسجلين</span>
                      <span className="text-white font-mono">{tournament.currentSlots} / {tournament.maxSlots}</span>
                    </div>
                    <Progress value={(tournament.currentSlots / tournament.maxSlots) * 100} className="h-2 bg-secondary/20" indicatorClassName="bg-secondary" />
                </div>
              </div>
              
              <div className="bg-black/20 p-6 flex flex-col justify-center sm:border-r border-border min-w-[200px]">
                <Button className="w-full h-14 text-lg bg-primary hover:bg-primary/80 shadow-[0_0_15px_rgba(83,74,183,0.3)]">
                  سجل الآن
                </Button>
                <div className="text-center text-xs text-muted-foreground mt-4">
                  تغلق التسجيلات قبل ساعة من البدء
                </div>
              </div>
            </div>

          </Card>
        ))}
      </div>
    </div>
  );
}
