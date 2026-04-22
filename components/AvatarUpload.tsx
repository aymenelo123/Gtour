"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { Camera, Loader2, Upload } from "lucide-react";
import Image from "next/image";

export default function AvatarUpload() {
  const { user, profile, refreshProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImageError(false);
  }, [profile?.avatar_url]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setSuccess(false);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      
      // Validation
      if (!file.type.startsWith("image/")) {
        setError("يجب أن يكون الملف صورة (Image).");
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        setError("حجم الصورة يجب أن لا يتجاوز 2MB.");
        return;
      }

      if (!user) {
        setError("يجب تسجيل الدخول أولاً.");
        return;
      }

      setIsUploading(true);

      // We add a timestamp to the file name to avoid browser caching issues when updating
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, cacheControl: '3600' });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("حدث خطأ أثناء رفع الصورة.");
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update Database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrlData.publicUrl + `?t=${Date.now()}` }) // Query param to bust cache
        .eq("id", user.id);

      if (updateError) {
        console.error("DB update error:", updateError);
        throw new Error("حدث خطأ أثناء تحديث الملف الشخصي.");
      }
      
      // Refresh context
      await refreshProfile();
      setSuccess(true);
      
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-4">
      <div className="relative group">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-[#2A3441] bg-[#0E1217] flex items-center justify-center relative shadow-lg">
          {profile?.avatar_url && !imageError ? (
            <Image 
              src={profile.avatar_url} 
              alt="Profile Avatar" 
              fill
              unoptimized
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <Upload className="w-10 h-10 text-slate-500" />
          )}
          
          <div 
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
            onClick={handleUploadClick}
          >
            <Camera className="w-8 h-8 text-white" />
          </div>

          {isUploading && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-center sm:items-start gap-2">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          accept="image/*"
          className="hidden" 
        />
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="bg-[#13181E] border-[#2A3441] text-white hover:bg-[#1A2129]"
        >
          {isUploading ? "جاري الرفع..." : "تغيير الصورة"}
        </Button>
        <p className="text-xs text-slate-500 font-medium">الحد الأقصى 2MB (JPG, PNG)</p>
        
        {error && <p className="text-sm text-red-500 text-center sm:text-right mt-1 font-medium">{error}</p>}
        {success && <p className="text-sm text-emerald-500 text-center sm:text-right mt-1 font-medium">تم التحديث بنجاح!</p>}
      </div>
    </div>
  );
}
