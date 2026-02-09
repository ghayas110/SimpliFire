"use client";

import React, { useRef, useEffect } from "react";
import { useImageSequence } from "@/context/ImageSequenceContext";

interface HeroCanvasProps {
  scrollProgress: number; // 0 to 1
}

export default function HeroCanvas({ scrollProgress }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { images, isLoaded } = useImageSequence();
  const requestRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0 || !isLoaded) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const totalFrames = images.length;

    const render = () => {
      // Calculate target frame based on scroll progress
      const targetFrame = Math.min(
        totalFrames - 1,
        Math.max(0, Math.floor(scrollProgress * (totalFrames - 1)))
      );

      // Lerp for smooth transition
      // Adjust the 0.1 factor for speed of catch-up. Lower = smoother/slower.
      currentFrameRef.current += (targetFrame - currentFrameRef.current) * 0.1;

      // Draw the frame
      const frameIndex = Math.round(currentFrameRef.current);
      const img = images[frameIndex];

      if (img) {
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate "cover" dimensions
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;

        context.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShift_x,
          centerShift_y,
          img.width * ratio,
          img.height * ratio
        );
      }

      requestRef.current = requestAnimationFrame(render);
    };

    // Start loop
    render();

    return () => cancelAnimationFrame(requestRef.current);
  }, [scrollProgress, images, isLoaded]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="sticky top-0 h-screen w-full object-cover"
    />
  );
}
