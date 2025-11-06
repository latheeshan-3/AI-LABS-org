import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const AnalyticsSection = () => {
  const stats = [
    {
      icon: Users,
      label: "Total Viewers",
      value: 5847,
      change: "+12.5%",
      color: "text-blue-400"
    },
    {
      icon: BookOpen,
      label: "Course Participants",
      value: 592,
      change: "+8.2%",
      color: "text-green-400"
    },
    {
      icon: Award,
      label: "Certificates Issued",
      value: 434,
      change: "+15.3%",
      color: "text-yellow-400"
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value: 94.7,
      change: "+2.1%",
      color: "text-purple-400",
      isPercentage: true
    }
  ];

  return (
    <section id="analytics" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
            Our Impact
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforming lives through AI education with measurable results
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="glass-card group hover:scale-105 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4 group-hover:animate-pulse-glow">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* CountUp Number */}
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.isPercentage ? (
                      <CountUp
                        end={stat.value}
                        duration={4}
                        decimals={1}
                        suffix="%"
                      />
                    ) : (
                      <CountUp end={stat.value} duration={4} separator="," />
                    )}
                  </div>

                  <div className="text-muted-foreground mb-2">
                    {stat.label}
                  </div>
                  <div className={`text-sm font-medium ${stat.color}`}>
                    {stat.change} from last month
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

export default AnalyticsSection;
