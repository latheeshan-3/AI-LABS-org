import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Announcement {
  id: number;
  title: string;
  message: string;
  target: "ALL" | "USERS" | "BATCH";
  userIds?: number[];
  batchId?: string;
  createdAt: string;
  createdBy: number;
}

export default function AdminAnnouncementsPage() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/announcements`);
      if (!res.ok) throw new Error("Failed to fetch announcements");
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/announcements/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Error deleting announcement:", err);
      alert("❌ Failed to delete announcement");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading announcements...</p>;

 return (
  <div className="container mx-auto mt-8 space-y-6 px-4">
    {/* Header Section */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-white">📢 Manage Announcements</h1>
      <Button
        onClick={() => navigate("/admin")}
        variant="outline"
        className="border-gray-600 text-gray-200 hover:bg-gray-700"
      >
        Back
      </Button>
    </div>

    {/* No Announcements */}
    {announcements.length === 0 ? (
      <p className="text-center text-gray-400 italic">No announcements yet.</p>
    ) : (
      <div className="space-y-4">
        {announcements.map((ann) => (
          <Card
            key={ann.id}
            className="bg-gray-900 hover:bg-gray-800 transition-colors duration-200 border border-gray-700 text-gray-100 rounded-xl shadow-md"
          >
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold text-white">
                  {ann.title}
                </CardTitle>
                <p className="text-sm text-gray-400 mt-1">
                  🎯 Target:{" "}
                  {ann.target === "ALL"
                    ? "All Users"
                    : ann.target === "USERS"
                    ? "Specific Users"
                    : `Batch ${ann.batchId}`}
                </p>
              </div>

              <Button
                size="sm"
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDelete(ann.id)}
              >
                Delete
              </Button>
            </CardHeader>

            <CardContent>
              <p className="text-gray-200">{ann.message}</p>
              <p className="text-xs text-gray-500 mt-3">
                🕒 Sent on{" "}
                {new Date(ann.createdAt).toLocaleString()} &nbsp;|&nbsp; 👤 By Admin #{ann.createdBy}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);
}