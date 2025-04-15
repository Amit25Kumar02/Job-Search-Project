import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/addJob.css";
import UserImg from './css/img/lg-product_page-7.png';

const API_URL = 'https://job-search-project-330t.onrender.com';
// const API_URL = "http://localhost:5200";

function JobOfferForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    location: "",
    salary: "",
    applicationDeadline: "",
    skills: "",
    Experience: "",
  });

  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  if (!token) {
    toast.error("Unauthorized! Please log in.", { position: "top-center" });
    return <Navigate to="/login" />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/jobs/all`);
      if (response.data.success) {
        setJobs(response.data.jobs);
      } else {
        throw new Error("Failed to fetch job offers");
      }
    } catch (err) {
      toast.error("Error fetching jobs: " + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: "",
      jobTitle: "",
      jobDescription: "",
      location: "",
      salary: "",
      applicationDeadline: "",
      skills: "",
      Experience: "",
    });
    setEditingJobId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingJobId
        ? `${API_URL}/api/jobs/update/${editingJobId}`
        : `${API_URL}/api/jobs/offer`;
      const response = editingJobId
        ? await axios.put(url, formData, { headers: { Authorization: `Bearer ${token}` } })
        : await axios.post(url, formData, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data.success) {
        toast.success(editingJobId ? "Job updated successfully!" : "Job offer submitted successfully!", { position: "top-center" });
        fetchJobs();
        setShowModal(false);
        resetForm();
      } else {
        toast.error(response.data.error || "Something went wrong!", { position: "top-center" });
      }
    } catch (err) {
      toast.error("Error connecting to server! " + err.message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJobId(job._id);
    setFormData({
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      jobDescription: job.jobDescription,
      location: job.location,
      salary: job.salary,
      applicationDeadline: job.applicationDeadline,
      skills: job.skills.join(", "),
      Experience: job.Experience,
    });
    setShowModal(true);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${API_URL}/api/jobs/delete/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Job deleted successfully!");
        fetchJobs();
      } catch (err) {
        toast.error("Failed to delete job: " + err.message);
      }
    }
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="container-main-job">
      <div className="dark-overlay-img1" />
      <div className="img-div1">
        <img src={UserImg} className="client-img" alt="Job Search" />
        <div className="text-overlay-1">
          <div className="btn-job">
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
              Add New Job
            </button>
          </div>
          <h1 className="fw-bold mt-2 text-center">
            Connecting Talent with <br />Opportunity
          </h1>
        </div>
      </div>

      <ToastContainer />

      {showModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingJobId ? "Update Job Offer" : "Post a Job Offer"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className="form-control mb-2" />
                  <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} className="form-control mb-2" />
                  <textarea name="jobDescription" placeholder="Job Description" value={formData.jobDescription} onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })} className="form-control mb-2" />
                  <input type="text" name="location" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="form-control mb-2" />
                  <input type="text" name="Experience" placeholder="Experience" value={formData.Experience} onChange={(e) => setFormData({ ...formData, Experience: e.target.value })} className="form-control mb-2" />
                  <input type="text" name="salary" placeholder="Salary" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className="form-control mb-2" />
                  <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })} className="form-control mb-2" />
                  <input type="text" name="skills" placeholder="Skills (comma-separated)" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} className="form-control mb-2" />
                  <button type="submit" className="btn btn-primary addjob-btn" disabled={loading}>
                    {loading ? (editingJobId ? "Updating..." : "Submitting...") : editingJobId ? "Update Job Offer" : "Submit Job Offer"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="job-list mt-2">
        {jobs.map((job) => (
          <div key={job._id} className="card-2 shadow border rounded mb-3 job-card-1">
            <div className="card-body text-start">
              <h3 >👎{job.dislikes}  👍{job.likes}</h3>
              <h3 >{job.companyName}</h3>
              <h5 >{job.jobTitle}</h5>

              <p >
                {expandedDescriptions[job._id]
                  ? job.jobDescription
                  : job.jobDescription?.substring(0, 150) + (job.jobDescription.length > 150 ? "..." : "")}
                {job.jobDescription.length > 150 && (
                  <button className="btn btn-link p-0 ps-2" onClick={() => toggleDescription(job._id)}>
                    {expandedDescriptions[job._id] ? "See Less" : "See More"}
                  </button>
                )}
              </p>

              <p>Location: {job.location}</p>
              <p>Experience: {job.Experience}</p>
              <p>Salary: ₹{job.salary} / PA</p>
              <p>Skills: {job.skills.join(", ")}</p>
              <p>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
              <button className="btn btn-warning me-2" onClick={() => handleEdit(job)}>Update</button>
              <button className="btn btn-danger" onClick={() => handleDelete(job._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobOfferForm;
