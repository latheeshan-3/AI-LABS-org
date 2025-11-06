import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Send, ArrowLeft, Megaphone, Users, GraduationCap, MapPin, Phone, Mail, Award, X, Check, Edit2, Trash2, Plus, Filter } from 'lucide-react';

interface EnrolledCourse {
  id: number;
  completionStatus: string;
  enrolledDate: string;
  course: {
    id: number;
    title: string;
    description?: string;
  };
  certificateUrl?: string;
}

interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  contactNumber?: string;
  hometown?: string;
  accountStatus: string;
  enrolledCourses: EnrolledCourse[];
  studentId?: string;
  batchId?: string;
}

export default function ManageUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<string | null>(null);
  const [batchFilter, setBatchFilter] = useState<string | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 🎯 Announcement modal state
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [announcementTarget, setAnnouncementTarget] = useState<"ALL" | "USERS" | "BATCH">("ALL");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("");

  const [editingCertificateId, setEditingCertificateId] = useState<number | null>(null);
  const [certificateInput, setCertificateInput] = useState<string>("");

  const [editingIdsUserId, setEditingIdsUserId] = useState<number | null>(null);
  const [studentIdInput, setStudentIdInput] = useState<string>("");
  const [batchIdInput, setBatchIdInput] = useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Create announcement
  const handleSendAnnouncement = async () => {
    try {
      const body: any = {
        title: announcementTitle,
        message: announcementMessage,
        target: announcementTarget,
        createdBy: 1 // TODO: replace with logged-in admin id
      };

      if (announcementTarget === "USERS") body.userIds = selectedUserIds;
      if (announcementTarget === "BATCH") body.batchId = selectedBatch;

      const res = await fetch(`${API_BASE_URL}/admin/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());

      alert("✅ Announcement sent!");
      setShowAnnouncementModal(false);
      setAnnouncementTitle("");
      setAnnouncementMessage("");
      setAnnouncementTarget("ALL");
      setSelectedUserIds([]);
      setSelectedBatch("");
    } catch (err) {
      console.error("Error sending announcement:", err);
      alert("❌ Failed to send announcement");
    }
  };

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/users/${userId}/status?accountStatus=${newStatus}`,
        { method: "PUT" }
      );
      if (res.ok) {
        const updatedUser: AdminUser = await res.json();
        setUsers(prev => prev.map(u => (u.id === userId ? updatedUser : u)));
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
        `${API_BASE_URL}/user-selected-courses/${userId}/${courseId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setUsers(prev =>
          prev.map(u =>
            u.id === userId
              ? { ...u, enrolledCourses: u.enrolledCourses.filter(c => c.id !== enrolledId) }
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

  const handleUpdateCertificate = async (enrollmentId: number) => {
    if (!certificateInput) return alert("Please enter a certificate URL");

    try {
      const res = await fetch(
        `${API_BASE_URL}/user-selected-courses/${enrollmentId}/certificate-url?certificateUrl=${encodeURIComponent(certificateInput)}`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Failed to update certificate");

      const updatedEnrollment: EnrolledCourse = await res.json();
      setUsers(prev =>
        prev.map(user => ({
          ...user,
          enrolledCourses: user.enrolledCourses.map(c =>
            c.id === enrollmentId ? updatedEnrollment : c
          ),
        }))
      );

      setEditingCertificateId(null);
      setCertificateInput("");
    } catch (err) {
      console.error("Error updating certificate:", err);
    }
  };

  const handleUpdateIds = async (userId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/ids`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentId: studentIdInput,
          batchId: batchIdInput
        })
      });

      if (!res.ok) throw new Error("Failed to update IDs");

      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, studentId: studentIdInput, batchId: batchIdInput } : u
        )
      );

      setEditingIdsUserId(null);
      setStudentIdInput("");
      setBatchIdInput("");
    } catch (err) {
      console.error("Error updating IDs:", err);
    }
  };

  const allCourses = Array.from(
    new Set(users.flatMap(u => u.enrolledCourses.map(c => c.course.title)))
  );

  const allBatchIds = Array.from(
    new Set(users.map(u => u.batchId).filter(Boolean))
  );

  const filteredUsers = users.filter(u => {
    const matchesName = u.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter
      ? u.enrolledCourses.some(c => c.course.title === courseFilter)
      : true;
    const matchesBatch = batchFilter ? u.batchId === batchFilter : true;
    return matchesName && matchesCourse && matchesBatch;
  });

  if (loading) return <p className="text-center mt-10">Loading users...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-200 to-yellow-300 p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
              <p className="text-sm text-gray-600">Total: {filteredUsers.length} users</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-700 to-gray-800 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
            >
              <Megaphone className="w-4 h-4" />
              Send Announcement
            </button>
            <button 
              onClick={() => navigate("/announcements")}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-200 font-medium"
            >
              <Megaphone className="w-4 h-4" />
              View Announcements
            </button>
            <button 
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-700" />
            Filters
          </h2>
        </div>
        
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="text"
      placeholder="Search by name..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-10 pr-4 py-3 rounded-xl
                 bg-gray-800 text-gray-100 placeholder-gray-400
                 border border-gray-700 focus:ring-2 focus:ring-slate-500 focus:border-transparent
                 transition-all duration-200"
    />
  </div>



          <select
            value={courseFilter || ""}
            onChange={e => setCourseFilter(e.target.value || null)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-200 bg-white placeholder:text-gray-500 text-gray-900"
          >
            <option value="" className="text-gray-900">All Courses</option>
            {allCourses.map(title => (
              <option key={title} value={title} className="text-gray-900">{title}</option>
            ))}
          </select>

          <select
            value={batchFilter || ""}
            onChange={e => setBatchFilter(e.target.value || null)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-200 bg-white placeholder:text-gray-500 text-gray-900"
          >
            <option value="" className="text-gray-900">All Batches</option>
            {allBatchIds.map(batch => (
              <option key={batch} value={batch} className="text-gray-900">{batch}</option>
            ))}
          </select>
        </div>
      </div>


      {/* User list */}
      <div className="space-y-4"> {/* adds gap between cards */}
      {filteredUsers.map(user => (
        <Card key={user.id} className="p-6 bg-gray-900 hover:bg-gray-800 text-gray-100 transition-colors duration-200 rounded-xl shadow-md border border-gray-700"
    >
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>{user.fullName} ({user.role})</CardTitle>
              <p className="text-sm text-green-600">{user.email}</p>
            </div>
            <Badge className={user.accountStatus === "ACTIVE" ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
              {user.accountStatus}
            </Badge>
          </CardHeader>
          


          <CardContent>
            <p>📞 {user.contactNumber || "N/A"} | 🏠 {user.hometown || "N/A"}</p>
            <p>🎓 Student ID: {user.studentId || "N/A"} | 🏫 Batch ID: {user.batchId || "N/A"}</p>

            <div className="mt-3 flex space-x-2">
              <Button
                variant={user.accountStatus === "ACTIVE" ? "destructive" : "default"}
                onClick={() => handleToggleStatus(user.id, user.accountStatus)}
              >
                {user.accountStatus === "ACTIVE" ? "Suspend Account" : "Activate Account"}
              </Button>

              {editingIdsUserId === user.id ? (
                <>
                  <input
                    type="text"
                    placeholder="Student ID"
                    value={studentIdInput}
                    onChange={e => setStudentIdInput(e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="Batch ID"
                    value={batchIdInput}
                    onChange={e => setBatchIdInput(e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <Button size="sm" onClick={() => handleUpdateIds(user.id)}>Save</Button>
                  <Button size="sm" variant="destructive" onClick={() => setEditingIdsUserId(null)}>Cancel</Button>
                </>
              ) : (
                <Button size="sm" onClick={() => {
                  setEditingIdsUserId(user.id);
                  setStudentIdInput(user.studentId || "");
                  setBatchIdInput(user.batchId || "");
                }}>Edit IDs</Button>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Enrolled Courses:</h3>
              {user.enrolledCourses.length === 0 ? (
                <p className="text-sm text-gray-500">No enrolled courses</p>
              ) : (
                <ul className="list-disc ml-5 text-sm space-y-2">
                  {user.enrolledCourses.map(c => (
                    <li key={c.id} className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                      <div>
                        {c.course.title} – {c.completionStatus} (Enrolled: {new Date(c.enrolledDate).toLocaleDateString()})
                      </div>
                      <div className="flex space-x-2">
                        {editingCertificateId === c.id ? (
                          <>
                            <input
                              type="text"
                              value={certificateInput}
                              onChange={e => setCertificateInput(e.target.value)}
                              placeholder="Enter certificate URL"
                              className="border rounded px-2 py-1"
                            />
                            <Button size="sm" onClick={() => handleUpdateCertificate(c.id)}>Save</Button>
                            <Button size="sm" variant="destructive" onClick={() => setEditingCertificateId(null)}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            {c.certificateUrl && (
                              <a href={c.certificateUrl} target="_blank" className="text-blue-600 underline">View Certificate</a>
                            )}
                            <Button size="sm" onClick={() => { setEditingCertificateId(c.id); setCertificateInput(c.certificateUrl || ""); }}>
                              {c.certificateUrl ? "Edit" : "Add Certificate"}
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleUnenroll(user.id, c.course.id, c.id)}>Unenroll</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 📢 Announcement Modal */}
<Dialog open={showAnnouncementModal} onOpenChange={setShowAnnouncementModal}>
  <DialogContent className="bg-gray-900 text-gray-100 border border-gray-700 rounded-xl shadow-lg">
    <DialogHeader>
      <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
        📢 Send Announcement
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-4 mt-2">
      {/* Title Input */}
      <input
        type="text"
        placeholder="Title"
        value={announcementTitle}
        onChange={(e) => setAnnouncementTitle(e.target.value)}
        className="w-full bg-gray-800 text-gray-100 placeholder-gray-400
                   border border-gray-700 rounded-lg px-4 py-2
                   focus:ring-2 focus:ring-slate-500 focus:border-transparent
                   transition-all duration-200"
      />

      {/* Message Textarea */}
      <textarea
        placeholder="Message"
        value={announcementMessage}
        onChange={(e) => setAnnouncementMessage(e.target.value)}
        className="w-full bg-gray-800 text-gray-100 placeholder-gray-400
                   border border-gray-700 rounded-lg px-4 py-2 min-h-[100px]
                   focus:ring-2 focus:ring-slate-500 focus:border-transparent
                   transition-all duration-200"
      />

      {/* Target Selector */}
      <select
        value={announcementTarget}
        onChange={(e) => setAnnouncementTarget(e.target.value as "ALL" | "USERS" | "BATCH")}
        className="w-full bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-4 py-2
                   focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
      >
        <option value="ALL">All Users</option>
        <option value="USERS">Specific Users</option>
        <option value="BATCH">Specific Batch</option>
      </select>

      {/* User Selection */}
      {announcementTarget === "USERS" && (
        <div className="border border-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-800">
          {users.map((u) => (
            <label key={u.id} className="flex items-center space-x-2 py-1 text-sm text-gray-200">
              <Checkbox
                checked={selectedUserIds.includes(u.id)}
                onCheckedChange={(checked) => {
                  setSelectedUserIds((prev) =>
                    checked ? [...prev, u.id] : prev.filter((id) => id !== u.id)
                  );
                }}
              />
              <span>
                {u.fullName} <span className="text-gray-400">({u.email})</span>
              </span>
            </label>
          ))}
        </div>
      )}

      {/* Batch Selection */}
      {announcementTarget === "BATCH" && (
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="w-full bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-4 py-2
                     focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
        >
          <option value="">Select Batch</option>
          {allBatchIds.map((batch) => (
            <option key={batch} value={batch}>
              {batch}
            </option>
          ))}
        </select>
      )}
    </div>

    {/* Footer Buttons */}
    <DialogFooter className="mt-4 flex justify-end space-x-3">
      <Button
        onClick={handleSendAnnouncement}
        className="bg-slate-600 hover:bg-slate-700 text-white transition-all duration-200"
      >
        Send
      </Button>
      <Button
        variant="outline"
        onClick={() => setShowAnnouncementModal(false)}
        className="border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-200"
      >
        Cancel
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
    </div>
     </div>

  );
}
