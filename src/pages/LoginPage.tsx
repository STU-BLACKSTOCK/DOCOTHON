import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const LoginPage: React.FC = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"doctor" | "staff" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) {
      toast.error("Please select a role");
      return;
    }

    if (!id || !password) {
      toast.error("Please enter your ID and password");
      return;
    }

    // Validate Aadhaar ID or ABHA ID format
    const aadhaarPattern = /^\d{12}$/;
    const abhaPattern = /^ABHA\d{12}$/;
    
    if (!aadhaarPattern.test(id) && !abhaPattern.test(id)) {
      toast.error("Please enter a valid 12-digit Aadhaar ID or ABHA ID (format: ABHA followed by 12 digits)");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(id, password, role);
      if (success) {
        toast.success(`Welcome back!`);
        navigate(role === "doctor" ? "/doctor/dashboard" : "/staff/dashboard");
      } else {
        toast.error("Invalid credentials. Please check your ID and password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Hero section */}
      <div className="flex-1 bg-primary-600 text-white p-6 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-md bg-white flex items-center justify-center">
              <span className="text-primary-600 font-bold text-xl">HD</span>
            </div>
            <h1 className="text-2xl font-bold">HealthData</h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Unified Healthcare Data Management
          </h2>
          
          <p className="text-lg mb-8 text-primary-100">
            Access, analyze, and manage patient records with AI-powered insights
            in one secure platform.
          </p>
          
          <div className="bg-primary-700/30 rounded-lg p-4 md:p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-lg mb-3">Why HealthData?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="rounded-full bg-primary-400 p-1 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>AI-powered document processing and insights</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="rounded-full bg-primary-400 p-1 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>Seamless integration with existing healthcare systems</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="rounded-full bg-primary-400 p-1 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>HIPAA-compliant security for patient data</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
            <p className="text-muted-foreground mt-2">
              Access your healthcare data management portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role">Select Your Role</Label>
              <RadioGroup
                value={role || ""}
                onValueChange={(value) => setRole(value as "doctor" | "staff")}
                className="flex flex-col space-y-3 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doctor" id="doctor" />
                  <Label htmlFor="doctor" className="cursor-pointer">Doctor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="staff" id="staff" />
                  <Label htmlFor="staff" className="cursor-pointer">Medical Staff</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="id">Aadhaar ID or ABHA ID</Label>
              <Input
                id="id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter your 12-digit Aadhaar ID or ABHA ID"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter your 12-digit Aadhaar ID or ABHA ID (format: ABHA followed by 12 digits)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm text-primary-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Password reset functionality coming soon");
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Sample Doctor Login:<br />
              ID: 123456789012 (or ABHA123456789012)<br />
              Password: password123
            </p>
            <p className="mt-2">
              Sample Staff Login:<br />
              ID: 456789012345<br />
              Password: password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
