import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/data.css';

const API_URL = 'https://job-search-project-330t.onrender.com';
// const API_URL = "http://localhost:5200";

const JobData = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    if (!token) {
      toast.error('Authentication token is missing. Please login.');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/Ajobs/all`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in headers
        },
      });
      const { jobs, success } = response.data;

      if (success) {
        setJobs(jobs || []);
      } else {
        toast.error('Failed to fetch job offers');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs. Please try again.');
    }
  };

  const deleteItem = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this?');
    if (!isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/jobs/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in headers
        },
      });
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
      toast.success('Job deleted successfully.');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Error deleting job.');
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
