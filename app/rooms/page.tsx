import { mockGames, mockMatches } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Plus, Filter } from "lucide-react";

export default function Rooms() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">غرف 1 ضد 1</h1>
          <p className="text-muted-foreground mt-2">ابحث عن خصم وتنافس على جوائز نقدية في ألعابك المفضلة</p>
        </div>
        <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold gap-2 shadow-[0_0_15px_rgba(29,158,117,0.4)]">
          <Plus size={20} />
          إنشاء غرفة جديدة
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-lg border border-border">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="ابحث عن لاعب أو لعبة..." 
            className="pl-4 pr-10 bg-background border-border"
          />
        </div>
        <Button variant="outline" className="w-full md:w-auto border-border">
          <Filter size={16} className="ml-2" /> التصنيف
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-card w-full md:w-auto overflow-x-auto flex justify-start border border-border p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">الكل</TabsTrigger>
          {mockGames.map(game => (
            <TabsTrigger 
              key={game.id} 
              value={game.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {game.icon} {game.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    <Avatar className="h-16 w-16 border-2 border-primary/50 group-hover:border-primary transition-colors">
                      <AvatarImage src={match.avatar} />
                      <AvatarFallback>{match.player.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-white">{match.player}</h3>
                      <p className="text-sm text-muted-foreground text-green-400">● متصل الآن</p>
                    </div>
                  </div>
                  
                  <Button className="w-full h-12 text-lg font-bold bg-white/5 hover:bg-primary text-white border border-white/10 group-hover:border-primary shadow-[0_0_10px_rgba(83,74,183,0)] group-hover:shadow-[0_0_15px_rgba(83,74,183,0.4)] transition-all">
                    العب مقابل ${match.amount}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        {/* Placeholder contents for individual tabs would go here */}
      </Tabs>
    </div>
  );
}
