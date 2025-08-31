import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EnrolledCourse {
  id: number;
  completionStatus: string;
  enrolledDate: string;
  course: {
    id: number;
    title: string;
    description?: string;
  };
}

interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  contactNumber?: string;
  hometown?: string;
  accountStatus: string;   // ✅ now required
  enrolledCourses: EnrolledCourse[];
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://10.57.131.221:5000/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle account status
  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    try {
      const res = await fetch(
        `http://10.57.131.221:5000/api/admin/users/${userId}/status?accountStatus=${newStatus}`,
        { method: "PUT" }
      );

      if (res.ok) {
        const updatedUser: AdminUser = await res.json();
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? updatedUser : u))
        );
      } else {
        console.error("Failed to update status:", await res.text());
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleUnenroll = async (userId: number, courseId: number, enrolledId: number) => {
    if (!confirm("Are you sure you want to unenroll this user from this course?")) return;

    try {
      const res = await fetch(
        `http://10.57.131.221:5000/api/user-selected-courses/${userId}/${courseId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, enrolledCourses: u.enrolledCourses.filter((c) => c.id !== enrolledId) }
              : u
          )
        );
      } else {
        console.error("Failed to unenroll:", await res.text());
      }
    } catch (err) {
      console.error("Error unenrolling user:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading users...</p>;

  return (
    <div className="container mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">👥 Manage Users</h1>

      {users.map((user) => (
        <Card key={user.id} className="p-6">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>
                {user.fullName} ({user.role})
              </CardTitle>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>

            {/* ✅ Account Status Badge */}
            <Badge
              className={
                user.accountStatus === "ACTIVE"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }
            >
              {user.accountStatus}
            </Badge>
          </CardHeader>

          <CardContent>
            <p>
              📞 {user.contactNumber || "N/A"} | 🏠 {user.hometown || "N/A"}
            </p>

            {/* ✅ Toggle Account Status Button */}
            <div className="mt-3">
              <Button
                variant={user.accountStatus === "ACTIVE" ? "destructive" : "default"}
                onClick={() => handleToggleStatus(user.id, user.accountStatus)}
              >
                {user.accountStatus === "ACTIVE" ? "Suspend Account" : "Activate Account"}
              </Button>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Enrolled Courses:</h3>
              {user.enrolledCourses.length === 0 ? (
                <p className="text-sm text-gray-500">No enrolled courses</p>
              ) : (
                <ul className="list-disc ml-5 text-sm space-y-1">
                  {user.enrolledCourses.map((c) => (
                    <li key={c.id} className="flex justify-between items-center">
                      <span>
                        {c.course.title} – {c.completionStatus} (Enrolled:{" "}
                        {new Date(c.enrolledDate).toLocaleDateString()})
                      </span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUnenroll(user.id, c.course.id, c.id)}
                      >
                        Unenroll
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
