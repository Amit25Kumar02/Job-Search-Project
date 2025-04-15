import { NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";

function ClientNav() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUsername(JSON.parse(userData));
    }

    // Scroll behavior
    const handleScroll = () => {
      const nav = document.querySelector('.navbar');
      if (window.scrollY > 0) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem("user");
    setUsername(null);
    toast.success('Logged out successfully');
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top main-nav">
      <div className="container">
        <NavLink className="jobs-nav" to="/">AmitJobsHub</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
