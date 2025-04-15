import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NavbarSection() {
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUserName(JSON.parse(userData));
    }
    // 👇 Add scroll event listener
    const handleScroll = () => {
      const nav = document.querySelector('.navbar');
      if (window.scrollY > 0) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem("user");
    setUserName(null);
    toast.success('Logged out successfully');
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg  fixed-top">
      <div className="container-fluid">
        <NavLink className=" jobs-nav" to="#">AmitJobsHub</NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2">
            <li className="nav-item">
              <NavLink
                to="/home"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/userabout"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                Contact
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/userservices"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                Services
              </NavLink>
            </li>
          </ul>


          {/* User Dropdown */}

          <div className="dropdown">
            <button className="btn btn-success dropdown-toggle" type="button" id="accountDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              {/* <img src={userName.profile} alt="Profile" className="profile-img2 mb-2" /> */}
              {userName ? `Hey, ${userName.username}` : "Account"}
            </button>
            <ul className="dropdown-menu" aria-labelledby="accountDropdown">
              {userName ? (
                <>
                  <li><NavLink className="dropdown-item" to="/userprofile">Profile</NavLink></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Log-out</button></li>
                </>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarSection;
