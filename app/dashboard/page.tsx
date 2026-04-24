"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Wallet, Calendar, ArrowUpRight, ArrowDownRight, RefreshCcw, UserCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useWallet } from "@/context/WalletContext";

export default function DashboardPage() {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const { balance } = useWallet();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoadingTx, setIsLoadingTx] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      try {
        setIsLoadingTx(true);
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        setTransactions(data || []);
      } catch (err) {
        console.error("Error fetching tx:", err);
      } finally {
        setIsLoadingTx(false);
      }
    };
    
    fetchTransactions();
  }, [user]);

  const handleRefresh = async () => {
    if (!user) return;
    setIsLoadingTx(true);
    await refreshProfile();
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setTransactions(data);
    setIsLoadingTx(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0E1217] flex justify-center p-4 pt-10 pb-20 relative overflow-hidden" dir="rtl">
        {/* Background Ambient Effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-5xl z-10 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#13181E] p-6 rounded-2xl border border-[#2A3441] shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center border border-red-500/20">
                <Trophy className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-wide">
                  مرحباً بك، {profile?.username || user?.email?.split('@')[0] || "لاعب"}!
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  نظرة عامة على حسابك ومحفظتك
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-[#0E1217] px-6 py-3 rounded-xl border border-[#2A3441] flex items-center gap-3">
                <Wallet className="text-secondary w-6 h-6" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">الرصيد الحالي</span>
                  <span className="text-xl font-bold text-white">{balance ? balance.toFixed(2) : "0.00"} DA</span>
                </div>
              </div>
              
              <Button 
                onClick={handleRefresh} 
                disabled={isLoading}
                className="bg-[#2A3441] hover:bg-[#344050] text-white self-stretch py-6"
                title="تحديث الرصيد"
              >
                <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Details Profile Settings */}
            <Card className="w-full bg-[#13181E] border-[#2A3441] shadow-xl md:col-span-1">
              <CardHeader className="border-b border-[#2A3441] pb-4">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-red-500" />
                  تفاصيل الحساب
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-medium">البريد الإلكتروني</label>
                  <p className="text-sm text-slate-300 bg-[#0E1217] p-3 rounded-lg border border-[#2A3441]">
                    {user?.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-medium">اسم المستخدم</label>
                  <p className="text-sm text-slate-300 bg-[#0E1217] p-3 rounded-lg border border-[#2A3441]">
                    {profile?.username || "غير محدد"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-medium">تاريخ الانضمام</label>
                  <div className="flex items-center gap-2 text-sm text-slate-300 bg-[#0E1217] p-3 rounded-lg border border-[#2A3441]">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {profile?.created_at ? formatDate(profile.created_at) : "غير معروف"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet History */}
            <Card className="w-full bg-[#13181E] border-[#2A3441] shadow-xl lg:col-span-2">
              <CardHeader className="border-b border-[#2A3441] pb-4">
                <CardTitle className="text-xl font-bold text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-red-500" />
                    سجل المعاملات
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right text-slate-300">
                    <thead className="text-xs text-slate-400 bg-[#0E1217] border-b border-[#2A3441]">
                      <tr>
                        <th className="px-6 py-4">النوع</th>
                        <th className="px-6 py-4">المبلغ</th>
                        <th className="px-6 py-4">التاريخ</th>
                        <th className="px-6 py-4">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoadingTx ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                            جاري تحميل سجل العمليات...
                          </td>
                        </tr>
                      ) : transactions.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                            لا توجد أي معاملات حتى الآن.
                          </td>
                        </tr>
                      ) : (
                        transactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-[#2A3441] hover:bg-[#1A2129] transition-colors">
                            <td className="px-6 py-4 font-medium flex-col flex gap-1">
                              <div className="flex items-center gap-2">
                                {tx.type === 'deposit' || tx.type === 'win' ? (
                                  <ArrowUpRight className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <ArrowDownRight className="w-4 h-4 text-red-500 shrink-0" />
                                )}
                                <span className="capitalize">
                                  {tx.type === 'deposit' ? 'إيداع' : 
                                   tx.type === 'withdraw' ? 'سحب' : 
                                   tx.type === 'wager' ? 'رهان' : 'فوز'}
                                </span>
                              </div>
                              {tx.reference_id && (
                                <span className="text-[10px] text-slate-500 font-mono pr-6">#Ref: {tx.reference_id}</span>
                              )}
                            </td>
                            <td className={`px-6 py-4 font-bold ${
                              tx.type === 'deposit' || tx.type === 'win' 
                              ? 'text-emerald-500' 
                              : 'text-white'
                            }`}>
                              {tx.type === 'deposit' || tx.type === 'win' ? '+' : '-'}{tx.amount.toFixed(2)} DA
                            </td>
                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                              {formatDate(tx.created_at)}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs border ${
                                tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                tx.status === 'rejected' || tx.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                'bg-slate-500/10 text-slate-500 border-slate-500/20'
                              }`}>
                                {tx.status === 'completed' ? 'مكتمل' : 
                                 tx.status === 'pending' ? 'قيد المراجعة' : 
                                 tx.status === 'rejected' ? 'مرفوض' : 
                                 tx.status === 'failed' ? 'فشل' : tx.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}


