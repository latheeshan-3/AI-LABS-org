import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  BookOpen,
  Users,
  Award
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-secondary py-16 mt-20">
      <div className="container mx-auto px-6">
        {/* Registration/Newsletter Section */}
        <div id="register" className="glass-card p-8 mb-16 text-center">
          <h3 className="text-3xl font-bold mb-4 text-white">
            Ready to Start Your AI Journey?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of students already learning AI. Get updates on new courses, exclusive content, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button className="glow-button px-8">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                AI Labs
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Empowering the next generation of AI professionals through comprehensive, hands-on education and cutting-edge curriculum.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="p-2 hover:bg-white/10">
                <Facebook size={18} />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 hover:bg-white/10">
                <Twitter size={18} />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 hover:bg-white/10">
                <Instagram size={18} />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 hover:bg-white/10">
                <Linkedin size={18} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { icon: BookOpen, text: "All Courses" },
                { icon: Users, text: "About Us" },
                { icon: Award, text: "Certifications" },
                { icon: Mail, text: "Contact" }
              ].map((item, index) => (
                <li key={index}>
                  <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-white justify-start">
                    <item.icon size={16} className="mr-2" />
                    {item.text}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Popular Courses</h4>
            <ul className="space-y-2">
              {[
                "AI Fundamentals",
                "Deep Learning",
                "Computer Vision",
                "NLP & Chatbots",
                "AI Ethics"
              ].map((course, index) => (
                <li key={index}>
                  <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-white justify-start">
                    {course}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center text-muted-foreground">
                <MapPin size={16} className="mr-3 text-primary" />
                <span className="text-sm">
                  123 AI Street, Tech City, TC 12345
                </span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone size={16} className="mr-3 text-primary" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Mail size={16} className="mr-3 text-primary" />
                <span className="text-sm">info@ailabs.edu</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>
            © {currentYear} AI Labs. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-white">
              Privacy Policy
            </Button>
            <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-white">
              Terms of Service
            </Button>
            <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-white">
              Cookie Policy
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;