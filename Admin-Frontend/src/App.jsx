/* eslint-disable no-unused-vars */
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './log/Signup';
import Login from './log/Login';
import Userdata from './pages/userdata';
import JobData from './pages/Jobdata';
import UpdateUser from './log/Update';
import DeleteUser from './log/Delete';
import ApplyJob from './pages/ApplyJob';
import AdminProfile from './pages/AdminProfile';
import { AuthContext } from './store/authcontex';
import { useContext } from 'react';
import Navbar from './pages/Navbar';
import Footer from './pages/footer';

// eslint-disable-next-line react/prop-types
const SecureRoute = ({ children }) => {
  let { token, setToken, user, setUser } = useContext(AuthContext)


  return token ? children : <Navigate to={"/login"} />
}

function App() {
  let { token, setToken, user, setUser } = useContext(AuthContext)
  return (
    <BrowserRouter>  
          <Navbar />
          <Routes>
            <Route path='/' element={token ? <Navigate to={"/userdata"} /> : <Navigate to={"/login"} />} />
            <Route path='/userdata' element={<SecureRoute> <Userdata /></SecureRoute>} />
            <Route path='/jobdata' element={<SecureRoute> <JobData /></SecureRoute>} />
            <Route path='/adminprofile' element={<SecureRoute> <AdminProfile /></SecureRoute>} />
            <Route path='/applyjob' element={<SecureRoute> <ApplyJob /></SecureRoute>} />
            <Route path='/login' element={!token && <Login />} />
            <Route path='/signup' element={!token && <Signup />} />
            <Route path='/update' element={!token && <UpdateUser />} />
            <Route path='/delete-user' element={!token && <DeleteUser />} />
            
          </Routes>
          <Footer />
        </BrowserRouter>
      );
}

      export default App;
