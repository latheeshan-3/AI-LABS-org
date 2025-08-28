import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent animate-fade-in">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-slide-up">
              Get in touch with our team. We're here to help you on your AI learning journey.
            </p>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="glass-card p-8 md:p-12 rounded-3xl">
                <h2 className="text-3xl font-bold mb-8 text-foreground">Send us a Message</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">First Name</label>
                      <Input placeholder="John" className="glass-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Last Name</label>
                      <Input placeholder="Doe" className="glass-input" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                    <Input type="email" placeholder="john@example.com" className="glass-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Subject</label>
                    <Input placeholder="Course Inquiry" className="glass-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Message</label>
                    <Textarea 
                      placeholder="Tell us how we can help you..." 
                      className="glass-input min-h-[120px]" 
                    />
                  </div>
                  <Button className="glow-button w-full">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className="glass-card p-8 rounded-3xl">
                  <h2 className="text-3xl font-bold mb-8 text-foreground">Get in Touch</h2>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Mail className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Email</h3>
                        <p className="text-muted-foreground">contact@ailabs.edu</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Phone className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Phone</h3>
                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <MapPin className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Address</h3>
                        <p className="text-muted-foreground">123 AI Street, Tech City, TC 12345</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Clock className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Office Hours</h3>
                        <p className="text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="glass-card p-8 rounded-3xl">
                  <h3 className="text-2xl font-bold mb-6 text-foreground">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">How do I enroll in a course?</h4>
                      <p className="text-muted-foreground text-sm">Visit our courses page and click "Book Course" on your desired program.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Do you offer refunds?</h4>
                      <p className="text-muted-foreground text-sm">Yes, we offer a 30-day money-back guarantee for all courses.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Are courses self-paced?</h4>
                      <p className="text-muted-foreground text-sm">Most of our courses are self-paced with optional live sessions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;