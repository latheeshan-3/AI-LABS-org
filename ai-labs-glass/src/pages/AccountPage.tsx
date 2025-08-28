import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface User {
  fullName: string;
  email: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // if no user found, redirect to home/login
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 glass-card p-6 text-center rounded-2xl">
      <h1 className="text-3xl font-bold mb-4">👋 Welcome, {user.fullName}!</h1>
      <p className="text-muted-foreground mb-6">{user.email}</p>
      <Button onClick={handleLogout} className="glow-button">
        Logout
      </Button>
    </div>
  );
}
