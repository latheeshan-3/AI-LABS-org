import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // ✅ add badge
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LogOut,
  User,
  Calendar,
  Home,
  Settings,
  Menu,
  X,
  Edit,
  Save,
  BookOpen,
   AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

interface UserDTO {
  id: number;
  fullName: string;
  email: string;
  hometown?: string;
  contactNumber?: string;
  status?: string;
  nic?: string;
  sex?: string;
  dateOfBirth?: string;
  accountStatus?:string,
  studentId?: string;
  batchId?: string;
}

interface UpdateUserDTO {
  fullName: string;
  hometown?: string;
  contactNumber?: string;
  status?: string;
  nic?: string;
  sex?: string;
  dateOfBirth?: string;
  accountStatus?:string,
  studentId?: string;
  batchId?: string;
  
}

interface EnrolledCourse {
  id: number;
  enrolledDate: string;
  completionStatus: string;
  course: {
    id: number;
    title: string;
    description?: string;
    duration?: string;
  };
}

interface Announcement {
  id: number;
  title: string;
  message: string;
  createdAt: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateUserDTO>({
    fullName: "",
    hometown: "",
    contactNumber: "",
    status: "",
    nic: "",
    sex: "",
    dateOfBirth: "",
    studentId: "",
    batchId: "",
  });

  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/");

    const parsedUser: UserDTO = JSON.parse(storedUser);
    if (!parsedUser.email) return navigate("/");

