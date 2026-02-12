"use client";

import React, { useRef, useEffect, useState } from "react";

const milestones = [
    {
      year: "2021",
      title: "Resilience and Collaboration",
      description:
        "Our collaboration with global customers during the challenging COVID-19 pandemic fosters resilience and leads to remarkable market share growth and mutual success.",
      image: "/about/about-journey-img1.png",
      position: "right",
    },
    {
      year: "2022",
      title: "Globalization and Localization",
      description:
        "We focus on refining our global business strategy and providing localized, and all-encompassing services ensures our customers' success in a dynamic and ever-changing market.",
      image: "/about/about-journey-img2.png",
      position: "left",
    },
    {
      year: "2023",
      title: "Enhanced Customer Value",
      description:
        "Driven by our passion for customer success, we upgrade our services, brand, and customer service system, elevating the overall customer experience and delivering unparalleled value.",
      image: "/about/about-journey-img3.png",
      position: "right",
    },
    {
      year: "2024",
      title: "Digital Transformation Partnership",
      description:
        "We strategically partner with Oracle to adopt a cutting-edge digital cloud platform, optimizing service efficiency and embracing digital transformation for our customers' benefit.",
      image: "/about/about-journey-img4.png",
      position: "left",
    },
    {
      year: "2025",
      title: "Product Diversification for Client Success",
      description:
        "We broaden our product offerings over 30 esteemed brands, including HPE, Dell, Juniper, etc., empowering our clients to stay ahead in a competitive market.",
      image: "/about/about-journey-img5.png",
      position: "right",
    },
  ];

