import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Edit,
  Save,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  X,
  Check,
  AlertCircle,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


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

interface UpdateUserDTO extends Partial<UserDTO> {}

export default function ProfilePage() {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateUserDTO>({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
 

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: UserDTO = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(parsedUser);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update user");
      const updated = await res.json();
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(user || {});
    setEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const InfoCard = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | undefined;
  }) => (
    <motion.div
      className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all duration-300"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {label}
          </p>
          <p className="text-base font-semibold text-gray-900 truncate">
            {value || (
              <span className="text-gray-400 font-normal">Not specified</span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );

  const EditField = ({
    icon,
    label,
    name,
    value,
    placeholder,
    type = "text",
  }: {
    icon: React.ReactNode;
    label: string;
    name: string;
    value: string | undefined;
    placeholder: string;
    type?: string;
  }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        <span className="mr-2">{icon}</span>
        {label}
      </label>
      <Input
        type={type}
        name={name}
        value={value || ""}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          {/* Header Background */}
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-black opacity-5"></div>
            <div className="relative flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-blue-100">
                  <User className="h-12 w-12 sm:h-14 sm:w-14 text-blue-600" />
                </div>
                {user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {user.fullName}
                </h1>
                <p className="text-blue-100 text-sm sm:text-base mb-3">
                  {user.email}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {user.accountStatus === "ACTIVE" ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-md">
                      <Check className="h-3 w-3 mr-1" />
                      Active Account
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-md">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Suspended
                    </Badge>
                  )}
                  {user.batchId && (
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm">
                      Batch: {user.batchId}
                    </Badge>
                  )}
                  {user.studentId && (
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm">
                      ID: {user.studentId}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (editing ? handleSave() : setEditing(true))}
                disabled={saving}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg transition-all"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : editing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>


<button
  onClick={() => navigate("/account")}
className="fixed top-6 right-6 bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded-xl shadow-lg transition-all z-50"
>
  <Home className="w-5 h-5" />
</button>


            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8 lg:p-10">
            {editing ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <Edit className="h-5 w-5 mr-2 text-blue-600" />
                    Edit Your Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    Update your personal details and preferences
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <EditField
                    icon={<User className="h-4 w-4 text-gray-500" />}
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    placeholder="Enter your full name"
                  />

                  <EditField
                    icon={<MapPin className="h-4 w-4 text-gray-500" />}
                    label="Hometown"
                    name="hometown"
                    value={formData.hometown}
                    placeholder="Enter your hometown"
                  />

                  <EditField
                    icon={<Phone className="h-4 w-4 text-gray-500" />}
                    label="Contact Number"
                    name="contactNumber"
                    value={formData.contactNumber}
                    placeholder="Enter your contact number"
                  />

                  <EditField
                    icon={<CreditCard className="h-4 w-4 text-gray-500" />}
                    label="NIC Number"
                    name="nic"
                    value={formData.nic}
                    placeholder="Enter your NIC number"
                  />

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      Gender
                    </label>
                    <Select
                      value={formData.sex}
                      onValueChange={(val) =>
                        setFormData({ ...formData, sex: val })
                      }
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <EditField
                    icon={<Calendar className="h-4 w-4 text-gray-500" />}
                    label="Date of Birth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    placeholder="Select your date of birth"
                    type="date"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                    className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 text-gray-700"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Personal Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    Your profile details and account information
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard
                    icon={<MapPin className="h-5 w-5 text-blue-600" />}
                    label="Hometown"
                    value={user.hometown}
                  />
                  <InfoCard
                    icon={<Phone className="h-5 w-5 text-green-600" />}
                    label="Contact Number"
                    value={user.contactNumber}
                  />
                  <InfoCard
                    icon={<CreditCard className="h-5 w-5 text-purple-600" />}
                    label="NIC Number"
                    value={user.nic}
                  />
                  <InfoCard
                    icon={<User className="h-5 w-5 text-indigo-600" />}
                    label="Gender"
                    value={user.sex}
                  />
                  <InfoCard
                    icon={<Calendar className="h-5 w-5 text-orange-600" />}
                    label="Date of Birth"
                    value={
                      user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : undefined
                    }
                  />
                </div>

                {/* Quick Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Account Details
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <p className="text-2xl font-bold text-blue-600">
                        {user.studentId || "N/A"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Student ID</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <p className="text-2xl font-bold text-purple-600">
                        {user.batchId || "N/A"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Batch</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <p className="text-2xl font-bold text-green-600">
                        {user.isVerified ? "Yes" : "No"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Verified</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                      <p className="text-2xl font-bold text-amber-600">
                        {user.accountStatus || "N/A"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Status</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Info Card */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                Keep Your Profile Updated
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Make sure your contact information is always up to date so we
                can reach you with important announcements and updates about
                your courses.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}