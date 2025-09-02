import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

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
    <div className="container mx-auto mt-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">👥 Manage Users</h1>
        <div className="space-x-2">
          <Button onClick={() => setShowAnnouncementModal(true)}>📢 Send Announcement</Button>
          <Button onClick={() => navigate("/admin")} variant="outline">Back</Button>
          <Button onClick={() => navigate("/announcements")} variant="outline">View Annoncement</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by user name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />

        <select
          value={courseFilter || ""}
          onChange={e => setCourseFilter(e.target.value || null)}
          className="border rounded px-3 py-2 mt-2 md:mt-0"
        >
          <option value="">All Courses</option>
          {allCourses.map(title => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>

        <select
          value={batchFilter || ""}
          onChange={e => setBatchFilter(e.target.value || null)}
          className="border rounded px-3 py-2 mt-2 md:mt-0"
        >
          <option value="">All Batches</option>
          {allBatchIds.map(batch => (
            <option key={batch} value={batch}>{batch}</option>
          ))}
        </select>
      </div>

      {/* User list */}
      {filteredUsers.map(user => (
        <Card key={user.id} className="p-6">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>{user.fullName} ({user.role})</CardTitle>
              <p className="text-sm text-gray-600">{user.email}</p>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>📢 Send Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Title"
              value={announcementTitle}
              onChange={e => setAnnouncementTitle(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
            <textarea
              placeholder="Message"
              value={announcementMessage}
              onChange={e => setAnnouncementMessage(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />

            <select
              value={announcementTarget}
              onChange={e => setAnnouncementTarget(e.target.value as any)}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="ALL">All Users</option>
              <option value="USERS">Specific Users</option>
              <option value="BATCH">Specific Batch</option>
            </select>

            {announcementTarget === "USERS" && (
              <div className="border rounded p-2 max-h-40 overflow-y-auto">
                {users.map(u => (
                  <label key={u.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedUserIds.includes(u.id)}
                      onCheckedChange={(checked) => {
                        setSelectedUserIds(prev =>
                          checked ? [...prev, u.id] : prev.filter(id => id !== u.id)
                        );
                      }}
                    />
                    <span>{u.fullName} ({u.email})</span>
                  </label>
                ))}
              </div>
            )}

            {announcementTarget === "BATCH" && (
              <select
                value={selectedBatch}
                onChange={e => setSelectedBatch(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Select Batch</option>
                {allBatchIds.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSendAnnouncement}>Send</Button>
            <Button variant="outline" onClick={() => setShowAnnouncementModal(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
