import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import './css/JobApply.css';

const API_URL = 'https://job-search-project-330t.onrender.com';
// const API_URL = "http://localhost:5200";

const JobApplyForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { jobId } = useParams();
    const { job, user } = location.state || {};
    
    const [resume, setResume] = useState(null);
    const [proposal, setProposal] = useState("");
    const [hasApplied, setHasApplied] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if user has already applied for this job
        const checkApplication = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/Ajobs/check-application`, {
                    params: {
                        jobId: jobId || job?._id,
                        userId: user?._id
                    }
                });
                setHasApplied(response.data.hasApplied);
            } catch (error) {
                console.error("Error checking application:", error);
            }
        };

        if (user?._id && (jobId || job?._id)) {
            checkApplication();
        }
    }, [jobId, job?._id, user?._id]);

    if (!job && !jobId) {
        return <h2 className="text-center">Job data missing.</h2>;
    }

    if (!user) {
        return <h2 className="text-center">User data missing.</h2>;
    }

    if (hasApplied) {
        return (
            <div className="job-apply-container">
                <div className="application-card">
                    <h2 className="application-header">Already Applied</h2>
                    <p>You have already applied for this position.</p>
                    <button 
                        className="submit-button" 
                        onClick={() => navigate("/userjob")}
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    const handleResumeChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleProposalChange = (e) => {
        setProposal(e.target.value);
    };

    const handleApply = async () => {
        if (!resume) {
            toast.error("Please upload a resume before applying.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("jobId", job?._id || jobId);
        formData.append("userId", user._id);
        formData.append("userName", user.username);
        formData.append("userEmail", user.email);
        formData.append("Phone", user.phone);
        formData.append("proposal", proposal);
        formData.append("resume", resume);

        try {
            const response = await axios.post(`${API_URL}/api/Ajobs/apply`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                toast.success("Application submitted successfully!");
                setTimeout(() => {
                    navigate("/userjob");
                }, 2000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error applying for job:", error);
            if (error.response?.data?.message === "You have already applied for this job") {
                setHasApplied(true);
                toast.error("You have already applied for this job");
            } else {
                toast.error("Failed to submit application");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="job-apply-container">
            <div className="application-card">
                <h2 className="application-header">Apply for {job?.jobTitle}</h2>
                
                <div className="applicant-info">
                    <p className="info-item company-info"><strong>Company:</strong> {job?.companyName}</p>
                    <p className="info-item location-info"><strong>Location:</strong> {job?.location}</p>
                    <p className="info-item applicant-name"><strong>Applicant:</strong> {user.username}</p>
                    <p className="info-item contact-info"><strong>Email:</strong> {user.email}</p>
                    <p className="info-item contact-info"><strong>Mobile:</strong> {user.phone}</p>
                </div>

                <div className="upload-resume">
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeChange}
                        className="resume-input"
                        required
                    />
                </div>

                <label className="proposal-label">Describe your proposal</label>
                <textarea
                    name="proposal"
                    placeholder="What makes you the best candidate for this project?"
                    className="proposal-textarea"
                    value={proposal}
                    onChange={handleProposalChange}
                    required
                />

                <button 
                    onClick={handleApply} 
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit Application"}
                </button>
            </div>
        </div>
    );
};

export default JobApplyForm;