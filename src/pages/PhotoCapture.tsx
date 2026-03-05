import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Plus, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScreenHeader from "@/components/ScreenHeader";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { analyzeItemPhoto } from "@/lib/gemini";

const MAX_PHOTOS = 5;

const PhotoCapture = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const base64Photos = await Promise.all(
        Array.from(files).map((file) => fileToBase64(file))
      );
      
      const newFiles = Array.from(files);
      
      const updatedPhotos = [...photos, ...base64Photos].slice(0, MAX_PHOTOS);
      const updatedFiles = [...photoFiles, ...newFiles].slice(0, MAX_PHOTOS);
      
      setPhotos(updatedPhotos);
      setPhotoFiles(updatedFiles);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoFiles(photoFiles.filter((_, i) => i !== index));
  };

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const uploadPhotosToSupabase = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of photoFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('listings')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('listings')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleNext = async () => {
    if (photoFiles.length === 0) {
      toast({
        title: "No photos",
        description: "Please add at least one photo",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);

    try {
      // Analyze first photo with Claude AI
      const aiAnalysis = await analyzeItemPhoto(photos[0]);
      
      setAnalyzing(false);
      setUploading(true);

      // Upload photos to Supabase Storage
      const uploadedUrls = await uploadPhotosToSupabase();

      // Navigate to next screen with AI suggestions AND uploaded URLs
      navigate("/description", { 
        state: { 
          photos: uploadedUrls,
          aiSuggestions: aiAnalysis,
          showAiBanner: true
        } 
      });
    } catch (error) {
      console.error('Error:', error);
      setAnalyzing(false);
      setUploading(false);
      toast({
        title: "Error",
        description: "Failed to process photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader title="Add Photos" />

      <div className="flex-1 flex flex-col p-12">
        {/* Camera area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-muted rounded-2xl mb-4 relative overflow-hidden">
          {photos.length === 0 ? (
            <button
              onClick={handleAddPhoto}
              className="flex flex-col items-center gap-3 p-8 hover:opacity-80 transition-opacity"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="w-10 h-10 text-primary" />
              </div>
              <span className="text-muted-foreground font-medium">
                Tap to add photos
              </span>
              <span className="text-xs text-muted-foreground">
                Up to {MAX_PHOTOS} photos
              </span>
            </button>
          ) : (
            <>
              <img
                src={photos[0]}
                alt="Main preview"
                className="w-full h-full object-cover"
              />

              {photos.length < MAX_PHOTOS && (
                <button
                  onClick={handleAddPhoto}
                  className="absolute top-4 right-4 w-10 h-10 bg-card/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-card transition-colors"
                >
                  <Plus className="w-5 h-5 text-foreground" />
                </button>
              )}
            </>
          )}
        </div>

        {/* AI Guidance Banner */}
        {photos.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-3 mb-4">
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                  📸 First photo matters!
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Our AI analyzes your first photo to suggest a title and price. Make sure it clearly shows the main item you're selling. Add extra angles in photos 2-5.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Thumbnail row */}
        {photos.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative flex-shrink-0">
                {/* Main Photo Badge */}
                {index === 0 && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
                    <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-sm">
                      Main
                    </span>
                  </div>
                )}
                
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className={`w-20 h-20 rounded-xl object-cover ${
                    index === 0 
                      ? 'border-2 border-primary' 
                      : 'border-2 border-border'
                  }`}
                />
                
                {/* Clean remove button */}
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all z-10"
                >
                  <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            ))}
            
            {/* Add more button */}
            {photos.length < MAX_PHOTOS && (
              <button
                onClick={handleAddPhoto}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors flex-shrink-0"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}
          </div>
        )}

        {/* Photo count */}
        <p className="text-center text-sm text-muted-foreground mb-4">
          {photos.length}/{MAX_PHOTOS} photos added
        </p>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Next button */}
        <Button
          onClick={handleNext}
          disabled={photos.length === 0 || uploading || analyzing}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-300 ease-out disabled:opacity-50 shadow-none hover:shadow-none"
        >
          {analyzing ? "🤖 AI analyzing photo..." : uploading ? "Uploading..." : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default PhotoCapture;