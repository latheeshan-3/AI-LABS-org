import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AnalyticsSection from "@/components/AnalyticsSection";
import CoursesSection from "@/components/CoursesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <AnalyticsSection />
        <CoursesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
