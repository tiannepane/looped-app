import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScreenHeader from "@/components/ScreenHeader";

const PhotoCapture = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [showAiBadge, setShowAiBadge] = useState(false);

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
      const updatedPhotos = [...photos, ...base64Photos].slice(0, 5);
      setPhotos(updatedPhotos);
      
      // Show AI badge after first photo
      if (updatedPhotos.length > 0 && !showAiBadge) {
        setTimeout(() => setShowAiBadge(true), 500);
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    if (photos.length <= 1) {
      setShowAiBadge(false);
    }
  };

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader title="Add Photos" />

      <div className="flex-1 flex flex-col p-4">
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
                Up to 5 photos
              </span>
            </button>
          ) : (
            <>
              {/* Main preview */}
              <img
                src={photos[0]}
                alt="Main preview"
                className="w-full h-full object-cover"
              />
              
              {/* AI Badge */}
              {showAiBadge && (
                <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg animate-in fade-in slide-in-from-left-4 duration-300">
                  <span className="text-sm font-medium text-foreground">
                    Looks like furniture 🛋️
                  </span>
                </div>
              )}

              {/* Add more button */}
              {photos.length < 5 && (
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

        {/* Thumbnail row */}
        {photos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 border-border"
              >
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-destructive-foreground" />
                </button>
              </div>
            ))}
            {photos.length < 5 && (
              <button
                onClick={handleAddPhoto}
                className="flex-shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
        )}

        {/* Photo count */}
        <p className="text-center text-sm text-muted-foreground mb-4">
          {photos.length}/5 photos added
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
          onClick={() => navigate("/description", { state: { photos } })}
          disabled={photos.length === 0}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-300 ease-out disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PhotoCapture;
