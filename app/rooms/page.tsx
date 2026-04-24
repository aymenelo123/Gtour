"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { mockGames, mockMatches } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Plus, Filter, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useWallet } from "@/context/WalletContext";
import { toast } from "sonner";

function RoomsContent() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const { balance, deductBalance } = useWallet();
  const [matches, setMatches] = useState(mockMatches);
  
  const searchParams = useSearchParams();
  
  // Tab State
  const [activeTab, setActiveTab] = useState("all");

  // Parse Query Parameters safely on mount
  useEffect(() => {
    const gameQuery = searchParams?.get("game");
    if (gameQuery) setActiveTab(gameQuery);
  }, [searchParams]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(mockGames[0].id);
  const [amount, setAmount] = useState("");
  const [inGameId, setInGameId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreateRoom = async () => {
    setErrorMsg("");
    const numericAmount = parseFloat(amount);
    
    if (!selectedGame || !amount || !inGameId) {
      setErrorMsg("الرجاء ملء جميع الحقول.");
      return;
    }
    
    if (isNaN(numericAmount) || numericAmount < 50) {
      setErrorMsg("الحد الأدنى لإنشاء غرفة هو 50 DA.");
      return;
    }
    
    if (!profile || !user) {
      setErrorMsg("يجب تسجيل الدخول أولاً.");
      return;
    }
    
    if (numericAmount > (balance ?? 0)) {
      setErrorMsg("رصيدك غير كافٍ.");
      return;
    }

    setIsLoading(true);
    
    try {
      const deducted = await deductBalance(numericAmount);
      if (!deducted) {
        throw new Error("حدث خطأ أثناء الخصم.");
      }
      
      toast.success(`تم خصم ${numericAmount} DA. تم إنشاء الغرفة بنجاح!`, {
        className: 'border-emerald-500/50 bg-emerald-950/90 text-white'
      });

      // UI push to mock array
      const newRoom = {
        id: Math.floor(Math.random() * 10000),
        game: selectedGame,
        player: profile.username || 'أنت',
        avatar: profile.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`,
        amount: numericAmount,
        status: 'open'
      };

      setMatches([newRoom, ...matches]);
      setActiveTab(selectedGame); // Auto-Navigation to the created room's tab
      setIsModalOpen(false);
      setAmount("");
      setInGameId("");
      
    } catch (error: any) {
      setErrorMsg(error.message || "حدث خطأ غير معروف.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">غرف 1 ضد 1</h1>
          <p className="text-muted-foreground mt-2">ابحث عن خصم وتنافس على جوائز نقدية في ألعابك المفضلة</p>
        </div>
        <Button 
          size="lg" 
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary hover:bg-secondary/90 text-white font-bold gap-2 shadow-[0_0_15px_rgba(29,158,117,0.4)]"
        >
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card w-full md:w-auto overflow-x-auto flex justify-start border border-border p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">الكل</TabsTrigger>
          {mockGames.map(game => {
            const Icon = LucideIcons[game.iconName as keyof typeof LucideIcons] as React.ElementType;
            return (
              <TabsTrigger 
                key={game.id} 
                value={game.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-white gap-2"
              >
                {Icon && <Icon className="w-4 h-4" />}
                {game.title}
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(activeTab === 'all' ? matches : matches.filter(m => m.game === activeTab)).map((match) => {
              const gameInfo = mockGames.find(g => g.id === match.game);
              const GameIcon = gameInfo ? LucideIcons[gameInfo.iconName as keyof typeof LucideIcons] as React.ElementType : null;
              
              return (
              <Card key={match.id} className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-[0_10px_30px_rgba(99,102,241,0.2)] transition-all duration-300 group">
                <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -ml-10 -mt-10 group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                      {GameIcon && <GameIcon className="w-3 h-3" />}
                      {gameInfo?.title}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-mono">ID: #{match.id}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 my-6">
                    <Avatar className="h-20 w-20 border-2 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                      <AvatarImage src={match.avatar} />
                      <AvatarFallback>{match.player.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{match.player}</h3>
                      <p className="text-sm text-muted-foreground text-green-400 font-bold drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">● متصل الآن</p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300"
                    onClick={() => {
                      void (async () => {
                        if ((balance ?? 0) < match.amount) {
                          toast.error('رصيد غير كافٍ. يرجى شحن محفظتك.', {
                            className: 'border-red-500/50 bg-red-950/90 text-white'
                          });
                          return;
                        }

                        const success = await deductBalance(match.amount);
                        if (success) {
                          toast.success(`تم خصم ${match.amount} DA. جاري الدخول للحلبة...`, {
                            className: 'border-indigo-500/50 bg-indigo-950/90 text-white'
                          });
                          router.push(`/rooms/${match.id}`);
                        }
                      })();
                    }}
                  >
                    العب مقابل {match.amount} DA
                  </Button>
                </CardContent>
              </Card>
            )})}
          </div>
        </TabsContent>
        {/* Placeholder contents for individual tabs would go here */}
      </Tabs>

      {/* CREATE ROOM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">إنشاء غرفة تحدي</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm font-bold">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-300 font-bold">اختر اللعبة</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {mockGames.map(game => {
                    const Icon = LucideIcons[game.iconName as keyof typeof LucideIcons] as React.ElementType;
                    const isSelected = selectedGame === game.id;
                    return (
                      <button
                        key={game.id}
                        onClick={() => setSelectedGame(game.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl min-w-[80px] border transition-all ${isSelected ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                      >
                        {Icon && <Icon className="w-6 h-6 mb-2" />}
                        <span className="text-xs font-bold">{game.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-300 font-bold">مبلغ الرهان (رصيدك: {balance !== null ? balance.toFixed(2) : "0.00"} DA)</label>
                <Input 
                  type="number" 
                  placeholder="مثال: 50" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-black/20 border-white/10 text-white font-mono text-lg py-6"
                />
                <span className="text-xs text-muted-foreground">الحد الأدنى: 50 DA</span>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-300 font-bold">معرف اللاعب داخل اللعبة (ID)</label>
                <Input 
                  type="text" 
                  placeholder="مثال: Player#1234" 
                  value={inGameId}
                  onChange={(e) => setInGameId(e.target.value)}
                  className="bg-black/20 border-white/10 text-white font-mono text-lg py-6 text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="p-6 bg-black/20 border-t border-white/5">
              <Button 
                onClick={handleCreateRoom}
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white text-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all"
              >
                {isLoading ? "جاري الإنشاء..." : "ادفع الرصيد وأنشئ الغرفة"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Rooms() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div></div>}>
      <RoomsContent />
    </Suspense>
  );
}
