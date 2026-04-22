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
          <Card key={tournament.id} className="bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(251,191,36,0.15)] hover:border-yellow-500/30 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-yellow-500/10 transition-all pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row h-full">
              <div className="p-6 flex-grow relative z-10 border-b sm:border-b-0 sm:border-l border-white/10 sm:border-dashed">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">{tournament.title}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar size={14} />
                      {tournament.startsAt}
                    </div>
                  </div>
                  <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-sm text-sm font-bold border border-indigo-500/30 tracking-wider">
                    {tournament.game}
                  </span>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4 my-6 flex justify-between items-center border border-white/5">
                  <div className="text-center w-full">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">الجائزة الكبرى</p>
                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">{tournament.prizePool} DA</p>
                  </div>
                  <div className="w-[1px] h-12 bg-white/10 mx-4" />
                  <div className="text-center w-full">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">الاشتراك</p>
                    <p className="text-xl font-bold text-white">{tournament.entryFee} DA</p>
                  </div>
                </div>

                <div className="space-y-2 mt-auto">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">عدد المسجلين</span>
                      <span className="text-white font-mono font-bold tracking-widest">{tournament.currentSlots} <span className="text-slate-500 font-normal">/ {tournament.maxSlots}</span></span>
                    </div>
                    <Progress value={(tournament.currentSlots / tournament.maxSlots) * 100} className="h-3 bg-white/5 border border-white/10 rounded-full overflow-hidden" indicatorClassName="bg-gradient-to-r from-yellow-500 to-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                </div>
              </div>
              
              <div className="bg-black/10 p-6 flex flex-col justify-center sm:border-r border-border min-w-[200px] relative z-10 w-full sm:w-auto">
                <Button className="w-full h-14 text-lg bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.4)] hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] transition-all font-bold border-0">
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
