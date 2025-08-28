import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Target, Award, BookOpen } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent animate-fade-in">
              About AI Labs
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-slide-up">
              Empowering the next generation through cutting-edge AI education and innovative learning experiences.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="glass-card p-8 md:p-12 rounded-3xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6 text-foreground">Our Mission</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    At AI Labs, we believe that artificial intelligence education should be accessible, 
                    engaging, and practical. We're dedicated to providing world-class online and offline 
                    learning experiences that prepare students for the AI-driven future.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Our expert instructors and cutting-edge curriculum ensure that every student 
                    gains hands-on experience with the latest AI technologies and methodologies.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-xl opacity-20"></div>
                  <div className="relative glass-card p-8 rounded-3xl">
                    <Target size={80} className="text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-center text-foreground">Excellence in AI Education</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-3xl text-center hover:scale-105 transition-transform duration-300">
                <Users size={60} className="text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-foreground">Community</h3>
                <p className="text-muted-foreground">
                  Building a supportive learning community where students collaborate and grow together.
                </p>
              </div>
              <div className="glass-card p-8 rounded-3xl text-center hover:scale-105 transition-transform duration-300">
                <BookOpen size={60} className="text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-foreground">Innovation</h3>
                <p className="text-muted-foreground">
                  Constantly updating our curriculum with the latest AI advancements and industry practices.
                </p>
              </div>
              <div className="glass-card p-8 rounded-3xl text-center hover:scale-105 transition-transform duration-300">
                <Award size={60} className="text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-foreground">Excellence</h3>
                <p className="text-muted-foreground">
                  Delivering high-quality education that exceeds expectations and drives real results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-foreground">Meet Our Expert Team</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our instructors are industry professionals with years of experience in AI research and development.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((member) => (
                <div key={member} className="glass-card p-8 rounded-3xl text-center">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">AI</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Dr. AI Expert {member}</h3>
                  <p className="text-primary mb-4">Senior AI Researcher</p>
                  <p className="text-muted-foreground">
                    Specialist in machine learning and deep learning with 10+ years of industry experience.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;