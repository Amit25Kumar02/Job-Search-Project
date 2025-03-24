import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';

function Home() {
  const [form, setForm] = useState({
    username : "",
    email : "",
    password : "",
    otp : ""
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpsending , setIsotpsending] = useState(false)
  const navigate = useNavigate();

  const inpChange = (e) => {
    console.log(e.target)
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
    setIsotpsending(true)

    if (!validatePassword(form.password)) {
      toast.error(
        'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      setIsotpsending(false)
      return;
    }
    try {
      const response = await axios.post('http://localhost:5200/api/Admin/verify-otp', form);
      // const data = response.data;
      console.log(response)
        toast.success('User Signup successfully.');
        setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.log(error)
      toast.error('Error adding Sign-up Data: ' + error.response.data.message);
    }
    setIsotpsending(false)
  };
  
  const sendOtp = async () => {
    setIsotpsending(true)
    if (!form.email) {
      toast.error("Please enter a valid email address.");
      setIsotpsending(false)
      return;
    }
    try {
      const response = await axios.post("http://localhost:5200/api/Admin/send-otp", { email:form.email });
      toast.success(response.data.message);
      setOtpSent(true); // OTP has been sent successfully
    } catch (error) {
      toast.error(error.response ? error.response.data.message : "Something went wrong!");
    }
    
    setIsotpsending(false)
  };

  return (
    <>
      <center className="container">
        <form onSubmit={formSubmit} className="form">
          <h1>Sign-Up</h1>
          <input type="text" name="username" placeholder="Enter Your UserName" onChange={inpChange} value={form.username} className="box" required autoComplete="off" />
          <input type="email" name='email' disabled={otpSent} placeholder="Enter email" onChange={inpChange} value={form.email} className='box'/>
          <input type="password" name="password" placeholder="Enter Your Password" onChange={inpChange} value={form.password} className="box" required autoComplete="off" />
          {
         !otpSent && 
          <button type='button' disabled={otpsending ? true :false} onClick={sendOtp} className="btn btn-primary">
            {otpsending?"wait... otp is sending": "Send OTP"}
          </button>
          } 
          <br />
          {/* OTP Input and Verify OTP Button */}
          {otpSent && (
            <>
              <input type="text" name="otp" placeholder="Enter OTP" onChange={inpChange} value={form.otp} className='box' />
               <input type="submit" value={otpsending ? 'submiting...wait..':"submit"} disabled={otpsending ? true :false} className="btn-1" />
              {/* Resend OTP Button */}
              <button type="button" onClick={sendOtp} disabled={otpsending ? true :false} className="btn btn-primary" >
              {otpsending?"wait... otp is sending": " Re-Send OTP"}
              </button>
            </>
          )}
          <h3 className="spn">Already have an account?
         
            <Link to="/">Log-In</Link>
            </h3>
        </form>
      </center>
      <ToastContainer />
    </>
  );
}

export default Home;
