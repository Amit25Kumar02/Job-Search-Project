import { useEffect, useState } from "react";

function UserProfile() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    role: ""
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUserData(JSON.parse(userData));
    }
  }, []); 


  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="card p-4" style={{ width: "400px" }}>
      <h2 className="text-center mb-4">Profile Page</h2>
      <div className="mb-3">
      <p><b>UserID : </b> - {userData.Id}</p>
      </div>
      <div className="mb-3">
      <p><b>Username : </b> - {userData.username}</p>
      </div>
      <div className="mb-3">
      <p><strong>Email : </strong> - {userData.email}</p>
      </div>
      <div className="mb-3">
      <p><strong>Mob. No. : </strong> - {userData.phone}</p>
      </div>
      <div className="mb-3">
      <p><strong>Role:</strong> - {userData.userType}</p>
      </div>
    </div>
  </div>
  );
}

export default UserProfile;
