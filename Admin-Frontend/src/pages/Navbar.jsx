import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import "./css/navbar.css";

function Navbar() {
  const [userName, setUserName] = useState(null);
  // console.log(userName)
 
  useEffect(() => {
    const userData = localStorage.getItem("user");
    // console.log(userData)
    if (userData) {
      setUserName(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem("user");
    setUserName(null);
    toast.success('Logged out successfully');

    window.location.reload()
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top">
      <div className="container-fluid">
        <Link className="jobs-nav" to="#">AmitJobsHub</Link>
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
              <Link className="nav-link" to="/userdata">Users</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/jobdata">Jobs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/applyjob">Apply-Jobs</Link>
            </li>
          </ul>

          {/* User Dropdown */}
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="accountDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              {userName ? `Hey, ${userName.username}` : "Account"}
            </button>
            <ul className="dropdown-menu w-50" aria-labelledby="accountDropdown">
              {userName ? (
                <>
                  <li><Link className="dropdown-item" to="/adminprofile">Profile</Link></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Log-out</button></li>
                </>
              ) : (
              <>
                <li><Link className="dropdown-item" to="/login">Login</Link></li>
                <li><Link className="dropdown-item" to="/signup">SignUp</Link></li>

              </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
