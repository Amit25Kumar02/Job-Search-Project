import { useEffect, useState } from "react";
import axios from "axios";
import "./css/profile.css";

function AdminProfile() {
  const [userData, setUserData] = useState({
    profile: "",
    username: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      calculateCompletion(parsedData);
    }
  }, []);

  const handleChange = (e) => {
    const updatedData = { ...userData, [e.target.name]: e.target.value };
    setUserData(updatedData);
    calculateCompletion(updatedData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSave = async () => {
    let updatedData = { ...userData };

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedData = { ...updatedData, profile: reader.result };
        saveData(updatedData);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      saveData(updatedData);
    }
  };

  const saveData = async (data) => {
    try {
      await axios.post("http://localhost:5200/api/Admin/profileUpdate", data);
      localStorage.setItem("user", JSON.stringify(data));
      setUserData(data);
      setIsEditing(false);
      calculateCompletion(data);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Function to calculate profile completeness
  const calculateCompletion = (data) => {
    // Define required fields (exclude optional fields like 'profile' if not mandatory)
    const requiredFields = ["username", "email", "phone", "dob", "gender", "address","profile"];
  
    // Count filled fields (trim to remove spaces and check for valid values)
    const filledFields = requiredFields.filter((field) => data[field] && data[field].trim() !== "").length;
  
    // Calculate percentage correctly
    const completionPercentage = Math.round((filledFields / requiredFields.length) * 100);
    
    setProfileCompletion(completionPercentage);
  };
  

  return (
    <div className="d-flex  pro-card ">
      <div className="card p-4 pro-div" style={{ width: "400px" }}>
        <h2 className="text-center mb-2">Profile Page</h2>
        
        {/* Profile Completion Progress */}
        <div className="progress mb-2 ">
          <div className="progress-bar" role="progressbar" style={{ width: `${profileCompletion}%` }} 
          aria-valuenow={profileCompletion} 
          aria-valuemin="0" aria-valuemax="100" >
            {profileCompletion}%
          </div>
        </div>

        <div className="mb-3 text-center">
          {userData.profile ? (
            <img src={userData.profile} alt="Profile" className="profile-img mb-2" />
          ) : (
            <p className="profile">No Profile Image</p>
          )}
        </div>

        {isEditing ? (
          <>
            <input type="file" accept="image/*" onChange={handleFileChange} className="form-control mb-2" />
            <input type="text" placeholder="Enter Your UserName" name="username" value={userData.username} onChange={handleChange} className="form-control mb-2" />
            <input type="email" name="email" value={userData.email} className="form-control mb-2" disabled />
            <input type="text" placeholder="Enter your Mob. No." name="phone" value={userData.phone} onChange={handleChange} className="form-control mb-2" />
            <select name="gender" value={userData.gender} onChange={handleChange} className="form-control mb-2">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input type="date" name="dob" value={userData.dob} onChange={handleChange} className="form-control mb-2" />
            <input type="text" placeholder="Enter your Address" name="address" value={userData.address} onChange={handleChange} className="form-control mb-2" />
            <button className="btn btn-success" onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <p><b>UserName : </b> - {userData.username}</p>
            <p><b>Email : </b> - {userData.email}</p>
            <p><b>Mob.No. : </b> - {userData.phone}</p>
            <p><b>Gender : </b> - {userData.gender}</p>
            <p><b>DOB : </b> - {userData.dob}</p>
            <p><b>Address : </b> - {userData.address}</p>
            <button className="btn btn-outline-success" onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminProfile;
