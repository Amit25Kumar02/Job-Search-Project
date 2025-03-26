import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function JobOfferForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    location: "",
    salary: "",
    applicationDeadline: "",
    skills: [],
  });

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);

  if (!token) {
    toast.error("Unauthorized! Please log in.", { position: "top-center" });
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "skills" ? value.split(",").map((s) => s.trim()) : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      companyName: "",
      jobTitle: "",
      jobDescription: "",
      location: "",
      salary: "",
      applicationDeadline: "",
      skills: [],
    });
    setEditingJobId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 

    setLoading(true);
    try {
      const url = editingJobId ? `http://localhost:5200/api/jobs/update/${editingJobId}` : `http://localhost:5200/api/jobs/offer`;
      const response = editingJobId
        ? await axios.put(url, formData, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } })
        : await axios.post(url, formData, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } });
      
      if (response.data.success) {
        toast.success(editingJobId ? "Job updated successfully!" : "Job offer submitted successfully!", { position: "top-center" });
        resetForm();
        fetchJobs();
      } else {
        toast.error(response.data.error || "Something went wrong!", { position: "top-center" });
      }
    } catch (err) {
      toast.error("Error connecting to server! " + err.message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`http://localhost:5200/api/jobs/all`,{ headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` } });
      if (response.data.success) {
        setJobs(response.data.jobs);
      } else {
        throw new Error("Failed to fetch job offers");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (job) => {
    setEditingJobId(job._id);
    setFormData({
      ...job,
      skills: job.skills.join(", "), 
    });
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`http://localhost:5200/api/jobs/delete/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Job deleted successfully!");
        fetchJobs();
      } catch (err) {
        toast.error("Failed to delete job: " + err.message);
      }
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="container con-d">
        <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "500px" }}>
          <h3 className="text-center mb-4">{editingJobId ? "Update Job Offer" : "Post a Job Offer"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <textarea name="jobDescription" placeholder="Job Description" value={formData.jobDescription} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <input type="text" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <input type="text" name="skills" placeholder="Skills (comma-separated)" value={formData.skills} onChange={handleChange} className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? (editingJobId ? "Updating..." : "Submitting...") : editingJobId ? "Update Job Offer" : "Submit Job Offer"}
            </button>
          </form>
          <ToastContainer />
        </div>

        <div className="mt-5">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} handleEdit={handleEdit} handleDelete={handleDelete} />
          ))}
        </div>
      </div>
    </>
  );
}

const JobCard = ({ job, handleEdit, handleDelete }) => (
  <div className="card shadow border rounded mb-3">
    <div className="card-body text-start">
      <h3 className="text-primary">{job.companyName}</h3>
      <h5 className="text-dark">{job.jobTitle}</h5>
      <p className="text-muted">{job.jobDescription}</p>
      <p className="text-info">Location: {job.location}</p>
      <p className="text-success">Salary: ₹{job.salary} / PA</p>
      <p className="text-dark">Skills: {job.skills.join(", ")}</p>
      <p className="text-danger">Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
      <button className="btn btn-warning me-2" onClick={() => handleEdit(job)}>Update</button>
      <button className="btn btn-danger" onClick={() => handleDelete(job._id)}>Delete</button>
    </div>
  </div>
);

export default JobOfferForm;
