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
  });

  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/");

    const parsedUser: UserDTO = JSON.parse(storedUser);
    if (!parsedUser.email) return navigate("/");

    const fetchUserByEmail = async () => {
      try {
        const res = await fetch(
          `http://10.57.131.221:5000/api/users/${parsedUser.email}`
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
        });
        localStorage.setItem("user", JSON.stringify(fullUser));
      } catch (err) {
        console.error("Fetch error:", err);
        navigate("/");
      }
    };

    fetchUserByEmail();
  }, [navigate]);

  // Fetch enrolled courses once user is loaded
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(
          `http://10.57.131.221:5000/api/user-courses/${user.id}`
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
        `http://10.57.131.221:5000/api/users/${user.id}`,
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

    <div className="relative min-h-screen bg-gray-50 p-6">
      {/* ✅ Show account status badge */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">
          {getGreeting()}, {user.fullName}
        </h1>
        {user.accountStatus === "ACTIVE" ? (
          <Badge className="bg-green-600 text-white">Active</Badge>
        ) : (
          <Badge className="bg-yellow-500 text-black flex items-center gap-1">
            <AlertTriangle size={14} /> Suspended
          </Badge>
        )}
      </div>

      {/* ✅ Warning Overlay when Suspended */}
      {isSuspended && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-md">
            <AlertTriangle className="text-yellow-500 mx-auto mb-3" size={40} />
            <h2 className="text-xl font-bold text-red-600">Account Suspended</h2>
            <p className="text-gray-600 mt-2">
              Your account has been suspended. Please contact the administrator
              for more details.
            </p>
            <Button className="mt-4" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </motion.div>
      )}

    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-blue-600">AI Labs</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 p-2"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Mobile Overlay */}
        <AnimatePresence>
          {showSidebar && (
            <>
              {/* Mobile Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={() => setShowSidebar(false)}
              />
              
              {/* Sidebar */}
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-50 md:relative md:w-64 md:shadow-md flex flex-col"
              >
                {/* Sidebar Header */}
                <div className="p-4 border-b md:border-b-0">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-blue-600">AI Labs</h1>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSidebar(false)}
                      className="md:hidden p-2"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Home className="h-5 w-5" />
                    <span className="font-medium">Home</span>
                  </button>
                  <button
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => {
                      setShowSidebar(false);
                    }}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">My Profile</span>
                  </button>
                  <button 
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => {
                      navigate("/courses");
                      setShowSidebar(false);
                    }}
                  >
                    <BookOpen className="h-5 w-5" />
                    <span className="font-medium">View Courses</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Settings</span>
                  </button>
                </nav>

                {/* Sidebar Footer - Desktop Only */}
                <div className="p-4 border-t hidden md:block">
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-white shadow-md flex-col">
          <div className="p-6">
            <h1 className="text-xl font-bold text-blue-600">AI Labs</h1>
            <nav className="mt-10 space-y-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <User className="h-5 w-5" />
                <span>My Profile</span>
              </button>
              <button 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => navigate("/courses")}
              >
                <BookOpen className="h-5 w-5" />
                <span>View Courses</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
          <div className="p-6 border-t mt-auto">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full flex items-center justify-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          </div>

          {/* Greeting */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2">
              {getGreeting()}, {user.fullName}! 👋
            </h1>
            <p className="text-gray-600">Welcome to your dashboard</p>
          </motion.div>

          {/* Enrolled Courses Section */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border p-6 md:p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
              My Enrolled Courses
            </h2>
            {loadingCourses ? (
              <p className="text-gray-600">Loading courses...</p>
            ) : enrolledCourses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  You haven't enrolled in any courses yet.
                </p>
                <Button 
                  onClick={() => navigate("/courses")}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Browse Courses
                </Button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {enrolledCourses.map((enrolled) => (
    <motion.li
      key={enrolled.id}
      className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-500 transition relative"
      whileHover={{ scale: 1.02 }}
    >
      {/* Course Title */}
      <h3 className="text-lg font-semibold text-blue-700">
        {enrolled.course.title}
      </h3>

      {/* Course Description */}
      {enrolled.course.description && (
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {enrolled.course.description}
        </p>
      )}

      {/* Enrollment Info */}
      <p className="text-xs text-gray-500 mt-3">
        Enrolled on:{" "}
        {new Date(enrolled.enrolledDate).toLocaleDateString()}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Status: {enrolled.completionStatus}
      </p>

      {/* ✅ Unenroll Button */}
      <Button
        onClick={async (e) => {
          e.stopPropagation(); // prevent navigating into the course
          if (!user) return;

          const confirmUnenroll = window.confirm(
            `Are you sure you want to unenroll from "${enrolled.course.title}"?`
          );
          if (!confirmUnenroll) return;

          try {
            const res = await fetch(
              `http://10.57.131.221:5000/api/user-selected-courses/${user.id}/${enrolled.course.id}`,
              { method: "DELETE" }
            );

            if (res.ok) {
              // remove unenrolled course from UI
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
        className="mt-4 bg-red-600 text-white hover:bg-red-700"
      >
        Unenroll
      </Button>
    </motion.li>
  ))}
</ul>

            )}
          </motion.div>

          {/* Profile Section */}
          <motion.div
            className="bg-white shadow-lg rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg md:text-xl">{user.fullName}</h3>
                    <p className="text-blue-100 text-sm">{user.email}</p>
                     <p className="text-blue-100 text-sm">{user.accountStatus}</p>

                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(!editing)}
                  className="text-white hover:bg-blue-600 p-2"
                >
                  {editing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-4 md:p-6">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hometown
                      </label>
                      <Input
                        type="text"
                        name="hometown"
                        value={formData.hometown}
                        onChange={handleChange}
                        placeholder="Your hometown"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <Input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder="+94 XX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIC Number
                      </label>
                      <Input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        placeholder="Enter NIC number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <Select
                        value={formData.sex}
                        onValueChange={(val) =>
                          setFormData({ ...formData, sex: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                        />
                        <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <Input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        placeholder="Your current status"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row gap-2 pt-4">
                    <Button onClick={handleSave} className="flex-1 md:flex-none">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditing(false)}
                      className="flex-1 md:flex-none"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Profile Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Hometown
                        </p>
                        <p className="text-gray-900 font-medium">
                          {user.hometown || "Not specified"}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Contact Number
                        </p>
                        <p className="text-gray-900 font-medium">
                          {user.contactNumber || "Not specified"}
                        </p>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Status
                        </p>
                        <p className="text-gray-900 font-medium">
                          {user.status || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          NIC Number
                        </p>
                        <p className="text-gray-900 font-medium">
                          {user.nic || "Not specified"}
                        </p>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Gender
                        </p>
                        <p className="text-gray-900 font-medium">
                          {user.sex || "Not specified"}
                        </p>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Date of Birth
                        </p>
                        <p className="text-gray-900 font-medium">
                          {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button onClick={() => setEditing(true)} className="w-full md:w-auto">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
    </div>
  );
}