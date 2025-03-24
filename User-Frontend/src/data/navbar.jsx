import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top">
      <div className="container-fluid">
        <Link className=" jobs-nav" to="#">AmitJobsHub</Link>
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/userabout">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/userservices">Services</Link>
            </li>
          </ul>

          {/* User Dropdown */}
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="accountDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              {userName ? `Hey, ${userName.username}` : "Account"}
            </button>
            <ul className="dropdown-menu" aria-labelledby="accountDropdown">
              {userName ? (
                <>
                  <li><Link className="dropdown-item" to="/userprofile">Profile</Link></li>
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
