import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// Environment-based API URL
const API_URL = "https://job-search-project-330t.onrender.com";
// const API_URL = "http://localhost:5200";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - Please check your connection');
    }
    if (!error.response) {
      throw new Error('Network error - Unable to reach server');
    }
    throw error;
  }
);

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "Client",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate fields
  const validateForm = () => {
    const { username, email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (username.trim().length < 3) {
      return "Username must be at least 3 characters.";
    }
    if (!emailRegex.test(email.trim())) {
      return "Invalid email format.";
    }
    if (password.trim().length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null;
  };

  // Test API connection
  const testConnection = async () => {
    try {
      const response = await api.get("/health");
      console.log("✅ API Connection Test:", response.data);
      return true;
    } catch (error) {
      console.error("❌ API Connection Failed:", error);
      toast.error("Cannot connect to server. Please try again later.");
      return false;
    }
  };

  // Send OTP
  const sendOtp = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) return;

    setSendingOtp(true);

    try {
      console.log("📧 Sending OTP to:", formData.email);
      
      const res = await api.post("/api/users/send-otp", { 
        email: formData.email 
      });

      toast.success(res.data.message || "OTP sent successfully! Check your email.");
      setOtpSent(true);
    } catch (error) {
      console.error("❌ OTP Error:", error);
      
      if (error.response) {
        // Server responded with error status
        toast.error(error.response.data?.message || "Failed to send OTP. Please try again.");
      } else if (error.request) {
        // Request was made but no response received
        toast.error("No response from server. Please check your connection.");
      } else {
        // Something else happened
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify OTP and register user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (!formData.otp) {
      toast.error("Please enter OTP before submitting.");
      return;
    }

    setLoading(true);

    try {
      console.log("🚀 Submitting registration...");
      
      const res = await api.post("/api/users/verify-otp", {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        otp: formData.otp.trim(),
        userType: formData.userType,
      });

      toast.success(res.data.message || "🎉 Signup successful! Redirecting...");
      
      // Store user data if needed
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("❌ Signup Error:", error);
      
      if (error.response) {
        toast.error(error.response.data?.error || error.response.data?.message || "Registration failed.");
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container con mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card p-4 shadow rounded">
            <h3 className="text-center text-dark mb-4">Sign Up</h3>
            <p className="text-center text-muted small mb-3">
              API: {API_URL}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-dark small">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Enter username (min 3 characters)"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-dark small">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  disabled={otpSent}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-dark small">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control"
                    placeholder="Enter password (min 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-dark">User Type</label>
                <select
                  name="userType"
                  className="form-select"
                  value={formData.userType}
                  onChange={handleChange}
                >
                  <option value="Client">Client (Post Jobs)</option>
                  <option value="User">User (Find Jobs)</option>
                </select>
              </div>

              {/* OTP Section */}
              {!otpSent ? (
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={sendingOtp}
                  className="btn btn-primary w-100 py-2"
                >
                  {sendingOtp ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label text-dark small">OTP Code</label>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter 6-digit OTP"
                      onChange={handleChange}
                      value={formData.otp}
                      className="form-control"
                      required
                      maxLength={6}
                    />
                    <div className="form-text">
                      Check your email for the OTP code
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-success w-100 py-2"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={sendingOtp}
                    className="btn btn-outline-primary w-100 mt-2 py-2"
                  >
                    {sendingOtp ? "Resending..." : "Resend OTP"}
                  </button>
                </>
              )}

              <div className="text-center text-dark mt-3">
                Already have an account? <Link to="/login" className="text-primary">Log In</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default SignUp;