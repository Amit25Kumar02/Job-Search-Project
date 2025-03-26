import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Log/Signup';
import Login from './Log/Login';
import User from './data/User.jsx';
import Client from './data/client/Client.jsx';
import UserHome from './data/UserHome.jsx';
import JobApplyForm from './data/ApplyJob.jsx';
import JobDetails from './data/jobdetail.jsx';
import NavbarSection from './data/navbar.jsx';
import { AuthContext } from './store/authcontex.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import ClientProfile from './data/client/clientProfile.jsx';
import UserProfile from './data/Profile.jsx';
import UserAboutPage from './data/UserAbout.jsx';
import ClientAboutPage from './data/client/ClientAbout.jsx';
import ServicesPage from './data/client/ClientServices.jsx';
import JobRequest from './data/client/JobRequest.jsx';
import ClientNav from './data/client/clientnav.jsx';
import ClientFooter from './data/client/clientfooter.jsx';
import Footer from './data/footer.jsx';
import UserServices from './data/UserServices.jsx';
import { Clientcontact } from './data/client/Clientcontact.jsx';
import { Usercontact } from './data/usercontact.jsx';

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const { token } = useContext(AuthContext);

  let { userType } = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {userType : null}
  // console.log(userType)
  return (
    <BrowserRouter>
      {userType == "User" &&
      <>
      <NavbarSection />
        <Routes>
          <Route path="/" element={token ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="/userjob" element={<ProtectedRoute><User /></ProtectedRoute>} />
          <Route path="/userabout" element={<ProtectedRoute><UserAboutPage /></ProtectedRoute>} />
          <Route path="/userservices" element={<ProtectedRoute><UserServices /></ProtectedRoute>} />
          <Route path="/userprofile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/apply/:jobId" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
          <Route path="/applybtn/:jobId" element={<ProtectedRoute><JobApplyForm /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Usercontact /></ProtectedRoute>} />
        </Routes>
        <Footer/>
        </>
      }

      {userType == "Client" &&
      <>
      <ClientNav/>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/client" /> : <Navigate to="/login" />} />
          <Route path="/client" element={<ProtectedRoute><Client /></ProtectedRoute>} />
          <Route path="/clientabout" element={<ProtectedRoute><ClientAboutPage /></ProtectedRoute>} />
          <Route path="/clientprofile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
          <Route path="/jobrequest" element={<ProtectedRoute><JobRequest /></ProtectedRoute>} />
          <Route path="/clientcontact" element={<ProtectedRoute><Clientcontact /></ProtectedRoute>} />
        </Routes>
        <ClientFooter/>
        </>
      }
      {
        userType == null &&
        <Routes>
          <Route path="/" element={token ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      }


    </BrowserRouter>
  );
}

export default App;
