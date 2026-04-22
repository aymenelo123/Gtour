"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DepositPage() {
  const { user, refreshProfile } = useAuth();
  
  const [amount, setAmount] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setMessage({ type: "error", text: "الرجاء إدخال مبلغ صحيح أكبر من 0." });
      return;
    }

    if (!referenceId.trim()) {
      setMessage({ type: "error", text: "الرجاء إدخال رقم العملية (Reference ID)." });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      // In a real app we'd also validate if this reference ID already exists
      const { error } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "deposit",
          amount: Number(amount),
          status: "pending",
          reference_id: referenceId.trim()
        });

      if (error) throw error;
      
      setMessage({ type: "success", text: "تم إرسال طلب الشحن بنجاح! سيتم تحديث رصيدك بعد المراجعة." });
      setAmount("");
      setReferenceId("");
      
      // We don't refreshProfile immediately because the balance is still pending
      
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "حدث خطأ أثناء إرسال الطلب." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0E1217] flex justify-center p-4 pt-10 pb-20 relative overflow-hidden" dir="rtl">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-4xl z-10 space-y-6">
          <div className="flex items-center gap-4 bg-[#13181E] p-6 rounded-2xl border border-[#2A3441] shadow-2xl">
            <div className="w-16 h-16 bg-emerald-600/10 rounded-full flex items-center justify-center border border-emerald-500/20">
              <CreditCard className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wide">
                شحن الرصيد
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                اختر وسيلة الدفع المناسبة واشحن حسابك في ثوانٍ.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Payment Info Card */}
            <Card className="w-full bg-[#13181E] border-[#2A3441] shadow-xl h-fit">
              <CardHeader className="border-b border-[#2A3441] bg-[#0E1217]/50">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  معلومات الدفع
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-2">
                  يُرجى إرسال المبلغ إلى إحدى الحسابات التالية، ثم إدخال رقم العملية في النموذج للتحقق.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1 h-full bg-yellow-500" />
                  <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                    بريدي موب (Baridimob)
                  </h3>
                  <div className="space-y-1 mt-3">
                    <p className="text-sm text-slate-400">RIP (رقم الحساب)</p>
                    <p className="text-lg font-mono text-yellow-400 font-bold bg-[#0E1217] p-2 rounded border border-[#2A3441]">007 99999 0088123456 12</p>
                  </div>
                  <div className="space-y-1 mt-3">
                    <p className="text-sm text-slate-400">الاسم واللقب</p>
                    <p className="text-md text-white font-bold">Aymen Username</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1 h-full bg-blue-500" />
                  <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                    البريد الجاري (CCP)
                  </h3>
                  <div className="space-y-1 mt-3">
                    <p className="text-sm text-slate-400">رقم الحساب</p>
                    <p className="text-lg font-mono text-blue-400 font-bold bg-[#0E1217] p-2 rounded border border-[#2A3441]">12345678 99</p>
                  </div>
                  <div className="space-y-1 mt-3">
                    <p className="text-sm text-slate-400">الاسم واللقب</p>
                    <p className="text-md text-white font-bold">Aymen Username</p>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Deposit Form */}
            <Card className="w-full bg-[#13181E] border-[#2A3441] shadow-xl h-fit">
              <form onSubmit={handleDeposit}>
                <CardHeader className="border-b border-[#2A3441] bg-[#0E1217]/50">
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-emerald-500" />
                    تأكيد الإيداع
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs mt-2">
                    بعد إرسال المبلغ، قم بملء الاستمارة لتوثيق الشحن في حسابك.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="space-y-2 relative">
                    <label className="text-sm text-slate-300 font-medium font-bold block">المبلغ المرسل (DZD)</label>
                    <input 
                      type="number" 
                      min="100"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-[#0E1217] border border-[#2A3441] text-white rounded-lg p-3 outline-none focus:border-emerald-500 transition-colors font-mono"
                      placeholder="الأدنى: 100"
                      dir="ltr"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300 font-medium font-bold block">رقم العملية (Reference ID)</label>
                    <input 
                      type="text" 
                      value={referenceId}
                      onChange={(e) => setReferenceId(e.target.value)}
                      className="w-full bg-[#0E1217] border border-[#2A3441] text-white rounded-lg p-3 outline-none focus:border-emerald-500 transition-colors font-mono text-left"
                      placeholder="e.g. 20240401123456"
                      dir="ltr"
                    />
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      ستجده في وصل الدفع الخاص بـ Baridimob أو CCP.
                    </p>
                  </div>

                </CardContent>
                <CardFooter className="border-t border-[#2A3441] bg-[#0E1217]/30 p-4 flex flex-col items-start gap-4">
                  {message && (
                    <div className={`w-full p-3 rounded-lg border flex items-start gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm font-medium leading-tight">
                        {message.text}
                      </p>
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 py-6 text-lg shadow-[0_0_15px_rgba(5,150,105,0.3)] hover:shadow-[0_0_25px_rgba(5,150,105,0.5)] transition-all"
                  >
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "إرسال طلب الشحن"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
