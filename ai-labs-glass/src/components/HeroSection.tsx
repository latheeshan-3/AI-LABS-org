import { Button } from "@/components/ui/button";
import { BookOpen, Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import ThreeBackground from "./ThreeBackground";

const HeroSection = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  const fullText = "Senior Gravity";
  const typingSpeed = 100; // milliseconds per character

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-10 sm:pt-20">

      {/* 3D Background */}
      <ThreeBackground />

      {/* Foreground Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Animated Typing Title */}
        <h1
  className="text-5xl sm:text-6xl md:text-[8rem] lg:text-[12rem] 
             font-black tracking-tight leading-tight 
             mb-4 text-white mx-auto w-fit 
             min-h-[100px] sm:min-h-[140px] md:min-h-[220px] 
             flex items-center justify-center">
  {displayedText}
</h1>


        <p className="text-lg md:text-xl text-gray-300 mb-10">
          Unlock the power of{" "}
          <span className="text-cyan-400 font-semibold">Artificial Intelligence</span>{" "}
          with our cutting-edge courses.
          <br />
          <span className="text-gray-200 font-semibold">
            Shape the future. Master AI today.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button
            size="lg"
className="px-8 py-4 text-lg rounded-2xl 
bg-gradient-to-r from-blue-300 via-cyan-600 to-blue-400 
text-white shadow-[0_0_20px_rgba(56,189,248,0.7)] 
backdrop-blur-lg border border-cyan-300/50 
hover:shadow-[0_0_30px_rgba(56,189,248,1)] 
hover:from-cyan-300 hover:via-blue-400 hover:to-cyan-500 
transition-all duration-300"
            onClick={() => scrollToSection("courses")}
          >
            <BookOpen className="mr-2" size={20} />
            View All Courses
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 text-lg rounded-2xl text-white bg-white/5 border border-gray-600 backdrop-blur-md hover:bg-white/10 hover:scale-105 transition-transform duration-300"
            onClick={() => setIsAuthModalOpen(true)}
          >
            <Rocket className="mr-2" size={20} />
            Let's Get Started
          </Button>
        </div>
      </div>

      {/* Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      

    </section>
  );
};

export default HeroSection;