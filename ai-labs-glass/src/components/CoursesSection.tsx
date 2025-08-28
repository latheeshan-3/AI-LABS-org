import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Monitor, Users } from "lucide-react";
import { motion } from "framer-motion";

const CoursesSection = () => {
  const courses = [
    {
      id: 1,
      title: "AI Fundamentals",
      description: "Master the basics of artificial intelligence and machine learning",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
      mode: "Online",
      rating: 4.8,
      reviews: 1247,
      price: "$299",
      level: "Beginner"
    },
    {
      id: 2,
      title: "Deep Learning Mastery",
      description: "Advanced neural networks and deep learning techniques",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
      mode: "Both",
      rating: 4.9,
      reviews: 892,
      price: "$599",
      level: "Advanced"
    },
    {
      id: 3,
      title: "Computer Vision",
      description: "Image processing and computer vision with practical projects",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      mode: "Physical",
      rating: 4.7,
      reviews: 654,
      price: "$449",
      level: "Intermediate"
    },
    {
      id: 4,
      title: "Natural Language Processing",
      description: "Text analysis, chatbots, and language understanding",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
      mode: "Online",
      rating: 4.6,
      reviews: 543,
      price: "$399",
      level: "Intermediate"
    },
    {
      id: 5,
      title: "AI Ethics & Society",
      description: "Understanding the ethical implications of AI technology",
      image: "https://images.unsplash.com/photo-1573164713712-03790a178651?w=400",
      mode: "Both",
      rating: 4.5,
      reviews: 321,
      price: "$199",
      level: "Beginner"
    },
    {
      id: 6,
      title: "Robotics & AI",
      description: "Combining robotics with AI for intelligent automation",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
      mode: "Physical",
      rating: 4.8,
      reviews: 789,
      price: "$799",
      level: "Advanced"
    }
  ];

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
        {/* Section Header */}
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
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="course-card overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
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
                  <CardTitle className="text-xl font-bold text-white">
                    {course.title}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {course.description}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">{renderStars(course.rating)}</div>
                    <span className="text-sm text-yellow-400 font-medium">
                      {course.rating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({course.reviews} reviews)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary-glow">
                      {course.price}
                    </div>
                    <Button className="glow-button">
                      Book Course
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;