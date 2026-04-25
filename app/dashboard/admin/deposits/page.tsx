"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Check, X, Loader2, ArrowUpRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDepositsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [user]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && profile) {
      if (!profile.is_admin) {
        router.push("/dashboard");
      } else {
        fetchPendingDeposits();
      }
    }
  }, [profile, isLoading, router]);

  const fetchPendingDeposits = async () => {
    try {
      setIsFetching(true);
      // Fetch from deposits table and join with profiles to get email and username
      const { data, error } = await supabase
        .from("deposits")
        .select(`
          *,
          profiles:user_id (email, username)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase fetchPendingDeposits error:", error);
        throw error;
      }
      setDeposits(data || []);
    } catch (err) {
      console.error("Error fetching deposits:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleApprove = async (txId: string) => {
    try {
      // Optimistic UI Update: Instantly remove from list to feel "Fast and Direct"
      setDeposits(prev => prev.filter(d => d.id !== txId));
      setProcessingId(txId);
      
      // Call the user-specified RPC
      const { error } = await supabase.rpc('admin_deposit_update', { deposit_id: txId });
      
      if (error) {
        console.error("Supabase admin_deposit_update RPC error:", error);
        throw error;
      }
      
      // Also explicitly update the table status as requested by the user, just in case the RPC doesn't do it
      const { error: updateError } = await supabase
        .from('deposits')
        .update({ status: 'completed' })
        .eq('id', txId);
        
      if (updateError) {
        console.error("Supabase deposits table update error:", updateError);
        throw updateError;
      }
      
      
    } catch (err: any) {
      console.error("Error approving:", err);
      // Revert optimistic update on failure (fetch fresh list)
      fetchPendingDeposits();
      alert(err.message || "حدث خطأ أثناء الموافقة.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (txId: string) => {
    if (!confirm("هل أنت متأكد من رفض هذا الشحن؟")) return;
    
    try {
      // Optimistic UI Update
      setDeposits(prev => prev.filter(d => d.id !== txId));
      setProcessingId(txId);
      
      const { error } = await supabase
        .from("deposits")
        .update({ status: 'failed' })
        .eq('id', txId);
        
      if (error) {
        console.error("Supabase handleReject error:", error);
        throw error;
      }
      
    } catch (err: any) {
      console.error("Error rejecting:", err);
      fetchPendingDeposits(); // Revert optimistic update
      alert("حدث خطأ أثناء الرفض.");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  if (isLoading || (profile && !profile.is_admin)) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-[#0E1217]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0E1217] p-4 pt-24 pb-20 relative overflow-hidden" dir="rtl">
        {/* Background Ambient Effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-6xl mx-auto z-10 space-y-6 relative">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#13181E] p-6 rounded-2xl border border-red-500/20 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center border border-red-500/20">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-wide">
                  إدارة عمليات الإيداع <span className="text-red-500 text-xs px-2 py-1 bg-red-500/10 rounded-full border border-red-500/20 align-middle mr-2">Admin</span>
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  مراجعة تأكيدات الدفع المعلقة وقبولها أو رفضها
                </p>
              </div>
            </div>
            
            <Button 
              onClick={fetchPendingDeposits} 
              disabled={isFetching}
              variant="outline"
              className="bg-[#0E1217] border-[#2A3441] text-white hover:bg-white/5 gap-2"
            >
              <Search className="w-4 h-4" />
              تحديث القائمة
            </Button>
          </div>

          <Card className="w-full bg-[#13181E] border-[#2A3441] shadow-xl">
            <CardHeader className="border-b border-[#2A3441] pb-4 bg-[#0E1217]/50">
              <CardTitle className="text-xl font-bold text-white flex items-center justify-between">
                الطلبات المعلقة ({deposits.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-slate-300">
                  <thead className="text-xs text-slate-400 bg-[#0E1217] border-b border-[#2A3441]">
                    <tr>
                      <th className="px-6 py-4">المستخدم</th>
                      <th className="px-6 py-4">المبلغ</th>
                      <th className="px-6 py-4">رقم العملية (Reference)</th>
                      <th className="px-6 py-4">التاريخ</th>
                      <th className="px-6 py-4 text-center">إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFetching ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                          جاري التحميل...
                        </td>
                      </tr>
                    ) : deposits.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                          لا توجد أي طلبات شحن معلقة حالياً.
                        </td>
                      </tr>
                    ) : (
                      deposits.map((tx) => (
                        <tr key={tx.id} className="border-b border-[#2A3441] hover:bg-[#1A2129] transition-colors">
                          <td className="px-6 py-4 font-bold text-white">
                            {tx.profiles?.username || tx.profiles?.email || "غير محدد"}
                          </td>
                          <td className="px-6 py-4 font-bold text-emerald-500">
                            +{tx.amount.toFixed(2)} DA
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono bg-black/40 px-2 py-1 text-yellow-500 rounded border border-yellow-500/20 text-xs tracking-wider">
                              {tx.reference_id}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                            {formatDate(tx.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {processingId === tx.id ? (
                                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                              ) : (
                                <>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleApprove(tx.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 px-3"
                                    title="قبول والشحن"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleReject(tx.id)}
                                    className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 h-8 px-3 bg-[#0E1217]"
                                    title="رفض الطلب"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
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
    </ProtectedRoute>
  );
}
