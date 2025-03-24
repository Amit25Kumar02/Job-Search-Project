import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CarouselImage from "./user-img/1735987411225.jpg";
import CarouselImage1 from "./user-img/240_F_283636229_M3E2FdyD2W6xIsZjKeXx1NeF2ExxKMTW.jpg";
import CarouselImage2 from "./user-img/gettyimages-956327810-612x612.jpg";
import { Heart } from 'lucide-react';

const User = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [dislikeCounts, setDislikeCounts] = useState({});
  const [showSavedJobs, setShowSavedJobs] = useState(false);
  const [dislikedJobs, setDislikedJobs] = useState(new Set());

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5200/api/jobs/all");
        if (response.data.success) {
          const currentDate = new Date();
          const validJobs = response.data.jobs.filter(
            (job) => new Date(job.applicationDeadline) >= currentDate
          );
          setJobs(validJobs);
          setFilteredJobs(validJobs);

          const initialDislikeCounts = {};
          validJobs.forEach((job) => {
            initialDislikeCounts[job._id] = 0;
            // window.location.reload();
          });
          setDislikeCounts(initialDislikeCounts);
        } else {
          toast.error("Failed to fetch job offers");
        }
      } catch (err) {
        toast.error("Error fetching jobs", err);
      }
    };

    fetchJobs();

    // Load saved jobs from localStorage
    const savedJobsFromLocalStorage = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(savedJobsFromLocalStorage);
  }, []);

  const handleInputChange = (e) => setQuery(e.target.value);

  const handleSearch = () => {
    const searchValue = query.toLowerCase().trim();
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
        
      // Save the updated saved jobs to localStorage
      localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs));
      return updatedSavedJobs;
    });
  };

  
  const handleDislike = (jobId) => {
    if (!dislikedJobs.has(jobId)) {
      setDislikeCounts((prevCounts) => ({
        ...prevCounts,
        [jobId]: (prevCounts[jobId] || 0) + 1,
      }));
  
      setDislikedJobs((prevDislikedJobs) => new Set(prevDislikedJobs).add(jobId));
    }
  };
  

  const toggleSavedJobs = () => setShowSavedJobs(!showSavedJobs);

  return (
    <>
      <div className="car-1">
        <div id="jobCarousel" className="carousel slide mt-5" data-bs-ride="carousel">
          <div className="carousel-inner">
            {[CarouselImage, CarouselImage1, CarouselImage2].map((image, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <img src={image} className="d-block w-100 rounded-lg" alt={`Slide ${index + 1}`} style={{ height: "300px" , borderRadius: "5px"}} />
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#jobCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#jobCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      <div className="container mt-4">
        <div className="input-group">
          <input
            type="search"
            placeholder="Search jobs..."
            value={query}
            onChange={handleInputChange}
            className="form-control"
          />
          <button className="btn btn-outline-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
        <button className="btn btn-info mt-3" onClick={toggleSavedJobs}>
          {showSavedJobs ? "Show All Jobs" : "Show Saved Jobs"}
        </button>
      </div>

      <div className="container mt-4">
        <h2 className="text-dark mb-4">{showSavedJobs ? "Saved Jobs" : "Jobs you might like"}</h2>
        {(showSavedJobs ? savedJobs : filteredJobs).map((job) => (
          <div key={job._id} className="card shadow mb-4 con-card">
            <div className="card-body text-start d-flex align-items-center ms-auto ">
              <button onClick={() => handleDislike(job._id)} className="btn-1 me-2">
                👎 {dislikeCounts[job._id] || 0}
              </button>
              <button onClick={() => handleSaveJob(job)} className="btn-1">
                <Heart fill={savedJobs.some((savedJob) => savedJob._id === job._id) ? 'red' : 'none'}
                  color={savedJobs.some((savedJob) => savedJob._id === job._id) ? 'red' : 'black'} />
              </button>
            </div>
            <Link to={`/apply/${job._id}`} className="con-btn">
              <div className="card-body text-start">
                <p className="text-muted">{new Date(job.postedAt).toLocaleDateString()}</p>
                <h5 className="text-dark">{job.jobTitle}</h5>
                <p className="text-muted">{job.jobDescription}</p>
                <p className="text-info">Location: {job.location}</p>
                <p className="text-success">Salary: ₹ {job.salary} / PA</p>
                <div className="text-dark gap-5 ">
                  {job.skills.join(' , ')}
                </div>
                <p className="text-danger">Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default User;
