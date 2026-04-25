"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useWallet } from "@/context/WalletContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Headphones, Settings, Upload, ShieldAlert, CheckCircle, XCircle, AlertTriangle, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { mockMatches, mockGames } from "@/lib/mockData";

export default function MatchArena() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("*").eq("id", user.id).single().then(({data}) => {
        if (data) setProfile(data);
      });
    }
  }, [user]);
  const { addWinnings } = useWallet();
  
  const [matchData, setMatchData] = useState<any>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([
    { sender: 'System', text: 'مرحباً بكم في الحلبة! يجب تصوير الشاشة عند الفوز.' }
  ]);

  useEffect(() => {
    // Attempt to locate mock match or fallback to generic
    const found = mockMatches.find(m => m.id.toString() === id) || {
      id, game: 'fc25', player: 'Aymen123', avatar: 'https://i.pravatar.cc/150?u=tempUser1', amount: 50, status: 'open'
    };
    setMatchData(found);
  }, [id]);

  if (!matchData) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
    </div>
  );

  const gameInfo = mockGames.find(g => g.id === matchData.game);
  const GameIcon = gameInfo ? LucideIcons[gameInfo.iconName as keyof typeof LucideIcons] as React.ElementType : LucideIcons.Gamepad2;

  const handleSendMessage = () => {
    if(!chatInput.trim()) return;
    setMessages([...messages, { sender: profile?.username || 'أنت', text: chatInput }]);
    setChatInput("");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      
      <Button variant="ghost" onClick={() => router.push('/rooms')} className="w-fit text-slate-400 hover:text-white group gap-2 -mb-2">
        <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> العودة إلى الغرف
      </Button>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
            <span className="text-red-400 font-bold tracking-widest uppercase">Live Match</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
               {GameIcon && <GameIcon className="w-6 h-6 text-indigo-400" />}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-none mb-1">{gameInfo?.title || 'Game'}</h1>
              <span className="text-sm text-slate-400 font-mono">MATCH #{matchData.id}</span>
            </div>
          </div>
        </div>

        <div className="text-center md:text-right bg-black/20 px-6 py-3 rounded-xl border border-white/5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">الرهان الإجمالي</p>
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
            {matchData.amount * 2} DA
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MAIN STAGE (VS GRAPHIC & CONTROLS) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <Card className="bg-[#0A0D14] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-transparent to-red-900/40 pointer-events-none" />
            
            <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between relative z-10 gap-8 h-full min-h-[300px]">
              
              {/* PLAYER 1 */}
              <div className="flex flex-col items-center flex-1 z-10 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                <Avatar className="h-32 w-32 border-4 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.5)] mb-4 ring-4 ring-indigo-500/20">
                  <AvatarImage src={matchData.avatar} />
                  <AvatarFallback className="text-3xl font-bold">{matchData.player.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="bg-black/40 backdrop-blur px-6 py-2 rounded-full border border-white/10 text-center min-w-[200px]">
                   <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{matchData.player}</h3>
                   <span className="text-indigo-400 text-sm font-bold flex items-center justify-center gap-1">
                     <CheckCircle className="w-4 h-4" /> المنشئ
                   </span>
                </div>
              </div>

              {/* VS TEXT */}
              <div className="relative shrink-0 flex items-center justify-center -my-8 md:my-0 z-20">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />
                 <h2 className="text-6xl italic font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">VS</h2>
              </div>

              {/* PLAYER 2 */}
              <div className="flex flex-col items-center flex-1 z-10 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
                <Avatar className="h-32 w-32 border-4 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.5)] mb-4 ring-4 ring-red-500/20 border-dashed animate-pulse">
                  <AvatarFallback className="text-3xl font-bold bg-slate-900 border border-white/5">?</AvatarFallback>
                </Avatar>
                <div className="bg-black/40 backdrop-blur px-6 py-2 rounded-full border border-white/10 text-center min-w-[200px]">
                   <h3 className="text-xl font-bold text-slate-400 mb-1">في انتظار الخصم</h3>
                   <span className="text-slate-500 text-sm font-mono flex items-center justify-center gap-1">
                     Searching...
                   </span>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* ACTION PANEL */}
          {profile?.is_admin ? (
            /* ADMIN DASHBOARD */
            <Card className="bg-[#1A110B] border-2 border-yellow-500/40 shadow-[0_0_30px_rgba(234,179,8,0.15)] relative overflow-hidden">
               <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-600" />
               <CardHeader className="border-b border-white/5 bg-black/20 pb-4">
                 <CardTitle className="text-yellow-500 flex items-center gap-2">
                   <ShieldAlert className="w-5 h-5 text-yellow-400" /> 
                   لوحة تحكم الحكم (Admin Panel)
                 </CardTitle>
                 <p className="text-sm text-slate-400">حسم النتيجة بشكل مباشر للمباريات المتنازع عليها.</p>
               </CardHeader>
               <CardContent className="p-6 flex flex-col md:flex-row gap-4">
                 <Button 
                   className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold border-0 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                   onClick={() => {
                     const prizePool = matchData.amount * 1.8;
                     addWinnings(prizePool);
                     toast.success(`Match Resolved! ${prizePool} DA Winnings added to wallet.`, {
                       className: 'border-yellow-500/50 bg-yellow-950/90 text-yellow-400 text-lg font-black'
                     });
                     router.push('/');
                   }}
                 >
                   إعلان فوز اللاعب 1
                 </Button>
                 <Button 
                   className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-bold border-0 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                   onClick={() => {
                     const prizePool = matchData.amount * 1.8;
                     addWinnings(prizePool);
                     toast.success(`Match Resolved! ${prizePool} DA Winnings added to wallet.`, {
                       className: 'border-yellow-500/50 bg-yellow-950/90 text-yellow-400 text-lg font-black'
                     });
                     router.push('/');
                   }}
                 >
                   إعلان فوز اللاعب 2
                 </Button>
                 <Button className="flex-1 md:flex-none md:w-32 h-12 bg-transparent border-2 border-slate-600 text-slate-300 hover:bg-slate-800 font-bold">
                   إلغاء المباراة
                 </Button>
               </CardContent>
            </Card>
          ) : (
            /* PLAYER DASHBOARD */
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden">
               <CardContent className="p-6">
                 
                 <div className="flex flex-col sm:flex-row gap-4 mb-6">
                   <Button className="flex-1 h-12 bg-primary hover:bg-primary/80 font-bold shadow-lg">
                     <CheckCircle className="w-5 h-5 ml-2" /> أنا جاهز
                   </Button>
                   <Button 
                     variant="outline" 
                     className="flex-1 h-12 border-primary/50 text-white hover:bg-primary/10 font-bold"
                     onClick={() => setShowUpload(!showUpload)}
                   >
                     <Upload className="w-5 h-5 ml-2" /> إرسال النتيجة (صورة)
                   </Button>
                   <Button variant="destructive" className="flex-1 md:flex-none h-12 bg-red-600 hover:bg-red-700 font-bold shadow-lg shadow-red-500/20">
                     <AlertTriangle className="w-5 h-5 ml-2" /> طلب تدخل الإدارة
                   </Button>
                 </div>

                 {showUpload && (
                   <div className="bg-black/30 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center border-dashed gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                     <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-400 pointer-events-none">
                       <Upload className="w-8 h-8" />
                     </div>
                     <div className="text-center">
                       <p className="text-white font-bold mb-1">ارفع صورة توثق فوزك</p>
                       <p className="text-sm text-slate-400">JPG, PNG, GIF (أقصى حجم 5MB)</p>
                     </div>
                     <Input type="file" className="w-full max-w-sm mt-2 text-slate-300 border-white/10 file:bg-white/10 file:text-white file:border-0 hover:file:bg-white/20 transition-all cursor-pointer" />
                     <Button className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-700 text-white mt-2">تأكيد الرفع</Button>
                   </div>
                 )}

               </CardContent>
            </Card>
          )}

        </div>

        {/* SIDEBAR (COMMUNICATION HUB) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="flex flex-col h-[600px] bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden">
            <CardHeader className="bg-black/20 border-b border-white/5 py-4">
              <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                <LucideIcons.MessageSquare className="w-5 h-5 text-indigo-400" /> المحادثة المباشرة
              </CardTitle>
            </CardHeader>
            
            <ScrollArea className="flex-1 p-4 bg-black/10">
              <div className="flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === (profile?.username || 'أنت') ? 'items-start' : 'items-end'}`}>
                    <span className="text-xs text-slate-500 mb-1 px-1 font-bold">{msg.sender}</span>
                    <div className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${msg.sender === 'System' ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 self-center text-center my-2' : msg.sender === (profile?.username || 'أنت') ? 'bg-primary text-white rounded-tr-none' : 'bg-white/10 text-slate-200 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 bg-black/20 border-t border-white/5 flex gap-2">
              <Input 
                placeholder="اكتب رسالة..." 
                className="bg-black/20 border-white/10 text-white"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} className="bg-indigo-600 hover:bg-indigo-700 px-3">
                <LucideIcons.Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Mock Discord UI */}
            <div className="bg-[#2B2D31] p-3 flex justify-between items-center border-t border-black/50">
               <div className="flex items-center gap-3">
                 <Avatar className="w-8 h-8 rounded shrink-0">
                   <AvatarImage src={profile?.avatar_url || ''} />
                   <AvatarFallback className="rounded bg-indigo-600 text-xs font-bold">{profile?.username?.substring(0, 2) || 'Me'}</AvatarFallback>
                 </Avatar>
                 <div className="flex flex-col overflow-hidden leading-tight">
                   <span className="text-sm font-bold text-white truncate max-w-[80px]">{profile?.username || 'Me'}</span>
                   <span className="text-[10px] text-green-500 font-mono">Connected</span>
                 </div>
               </div>
               <div className="flex gap-1">
                 <button className="text-slate-400 hover:text-white hover:bg-white/5 p-1.5 rounded transition-colors"><Mic className="w-4 h-4" /></button>
                 <button className="text-slate-400 hover:text-white hover:bg-white/5 p-1.5 rounded transition-colors"><Headphones className="w-4 h-4" /></button>
                 <button className="text-slate-400 hover:text-white hover:bg-white/5 p-1.5 rounded transition-colors"><Settings className="w-4 h-4" /></button>
               </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
