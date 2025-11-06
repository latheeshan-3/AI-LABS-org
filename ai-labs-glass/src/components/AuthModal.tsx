import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  UserPlus,
  LogIn,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/auth`;

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [showForgotBanner, setShowForgotBanner] = useState(false);
  


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        })
      );

      if (data.role === "ADMIN") navigate("/admin");
      else navigate("/account");
      onClose();
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (registerPassword !== confirmPassword) {
      alert("❌ Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        })
      );

      alert("✅ Account created successfully! Check your email for verification.");
      onClose();
      navigate("/account");
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;
      if (!token) throw new Error("No credential received");

      const res = await fetch(`${API_URL}/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      alert("✅ Logged in with Google!");
      onClose();
      if (data.role === "ADMIN") navigate("/admin");
      else navigate("/account");
    } catch (err: any) {
      alert("❌ " + err.message);
    }
  };

  const StyledGoogleLogin = () => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex justify-center"
    >
      <div className="inline-block rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 w-full max-w-sm">
        <GoogleLogin
          onSuccess={handleGoogleAuth}
          onError={() => alert("❌ Google Login Failed")}
          theme="filled_blue"
          size="large"
          text="continue_with"
          width="100%"
           shape="pill"          
           logo_alignment="left" 
        />
      </div>
    </motion.div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[90vw] max-w-md 
          sm:w-[90%] sm:max-w-md 
          border-0 
          bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 
          text-white 
          shadow-2xl 
          backdrop-blur-xl 
          rounded-3xl 
          p-0 
          overflow-hidden 
          max-h-[90vh] 
          overflow-y-auto
        "
      >
        <div className="relative p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Welcome to AI Labs
            </DialogTitle>
          </DialogHeader>

           {showForgotBanner && (
            <Alert
              variant="default"
              className="bg-green-900/30 border border-blue-600/40 text-red-300 mb-5 rounded-xl"
            >
              <AlertCircle className="h-4 w-4 mr-2 text-blue-400" />
              <AlertDescription className="text-sm">
                Please use the <strong>“Continue with Google”</strong> button to sign in with your Gmail.
                <br />
                If you still encounter an issue, contact <strong>AI Labs</strong>.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/60 rounded-xl p-1 mb-5 text-sm sm:text-base">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 rounded-lg text-white transition-all py-2"
              >
                <LogIn size={16} className="mr-1 sm:mr-2" /> Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-500 rounded-lg text-white transition-all py-2"
              >
                <UserPlus size={16} className="mr-1 sm:mr-2" /> Register
              </TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login" className="space-y-5">
              <div className="space-y-3">
                <StyledGoogleLogin />
                <p className="text-center text-xs text-gray-400">
                  Quick sign-in with Google
                </p>
              </div>

              <div className="flex items-center gap-3 text-gray-400 my-3 sm:my-5">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                <span className="text-sm font-medium">or email login</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm sm:text-base">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-slate-800/50 border border-slate-700 pl-10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 rounded-xl h-11 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm sm:text-base">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-slate-800/50 border border-slate-700 pl-10 pr-10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 rounded-xl h-11 text-sm sm:text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all h-11 text-sm sm:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center">
                 <Button
                       variant="link"
                       className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm"
                       onClick={() => {
                                          setShowForgotBanner(true);              // show the banner
                                          setTimeout(() => setShowForgotBanner(false), 3000); // auto-hide after 4s
                                                             }}
                                                                            >
                                            Forgot password?
                   </Button>
                </div>

            </TabsContent>

            {/* REGISTER */}
            <TabsContent value="register" className="space-y-5">
              <div className="space-y-3">
                <StyledGoogleLogin />
                <p className="text-center text-xs text-gray-400">
                  Sign up instantly with Google
                </p>
              </div>

              <div className="flex items-center gap-3 text-gray-400 my-3 sm:my-5">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                <span className="text-sm font-medium">or sign up with email</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm sm:text-base">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="bg-slate-800/50 border border-slate-700 pl-10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 rounded-xl h-11 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm sm:text-base">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-slate-800/50 border border-slate-700 pl-10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 rounded-xl h-11 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm sm:text-base">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Create a password"
                      className="bg-slate-800/50 border border-slate-700 pl-10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 rounded-xl h-11 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm sm:text-base">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="bg-slate-800/50 border border-slate-700 pl-10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 rounded-xl h-11 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all h-11 text-sm sm:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <p className="text-xs text-center text-gray-400 mt-3 sm:mt-4">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
