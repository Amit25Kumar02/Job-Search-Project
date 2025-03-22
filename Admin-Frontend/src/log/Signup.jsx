import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';

function Home() {
  const [form, setForm] = useState({});
  // const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVarified , setIsverified] = useState(false)
  const navigate = useNavigate();

  const inpChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      toast.error(
        'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    try {
      const response = await axios.post('http://localhost:5200/api/Admin', form);
      const data = response.data;
      console.log(response)
      if (data.success) {
        toast.success('User Signup successfully.');
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      toast.error('Error adding Sign-up Data: ' + error.message);
    }
  };
  const sendOtp = async () => {
    setIsverified(false)
    if (!form.email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5200/api/Admin/send-otp", { email:form.email });
      toast.success(response.data.message);
      setOtpSent(true); // OTP has been sent successfully
    } catch (error) {
      toast.error(error.response ? error.response.data.message : "Something went wrong!");
    }
  };
  const resendOtp = async () => {
    setIsverified(false)
    otpSent(false)
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5200/api/Admin/resend-otp", {  email:form.email });
      toast.success(response.data.message);
      otpSent(true)
    } catch (error) {
      toast.error(error.response ? error.response.data.message : "Something went wrong!");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5200/api/Admin/verify-otp", { email:form.email, otp });
      toast.success(response.data.message);
      setIsverified(true)
    } catch (error) {
      toast.error(error.response ? error.response.data.message : "Something went wrong!");
    }
  };


  return (
    <>
      <center className="container">
        <form onSubmit={formSubmit} className="form">
          <h1>Sign-Up</h1>
          <input type="text" name="username" placeholder="Enter Your UserName" onChange={inpChange} className="box" required autoComplete="off" />
          <input type="email" name='email' placeholder="Enter email" onChange={inpChange} value={form.email} className='box'/>
          <button onClick={sendOtp} className="btn btn-primary">
            Send OTP
          </button>
          <br />
          {/* OTP Input and Verify OTP Button */}
          {otpSent && (
            <>
              <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} value={otp} className='box' />
              <button onClick={verifyOtp} className="btn btn-success">
                Verify OTP
              </button>
              {/* Resend OTP Button */}
              <button onClick={resendOtp}className="btn btn-primary" >
                Resend OTP
              </button>
            </>
          )}
          { isVarified && <><input type="password" name="password" placeholder="Enter Your Password" onChange={inpChange} className="box" required autoComplete="off" />
          <input type="submit" className="btn-1" value="Sign-Up" />
          </>}
          <h3 className="spn">Already have an account?</h3>
          <div className="btn-1">
            <Link to="/" className="l-btn">Log-In</Link>
          </div>
        </form>
      </center>
      <ToastContainer />
    </>
  );
}

export default Home;
