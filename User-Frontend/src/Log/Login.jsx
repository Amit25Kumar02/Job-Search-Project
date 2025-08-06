import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../store/authcontex";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Reset.css";

const API_URL = "https://job-search-project-330t.onrender.com";
// const API_URL = "http://localhost:5200";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "Client",
  });

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state

  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, formData);
      toast.success(response.data.message, { position: "top-center" });

      setToken(response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      navigate(formData.userType === "Client" ? "/client" : "/home");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Invalid credentials.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const { data } = await axios.post(`${API_URL}/api/users/google-login`, {
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
      });

      toast.success("Login Successful", { position: "top-center" });
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      navigate("/home");
    } catch (err) {
      console.error(err);
      toast.error("Google Login Failed", { position: "top-center" });
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.warn("⚠ Please enter your email");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/users/forgot-password`, {
        email: forgotEmail,
      });

      toast.success("✅ Reset link sent to your email");
      setShowForgotModal(false);
      setForgotEmail("");
    } catch (err) {
      toast.error("❌ Failed to send reset link", err);
    }
  };

  return (
    <div className="container con">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card p-4 shadow rounded">
            <h3 className="text-center text-dark mb-3">Log In</h3>

            {/* Google Login */}
            <div className="mb-3 text-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() =>
                  toast.error("Google Login Failed", { position: "top-center" })
                }
              />
            </div>

            <hr />

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email..."
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

              {/* Forgot Password link */}
              <div className="mb-2 text-end">
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => setShowForgotModal(true)}
                  style={{ fontSize: "14px" }}
                >
                  Forgot Password?
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

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

              <div className="text-center text-dark mt-3">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="mb-3">Forgot Password</h3>
            <input
              className="form-control mb-3"
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-success" onClick={handleForgotPassword}>
                Send Link
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowForgotModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Login;
