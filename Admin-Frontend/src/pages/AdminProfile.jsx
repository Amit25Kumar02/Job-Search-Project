import { useEffect, useState } from "react";

function AdminProfile() {
  const [userData, setUserData] = useState({
    id: "",
    username: "",
    email: "",
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
        <p><strong>ID:</strong> - {userData._id}</p>
        </div>
        <div className="mb-3">
        <p><b>Name : </b> - {userData.username}</p>
        </div>
        <div className="mb-3">
        <p><strong>Email : </strong> - {userData.email}</p>
        </div>
        {/* <div className="mb-3">
        <p><strong>Mob. No. : </strong> - {userData.}</p>
        </div> */}
      </div>
    </div>
  );
}

export default AdminProfile;
