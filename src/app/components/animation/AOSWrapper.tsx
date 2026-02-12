"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

interface AOSWrapperProps {
  children: React.ReactNode;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "flip-left";
  delay?: number;
  duration?: number;
  offset?: number;
  once?: boolean;
  easing?: any; // custom easing
  className?: string;
}

const defaultAnimations = ["fade-up", "fade-down", "fade-left", "fade-right", "zoom-in"];

const AOSWrapper: React.FC<AOSWrapperProps> = ({
  children,
  animation,
  delay = 0,
  duration = 1000,
  offset = 120,
  once = true,
  easing = "ease-out-cubic",
  className = "",
}) => {
  useEffect(() => {
    AOS.init({
      duration,
      offset,
      once,
      easing,
    });
    AOS.refresh();
  }, [duration, offset, once, easing]);

  // If no animation is specified, pick a random one from defaults
  const finalAnimation = animation || defaultAnimations[Math.floor(Math.random() * defaultAnimations.length)];

  return (
    <div
      data-aos={finalAnimation}
      data-aos-delay={delay}
      className={className}
    >
      {children}
    </div>
  );
};

export default AOSWrapper;