const JourneyTimeline = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [linePaths, setLinePaths] = useState<Array<{ path: string; color: string }>>([]);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const calculateLines = () => {
      const paths: Array<{ path: string; color: string }> = [];
      
      if (!containerRef.current) {
        return;
      }
      
      // Check if all cards are rendered (only desktop cards)
      const desktopCards = milestones.map((_, i) => {
        // Only check desktop layout cards
        return cardRefs.current[i];
      });
      
      const allCardsRendered = desktopCards.every(card => card !== null && card !== undefined);
      if (!allCardsRendered) {
        return;
      }
      
      for (let i = 0; i < milestones.length - 1; i++) {
        const currentCard = cardRefs.current[i];
        const nextCard = cardRefs.current[i + 1];
        
        if (!currentCard || !nextCard) {
          continue;
        }
        
        const currentRect = currentCard.getBoundingClientRect();
        const nextRect = nextCard.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Get border color
        const borderColor = i === 0 ? '#F15939' : '#444444';
        
        // Determine which side to start from (even index = left side, odd index = right side)
        const isEven = i % 2 === 0;
        const startX = isEven 
          ? currentRect.left - containerRect.left 
          : currentRect.right - containerRect.left;
        const startY = currentRect.top - containerRect.top + (currentRect.height / 2);
        
        // End at top center of next card
        const endX = nextRect.left - containerRect.left + (nextRect.width / 2);
        const endY = nextRect.top - containerRect.top;
        
        // Create curved path with better control point
        const controlY = startY + (endY - startY) * 0.6;
        const path = `M ${startX} ${startY} Q ${startX} ${controlY}, ${endX} ${endY}`;
        paths.push({ path, color: borderColor });
      }
      
      if (paths.length > 0 && containerRef.current) {
        setLinePaths(paths);
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    // Use requestAnimationFrame for better timing
    const rafId = requestAnimationFrame(() => {
      setTimeout(calculateLines, 100);
      setTimeout(calculateLines, 500);
      setTimeout(calculateLines, 1000);
    });
    
    const handleResize = () => {
      calculateLines();
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', calculateLines);
    
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', calculateLines);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-6 md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%]">
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-left mb-16 sm:mb-24">
          <h1 className="h1-lg !text-[#FFFFFF]">
            Journey Of Excellence
          </h1>
          <p className="h1-lg !text-[#FFFFFF]">
            Shaping <span className="text-[#F15939]">The Future</span> Of
            Customer Success
          </p>
        </div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Connecting Lines SVG - Desktop only */}
          <svg 
            className="hidden lg:block absolute top-0 left-0 pointer-events-none" 
            style={{ 
              zIndex: 5,
              width: containerSize.width > 0 ? `${containerSize.width}px` : '100%',
              height: containerSize.height > 0 ? `${containerSize.height}px` : '100%'
            }}
          >
            {linePaths.length === 0 && (
              <line x1="0" y1="0" x2="100" y2="100" stroke="red" strokeWidth="2" />
            )}
            {linePaths.map((line, index) => (
              <path
                key={`line-${index}`}
                d={line.path}
                stroke={line.color}
                strokeWidth="4"
                fill="none"
                opacity="1"
              />
            ))}
          </svg>

          {milestones.map((milestone, index) => (
            <div
              key={milestone.year}
              className="relative mb-16 sm:mb-24 last:mb-0 lg:mt-80"
            >
              {/* Mobile Layout */}
              <div className="lg:hidden">
                {/* Content */}
                <div className="w-full">
                  <div className={`bg-[#212121] border-3 ${index === 0 ? 'border-[#F15939]' : 'border-[#444444]'} rounded-lg p-6 sm:p-8 mb-4`}>
                    <h3 className="h2-medium !text-[#FFFFFF] mb-4">
                      {milestone.title}
                    </h3>
                    <p className="h5-regular !text-[#FFFFFF] leading-relaxed mb-6">
                      {milestone.description}
                    </p>
                    <div className="text-6xl sm:text-8xl text-right opacity-30 font-bold !text-[#FFFFFF]">
                      {milestone.year}
                    </div>
                  </div>
                  <img
                    src={milestone.image}
                    alt={milestone.title}
                    className="w-full h-[240px] sm:h-[300px] object-cover rounded-lg !border-2 !border-white"
                    style={{ border: '2px solid white' }}
                  />
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:flex items-center gap-8 mt-56">
                {milestone.position === "right" ? (
                  <>
                    {/* Left side - empty space */}
                    <div className="flex-1"></div>

                    {/* Right side - content */}
                    <div className="flex-1 relative -translate-x-58 2xl:-translate-x-80">
                      <div 
                        ref={(el) => {
                          if (el) cardRefs.current[index] = el;
                        }}
                        className={`bg-[#212121] border-3 ${index === 0 ? 'border-[#F15939]' : 'border-[#444444]'} rounded-lg p-8 lg:w-[85.4%] xl:w-[85.4%] 2xl:w-[85.4%] h-[400px] relative z-10`}
                      >
                        <h3 className="h2-medium !text-[#FFFFFF] mb-4 w-full lg:max-w-[80%] xl:max-w-[80%] 2xl:max-w-2xl">
                          {milestone.title}
                        </h3>
                        <p className="h5-regular !text-[#FFFFFF] leading-relaxed mb-6 w-full lg:max-w-[80%] xl:max-w-[80%] 2xl:max-w-[80%]">
                          {milestone.description}
                        </p>
                        <div className="text-8xl text-right opacity-30 font-bold !text-[#FFFFFF]">
                          {milestone.year}
                        </div>
                      </div>
                      <img
                        src={milestone.image}
                        alt={milestone.title}
                        className="absolute top-0 lg:-right-[160px] xl:-right-[160px] 2xl:-right-[220px] translate-x-4 w-64 h-[306px] object-cover rounded-lg !border-2 !border-white -translate-y-1/2 lg:w-[59.8%] xl:w-[59.8%] 2xl:w-[59.8%] z-20"
                        style={{ border: '2px solid white' }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Left side - content */}
                    <div className="flex-1 relative">
                      <div 
                        ref={(el) => {
                          if (el) cardRefs.current[index] = el;
                        }}
                        className="bg-[#212121] border-3 border-[#444444] rounded-lg p-8 lg:w-[85.4%] xl:w-[85.4%] 2xl:w-[85.4%] h-[400px] relative z-10"
                      >
                        <h3 className="h2-medium !text-[#FFFFFF] mb-4 w-full lg:max-w-[80%] xl:max-w-[80%] 2xl:max-w-2xl">
                          {milestone.title}
                        </h3>
                        <p className="h5-regular !text-[#FFFFFF] leading-relaxed mb-6 w-full lg:max-w-[80%] xl:max-w-[80%] 2xl:max-w-[80%]">
                          {milestone.description}
                        </p>
                        <div className="text-8xl text-right opacity-30 font-bold !text-[#FFFFFF]">
                          {milestone.year}
                        </div>
                      </div>
                      <img
                        src={milestone.image}
                        alt={milestone.title}
                        className="absolute top-0 lg:-right-[140px] xl:-right-[160px] 2xl:-right-[220px] translate-x-4 w-64 h-[306px] object-cover rounded-lg !border-2 !border-white -translate-y-1/2 lg:w-[59.8%] xl:w-[59.8%] 2xl:w-[59.8%] z-20"
                        style={{ border: '2px solid white' }}
                      />
                    </div>

                    {/* Right side - empty space */}
                    <div className="flex-1"></div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JourneyTimeline;
