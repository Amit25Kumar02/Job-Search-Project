import { useState, useEffect } from 'react';
import axios from 'axios';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/data.css';


const ApplyJob = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get("http://localhost:5200/api/Ajobs/applications");
      console.log("API Response:", data);
      // window.location.reload();

      if (data && Array.isArray(data.applications)) {
        setApplications(data.applications);
      } else {
        console.error("Invalid response structure. Expected an array.");
        setApplications([]);
      }
    } catch (error) {
      toast.error("Failed to fetch applied jobs.", error);
    }
  };

  const deleteApplication = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this?");
  
    if (!isConfirmed) {
      return; // Stop execution if user cancels
    }
    try {
      await axios.delete(`http://localhost:5200/api/Ajobs/del/${id}`);
      setApplications((prevApplications) => prevApplications.filter((app) => app._id !== id));
      toast.success("Application deleted successfully.");
    } catch (error) {
      toast.error("Error deleting application.", error);
    }
  };

  return (
    <>

      <div className="con-d">
        <h1 className="data">Applied Jobs List</h1>
        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <table className="table table-striped ">
            <thead>
              <tr>
                <th scope="col">Applicant Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Job Title</th>
                <th scope="col">Company Name</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.userName}</td>
                  <td>{app.userEmail}</td>
                  <td>{app.Phone}</td>
                  <td>{app.jobId?.jobTitle || "N/A"}</td>
                  <td>{app.jobId?.companyName || "N/A"}</td>
                  <td>
                    <button
                      onClick={() => deleteApplication(app._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer />

    </>
  );
};

export default ApplyJob;
