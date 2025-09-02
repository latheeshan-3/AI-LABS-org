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
    <div className="container mx-auto mt-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📢 Manage Announcements</h1>
        <Button onClick={() => navigate("/admin")} variant="outline">Back</Button>
      </div>

      {announcements.length === 0 ? (
        <p className="text-center text-gray-500">No announcements yet.</p>
      ) : (
        announcements.map(ann => (
          <Card key={ann.id} className="p-4">
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>{ann.title}</CardTitle>
                <p className="text-sm text-gray-600">
                  Target: {ann.target === "ALL" ? "All Users" : ann.target === "USERS" ? "Specific Users" : `Batch ${ann.batchId}`}
                </p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(ann.id)}>
                Delete
              </Button>
            </CardHeader>
            <CardContent>
              <p>{ann.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                Sent on {new Date(ann.createdAt).toLocaleString()} | By Admin #{ann.createdBy}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
