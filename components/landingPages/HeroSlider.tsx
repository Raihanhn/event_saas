//components/landingPages/HeroSlider.tsx
"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  image: string;
  buttonText?: string;
  buttonLink?: string;
}

interface HeroSliderProps {
  slides: Slide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const delayRef = useRef(5000);

 useEffect(() => {
  if (slides.length <= 1) return;

  timeoutRef.current = setTimeout(() => {
    setCurrentIndex((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  }, delayRef.current);

  return () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
}, [currentIndex, slides.length]);


  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] md:h-[100vh] overflow-hidden "
     style={{ contain: "paint layout size" }}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >

          <Image
            src={slide.image}
            alt={`Slide ${index + 1}`}
            fill
            sizes="100vw"
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            className="object-fill"
          />

          {slide.buttonText && slide.buttonLink && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
              <a
                href={slide.buttonLink}
                className="bg-white/35 backdrop-blur-sm hover:bg-[#4F46E5] transition transform hover:scale-105 hover:text-white text-[#4F46E5] px-6 py-3 rounded-full shadow text-lg sm:text-xl md:text-2xl font-semibold shadow-lg"
              >
                {slide.buttonText}
              </a>
            </div>
          )}
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl sm:text-4xl 
             bg-white/20 backdrop-blur-md border border-white/30 
             hover:bg-white/30 p-2 sm:p-3 rounded-full z-20 transition"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl sm:text-4xl 
             bg-white/20 backdrop-blur-md border border-white/30 
             hover:bg-white/30 p-2 sm:p-3 rounded-full z-20 transition"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-1.5 h-1.5 rounded-full ${
              idx === currentIndex ? "bg-[#4F46E5]" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(idx)}
          ></button>
        ))}
      </div>
    </div>
  );
}
