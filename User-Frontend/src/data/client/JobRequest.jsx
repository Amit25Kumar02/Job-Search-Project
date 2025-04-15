import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/jobRequest.css';

const API_URL = 'https://job-search-project-330t.onrender.com';
// const API_URL = "http://localhost:5200"


const JobRequest = () => {
  const [applications, setApplications] = useState([]);
  const [expandedProposals, setExpandedProposals] = useState({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/Ajobs/applications`);
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

  const deleteApplication = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this?");
    if (!isConfirmed) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/api/Ajobs/del/${id}`);
      setApplications((prevApplications) => prevApplications.filter((app) => app._id !== id));
      toast.success("Application deleted successfully.");
    } catch (error) {
      toast.error("Error deleting application.", error);
    }
  };

  const toggleProposal = (id) => {
    setExpandedProposals((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
        <div className="con-job-r">
          <h1 className="text-j">Applied Jobs</h1>
          {applications?.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <div className=" con-job-a ">
              {applications?.map((app) => {
                const isExpanded = expandedProposals[app._id];
                return (
                  <div key={app._id} className="card shadow-lg m-3 w-100">
                    <div className="card-body">
                      <p><strong>Job Title: </strong>{app.jobId?.jobTitle}</p>
                      <p><strong>Company Name: </strong>{app.jobId?.companyName}</p>
                      <strong>Applied by: <b>{app.userName}</b></strong>
                      <p><b>Email: </b>{app.userEmail}</p>
                      <p><b>Mob. No.: </b>{app.Phone}</p>
                      <p><b>Applied At: </b>{new Date(app.appliedAt).toLocaleDateString()}</p>

                      {/* Proposal with See More/Less */}
                      <p>
                        <b>Proposal: </b>
                        {isExpanded ? app.proposal : `${app.proposal.substring(0, 150)}...`}
                        {app.proposal.length > 150 && (
                          <button
                            onClick={() => toggleProposal(app._id)}
                            className="btn btn-link p-0"
                          >
                            {isExpanded ? " See Less" : " See More"}
                          </button>
                        )}
                      </p>

                      <div className="btn-rd">
                        <a href={app.resume} target="_blank" rel="noopener noreferrer" className="btn btn-outline-success">
                          See Resume
                        </a>
                        <button onClick={() => deleteApplication(app._id)} className="btn btn-outline-danger">Delete</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      <ToastContainer />
    </>
  );
};

export default JobRequest;
