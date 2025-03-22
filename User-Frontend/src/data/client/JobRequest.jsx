import { useState, useEffect } from "react";
import axios from "axios";

const JobRequest = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get("http://localhost:5200/api/Ajobs/applications");
      if (data && Array.isArray(data.applications)) {
        setApplications(data.applications);
      } else {
        console.error("Invalid response structure. Expected an array.");
        setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      setApplications([]); 
    }
  };

  return (
    <>
      <div className="con-d">
        <h1 className="text-j">Applied Jobs</h1>
        {applications?.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="d-flex flex-wrap justify-content-around mt-4">
            {applications?.map((app) => (
              <div key={app._id} className="card shadow-lg m-3" style={{ width: "300px" }}>
                <div className="card-body">
                  <strong>Job Title: {app.jobId?.jobTitle}</strong>
                  <br />
                  <strong>Company Name: {app.jobId?.companyName}</strong>
                  <br />
                  <strong>Applied by:</strong>
                  <p><b>Name: </b>{app.userName}</p>
                  <p><b>Email: </b>{app.userEmail}</p>
                  <p><b>Mob. No.: </b>{app.Phone}</p>
                  <a href={app.resume} target="_blank" rel="noopener noreferrer" className="btn btn-outline-success">
                    See Resume
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default JobRequest;
