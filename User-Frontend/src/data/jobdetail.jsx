import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import './css/JobDetails.css'

const API_URL = 'https://job-search-project-330t.onrender.com';
// const API_URL = "http://localhost:5200";

const JobDetails = () => {
    const [job, setJob] = useState(null);
    const { jobId } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/jobs/det/${jobId}`);
                // console.log("API Response:", response.data);
                if (response.data.success) {
                    setJob(response.data.job);
                } else {
                    toast.error("Job not found");
                }
            } catch (err) {
                toast.error("Error fetching job details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    if (loading) {
        return <div class="d-flex justify-content-center mt-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    }

    if (!job) {
        return <div>Job not found.</div>;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <>
          <div className="job-details-container">
            <div className="job-card shadow">
              <div className="job-card-body">
                <Link to='/userjob' className="back-button">🔙 Back to Jobs</Link>
                <p className="job-posted-date">Published Date{new Date(job.postedAt).toLocaleDateString()}</p>
                <h2 className="job-title">{job.jobTitle}</h2>
                <p className="job-meta job-company">Company: {job.companyName}</p>
                <p className="job-description">{job.jobDescription}</p>
                <p className="job-meta job-location">Location: {job.location}</p>
                <p className="job-meta job-experience">Experience: {job.Experience}</p>
                <p className="job-meta job-salary">Salary: ₹ {job.salary} / PA</p>
                <div className="job-skills">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
                <p className="job-meta job-deadline">Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
                <Link to={`/applybtn/${job._id}`} state={{ job, user }} className="apply-link">
                  <button className="apply-button">Apply Now</button>
                </Link>
              </div>
            </div>
          </div>
        </>
      );
};

export default JobDetails;