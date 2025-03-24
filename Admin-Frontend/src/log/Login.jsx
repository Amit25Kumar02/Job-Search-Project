import './login.css';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../store/authcontex';

function Login() {
  const navigate = useNavigate();
  const [admindata, setAdmindata] = useState({
    email: "",
    password: "",
  });

  const { setToken } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmindata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5200/api/Admin/login", admindata);
      toast.success(response.data.message, { position: "top-center" });

      // Store Token in AuthContext & Local Storage
      console.log(response.data)
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate('/userdata');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid credentials.", { position: "top-center" });
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <center className="container">
        <form className="form" onSubmit={formSubmit}>
          <div className="sign-up"><h1>Log-In</h1></div>
          <input type="email" name="email" placeholder="Enter UserName or Email" value={admindata.email} className="box" onChange={handleChange} required autoComplete="off" />
          <input type="password" name="password" placeholder="Enter Your Password" value={admindata.password} className="box" onChange={handleChange} required autoComplete="off" />
          <input type="submit" className="btn-1" value="Log-In" />
          <Link to="/update" className="p-btn"><h3>Forget Password</h3></Link>
          <Link to="/delete-user" className="p-btn"><h3>Delete User</h3></Link>
          <h3 className="spn">Doesn&apos;t have an account?
          
            <Link to="/signup">Sign-Up</Link>
            </h3>
        </form>
      </center>
    </>
  );
}

export default Login;
