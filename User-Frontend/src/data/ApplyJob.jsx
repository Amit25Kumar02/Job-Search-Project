import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const JobApplyForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);
  const [resume, setResume] = useState(null);
  const { job, user } = location.state || {};

  const token = localStorage.getItem("token");

  if (!job || !user) {
    return <h2 className="text-center">Job or User data missing.</h2>;
  }

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleApply = async () => {
    if (!resume) {
      toast.error("Please upload a resume before applying.");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", job._id);
    formData.append("userId", user.Id);
    formData.append("userName", user.username);
    formData.append("userEmail", user.email);
    formData.append("Phone", user.phone);
    formData.append("resume", resume);

    try {
      console.log("hello");
      setApplying(true)
      const response = await axios.post(
        "http://localhost:5200/api/Ajobs/apply",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
        toast.success(response.data.message);
        setApplying(true)
        setTimeout(() => {
          navigate("/userjob");
        }, 2000);
    } catch (error) {
        setApplying(false)
      console.error("Error applying for job:", error.response.data.message);
      alert(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="container mt-5">
          <ToastContainer />
      <h2>Apply for {job.jobTitle}</h2>
      <p>
        <strong>Company : </strong> {job.companyName}
      </p>
      <p>
        <strong>Location : </strong> {job.location}
      </p>
      <p>
        <strong>ApplicantID : </strong> {user.Id}
      </p>
      <p>
        <strong>Applicant : </strong> {user.username}
      </p>
      <p>
        <strong>Email : </strong> {user.email}
      </p>
      <p>
        <strong>Mob. No. : </strong> {user.phone}
      </p>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleResumeChange}
        className="form-control mt-3"
      />
      <button onClick={handleApply} disabled={applying} className="btn btn-success mt-3">
      {applying ? "Submitting.... Application....":"Submit Application"}
      </button>
    </div>
  );
};

export default JobApplyForm;
