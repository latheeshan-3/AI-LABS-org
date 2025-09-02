import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Course {
  id?: number;
  title: string;
  description: string;
  image: string;
  mode: string; // Online / Physical / Both
  rating: number;
  reviews: number;
  price: string;
  level: string; // Beginner / Intermediate / Advanced
  totalParticipants: number;
  certificateProviders: string;
  promoCode?: string;
  demoCertificate?: string;
}

// ✅ API base URL
//const API_URL = "http://10.57.131.221:5000/api";
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
    } catch (err) {
      setError("Failed to load courses.");
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
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Admin Course Management</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

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
      >
        Add New Course
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {courses.map(course => (
          <Card key={course.id} className="p-4 glass-card hover:scale-105 transition">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{course.description}</p>
              <p>Mode: {course.mode}</p>
              <p>Level: {course.level}</p>
              <p>Price: {course.price}</p>
              <p>Rating: {course.rating} ({course.reviews} reviews)</p>
              <p>Total Participants: {course.totalParticipants}</p>
              <p>Certificates: {course.certificateProviders}</p>
              <p>Promo Code: {course.promoCode || "-"}</p>
              <p>Demo Certificate: {course.demoCertificate || "-"}</p>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => setEditingCourse(course)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(course.id!)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingCourse && (
        <div className="mt-6 p-6 border rounded-lg bg-white shadow-md">
          <h2 className="text-xl font-bold mb-4">{editingCourse.id ? "Edit Course" : "Add Course"}</h2>

          {/* Title */}
          <input
            className="border p-2 mb-2 w-full"
            placeholder="Title"
            value={editingCourse.title}
            onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
          />

          {/* Description */}
          <textarea
            className="border p-2 mb-2 w-full"
            placeholder="Description"
            value={editingCourse.description}
            onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
          />

          {/* Image URL */}
          <input
            className="border p-2 mb-2 w-full"
            placeholder="Image URL"
            value={editingCourse.image}
            onChange={e => setEditingCourse({ ...editingCourse, image: e.target.value })}
          />

          {/* Mode */}
          <select
            className="border p-2 mb-2 w-full"
            value={editingCourse.mode}
            onChange={e => setEditingCourse({ ...editingCourse, mode: e.target.value })}
          >
            <option>Online</option>
            <option>Physical</option>
            <option>Both</option>
          </select>

          {/* Level */}
          <select
            className="border p-2 mb-2 w-full"
            value={editingCourse.level}
            onChange={e => setEditingCourse({ ...editingCourse, level: e.target.value })}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          {/* Price */}
          <input
            className="border p-2 mb-2 w-full"
            placeholder="Price"
            value={editingCourse.price}
            onChange={e => setEditingCourse({ ...editingCourse, price: e.target.value })}
          />

          {/* Rating */}
          <input
            className="border p-2 mb-2 w-full"
            type="number"
            min={0}
            max={5}
            step={0.1}
            placeholder="Rating"
            value={editingCourse.rating}
            onChange={e => setEditingCourse({ ...editingCourse, rating: parseFloat(e.target.value) })}
          />

          {/* Reviews */}
          <input
            className="border p-2 mb-2 w-full"
            type="number"
            min={0}
            placeholder="Reviews"
            value={editingCourse.reviews}
            onChange={e => setEditingCourse({ ...editingCourse, reviews: parseInt(e.target.value) })}
          />

          {/* Total Participants */}
          <input
            className="border p-2 mb-2 w-full"
            type="number"
            min={0}
            placeholder="Total Participants"
            value={editingCourse.totalParticipants}
            onChange={e => setEditingCourse({ ...editingCourse, totalParticipants: parseInt(e.target.value) })}
          />

          {/* Certificate Providers */}
          <input
            className="border p-2 mb-2 w-full"
            placeholder="Certificate Providers"
            value={editingCourse.certificateProviders}
            onChange={e => setEditingCourse({ ...editingCourse, certificateProviders: e.target.value })}
          />

          {/* Promo Code */}
          <input
            className="border p-2 mb-2 w-full"
            placeholder="Promo Code"
            value={editingCourse.promoCode}
            onChange={e => setEditingCourse({ ...editingCourse, promoCode: e.target.value })}
          />

          {/* Demo Certificate */}
          <input
            className="border p-2 mb-4 w-full"
            placeholder="Demo Certificate URL"
            value={editingCourse.demoCertificate}
            onChange={e => setEditingCourse({ ...editingCourse, demoCertificate: e.target.value })}
          />

          <div className="flex gap-2">
            <Button onClick={() => handleSave(editingCourse)}>Save</Button>
            <Button variant="destructive" onClick={() => setEditingCourse(null)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
