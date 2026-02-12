"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import workLifeLeft from "@/assets/about/worf-life-left.png";
import workLifeMiddle from "@/assets/about/worf-life-middle.png";
import workLifeRight from "@/assets/about/worf-life-right.png";

const WorkLifeSlider = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const carouselRef = useRef<HTMLDivElement>(null);

  // Mouse wheel support
  useEffect(() => {
    if (!api || !carouselRef.current) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        api.scrollNext();
      } else {
        api.scrollPrev();
      }
    };

    const carouselElement = carouselRef.current;
    carouselElement.addEventListener("wheel", handleWheel, { passive: false });
    
    return () => {
      carouselElement.removeEventListener("wheel", handleWheel);
    };
  }, [api]);


  return (
    <div className="w-full bg-black py-12">
      <div className="w-full mx-auto px-4">
        {/* Text Above Slider */}
        <div className="flex justify-center items-center mx-auto">
          <h2 className="h1-lg !text-[#FFFFFF] 2xl:w-[40%] text-center">
            Work-Life Harmony, Happiness & Customer Commitment
          </h2>
        </div>

        <div ref={carouselRef} className="overflow-hidden w-full">
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
              slidesToScroll: 1,
              containScroll: "trimSnaps",
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
          <CarouselContent className="-ml-2 md:-ml-4">
            <CarouselItem key="left" className="pl-2 md:pl-4 basis-[85%] md:basis-[70%] lg:basis-[60%]">
              <div className="flex items-center justify-center h-[650px] px-2">
                <div className="relative w-full max-w-[1300px] h-full flex items-center justify-center">
                  <img
                    src={typeof workLifeLeft === 'string' ? workLifeLeft : workLifeLeft.src}
                    alt="Work-Life Harmony, Happiness & Customer Commitment - Left"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem key="middle" className="pl-2 md:pl-4 basis-[85%] md:basis-[70%] lg:basis-[60%]">
              <div className="flex items-center justify-center h-[650px] px-2">
                <div className="relative w-full max-w-[1300px] h-full flex items-center justify-center">
                  <img
                    src={typeof workLifeMiddle === 'string' ? workLifeMiddle : workLifeMiddle.src}
                    alt="Work-Life Harmony, Happiness & Customer Commitment - Middle"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem key="right" className="pl-2 md:pl-4 basis-[85%] md:basis-[70%] lg:basis-[60%]">
              <div className="flex items-center justify-center h-[650px] px-2">
                <div className="relative w-full max-w-[1300px] h-full flex items-center justify-center">
                  <img
                    src={typeof workLifeRight === 'string' ? workLifeRight : workLifeRight.src}
                    alt="Work-Life Harmony, Happiness & Customer Commitment - Right"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center mt-6 gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`transition-all duration-300 rounded-full ${
                index === current
                  ? "w-8 h-2 bg-white"
                  : "w-8 h-2 bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkLifeSlider;

