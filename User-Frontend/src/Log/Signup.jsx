import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const API_URL = 'https://job-search-project-330t.onrender.com';
// const API_URL = "http://localhost:5200";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "Client",
    otp:""
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpsending , setIsotpsending] = useState(false)


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { username, email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (username.trim().length < 4) return "Username must be at least 3 characters.";
    if (!emailRegex.test(email.trim())) return "Invalid email format.";
    if (password.trim().length < 6) return "Password must be at least 6 characters.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsotpsending(true)
    if (loading) return;

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError, { position: "top-center" });
      return;
    }
    setIsotpsending(false)

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/users/verify-otp`, {
        ...formData,
        username: formData.username.trim(),
        email: formData.email.trim(),
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
    setIsotpsending(false)
  };
    
  const sendOtp = async () => {
    setIsotpsending(true)
    if (!formData.email) {
      toast.error("Please enter a valid email address.");
      setIsotpsending(false)
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/users/send-otp`, { email:formData.email });
      toast.success(response.data.message);
      setOtpSent(true); // OTP has been sent successfully
    } catch (error) {
      toast.error(error.response ? error.response.data.message : "Something went wrong!");
    }
    
    setIsotpsending(false)
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
              {
         !otpSent && 
          <button type='button' disabled={otpsending ? true :false} onClick={sendOtp} className="btn btn-primary btn-o">
            {otpsending?"wait... otp is sending": "Send OTP"}
          </button>
          } 
              {/* OTP Input and Verify OTP Button */}
              {otpSent && (
            <>
              <input type="text" name="otp" placeholder="Enter OTP" onChange={handleChange} value={formData.otp}   className="form-control"  />
               <input type="submit" value={otpsending ? 'submiting...wait..':"submit"} disabled={otpsending ? true :false} className="btn-o" />
              {/* Resend OTP Button */}
              <button type="button" onClick={sendOtp} disabled={otpsending ? true :false} className="btn btn-primary btn-o" >
              {otpsending?"wait... otp is sending": " Re-Send OTP"}
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
