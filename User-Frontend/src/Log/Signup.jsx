import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const API_URL = "https://job-search-project-330t.onrender.com";
// const API_URL = "http://localhost:5200";

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

  //  Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  Validate fields
  const validateForm = () => {
    const { username, email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (username.trim().length < 3) return "Username must be at least 3 characters.";
    if (!emailRegex.test(email.trim())) return "Invalid email format.";
    if (password.trim().length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  //  Send OTP
  const sendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSendingOtp(true);

    try {
      console.log("Sending OTP to:", formData.email);
      const res = await axios.post(
        `${API_URL}/api/users/send-otp`,
        { email: formData.email },
        {
          headers: { "Content-Type": "application/json" },
          // withCredentials: true, 
        }
      );

      toast.success(res.data.message || "OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      console.error("OTP Error:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong while sending OTP."
      );
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
      const res = await axios.post(
        `${API_URL}/api/users/verify-otp`,
        {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          otp: formData.otp.trim(),
          userType: formData.userType,
        },
        {
          headers: { "Content-Type": "application/json" },
          // withCredentials: true,
        }
      );

      toast.success(res.data.message || "Signup successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error(err.response?.data?.error || "Something went wrong.");
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

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Enter Username..."
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email..."
                  disabled={otpSent}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  placeholder="Enter Password..."
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

              <div className="mb-3">
                <label className="form-label text-dark">Select User Type:</label>
                <select
                  name="userType"
                  className="form-select"
                  value={formData.userType}
                  onChange={handleChange}
                >
                  <option value="Client">Client</option>
                  <option value="User">User</option>
                </select>
              </div>

              {/* OTP Buttons */}
              {!otpSent && (
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={sendingOtp}
                  className="btn btn-primary w-100"
                >
                  {sendingOtp ? "Sending OTP..." : "Send OTP"}
                </button>
              )}

              {otpSent && (
                <>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    onChange={handleChange}
                    value={formData.otp}
                    className="form-control mt-3"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-success w-100 mt-3"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={sendingOtp}
                    className="btn btn-primary w-100 mt-2"
                  >
                    {sendingOtp ? "Resending..." : "Re-Send OTP"}
                  </button>
                </>
              )}

              <div className="text-center text-dark mt-3">
                Already have an account? <Link to="/login">Log In</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignUp;
