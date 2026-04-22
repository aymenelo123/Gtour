"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Settings, Save, Gamepad2, Play, Loader2 } from "lucide-react";
import AvatarUpload from "@/components/AvatarUpload";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [favoriteGames, setFavoriteGames] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setYoutubeUrl(profile.youtube_url || "");
      setFavoriteGames(profile.favorite_games ? profile.favorite_games.join(', ') : "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    setMessage(null);
    
    try {
      // Clean up games string to array
      const gamesArray = favoriteGames
        .split(',')
        .map(game => game.trim())
        .filter(game => game.length > 0);

      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          bio,
          youtube_url: youtubeUrl,
          favorite_games: gamesArray
        })
        .eq("id", user.id);

      if (error) throw error;
      
      await refreshProfile();
      setMessage({ type: "success", text: "تم حفظ التغييرات بنجاح!" });
      
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "حدث خطأ أثناء حفظ التغييرات." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0E1217] flex justify-center p-4 pt-10 pb-20 relative overflow-hidden" dir="rtl">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-4xl z-10 space-y-6">
          <div className="flex items-center gap-4 bg-[#13181E] p-6 rounded-2xl border border-[#2A3441] shadow-2xl">
            <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center border border-red-500/20">
              <Settings className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-wide">
                إعدادات الحساب
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                تخصيص ملفك الشخصي وصورتك الرمزية
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="w-full bg-[#13181E] border-[#2A3441] shadow-xl md:col-span-1 h-fit">
              <CardHeader className="border-b border-[#2A3441] bg-[#0E1217]/50">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-red-500" />
                  الصورة الشخصية
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-2">
                  ارفِع صورة تعبر عنك ليتعرف عليك المنافسون.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-6 flex justify-center sm:justify-start">
                <AvatarUpload />
              </CardContent>
            </Card>

            <Card className="w-full bg-[#13181E] border-[#2A3441] shadow-xl md:col-span-2">
              <form onSubmit={handleSave}>
                <CardHeader className="border-b border-[#2A3441] bg-[#0E1217]/50">
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-red-500" />
                    المعلومات الشخصية
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs mt-2">
                    حدّث معلوماتك لتعكس شخصيتك واهتماماتك كلاعب.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="space-y-2 relative">
                    <label className="text-sm text-slate-300 font-medium font-bold block">اسم المستخدم</label>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#0E1217] border border-[#2A3441] text-white rounded-lg p-3 outline-none focus:border-red-500 transition-colors"
                      placeholder="أدخل اسم المستخدم هنا"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300 font-medium font-bold block">نبذة تعريفية (Bio)</label>
                    <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full bg-[#0E1217] border border-[#2A3441] text-white rounded-lg p-3 outline-none focus:border-red-500 transition-colors resize-none"
                      placeholder="اكتب نبذة قصيرة عن نفسك كلاعب..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-300 font-medium font-bold block flex items-center gap-2">
                      <GamePadIcon className="w-4 h-4 text-primary" /> الألعاب المفضلة
                    </label>
                    <input 
                      type="text" 
                      value={favoriteGames}
                      onChange={(e) => setFavoriteGames(e.target.value)}
                      className="w-full bg-[#0E1217] border border-[#2A3441] text-white rounded-lg p-3 outline-none focus:border-red-500 transition-colors"
                      placeholder="فيفا، كول أوف ديوتي، الخ (مفصولة بفاصلة)"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-300 font-medium font-bold block flex items-center gap-2">
                      <Play className="w-4 h-4 text-red-500" /> رابط يوتيوب أو تويتش
                    </label>
                    <input 
                      type="url" 
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="w-full bg-[#0E1217] border border-[#2A3441] text-white rounded-lg p-3 outline-none focus:border-red-500 transition-colors text-left"
                      placeholder="https://youtube.com/..."
                      dir="ltr"
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#2A3441] bg-[#0E1217]/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="w-full sm:w-auto">
                    {message && (
                      <p className={`text-sm font-medium ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {message.text}
                      </p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold gap-2 min-w-[120px]"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    حفظ التغييرات
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

// Simple wrapper for Gamepad2 icon just for easier naming
function GamePadIcon({ className }: { className?: string }) {
  return <Gamepad2 className={className} />;
}
