import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import OpenServices from "./pages/OpenServices";
import NotFound from "./pages/NotFound";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import CoursesSection from "./components/CoursesSection";
import ManageUsersPage from "@/pages/ManageUsersPage";
import AdminAnnouncementsPage from "./pages/AdminAnnouncementsPage";
import ProfilePage from "./pages/studentProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/services" element={<OpenServices />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
           <Route path="/account" element={<AccountPage />} />
           <Route path="/admin" element={<AdminPage/>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/admincourse" element={<AdminCoursesPage/>}/>
            <Route path="/courses" element={<CoursesSection />} />
             <Route path="/admin/users" element={<ManageUsersPage />} />
             <Route path="/announcements" element={<AdminAnnouncementsPage/>} />
              <Route path="/profile" element={<ProfilePage />} /> 
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
