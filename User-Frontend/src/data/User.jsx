import { useEffect, useState } from "react";
import axios from "axios";
import './css/userMain.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Heart } from 'lucide-react';
import { SlLike } from "react-icons/sl";
import UserImg from './img/slider-2.jpg';
import UserImg2 from './img/video-bg.webp';

// const API_URL = 'https://job-search-project-330t.onrender.com';
const API_URL = "http://localhost:5200";


const User = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [showSavedJobs, setShowSavedJobs] = useState(false);
  const [dislikeCounts, setDislikeCounts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [dislikedJobs, setDislikedJobs] = useState(new Set());
  const [likedJobs, setLikedJobs] = useState(new Set());

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/jobs/all`);
        if (response.data.success) {
          const currentDate = new Date();
          const validJobs = response.data.jobs.filter(
            (job) => new Date(job.applicationDeadline) >= currentDate
          );
          setJobs(validJobs);
          setFilteredJobs(validJobs);

          const initialDislikeCounts = {};
          const initialLikeCounts = {};
          validJobs.forEach((job) => {
            initialDislikeCounts[job._id] = job.dislikes || 0;
            initialLikeCounts[job._id] = job.likes || 0;
          });

          setDislikeCounts(initialDislikeCounts);
          setLikeCounts(initialLikeCounts);
        } else {
          toast.error("Failed to fetch job offers");
        }
      } catch (err) {
        toast.error("Error fetching jobs", err);
      }
    };

    fetchJobs();

    const savedJobsFromLocalStorage = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(savedJobsFromLocalStorage);

    const savedLikedJobs = JSON.parse(localStorage.getItem("LikedJobs")) || [];
    const savedDislikedJobs = JSON.parse(localStorage.getItem("DislikedJobs")) || [];

    setLikedJobs(new Set(savedLikedJobs));
    setDislikedJobs(new Set(savedDislikedJobs));

    // const interval = setInterval(fetchJobs, 1000);
    // return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  
    const searchValue = value.toLowerCase().trim();
    if (searchValue === "") {
      setFilteredJobs(jobs);
      return;
    }
    const filtered = jobs.filter(
      (job) =>
        job.companyName.toLowerCase().includes(searchValue) ||
        job.jobTitle.toLowerCase().includes(searchValue) ||
        job.location.toLowerCase().includes(searchValue) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchValue))
    );
    setFilteredJobs(filtered);
  };
  

  const handleSaveJob = (job) => {
    setSavedJobs((prev) => {
      const updatedSavedJobs = prev.some((savedJob) => savedJob._id === job._id)
        ? prev.filter((savedJob) => savedJob._id !== job._id)
        : [...prev, job];

      localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs));
      return updatedSavedJobs;
    });
  };

  // for dislike btn
  const handleDislike = async (jobId) => {
    const updatedDislikedJobs = new Set(dislikedJobs);
  
    if (dislikedJobs.has(jobId)) {
      // Remove dislike (undo)
      try {
        const response = await axios.post(`${API_URL}/api/jobs/undislike`, { jobId });
  
        if (response.data.success) {
          updatedDislikedJobs.delete(jobId);
          setDislikedJobs(updatedDislikedJobs);
          setDislikeCounts((prevCounts) => ({
            ...prevCounts,
            [jobId]: response.data.updatedDislikeCount,
          }));
  
          localStorage.setItem("DislikedJobs", JSON.stringify([...updatedDislikedJobs]));
          toast.info("You removed your dislike.");
        } else {
          toast.error("Failed to remove dislike.");
        }
      } catch (error) {
        toast.error("Error removing dislike.", error);
      }
    } else {
      // Dislike the job
      try {
        const response = await axios.post(`${API_URL}/api/jobs/dislike`, { jobId });
  
        if (response.data.success) {
          updatedDislikedJobs.add(jobId);
          setDislikedJobs(updatedDislikedJobs);
          setDislikeCounts((prevCounts) => ({
            ...prevCounts,
            [jobId]: response.data.updatedDislikeCount,
          }));
  
          localStorage.setItem("DislikedJobs", JSON.stringify([...updatedDislikedJobs]));
          toast.warning("You disliked this job.");
        } else {
          toast.error("Failed to dislike job.");
        }
      } catch (error) {
        toast.error("Error disliking job.", error);
      }
    }
  };

  // for like btn

  const handleLike = async (jobId) => {
    const updatedLikedJobs = new Set(likedJobs);
  
    if (likedJobs.has(jobId)) {
      // Unlike the job
      try {
        const response = await axios.post(`${API_URL}/api/jobs/unlike`, { jobId });
  
        if (response.data.success) {
          updatedLikedJobs.delete(jobId);
          setLikedJobs(updatedLikedJobs);
          setLikeCounts((prevCounts) => ({
            ...prevCounts,
            [jobId]: response.data.updatedLikeCount,
          }));
  
          localStorage.setItem("LikedJobs", JSON.stringify([...updatedLikedJobs]));
          toast.info("You unliked this job.");
        } else {
          toast.error("Failed to unlike job.");
        }
      } catch (error) {
        toast.error("Error unliking job.", error);
      }
    } else {
      // Like the job
      try {
        const response = await axios.post(`${API_URL}/api/jobs/like`, { jobId });
  
        if (response.data.success) {
          updatedLikedJobs.add(jobId);
          setLikedJobs(updatedLikedJobs);
          setLikeCounts((prevCounts) => ({
            ...prevCounts,
            [jobId]: response.data.updatedLikeCount,
          }));
  
          localStorage.setItem("LikedJobs", JSON.stringify([...updatedLikedJobs]));
          toast.success("You liked this job.");
        } else {
          toast.error("Failed to like job.");
        }
      } catch (error) {
        toast.error("Error liking job.", error);
      }
    }
  };
  
  const toggleSavedJobs = () => {
    // if (!savedJobs) {
    //   toast.success("You saved this job."); // Saving
    // } else {
    //   toast.info("You unsaved this job."); // Unsaving
    // }

    // setSavedJobs(!savedJobs); // Toggle saved state
    setShowSavedJobs(!showSavedJobs);
  };
    

  return (
    <>
    <ToastContainer position="top-center" reverseOrder={false}/>
      <div className="car-1">
        <div className="user-main-img-div">
          <img src={UserImg} alt="" />
        </div>
        <div className="user-main-text-div">
          <h1 className="user-main-text-1st-h1">Find</h1>
          <h1 className="user-main-text-2nd-h1">Great Job Opportunity<br />You Deserve</h1>

          <div className="input-group">
            <input
              type="search"
              placeholder="Search jobs..."
              value={query}
              onChange={handleInputChange}
              className="form-control"
            />
            <button className="btn btn-outline-success" >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <button className="btn btn-info mt-3" onClick={toggleSavedJobs}>
          {showSavedJobs ? "Show All Jobs" : "Show Saved Jobs"}
        </button>
      </div>

      <div className="container mt-4">
        <h2 className="text-dark mb-4">{showSavedJobs ? "Saved Jobs" : "Jobs you might like"}</h2>
        {(showSavedJobs ? savedJobs : filteredJobs).map((job) => (
          <div key={job._id} className="card-2 shadow mb-4 con-card">
            <div className="card-body text-start d-flex align-items-center ms-auto ">
              <button onClick={() => handleDislike(job._id)} className="btn-1 me-2">
                👎 {dislikeCounts[job._id] || job.dislikes}
              </button>
              <button onClick={() => handleLike(job._id)} className="btn-1 me-2">
                👍 {likeCounts[job._id] || job.likes}
              </button>
              <button onClick={() => handleSaveJob(job)} className="btn-1">
                <Heart fill={savedJobs.some((savedJob) => savedJob._id === job._id) ? 'red' : 'none'}
                  color={savedJobs.some((savedJob) => savedJob._id === job._id) ? 'red' : 'black'} />
              </button>
            </div>
            <Link to={`/apply/${job._id}`} className="con-btn">
              <div className="card-body text-start">
              <p className="text-primary">Posted At : {new Date(job.postedAt).toLocaleDateString()}</p>
                <h5 className="text-dark">{job.jobTitle}</h5>
                <p className="text-muted">{job.jobDescription}</p>
                <p className="text-info">Location: {job.location}</p>
                {/* <p className="text-info">Experience: {job.Experience}</p> */}
                <p className="text-success">Salary: ₹ {job.salary} / PA</p>
                <div className="text-dark gap-5 ">
                  <span> {job.skills.join(' , ')}</span>
                </div>
                <p className="text-danger">Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="car-2">
          <div className="dark-overlay5-img"/>
        <div className="user-main-img2-div">
          <img src={UserImg2} alt="" />
        </div>
        <div className="user-main-text2-div">
          <h1 className="user-main-text2-1st-h1">Are You Already Working<br/> With Us?</h1>

        </div>
      </div>
    </>
  );
};

export default User;
