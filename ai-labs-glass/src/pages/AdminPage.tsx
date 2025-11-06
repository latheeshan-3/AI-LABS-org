import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, LogOut, Crown } from "lucide-react";

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
      navigate("/");
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);

    if (parsedUser.role !== "ADMIN") {
      navigate("/account");
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-10">
      <div className="container mx-auto px-4">
        <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/80 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-8">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-8 h-8" />
              <CardTitle className="text-3xl font-bold">Admin Dashboard</CardTitle>
            </div>
            <p className="text-blue-100 text-lg">
              Welcome back, {user.fullName} ({user.email})
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="border border-slate-200 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">Manage Courses</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-slate-600 mb-4">
                    Add, update, or delete courses from the platform.
                  </p>
                  <Button 
                    onClick={() => navigate("/admincourse")}
                    className="w-full bg-blue-600 hover:bg-blue-700 shadow-md"
                  >
                    Go to Courses
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl">Manage Users</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-slate-600 mb-4">
                    View and manage registered users and their enrolled courses.
                  </p>
                  <Button 
                    onClick={() => navigate("/admin/users")}
                    className="w-full bg-purple-600 hover:bg-purple-700 shadow-md"
                  >
                    Go to Users
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end pt-8 border-t border-slate-400">
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <LogOut className="w-6 h-6" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}