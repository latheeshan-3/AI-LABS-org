import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Monitor, Users, Home } from "lucide-react";
import { motion } from "framer-motion";
import AuthModal from "../components/AuthModal";


interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  mode: string;
  rating: number;
  reviews: number;
  price: string;
  level: string;
  totalParticipants: number;
  certificateProviders: string;
  promoCode?: string;
  demoCertificate?: string;
}

const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [bookedCourseIds, setBookedCourseIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).id : null;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/courses`);
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data: Course[] = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    const fetchBookedCourses = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`${API_BASE_URL}/user-selected-courses/user/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch booked courses");
        const booked: { courseId: number }[] = await res.json();
        setBookedCourseIds(booked.map(b => b.courseId));
      } catch (err) {
        console.error("Error fetching booked courses:", err);
      }
    };

    fetchCourses();
    fetchBookedCourses();
  }, [userId]);

  const handleBookCourse = async (course: Course) => {
    if (!userId) {
      setShowLogin(true);
      return;
    }

    if (bookedCourseIds.includes(course.id)) {
      setMessage(" You have already enrolled in this course");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/user-selected-courses/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          courseId: course.id,
          completionStatus: "ENROLLED",
          selectedCourseTitle: course.title,
          certificateUrl: null,
          enrolledDate: new Date().toISOString().split("T")[0],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to book course");
      }

      setMessage(` You successfully booked: ${course.title}`);
      setBookedCourseIds(prev => [...prev, course.id]); // mark as booked
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "Online": return <Monitor size={16} />;
      case "Physical": return <MapPin size={16} />;
      case "Both": return <Users size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "Online": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Physical": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Both": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}
      />
    ));
  };

  return (
    <section id="courses" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
 

          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
            Featured Courses
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our comprehensive AI courses designed for every skill level
          </p>
          {message && <p className="mt-4 text-green-400">{message}</p>}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const isBooked = bookedCourseIds.includes(course.id);

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className={`course-card overflow-hidden group transition-all duration-300 ${isBooked ? "opacity-60" : "hover:scale-105"}`}>
                  <div className="relative">
                    <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-4 right-4">
                      <Badge className={getModeColor(course.mode)}>
                        {getModeIcon(course.mode)}
                        <span className="ml-1">{course.mode}</span>
                      </Badge>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-black/50 text-white border-0">
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">{course.title}</CardTitle>
                    <p className="text-muted-foreground">{course.description}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">{renderStars(course.rating)}</div>
                      <span className="text-sm text-yellow-400 font-medium">{course.rating}</span>
                      <span className="text-sm text-muted-foreground">({course.reviews} reviews)</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-1">
                      👥 {course.totalParticipants} participants
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      🎓 Certificate by: {course.certificateProviders}
                    </p>
                    {course.promoCode && (
                      <p className="text-sm text-green-400 mb-1">
                        💸 Use promo code: <strong>{course.promoCode}</strong>
                      </p>
                    )}
                    {course.demoCertificate && (
                      <a
                        href={course.demoCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 underline mb-2 block"
                      >
                        📄 View Demo Certificate
                      </a>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary-glow">{course.price}</div>
                      <Button
                        className="glow-button"
                        onClick={() => handleBookCourse(course)}
                        disabled={loading || isBooked}
                      >
                        {isBooked ? "Booked" : loading ? "Booking..." : "Book Course"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AuthModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </section>
  );
};

export default CoursesSection;
