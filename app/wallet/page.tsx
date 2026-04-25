"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowUpRight, Wallet, History, Loader2 } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";

export default function WalletPage() {
  // ✅ Balance comes from the global AuthProvider — same source as Navbar
  const { user, isLoading: authLoading } = useAuth();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // ProtectedRoute handles the redirect; just bail here

    const fetchTransactions = async () => {
      setTxLoading(true);
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTransactions(data ?? []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setTxLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const { balance } = useWallet();

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-8">

        <div className="flex flex-col md:flex-row gap-6">
          {/* Balance Card */}
          <Card className="flex-1 bg-gradient-to-br from-primary/20 to-card border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -ml-10 -mt-10 pointer-events-none" />
            <CardContent className="p-8">
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Wallet size={20} />
                <span className="font-bold">الرصيد المتاح</span>
              </div>
              {authLoading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <h1 className="text-5xl font-black text-white">{balance !== null ? balance.toFixed(2) : "0.00"} DA</h1>
              )}
              <p className="text-sm text-muted-foreground mt-2">+ 0.00 DA أرباح اليوم</p>
            </CardContent>
          </Card>

          {/* Action Panel */}
          <Card className="flex-1 bg-card border-border">
            <CardContent className="p-8 flex flex-col gap-4 justify-center h-full">
              <h2 className="text-lg font-bold text-white mb-2">إدارة الرصيد</h2>
              <div className="flex gap-4">
                <Link href="/dashboard/deposit" className="flex-1">
                  <Button
                    className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-bold gap-2"
                  >
                    <ArrowDownRight size={18} />
                    إيداع رصيد
                  </Button>
                </Link>
                <Button variant="outline" className="flex-1 h-12 border-border hover:bg-white/5 font-bold gap-2">
                  <ArrowUpRight size={18} />
                  سحب
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <History size={20} className="text-primary" /> سجل العمليات
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {txLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">جاري تحميل العمليات...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                لا توجد عمليات حالياً
              </div>
            ) : (
              <div className="divide-y divide-border">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        tx.type === 'deposit' || tx.type === 'win' ? 'bg-secondary/10 text-secondary' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {tx.type === 'deposit' || tx.type === 'win' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">
                          {tx.type === 'deposit' ? 'إيداع رصيد' :
                           tx.type === 'withdraw' ? 'سحب رصيد' :
                           tx.type === 'wager' ? 'دخول تحدي / غرفة' : 'جائزة فوز'}
                        </h3>
                        <p className="text-sm text-muted-foreground font-mono mt-1">
                          {new Date(tx.created_at).toLocaleString('ar-EG')}
                        </p>
                        {tx.reference_id && (
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">#Ref: {tx.reference_id}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-left flex flex-col items-end gap-2">
                      <span className={`text-lg font-bold font-mono ${
                        tx.type === 'deposit' || tx.type === 'win' ? 'text-secondary' : 'text-white'
                      }`}>
                        {tx.type === 'deposit' || tx.type === 'win' ? '+' : '-'}{tx.amount.toFixed(2)} DA
                      </span>
                      <Badge variant="outline" className={`${
                        tx.status === 'completed' ? 'border-secondary/50 text-secondary' :
                        tx.status === 'pending' ? 'border-yellow-500/50 text-yellow-500' :
                        'border-red-500/50 text-red-500'
                      }`}>
                        {tx.status === 'completed' ? 'مكتمل' :
                         tx.status === 'pending' ? 'قيد المعالجة' :
                         tx.status === 'rejected' ? 'مرفوض' : tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </ProtectedRoute>
  );
}
