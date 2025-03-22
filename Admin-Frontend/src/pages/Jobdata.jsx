import { useState, useEffect } from 'react';
import axios from 'axios';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/data.css';


const JobData = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get("http://localhost:5200/api/jobs/all");
      console.log("API Response:", data);
      setJobs(Array.isArray(data) ? data : data.jobs || []);
      // window.location.reload();
    } catch (error) {
      toast.error("Failed to fetch jobs.",error);
    }
  };
  

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5200/api/jobs/delete/${id}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
      toast.success("Job deleted successfully.");
    } catch (error) {
      toast.error("Error deleting job.",error);
    }
  };

  return (
    <>
    
      <div className="con-d">
        <h1 className="data">Job List</h1>
        {jobs.length === 0 ? (
          <p>No jobs available.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Company Name</th>
                <th scope="col">Job Title</th>
                <th scope="col">City</th>
                <th scope="col">Salary</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.companyName}</td>
                  <td>{job.jobTitle}</td>
                  <td>{job.location}</td>
                  <td>{job.salary}</td>
                  <td>
                    <button
                      onClick={() => deleteItem(job._id)}
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

export default JobData;
