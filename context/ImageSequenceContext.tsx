"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ImageSequenceContextType {
  images: HTMLImageElement[];
  progress: number;
  isLoaded: boolean;
  loadImages: () => void;
}

const ImageSequenceContext = createContext<ImageSequenceContextType | undefined>(undefined);

export const useImageSequence = () => {
  const context = useContext(ImageSequenceContext);
  if (!context) {
    throw new Error("useImageSequence must be used within an ImageSequenceProvider");
  }
  return context;
};

export const ImageSequenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadImages = () => {
    if (isLoaded) return;

    const totalFrames = 279;
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const filename = `ezgif-frame-${i.toString().padStart(3, "0")}.jpg`;
      img.src = `/assets/sequence/${filename}`;
      
      img.onload = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / totalFrames) * 100));
        
        if (loadedCount === totalFrames) {
          setIsLoaded(true);
        }
      };

      // Ensure order is preserved in the array (though loading is async)
      // Actually, we should assign to index.
      loadedImages[i - 1] = img;
    }
    
    setImages(loadedImages);
  };

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <ImageSequenceContext.Provider value={{ images, progress, isLoaded, loadImages }}>
      {children}
    </ImageSequenceContext.Provider>
  );
};
