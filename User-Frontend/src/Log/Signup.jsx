import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    userType: "Client",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { username, email, phone, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (username.trim().length < 4) return "Username must be at least 3 characters.";
    if (!emailRegex.test(email.trim())) return "Invalid email format.";
    if (!phoneRegex.test(phone.trim())) return "Phone number must be 10 digits.";
    if (password.trim().length < 6) return "Password must be at least 6 characters.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError, { position: "top-center" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5200/api/users/signup", {
        ...formData,
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password.trim(),
      });

      toast.success(response.data.message, { position: "top-center" });

      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card p-4 shadow rounded">
            <h3 className="text-center mb-4">Sign Up</h3>
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
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="mb-3">
                <input 
                  type="tel" 
                  name="phone" 
                  className="form-control" 
                  placeholder="Enter Phone No..." 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="mb-3">
                <input 
                  type="password" 
                  name="password" 
                  className="form-control" 
                  placeholder="Enter Password..." 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Select User Type:</label>
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

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </button>

              <div className="text-center mt-3">
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
