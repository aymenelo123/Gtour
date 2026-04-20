"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Mail, Lock, User, Calendar, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // Visibility State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = password === confirmPassword;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && !passwordsMatch) {
      return; // يمنع الإرسال إذا كانت الكلمات غير متطابقة
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError("خطأ في تسجيل الدخول: البريد أو كلمة السر غير صحيحة");
          setLoading(false);
          return;
        }

        router.push("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              birthday: birthDate,
              balance: 0,
            },
          },
        });

        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        setSuccess("تم إرسال رابط التأكيد إلى بريدك الإلكتروني، يرجى التحقق منه لتفعيل الحساب");
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1217] flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background Ambient Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md bg-[#13181E] border-[#2A3441] shadow-2xl relative z-10 my-8">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <Trophy className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <CardTitle className="text-3xl font-black text-white mb-2 tracking-wide uppercase">
              ArenaBet
            </CardTitle>
            <CardDescription className="text-slate-400 text-base font-medium">
              {isLogin ? "تسجيل الدخول إلى حسابك للإكمال" : "إنشاء حساب جديد للانضمام للحلبة"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <div className="bg-[#0E1217] p-1 rounded-lg border border-[#2A3441] flex gap-1 w-full max-w-[300px]">
              <button
                type="button"
                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                  isLogin ? "bg-[#2A3441] text-white shadow-md" : "text-slate-400 hover:text-white"
                }`}
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                  setSuccess(null);
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                  !isLogin ? "bg-[#2A3441] text-white shadow-md" : "text-slate-400 hover:text-white"
                }`}
                onClick={() => {
                  setIsLogin(false);
                  setError(null);
                  setSuccess(null);
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                إنشاء حساب
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded-lg mb-4 text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <User className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="الاسم"
                      required={!isLogin}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pr-10 bg-[#0E1217] border-[#2A3441] focus-visible:ring-red-500 text-white placeholder:text-slate-500 h-12"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <User className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="اللقب"
                      required={!isLogin}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pr-10 bg-[#0E1217] border-[#2A3441] focus-visible:ring-red-500 text-white placeholder:text-slate-500 h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2 relative">
                  <Calendar className="absolute right-3 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
                  <Input
                    type="date"
                    required={!isLogin}
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="pr-10 bg-[#0E1217] border-[#2A3441] focus-visible:ring-red-500 text-slate-400 h-12"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <div className="space-y-2 relative">
                <Mail className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 pl-4 bg-[#0E1217] border-[#2A3441] focus-visible:ring-red-500 text-white placeholder:text-slate-500 h-12 text-left"
                  dir="ltr"
                />
              </div>
              
              <div className="space-y-2 relative">
                <Lock className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="كلمة السر"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 pl-12 bg-[#0E1217] border-[#2A3441] focus-visible:ring-red-500 text-white placeholder:text-slate-500 h-12 text-left"
                  dir="ltr"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3.5 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {!isLogin && (
                <div className="space-y-2 relative">
                  <Lock className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="تأكيد كلمة السر"
                    required={!isLogin}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pr-10 pl-12 bg-[#0E1217] border-[#2A3441] focus-visible:ring-red-500 text-white placeholder:text-slate-500 h-12 text-left ${
                      confirmPassword && !passwordsMatch ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-3.5 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-red-500 text-xs mt-1 absolute -bottom-6 right-1">
                      كلمة السر غير متطابقة
                    </p>
                  )}
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className={`w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all ${
                !isLogin ? "mt-8" : "mt-6"
              }`}
              disabled={loading || (!isLogin && !passwordsMatch && confirmPassword !== "")}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "تسجيل الدخول" : "تأكيد وإنشاء الحساب")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
