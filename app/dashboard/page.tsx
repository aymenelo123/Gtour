import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0E1217] flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background Ambient Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-2xl bg-[#13181E] border-[#2A3441] shadow-2xl relative z-10 text-center">
        <CardHeader className="space-y-4 pb-8 border-b border-[#2A3441]">
          <div className="mx-auto w-20 h-20 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <Trophy className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <CardTitle className="text-4xl font-black text-white mb-4 tracking-wide">
              مرحباً بك في لوحة تحكم ArenaBet
            </CardTitle>
            <CardDescription className="text-slate-400 text-lg font-medium">
              تم التخطي بنجاح، أنت الآن في بيئة التطوير التجريبية.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <p className="text-slate-300 text-lg mb-4">
            من هنا يمكنك البدء بإضافة مميزات لوحة التحكم الخاصة بمنصتك.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
