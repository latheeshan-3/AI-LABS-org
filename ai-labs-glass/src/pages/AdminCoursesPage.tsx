import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";

interface Course {
  id?: number;
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const COURSES_URL = `${API_BASE_URL}/courses`;

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(COURSES_URL);
      const data = await res.json();
      setCourses(data);
    } catch {
      setError("⚠️ Failed to load courses. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    await fetch(`${COURSES_URL}/${id}`, { method: "DELETE" });
    setCourses(courses.filter(c => c.id !== id));
  };

  const handleSave = async (course: Course) => {
    if (!course.title || !course.description || !course.price) {
      setError("Title, Description, and Price are required.");
      return;
    }

    const method = course.id ? "PUT" : "POST";
    const url = course.id ? `${COURSES_URL}/${course.id}` : COURSES_URL;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });

    if (!res.ok) {
      setError("Failed to save course.");
      return;
    }

    const savedCourse = await res.json();
    if (course.id) {
      setCourses(courses.map(c => (c.id === savedCourse.id ? savedCourse : c)));
    } else {
      setCourses([...courses, savedCourse]);
    }

    setEditingCourse(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 tracking-tight text-blue-400">
          🎓 Admin Course Management
        </h1>

        {error && (
          <p className="text-red-500 bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-center mb-4">
            {error}
          </p>
        )}

        <div className="flex justify-center mb-8">
          <Button
            onClick={() =>
              setEditingCourse({
                title: "",
                description: "",
                image: "",
                mode: "Online",
                rating: 0,
                reviews: 0,
                price: "",
                level: "Beginner",
                totalParticipants: 0,
                certificateProviders: "",
                promoCode: "",
                demoCertificate: "",
              })
            }
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Course
          </Button>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border border-white/10 shadow-xl hover:scale-[1.02] transition-all duration-300">
                <img
                  src={course.image || "https://via.placeholder.com/400x200"}
                  alt={course.title}
                  className="rounded-t-lg w-full h-40 object-cover"
                />
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-300">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-gray-300 line-clamp-3">{course.description}</p>
                  <div className="grid grid-cols-2 text-xs gap-1 mt-2 text-gray-400">
                    <p>🎯 {course.level}</p>
                    <p>💻 {course.mode}</p>
                    <p>⭐ {course.rating} / 5 ({course.reviews})</p>
                    <p>👥 {course.totalParticipants}</p>
                  </div>
                  <p className="mt-2 font-semibold text-blue-400 text-md">💰 {course.price}</p>
                  <p className="text-gray-400 text-xs">
                    🏅 {course.certificateProviders || "N/A"}
                  </p>
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingCourse(course)}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                    >
                      <Edit2 size={14} /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(course.id!)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add / Edit Form */}
        {editingCourse && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 p-8 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md shadow-lg"
          >
            <h2 className="text-2xl font-bold text-blue-400 mb-6">
              {editingCourse.id ? "✏️ Edit Course" : "➕ Add New Course"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="p-3 rounded-md bg-white/5 border border-white/20 text-gray-100"
                placeholder="Course Title"
                value={editingCourse.title}
                onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
              />
              <input
                className="p-3 rounded-md bg-white/5 border border-white/20 text-gray-100"
                placeholder="Price"
                value={editingCourse.price}
                onChange={e => setEditingCourse({ ...editingCourse, price: e.target.value })}
              />
              <input
                className="p-3 rounded-md bg-white/5 border border-white/20 text-gray-100"
                placeholder="Image URL"
                value={editingCourse.image}
                onChange={e => setEditingCourse({ ...editingCourse, image: e.target.value })}
              />
              <input
                className="p-3 rounded-md bg-white/5 border border-white/20 text-gray-100"
                placeholder="Certificate Providers"
                value={editingCourse.certificateProviders}
                onChange={e =>
                  setEditingCourse({ ...editingCourse, certificateProviders: e.target.value })
                }
              />
              <select
                className="p-3 rounded-md bg-white/5 border border-white/20 text-gray-100"
                value={editingCourse.mode}
                onChange={e => setEditingCourse({ ...editingCourse, mode: e.target.value })}
              >
                <option>Online</option>
                <option>Physical</option>
                <option>Both</option>
              </select>
              <select
                className="p-3 rounded-md bg-white/5 border border-white/20 text-gray-100"
                value={editingCourse.level}
                onChange={e => setEditingCourse({ ...editingCourse, level: e.target.value })}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

              {/* Rating */}
              <input
                className="p-3 rounded-md bg-white/5 border border-white/20 text-gray-100"
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="Rating (0-5)"
                value={editingCourse.rating}
                onChange={e =>
                  setEditingCourse({ ...editingCourse, rating: parseFloat(e.target.value) })
                }
              />

              {/* Reviews */}
              <input
                className="p-3 rounded-md bg-white/5 border border-white/20 text-gray-100"
                type="number"
                min="0"
                placeholder="Number of Reviews"
                value={editingCourse.reviews}
                onChange={e =>
                  setEditingCourse({ ...editingCourse, reviews: parseInt(e.target.value) })
                }
              />

              {/* Total Participants */}
              <input
                className="p-3 rounded-md bg-white/5 border border-white/20 text-gray-100"
                type="number"
                min="0"
                placeholder="Total Participants"
                value={editingCourse.totalParticipants}
                onChange={e =>
                  setEditingCourse({ ...editingCourse, totalParticipants: parseInt(e.target.value) })
                }
              />

              {/* Promo Code */}
              <input
                className="p-3 rounded-md bg-white/5 border border-white/20 text-gray-100"
                placeholder="Promo Code"
                value={editingCourse.promoCode}
                onChange={e =>
                  setEditingCourse({ ...editingCourse, promoCode: e.target.value })
                }
              />

              {/* Demo Certificate */}
              <input
                className="p-3 rounded-md bg-white/5 border border-white/20 text-gray-100"
                placeholder="Demo Certificate URL"
                value={editingCourse.demoCertificate}
                onChange={e =>
                  setEditingCourse({ ...editingCourse, demoCertificate: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <textarea
              className="mt-4 p-3 rounded-md bg-white/5 border border-white/20 text-gray-100 w-full"
              placeholder="Course Description"
              rows={3}
              value={editingCourse.description}
              onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => handleSave(editingCourse)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                💾 Save
              </Button>
              <Button
                variant="destructive"
                onClick={() => setEditingCourse(null)}
                className="px-6 py-2 rounded-lg"
              >
                ❌ Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
