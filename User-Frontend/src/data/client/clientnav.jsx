import { NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; 



function ClientNav() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem("user");
    setUsername(null);
    toast.success('Logged out successfully');
    navigate("/login");
    window.location.reload();
  };

  // Auto-logout based on token expiry
  useEffect(() => {
    // console.log("Navbar useEffect ran");
  
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    let logoutTimeout;
  
    if (userData) {
      setUsername(JSON.parse(userData));
    }
  
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
  
        if (decoded.exp < now) {
          handleLogout();
        } else {
          logoutTimeout = setTimeout(() => {
            handleLogout();
          }, (decoded.exp - now) * 1000);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    }
  
    // ✅ Scroll handler - this now runs!
    const handleScroll = () => {
      // console.log("Scrolled ✅");
      const nav = document.querySelector(".navbar");
      if (!nav) return;
      if (window.scrollY > 0) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    };
  
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      if (logoutTimeout) clearTimeout(logoutTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <nav className="navbar navbar-expand-lg fixed-top main-nav">
      <div className="container">
        <div className="con-2">

        <NavLink className="jobs-nav" to="/">AmitJobsHub</NavLink>
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-gap">
            <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/client">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/clientabout">About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/clientcontact">Contact</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/services">Services</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to="/jobrequest">Job-Request</NavLink>
            </li>
          </ul>

          <div className="dropdown">
            <button className="btn btn-success dropdown-toggle" type="button" id="accountDropdown" data-bs-toggle="dropdown">
              {username ? `Hey, ${username.username}` : "Account"}
            </button>
            <ul className="dropdown-menu" aria-labelledby="accountDropdown">
              {username && (
                <>
                  <li><NavLink className="dropdown-item" to="/clientprofile">Profile</NavLink></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Log-out</button></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default ClientNav;
