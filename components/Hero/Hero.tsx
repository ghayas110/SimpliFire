import React, { useRef } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import HeroCanvas from "./HeroCanvas";
import StoryOverlay from "./StoryOverlay";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [progress, setProgress] = React.useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  return (
    <section ref={containerRef} className="relative h-[800vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <HeroCanvas scrollProgress={progress} />
        <StoryOverlay scrollProgress={progress} />
      </div>
    </section>
  );
}
