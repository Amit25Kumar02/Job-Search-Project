import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/addJob.css"; // Ensure this CSS file exists

function JobOfferForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    location: "",
    salary: "",
    applicationDeadline: "",
    skills: "",
  });

  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);

  if (!token) {
    toast.error("Unauthorized! Please log in.", { position: "top-center" });
    return <Navigate to="/login" />;
  }

  // Fetch jobs from the API
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5200/api/jobs/all");
      if (response.data.success) {
        setJobs(response.data.jobs); // Make sure the response contains a 'jobs' array
      } else {
        throw new Error("Failed to fetch job offers");
      }
    } catch (err) {
      toast.error("Error fetching jobs: " + err.message);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      companyName: "",
      jobTitle: "",
      jobDescription: "",
      location: "",
      salary: "",
      applicationDeadline: "",
      skills: "",
    });
    setEditingJobId(null);
  };

  // Handle form submission (add or edit job)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingJobId
        ? `http://localhost:5200/api/jobs/update/${editingJobId}`
        : `http://localhost:5200/api/jobs/offer`;
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

  // Handle editing a job offer
  const handleEdit = (job) => {
    setEditingJobId(job._id); // Set job ID for editing
    setFormData({
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      jobDescription: job.jobDescription,
      location: job.location,
      salary: job.salary,
      applicationDeadline: job.applicationDeadline,
      skills: job.skills.join(", "), // Convert skills array to comma-separated string
    });
    setShowModal(true);
  };

  // Handle deleting a job offer
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

  return (
    <div className="container-main-job">
      <div className="btn-job">
      <button className="btn btn-primary add-job-btn mb-3"
        onClick={() => { resetForm(); setShowModal(true); }}>
        Add New Job
      </button>
      </div>
      <ToastContainer />

      {/* Modal with CSS Animation */}
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
                  <input type="text" name="salary" placeholder="Salary" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className="form-control mb-2" />
                  <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })} className="form-control mb-2" />
                  <input type="text" name="skills" placeholder="Skills (comma-separated)" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} className="form-control mb-2" />
                  <button type="submit" className="btn btn-primary addjob-btn " disabled={loading}>
                    {loading ? (editingJobId ? "Updating..." : "Submitting...") : editingJobId ? "Update Job Offer" : "Submit Job Offer"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Job List */}
      <div className="job-list mt-2">
        {jobs.map((job) => (
          <div key={job._id} className="card shadow border rounded mb-3">
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
        ))}
      </div>
    </div>
  );
}

export default JobOfferForm;
