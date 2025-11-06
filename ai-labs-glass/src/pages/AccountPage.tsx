import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  User,
  Calendar,
  Settings,
  Menu,
  X,
  BookOpen,
  AlertTriangle,
  ChevronRight,
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
  accountStatus?: string;
  studentId?: string;
  batchId?: string;
  isVerified?: boolean;
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
        const res = await fetch(`${API_BASE_URL}/users/${parsedUser.email}`);
        if (!res.ok) throw new Error("Failed to fetch user details");
        const fullUser: UserDTO = await res.json();
        setUser(fullUser);
        localStorage.setItem("user", JSON.stringify(fullUser));
      } catch (err) {
        console.error("Fetch error:", err);
        navigate("/");
      }
    };

    fetchUserByEmail();
  }, [navigate]);

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

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`${API_BASE_URL}/user-courses/${user.id}`);
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isSuspended = user.accountStatus === "SUSPENDED";

  function SidebarNavButton({
    icon,
    label,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors">
            {icon}
          </div>
          <span className="font-medium">{label}</span>
        </div>
        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Suspension Modal */}
      {isSuspended && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", damping: 20 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="text-amber-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Account Suspended
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your account access has been temporarily suspended. Please contact
              your administrator for assistance.
            </p>
            <Button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-3 rounded-xl font-medium shadow-lg"
            >
              Sign Out
            </Button>
          </motion.div>
        </motion.div>
      )}

    {/* 🌙 Mobile Navigation Header */}
<div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
  <div className="px-4 py-2 flex items-center justify-between">
    
    {/* Left Section: Menu + Logo */}
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowSidebar(true)}
        className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200"
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </Button>

      {/* Logo + Brand */}
      <div className="flex items-center gap-2">
        <img
          src="/logo4.png"
          alt="Gravity Labs Logo"
          className="h-8 w-auto object-contain"
        />
        <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          Gravity Labs
        </h1>
      </div>
    </div>

    {/* Right Section: User Status */}
    <div>
      {user.accountStatus === "ACTIVE" ? (
        <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs px-2 py-0.5 rounded-md">
          Active
        </Badge>
      ) : (
        <Badge className="bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 text-xs px-2 py-0.5 rounded-md">
          <AlertTriangle size={12} />
          Suspended
        </Badge>
      )}
    </div>
  </div>
</div>

{/* Spacer to prevent content overlap below fixed header */}
<div className="lg:hidden h-[56px]" />


      {/* Main Layout */}
      <div className="flex min-h-screen">
        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {showSidebar && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
                onClick={() => setShowSidebar(false)}
              />

              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col lg:hidden"
              >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold">AI</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">AI Labs</h1>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSidebar(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                  <SidebarNavButton
                    icon={<User className="h-5 w-5" />}
                    label="Profile"
                    onClick={() => {
                      navigate("/profile");
                      setShowSidebar(false);
                    }}
                  />
                  <SidebarNavButton
                    icon={<BookOpen className="h-5 w-5" />}
                    label="Courses"
                    onClick={() => {
                      navigate("/courses");
                      setShowSidebar(false);
                    }}
                  />
                  <SidebarNavButton
                    icon={<Settings className="h-5 w-5" />}
                    label="Certification"
                    onClick={() => setShowSidebar(false)}
                  />
                </nav>

                <div className="p-6 border-t border-gray-100 space-y-4">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {user.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {user.studentId}
                          </span>
                          {user.batchId && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {user.batchId}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
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
        <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Labs</h1>
                <p className="text-xs text-gray-500">Learning Platform</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-100">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">ID: {user.studentId}</span>
                {user.batchId && (
                  <span className="text-gray-600">Batch: {user.batchId}</span>
                )}
              </div>
              <div className="mt-3">
                {user.accountStatus === "ACTIVE" ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs w-full justify-center">
                    Account Active
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex items-center justify-center gap-1.5 text-xs w-full">
                    <AlertTriangle size={12} />
                    Account Suspended
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            <SidebarNavButton
              icon={<User className="h-5 w-5" />}
              label="Profile"
              onClick={() => navigate("/profile")}
            />
            <SidebarNavButton
              icon={<BookOpen className="h-5 w-5" />}
              label="Courses"
              onClick={() => navigate("/courses")}
            />
            <SidebarNavButton
              icon={<Settings className="h-5 w-5" />}
              label="Certification"
            />
          </nav>

          <div className="p-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {getGreeting()}, {user.fullName.split(" ")[0]}!
                    </h2>
                    <p className="text-blue-100 text-sm sm:text-base">
                      Ready to continue your learning journey?
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
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
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      My Courses
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Manage your enrolled courses
                    </p>
                  </div>
                </div>
                {enrolledCourses.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200 w-fit"
                  >
                    {enrolledCourses.length} Enrolled
                  </Badge>
                )}
              </div>

              {loadingCourses ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                  <span className="text-gray-600 text-sm">
                    Loading courses...
                  </span>
                </div>
              ) : enrolledCourses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No Courses Yet
                  </h4>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
                    Start your learning journey by enrolling in your first
                    course.
                  </p>
                  <Button
                    onClick={() => navigate("/courses")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-md"
                  >
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {enrolledCourses.map((enrolled) => (
                    <motion.div
                      key={enrolled.id}
                      className="group bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer"
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <Badge
                          variant={
                            enrolled.completionStatus === "COMPLETED"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {enrolled.completionStatus}
                        </Badge>
                      </div>

                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {enrolled.course.title}
                      </h4>

                      {enrolled.course.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {enrolled.course.description}
                        </p>
                      )}

                      <div className="flex items-center text-xs text-gray-500 mb-4">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        Enrolled:{" "}
                        {new Date(enrolled.enrolledDate).toLocaleDateString()}
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
                                prev.filter(
                                  (c) => c.course.id !== enrolled.course.id
                                )
                              );
                            } else {
                              console.error(
                                "Failed to unenroll:",
                                await res.text()
                              );
                            }
                          } catch (err) {
                            console.error("Error during unenroll:", err);
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
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
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Announcements
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Latest updates and notifications
                  </p>
                </div>
              </div>

              {loadingAnnouncements ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mb-3"></div>
                  <span className="text-gray-600 text-sm">
                    Loading announcements...
                  </span>
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="h-7 w-7 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    No announcements at this time
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {announcements.map((announcement) => (
                    <motion.div
                      key={announcement.id}
                      className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow duration-300"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertTriangle className="h-4 w-4 text-amber-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base sm:text-lg font-semibold text-amber-900 mb-1">
                            {announcement.title}
                          </h4>
                          <p className="text-sm text-amber-800 leading-relaxed mb-3">
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
          </div>
        </main>
      </div>
    </div>
  );
}