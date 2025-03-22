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
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">Client-Navbar</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
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
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">Services</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/jobrequest">Job-Request</Link>
            </li>
          </ul>

          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="accountDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              {username ? `Hey, ${username.username}` : "Account"}
            </button>
            <ul className="dropdown-menu" aria-labelledby="accountDropdown">
              {username ? (
                <>
                  <li><Link className="dropdown-item" to="/clientprofile">Profile</Link></li>
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

export default ClientNav;