    const fetchUserByEmail = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/${parsedUser.email}`
        );
        if (!res.ok) throw new Error("Failed to fetch user details");
        const fullUser: UserDTO = await res.json();
        setUser(fullUser);
        setFormData({
          fullName: fullUser.fullName || "",
          hometown: fullUser.hometown || "",
          contactNumber: fullUser.contactNumber || "",
          status: fullUser.status || "",
          nic: fullUser.nic || "",
          sex: fullUser.sex || "",
          dateOfBirth: fullUser.dateOfBirth || "",
          accountStatus:fullUser.accountStatus || "",
          studentId: fullUser.studentId || "",
          batchId: fullUser.batchId || "",
        });
        localStorage.setItem("user", JSON.stringify(fullUser));
      } catch (err) {
        console.error("Fetch error:", err);
        navigate("/");
      }
    };

    fetchUserByEmail();
  }, [navigate]);

  // Fetch announcements for this user
  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(
          `${API_BASE_URL}/announcements/user/${user.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch announcements");
        const data: Announcement[] = await res.json();
        setAnnouncements(data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      } finally {
        setLoadingAnnouncements(false);
      }
    };
    fetchAnnouncements();
  }, [user]);

  // Fetch enrolled courses once user is loaded
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(
          `${API_BASE_URL}/user-courses/${user.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch enrolled courses");
        const data: EnrolledCourse[] = await res.json();
        setEnrolledCourses(data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchEnrolledCourses();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/users/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Update failed");
      const updatedUser: UserDTO = await res.json();
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditing(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isSuspended = user.accountStatus === "SUSPENDED";

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
    {/* Professional Header with Account Status */}
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {getGreeting()}, {user.fullName}
            </h1>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <span>{user.batchId}</span>
              <span>•</span>
              <span>{user.studentId}</span>
            </div>
          </div>
          
          {/* Account Status Badge */}
          {user.accountStatus === "ACTIVE" ? (
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-medium">
              Active
            </Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1.5 font-medium">
              <AlertTriangle size={14} />
              Suspended
            </Badge>
          )}
        </div>
      </div>
    </header>

    {/* Suspension Warning Overlay */}
    {isSuspended && (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-amber-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Suspended</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your account access has been temporarily suspended. Please contact your administrator for assistance and further details.
          </p>
          <Button 
            onClick={handleLogout}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-medium"
          >
            Sign Out
          </Button>
        </motion.div>
      </motion.div>
    )}

    <div className="flex min-h-screen">
      {/* Enhanced Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />
            
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 20, stiffness: 150 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:relative lg:w-72 lg:shadow-none flex flex-col border-r border-gray-200"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">AI</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">AI Labs</h1>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSidebar(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-6">
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group">
                    <div className="p-1 rounded-lg group-hover:bg-blue-100">
                      <Home className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Dashboard</span>
                  </button>
                  
                  <button
                    className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                    onClick={() => setShowSidebar(false)}
                  >
                    <div className="p-1 rounded-lg group-hover:bg-blue-100">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Profile</span>
                  </button>
                  
                  <button 
                    className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                    onClick={() => {
                      navigate("/courses");
                      setShowSidebar(false);
                    }}
                  >
                    <div className="p-1 rounded-lg group-hover:bg-blue-100">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Courses</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group">
                    <div className="p-1 rounded-lg group-hover:bg-blue-100">
                      <Settings className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Settings</span>
                  </button>
                </div>
              </nav>

              {/* Enhanced Sidebar Footer */}
              <div className="p-6 border-t border-gray-100">
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-gray-200 flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">AI Labs</h1>
          </div>
        </div>

        <nav className="flex-1 p-6">
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group">
              <div className="p-1 rounded-lg group-hover:bg-blue-100">
                <Home className="h-5 w-5" />
              </div>
              <span className="font-medium">Dashboard</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group">
              <div className="p-1 rounded-lg group-hover:bg-blue-100">
                <User className="h-5 w-5" />
              </div>
              <span className="font-medium">Profile</span>
            </button>
            
            <button 
              className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
              onClick={() => navigate("/courses")}
            >
              <div className="p-1 rounded-lg group-hover:bg-blue-100">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-medium">Courses</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group">
              <div className="p-1 rounded-lg group-hover:bg-blue-100">
                <Settings className="h-5 w-5" />
              </div>
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">AI</span>
                </div>
                <h1 className="text-lg font-bold text-gray-900">AI Labs</h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 p-2"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content Container */}
        <div className="h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
            
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 lg:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                      Welcome Back
                    </h2>
                    <p className="text-blue-100 text-lg">
                      Ready to continue your learning journey?
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enrolled Courses Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">My Courses</h3>
                    <p className="text-sm text-gray-500">Manage your enrolled courses</p>
                  </div>
                </div>
                {enrolledCourses.length > 0 && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    {enrolledCourses.length} Enrolled
                  </Badge>
                )}
              </div>

              {loadingCourses ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading courses...</span>
                </div>
              ) : enrolledCourses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Courses Yet</h4>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Start your learning journey by enrolling in your first course.
                  </p>
                  <Button 
                    onClick={() => navigate("/courses")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
                  >
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {enrolledCourses.map((enrolled) => (
                    <motion.div
                      key={enrolled.id}
                      className="group bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer"
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <Badge 
                          variant={enrolled.completionStatus === "COMPLETED" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {enrolled.completionStatus}
                        </Badge>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {enrolled.course.title}
                      </h4>
                      
                      {enrolled.course.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {enrolled.course.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          Enrolled: {new Date(enrolled.enrolledDate).toLocaleDateString()}
                        </div>
                      </div>

                      <Button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!user) return;

                          const confirmUnenroll = window.confirm(
                            `Are you sure you want to unenroll from "${enrolled.course.title}"?`
                          );
                          if (!confirmUnenroll) return;

                          try {
                            const res = await fetch(
                              `${API_BASE_URL}/user-selected-courses/${user.id}/${enrolled.course.id}`,
                              { method: "DELETE" }
                            );

                            if (res.ok) {
                              setEnrolledCourses((prev) =>
                                prev.filter((c) => c.course.id !== enrolled.course.id)
                              );
                            } else {
                              console.error("Failed to unenroll:", await res.text());
                            }
                          } catch (err) {
                            console.error("Error during unenroll:", err);
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      >
                        Unenroll
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Announcements Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Announcements</h3>
                  <p className="text-sm text-gray-500">Latest updates and notifications</p>
                </div>
              </div>

              {loadingAnnouncements ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                  <span className="ml-3 text-gray-600">Loading announcements...</span>
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No announcements at this time</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <motion.div
                      key={announcement.id}
                      className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-300"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertTriangle className="h-4 w-4 text-amber-700" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-amber-900 mb-1">
                            {announcement.title}
                          </h4>
                          <p className="text-amber-800 leading-relaxed mb-3">
                            {announcement.message}
                          </p>
                          <p className="text-xs text-amber-600 font-medium">
                            {new Date(announcement.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Enhanced Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 lg:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{user.fullName}</h3>
                      <p className="text-gray-300">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-gray-700 text-gray-200 text-xs">
                          {user.batchId}
                        </Badge>
                        <Badge className="bg-gray-700 text-gray-200 text-xs">
                          {user.studentId}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing(!editing)}
                    className="text-white hover:bg-gray-700 p-3 rounded-xl"
                  >
                    {editing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-6 lg:p-8">
                {editing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                          </label>
                          <Input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Hometown
                          </label>
                          <Input
                            type="text"
                            name="hometown"
                            value={formData.hometown}
                            onChange={handleChange}
                            placeholder="Your hometown"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Contact Number
                          </label>
                          <Input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            placeholder="+94 XX XXX XXXX"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            NIC Number
                          </label>
                          <Input
                            type="text"
                            name="nic"
                            value={formData.nic}
                            onChange={handleChange}
                            placeholder="Enter NIC number"
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Gender
                          </label>
                          <Select
                            value={formData.sex}
                            onValueChange={(val) =>
                              setFormData({ ...formData, sex: val })
                            }
                          >
                            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date of Birth
                          </label>
                          <div className="relative">
                            <Input
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleChange}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                            />
                            <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Status
                      </label>
                      <Input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        placeholder="Your current status"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                      <Button 
                        onClick={handleSave} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex-1 sm:flex-none"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditing(false)}
                        className="border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-xl font-medium flex-1 sm:flex-none"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Profile Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Hometown
                          </label>
                          <p className="text-gray-900 font-medium text-lg">
                            {user.hometown || "Not specified"}
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Contact Number
                          </label>
                          <p className="text-gray-900 font-medium text-lg">
                            {user.contactNumber || "Not specified"}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Status
                          </label>
                          <p className="text-gray-900 font-medium text-lg">
                            {user.status || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            NIC Number
                          </label>
                          <p className="text-gray-900 font-medium text-lg">
                            {user.nic || "Not specified"}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Gender
                          </label>
                          <p className="text-gray-900 font-medium text-lg">
                            {user.sex || "Not specified"}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Date of Birth
                          </label>
                          <p className="text-gray-900 font-medium text-lg">
                            {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <Button 
                        onClick={() => setEditing(true)} 
                        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  </div>
);
}        