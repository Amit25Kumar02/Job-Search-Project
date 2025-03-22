import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../store/authcontex";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "Client", 
  });

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

    try {
      const response = await axios.post("http://localhost:5200/api/users/login", formData);
      toast.success(response.data.message, { position: "top-center" });

      // Store Token in AuthContext & Local Storage
      setToken(response.data.token);
      localStorage.setItem("user",JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      // Redirect based on User Type
      if (formData.userType === "Client") {
        navigate('/client');
      } else {
        navigate('/home');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid credentials.", { position: "top-center" });
    }
  };

  return (
    <div className="container con">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card p-4 shadow rounded">
            <h3 className="text-center mb-4">Log In</h3>
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

              <button type="submit" className="btn btn-primary w-100">
                Log In
              </button>

              <div className="text-center mt-3">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;
