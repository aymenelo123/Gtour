"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowUpRight, Wallet, History, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/login");
          return;
        }

        // Fetch balance from profiles
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("balance")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setBalance(profileData.balance || 0);
        }

        // Fetch transactions
        const { data: txData, error: txError } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (txData) {
          setTransactions(txData);
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
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
            <h1 className="text-5xl font-black text-white">${balance.toFixed(2)}</h1>
            <p className="text-sm text-muted-foreground mt-2">+ $0.00 أرباح اليوم</p>
          </CardContent>
        </Card>

        {/* Action Panel */}
        <Card className="flex-1 bg-card border-border">
          <CardContent className="p-8 flex flex-col gap-4 justify-center h-full">
            <h2 className="text-lg font-bold text-white mb-2">إدارة الرصيد</h2>
            <div className="flex gap-4">
              <Button 
                onClick={() => console.log('Ready for Stripe integration')}
                className="flex-1 h-12 bg-secondary hover:bg-secondary/90 text-white font-bold gap-2"
              >
                <ArrowDownRight size={18} />
                إيداع (Stripe)
              </Button>
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
            <History size={20} className="text-primary"/> سجل العمليات
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              لا توجد عمليات حالياً
            </div>
          ) : (
            <div className="divide-y divide-border">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      tx.type === 'deposit' || tx.type === 'prize' ? 'bg-secondary/10 text-secondary' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'prize' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">
                        {tx.type === 'deposit' ? 'إيداع رصيد' : 
                         tx.type === 'withdrawal' ? 'سحب رصيد' : 
                         tx.type === 'bet' ? 'دخول تحدي / غرفة' : 'جائزة فوز'}
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono mt-1">
                        {new Date(tx.created_at).toLocaleString('ar-EG')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-left flex flex-col items-end gap-2">
                    <span className={`text-lg font-bold font-mono ${
                      tx.amount > 0 ? 'text-secondary' : 'text-white'
                    }`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}$
                    </span>
                    <Badge variant="outline" className={`${
                      tx.status === 'مكتمل' || tx.status === 'completed' ? 'border-secondary/50 text-secondary' : 'border-yellow-500/50 text-yellow-500'
                    }`}>
                      {tx.status === 'completed' ? 'مكتمل' : tx.status === 'pending' ? 'قيد المعالجة' : tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
