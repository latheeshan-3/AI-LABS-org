import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/"); // not logged in
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);

    if (parsedUser.role !== "ADMIN") {
      navigate("/account"); // non-admins redirected
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto mt-10">
      <Card className="glass-card p-6 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary-glow">
            👑 Admin Dashboard
          </CardTitle>
          <p className="text-muted-foreground">
            Welcome back, {user.fullName} ({user.email})
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card hover:scale-105 transition p-4">
              <CardHeader>
                <CardTitle>📚 Manage Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Add, update, or delete courses from the platform.
                </p>
                <Button onClick={() => navigate("/admincourse")}>
                  Go to Courses
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card hover:scale-105 transition p-4">
              <CardHeader>
                <CardTitle>👥 Manage Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  View and manage registered users and their enrolled courses.
                </p>
                <Button onClick={() => navigate("/admin/users")}>
                  Go to Users
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-right">
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
