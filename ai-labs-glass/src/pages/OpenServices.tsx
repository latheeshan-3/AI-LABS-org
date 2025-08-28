import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, FileText, Calendar, Award } from "lucide-react";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const OpenServices = () => {
  const [certificateId, setCertificateId] = useState("");


  useEffect(() => {
    AOS.init({ duration: 10000, once: true });
  }, []);

  const handleVerification = () => {
    // Placeholder for backend call
    console.log("Verifying certificate:", { certificateId});
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center">
          <div className="container mx-auto" data-aos="fade-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Open Services
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Verify certificates, access public resources, and explore our open educational services.
            </p>
          </div>
        </section>

        {/* Certificate Verification Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto" data-aos="fade-up">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                <Shield className="text-white" size={40} />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-foreground">Certificate Verification</h2>
              <p className="text-xl text-muted-foreground">
                Verify the authenticity of AI Labs certificates using our secure verification system.
              </p>
            </div>

            <div className="glass-card p-8 md:p-12 rounded-3xl mx-auto max-w-2xl" data-aos="fade-up">
              <h3 className="text-2xl font-bold mb-8 text-foreground text-center">Verify a Certificate</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Certificate ID</label>
                  <Input 
                    placeholder="Enter certificate ID (e.g., AI-ML-2024-001)"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    className="glass-input"
                  />
                </div>
              
                <Button 
                  onClick={handleVerification}
                  className="glow-button w-full"
                  disabled={!certificateId}
                >
                  Verify Certificate
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Other Services Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Additional Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-3xl text-center hover:scale-105 transition-transform duration-300" data-aos="fade-up">
                <FileText size={60} className="text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-foreground">Course Materials</h3>
                <p className="text-muted-foreground mb-6">
                  Access free course materials, study guides, and practice exercises.
                </p>
                <Button variant="outline" className="glass-button">
                  Browse Materials
                </Button>
              </div>
              
              <div className="glass-card p-8 rounded-3xl text-center hover:scale-105 transition-transform duration-300" data-aos="fade-up">
                <Calendar size={60} className="text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-foreground">Event Calendar</h3>
                <p className="text-muted-foreground mb-6">
                  Stay updated with our upcoming workshops, webinars, and events.
                </p>
                <Button variant="outline" className="glass-button">
                  View Events
                </Button>
              </div>
              
              <div className="glass-card p-8 rounded-3xl text-center hover:scale-105 transition-transform duration-300" data-aos="fade-up">
                <Award size={60} className="text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-foreground">Alumni Network</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with fellow graduates and expand your professional network.
                </p>
                <Button variant="outline" className="glass-button">
                  Join Network
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OpenServices;
