import { Link, useNavigate } from "react-router-dom";
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
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link className="jobs-nav" to="/">AmitJobsHub</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/client">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clientabout">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clientcontact">Contact</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">Services</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/jobrequest">Job-Request</Link>
            </li>
          </ul>

          <div className="dropdown">
            <button className="btn btn-success dropdown-toggle" type="button" id="accountDropdown" data-bs-toggle="dropdown">
              {username ? `Hey, ${username.username}` : "Account"}
            </button>
            <ul className="dropdown-menu" aria-labelledby="accountDropdown">
              {username && (
                <>
                  <li><Link className="dropdown-item" to="/clientprofile">Profile</Link></li>
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
