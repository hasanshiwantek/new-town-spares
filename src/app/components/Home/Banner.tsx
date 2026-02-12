"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
// import homeBanner from "/home-banner.mp4"
const Banner = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isReversingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Trigger text and image animations
    setIsLoaded(true);

    // Ensure autoplay works on mobile/desktop
    const video = videoRef.current;
    if (video) {
      // Ensure video plays forward initially
      video.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });

      // When video ends, immediately start reversing (no pause)
      const handleEnded = () => {
        if (!isReversingRef.current) {
          isReversingRef.current = true;
          // Don't pause, immediately start reverse for smooth transition
          startReversePlayback(video);
        }
      };

      // Monitor video time to catch when it's near the end for smoother transition
      const handleTimeUpdate = () => {
        if (!isReversingRef.current && video.duration) {
          // If video is very close to end (within 0.05 seconds), start reverse immediately
          // This prevents the pause/gap when video ends
          if (video.currentTime >= video.duration - 0.05) {
            isReversingRef.current = true;
            startReversePlayback(video);
          }
        }
      };

      const startReversePlayback = (vid: HTMLVideoElement) => {
        // Cancel any existing animation frame
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        // Use requestAnimationFrame for smooth 60fps reverse playback
        const reverseStep = () => {
          if (vid.currentTime > 0.03) {
            // Decrease currentTime smoothly at ~60fps
            vid.currentTime = Math.max(0, vid.currentTime - 0.033);
            animationFrameRef.current = requestAnimationFrame(reverseStep);
          } else {
            // Reached the start, play forward again immediately
            stopReversePlayback();
            isReversingRef.current = false;
            vid.currentTime = 0;
            vid.play().catch((error) => {
              console.log("Video play failed:", error);
            });
          }
        };

        // Start reverse immediately
        animationFrameRef.current = requestAnimationFrame(reverseStep);
      };

      const stopReversePlayback = () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };

      video.addEventListener("ended", handleEnded);
      video.addEventListener("timeupdate", handleTimeUpdate);

      // Cleanup
      return () => {
        video.removeEventListener("ended", handleEnded);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        stopReversePlayback();
      };
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-visible">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Image
          src="/home-banner-bg.png"
          alt="Banner Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src="/home-banner.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        {/* Overlay for better text readability */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a3a]/80 via-[#0a1a3a]/60 to-transparent"></div> */}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-center w-full h-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-0">
        {/* Text Content */}
        <div
          className={`flex flex-col justify-center text-white space-y-2 sm:space-y-3 md:space-y-4 transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
          style={{
            marginLeft: "clamp(1rem, 8vw, 11rem)",
            marginTop: "clamp(2rem, 10vh, 12rem)",
          }}
        >
          <p className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-[2.6rem] 2xl:text-[3.5rem] font-normal text-white">
            Empowering Your Business with
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-[3.8rem] 2xl:text-[5rem] font-bold leading-tight">
            Quality Computer Components
          </h1>
        </div>

        {/* Computer Parts Image - Bottom Side with Animation */}
        <div
          className={`absolute w-[70%] sm:w-[50.4%] md:w-[50.4%] lg:w-[50.4%] xl:w-[59.5%] 2xl:w-[66.4%] bottom-[-1.5rem] sm:bottom-[-2rem] lg:bottom-[-1.7rem] xl:bottom-[-4.5rem] 2xl:bottom-[-5.5rem] sm:right-40 md:right-30 lg:right-30 xl:right-40 2xl:right-30 transition-all duration-1000 delay-500 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
          // style={{
          //   left: "clamp(0%, 25vw, 38.5rem)",
          //   width: "clamp(70%, 70vw, 66.4%)"
          // }}
        >
          <div className="relative w-full h-[30vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh] xl:h-[60vh] max-h-[761px]">
            {/* Smooth white fade to seamlessly blend with white background below - no harsh separation */}
            <div className="hidden sm:block absolute -bottom-12 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/95 to-transparent z-10 pointer-events-none"></div>
            <div className="hidden sm:block absolute -bottom-8 left-0 right-0 h-24 bg-gradient-to-t from-white/98 via-white/90 to-transparent z-10 pointer-events-none"></div>
            <div className="hidden sm:block absolute -bottom-4 left-0 right-0 h-16 bg-gradient-to-t from-white/95 via-white/80 to-transparent z-10 pointer-events-none"></div>

            <Image
              src="/computer-parts.png"
              alt="Computer Components"
              fill
              className="object-contain object-bottom z-20 relative"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 66.4vw"
              quality={90}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
