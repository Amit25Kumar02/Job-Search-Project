import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

const JobDetails = () => {
    const [job, setJob] = useState(null);
    const { jobId } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5200/api/jobs/det/${jobId}`);
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
        return <div>Loading...</div>;
    }

    if (!job) {
        return <div>Job not found.</div>;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <>
            <div className="card-sec">
                <div className="card shadow mb-4 mt-5">
                    <div className="container card-body text-start  ">
                        <Link to='/user' className="back-btn">🔙</Link>
                        <p className="text-muted">{new Date(job.postedAt).toLocaleDateString()}</p>
                        <h2 className="text-dark">{job.jobTitle}</h2>
                        <p className="text-info">Company: {job.companyName}</p>
                        <p className="text-muted">{job.jobDescription}</p>
                        <p className="text-info">Location: {job.location}</p>
                        <p className="text-success">Salary: ₹ {job.salary} / PA</p>
                        <div className="text-dark gap-5 ">
                            {job.skills.join(' , ')}
                        </div>
                        <p className="text-danger">Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
                        <Link to={`/applybtn/${job._id}`} state={{ job, user }} className="con-btn">
                            <button className="btn btn-primary mt-3">Apply Now</button>
                        </Link>
                    </div>
                </div>
            </div>
 
        </>
    );
};

export default JobDetails;