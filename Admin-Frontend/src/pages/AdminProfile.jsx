import { useEffect, useState } from "react";
import axios from "axios";
import "./css/profile.css";

const API_URL = 'https://job-search-project-330t.onrender.com';

function AdminProfile() {
  const [userData, setUserData] = useState({
    profileImage: "",
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
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone);
      formData.append("gender", userData.gender);
      formData.append("address", userData.address);
      formData.append("dob", userData.dob);

      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const response = await axios.post(
        `${API_URL}/api/Admin/profileUpdate`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUserData(response.data.user);
      setIsEditing(false);
      calculateCompletion(response.data.user);
      window.location.reload();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Profile completion calculator
  const calculateCompletion = (data) => {
    const requiredFields = ["username", "email", "phone", "dob", "gender", "address", "profileImage"];
    const filledFields = requiredFields.filter(
      (field) => data[field] && data[field].trim() !== ""
    ).length;
    const completionPercentage = Math.round((filledFields / requiredFields.length) * 100);
    setProfileCompletion(completionPercentage);
  };

  // 🧠 Helper: Get initials if image not available
  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0][0]?.toUpperCase() || "";
    } else if (parts.length > 1) {
      return `${parts[0][0]?.toUpperCase() || ""}${parts[1][0]?.toUpperCase() || ""}`;
    }
    return "";
  };

  return (
    <div className="d-flex pro-card">
      <div className="card p-4 pro-div" style={{ width: "400px" }}>
        <h2 className="text-center mb-2">Profile Page</h2>

        {/* Profile Completion Progress */}
        <div className="progress mb-2">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${profileCompletion}%` }}
            aria-valuenow={profileCompletion}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {profileCompletion}%
          </div>
        </div>

        {/* ✅ Profile Image OR Initials */}
        <div className="mb-3 text-center">
          {userData.profileImage ? (
            <img
              src={userData.profileImage}
              alt="Profile"
              className="profile-img mb-2"
            />
          ) : (
            <div className="initial-avatar mb-2">
              {getInitials(userData.username)}
            </div>
          )}
        </div>

        {isEditing ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Enter Your UserName"
              name="username"
              value={userData.username}
              onChange={handleChange}
              className="form-control mb-2"
            />
            <input
              type="email"
              name="email"
              value={userData.email}
              className="form-control mb-2"
              disabled
            />
            <input
              type="text"
              placeholder="Enter your Mob. No."
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              className="form-control mb-2"
            />
            <select
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              className="form-control mb-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="date"
              name="dob"
              value={userData.dob}
              onChange={handleChange}
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Enter your Address"
              name="address"
              value={userData.address}
              onChange={handleChange}
              className="form-control mb-2"
            />
            <button className="btn btn-success" onClick={handleSave}>
              Save
            </button>
          </>
        ) : (
          <>
            <p><b>UserName : </b> - {userData.username}</p>
            <p><b>Email : </b> - {userData.email}</p>
            <p><b>Mob.No. : </b> - {userData.phone}</p>
            <p><b>Gender : </b> - {userData.gender}</p>
            <p><b>DOB : </b> - {userData.dob ? new Date(userData.dob).toLocaleDateString() : "N/A"}</p>
            <p><b>Address : </b> - {userData.address}</p>
            <button
              className="btn btn-outline-success"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminProfile;
