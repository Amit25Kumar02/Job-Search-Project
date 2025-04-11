import { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { TbXboxX } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/profile.css";

function UserProfile() {
  const [userData, setUserData] = useState({
    profileImage: null,
    username: "",
    email: "",
    role: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    overview: "",
    title: "",
    rate: "",
    skills: "",
    project: "",
    languages: '',
    // education: [],
  });
  // const [educationData, setEducationData] = useState([]);
  const [education, setEducation] = useState({
    school: "",
    fromDate: "",
    toDate: "",
    degree: "",
    areaOfStudy: "",
    description: "",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [InfoshowModal, setInfoShowModal] = useState(false);
  const [TitleshowModal, setTitleShowModal] = useState(false);
  const [RateshowModal, setRateShowModal] = useState(false);
  const [SkillshowModal, setSkillShowModal] = useState(false);
  const [ProjectshowModal, setProjectShowModal] = useState(false);
  const [EducationshowModal, setEducationShowModal] = useState(false);
  const [LanguagesshowModal, setLanguagesShowModal] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        setPreviewImage(parsedData.profile || "");
         setEducation(parsedData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  // console.log(userData)

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleEduChange = (e) => {
    setEducation({ ...education, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); 
  
        // Update userData with the new image (assuming userData has an 'image' key)
        setUserData((prevUserData) => ({
          ...prevUserData,
          image: reader.result, 
        }));
  
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleSave = async () => {
    setLoading(true);
    let updatedData = { ...userData };
    let updatedEducation = {...education};
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        updatedData.profile = reader.result;
        await saveData(updatedData);
        window.location.reload();
      };
      reader.readAsDataURL(selectedFile);
    } else {
      await saveData(updatedData,updatedEducation);
    }
  };

  const saveData = async (data) => {
    try {
      await axios.post("http://localhost:5200/api/users/ucprofileUpdate", data
        , { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUserData((prev) => ({ ...prev, profileImage: data.imageUrl })); 
      localStorage.setItem("user", JSON.stringify(data));
      setUserData(data);
      setPreviewImage(data.profileImage);
      setSelectedFile(null);
      setIsEditing(false);
      setShowModal(false);
      setInfoShowModal(false);
      setTitleShowModal(false);
      setRateShowModal(false);
      setSkillShowModal(false);
      setProjectShowModal(false);
      setEducationShowModal(false);
      setLanguagesShowModal(false);
      setLoading(false);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to update profile!");
      setLoading(false);
    }
  };
  return (
    <div className="pro-card">
      <h2 className="text-center ">Profile Page</h2>
      <div className="main-div">
        {/* Profile Section */}
        <div className="row">
          <div className="col">
            <div className="p-card d-flex flex-row align-items-center p-3">
              {/* Profile Image & Edit Button */}
              <div className="position-relative">
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Profile" className="profile-img me-3" />
                    <button className="btn-profile" onClick={() => setShowModal(true)}>
                      <LuPencil color="green" />
                    </button>
                  </>
                ) : (
                  <>
                    <p className="profile-img me-3"><p>No Profile Image</p></p>
                    <button className="btn-profile-non" onClick={() => setShowModal(true)}>
                      <LuPencil color="green" />
                    </button>
                  </>
                )}
              </div>
              {/* User Details */}
              <div className="d-flex flex-column">
                <span className="fw-bold">{userData.username}</span>
                <span className="text-muted">
                  <FaMapMarkerAlt size={18} /> {userData.address}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="left-card">

          {/* for user details section */}
          <div className="left-card-details">
            <div className="left-card-left-pro">
              <h5><b>Email:</b> {userData.email}</h5>
              <h5><b>Mob. No.:</b> {userData.phone}</h5>
              <h5><b>Gender:</b> {userData.gender}</h5>
              <h5><b>DOB:</b> {userData.dob ? new Date(userData.dob).toLocaleDateString() : "Not provided"}</h5>
            </div>
            <div className="left-card-right-btn">
              <button className="btn-overview btn-outline-success" onClick={() => setIsEditing(true)}> <LuPencil color="green" /></button>
            </div>
          </div>

          {/* for education section */}
          <div className="left-card-education">
            <div className="left-card-left-pro"><h3>Education</h3>
              <p>{education.school}</p>
              <div className="education-div">
                <span>From : {education.fromDate}</span><span>To : {education.toDate}</span>
              </div>
              <p>{education.degree}</p>
              <p>{education.areaOfStudy}</p>
              <p>{education.description}</p>
            </div>
            <div className="left-card-right-btn">
              <button className="btn-overview" onClick={() => setEducationShowModal(true)}>
                <LuPencil color="green" />
              </button>
            </div>
          </div>

          {/* for language section */}
          <div className="left-card-language">
            <div className="left-card-left-pro"><h3>Languages</h3>
              <p className="language-p" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {userData?.languages
                  ? userData.languages.split(",").map((lang, index) => (
                    <span className="bgskill" key={index}>{lang.trim()}</span>
                  ))
                  : "No languages available"}
              </p>

            </div>
            <div className="left-card-right-btn">
              <button className="btn-overview" onClick={() => setLanguagesShowModal(true)}>
                <LuPencil color="green" />
              </button>
            </div>
          </div>
        </div>
        {/*left side div area end*/}

        {/* for right side div area start*/}
        <div className="right-card">

          {/* for title and rate */}
          <div className="right-card-title">
            <div className="right-card-left">
              <div className="right-card-left-left">
                <h3>{userData.title}</h3>
              </div>
              <div className="right-card-left-right">
                <button className="btn-overview" onClick={() => setTitleShowModal(true)}>
                  <LuPencil color="green" />
                </button>
              </div>
            </div>
            {/* for rate div */}
            <div className="right-card-right">
              <div className="right-card-right-left">
                <h3>$ {userData.rate} /hr</h3>
              </div>
              <div className="right-card-right-right">
                <button className="btn-overview" onClick={() => setRateShowModal(true)}>
                  <LuPencil color="green" />
                </button>
              </div>
            </div>
          </div>
          {/* for profile overview */}
          <div className="right-card-profile">
            <div className="right-card-all-left"><h3>Profile</h3>
              <p>{userData.overview}</p>
            </div>
            <div className="right-card-all-right">
              <button className="btn-overview" onClick={() => setInfoShowModal(true)}>
                <LuPencil color="green" />
              </button>
            </div>
          </div>
          {/* for skills */}
          <div className="right-card-all-skill">
            <div className="right-card-all-skill-left"><h3>Skills</h3>
              <p
                className="right-card-all-skill-left-p"
                style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
              >
                {userData?.skills
                  ? userData.skills.split(",").map((item, index) => (
                    <span className="bgskill" key={index}>
                      {item.trim()}
                    </span>
                  ))
                  : "No skills available"}
              </p>
            </div>
            <div className="right-card-all-skill-right">
              <button className="btn-overview" onClick={() => setSkillShowModal(true)}>
                <LuPencil color="green" />
              </button>
            </div>
          </div>
          {/* for project catalog */}
          <div className="right-card-all-project">
            <div className="right-card-all-left"><h3>Your Project Catalog </h3>
              <p>Projects are a new way to earn on Upwork that helps you do more of the work you love to do.
                Create project offerings that highlight your strengths and attract more clients.</p>
              <p>{userData.project}</p>
            </div>
            <div className="right-card-all-right">
              <button className="btn-overview" onClick={() => setProjectShowModal(true)}>
                <LuPencil color="green" />
              </button>
            </div>
          </div>
        </div>

        {/* right side div end */}

      </div>
      {/* main div end */}

      {/* Modal  start*/}

      {/* modal for profile image */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h5>Update Profile Picture</h5>
            <div className="input-wrapper">
              {previewImage ? (
                <img src={previewImage} alt="Profile Preview" className="profile-img-input" />
              ) : (
                <p className="pro-img-p">No Image Selected</p>
              )}
            </div>
            <div className="input-wrapper-1">
              <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} className="input-t" />
            </div>
            {/* Buttons at bottom-right */}
            <div className="modal-buttons-1">
              <button className="btn btn-outline-danger" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-outline-success" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )
      }

      {/* modal for about profile overview info. */}
      {
        InfoshowModal && (
          <div className="modal-overlay" onClick={() => setInfoShowModal(false)}>
            <div className="modal-card-1" onClick={(e) => e.stopPropagation()}>
              <div className="input-wrapper-2">
                <h1>Profile overview</h1>
                <p>Use this space to show clients you have the skills and experience they're looking for.</p>
                <ul>
                  <li>Describe your strengths and skills</li>
                  <li>Highlight projects, accomplishments and education</li>
                  <li>Keep it short and make sure it's error-free</li>
                </ul>
                <h3>Profile overview</h3>
                <textarea name="overview" placeholder="Profile overview" value={userData.overview} onChange={handleChange} className="text-area-pro"></textarea>
              </div>
              {/* Buttons at bottom-right */}
              <div className="modal-buttons-1">
                <button className="btn btn-outline-danger " onClick={() => setInfoShowModal(false)}>Cancel</button>
                <button className="btn btn-outline-success" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        )
      }

      {/* modal for title info. */}
      {
        TitleshowModal && (
          <div className="modal-overlay" onClick={() => setTitleShowModal(false)}>
            <div className="modal-card-2" onClick={(e) => e.stopPropagation()}>

              <div className="input-wrapper-2">
                <h1>Edit your title</h1>
                <p>Enter a single sentence description of your professional skills/experience (e.g. Expert Web Designer with Ajax experience)</p>

                <h4>Your title</h4>
                <input type="text" name="title" placeholder="Your Title" value={userData.title} onChange={handleChange} className="text-area-title"></input>
              </div>
              {/* Buttons at bottom-right */}
              <div className="modal-buttons">
                <button className="btn btn-outline-danger btn-ss" onClick={() => setTitleShowModal(false)}>Cancel</button>
                <button className="btn btn-outline-success btn-ss" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        )
      }
      {/* modal for price / hrs info. */}
      {
        RateshowModal && (
          <div className="modal-overlay" onClick={() => setRateShowModal(false)}>
            <div className="modal-card-3" onClick={(e) => e.stopPropagation()}>
              <div className="input-wrapper-2">
                <h1>Change hourly rate</h1>
                <p>Please note that your new hourly rate will only apply to new contracts.</p>
                <div className="right-card-right-rate">
                  <h4>Hourly Rate</h4>
                  <input type="number" name="rate" placeholder="Rate/hr" value={userData.rate} onChange={handleChange} className="text-area-rate"></input>
                  {/* <h5>/hr</h5> */}
                </div>
                <h6>Total amount the client will see</h6>
              </div>
              {/* Buttons at bottom-right */}
              <div className="modal-buttons-1">
                <button className="btn btn-outline-danger" onClick={() => setRateShowModal(false)}>Cancel</button>
                <button className="btn btn-outline-success" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        )
      }
      {/* modal for skills info. */}
      {
        SkillshowModal && (
          <div className="modal-overlay" onClick={() => setSkillShowModal(false)}>
            <div className="modal-card-3" onClick={(e) => e.stopPropagation()}>
              <div className="input-wrapper-2">
                <h1>Edit Skills</h1>
                <h4>Skills</h4>
                <input type="text" name="skills" placeholder="Add your Skills" value={userData.skills} onChange={handleChange} className="text-area-title"></input>
              </div>
              {/* Buttons at bottom-right */}
              <div className="modal-buttons-1">
                <button className="btn btn-outline-danger btn-ss" onClick={() => setSkillShowModal(false)}>Cancel</button>
                <button className="btn btn-outline-success btn-ss" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        )
      }
      {/* modal for project catalog */}
      {ProjectshowModal && (
        <div className="modal-overlay" onClick={() => setProjectShowModal(false)}>
          <div className="modal-card-1" onClick={(e) => e.stopPropagation()}>
            <div className="input-wrapper-2">
              <h1>Project overview</h1>
              <p>Use this space to show clients you have the skills and experience they're looking for.</p>
              <ul>
                <li>Highlight projects</li>
                <li>Keep it short and make sure it's error-free</li>
              </ul>
              <h4>Project overview</h4>
              <textarea name="project" placeholder="Project overview" value={userData.project} onChange={handleChange} className="text-area-pro"></textarea>
            </div>
            {/* Buttons at bottom-right */}
            <div className="modal-buttons-1">
              <button className="btn btn-outline-danger" onClick={() => setProjectShowModal(false)}>Cancel</button>
              <button className="btn btn-outline-success " onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )
      }

      {/* modal for languages */}
      {LanguagesshowModal && (
        <div className="modal-overlay" onClick={() => setLanguagesShowModal(false)}>
          <div className="modal-card-3" onClick={(e) => e.stopPropagation()}>
            <div className="input-wrapper-2">
              <h1>Add Language</h1>
              <h4>Languages</h4>
              <input type="text" name="languages" placeholder="Add your Languages" value={userData.languages} onChange={handleChange} className="text-area-title"></input>
            </div>
            {/* Buttons at bottom-right */}
            <div className="modal-buttons-1">
              <button className="btn btn-outline-danger" onClick={() => setLanguagesShowModal(false)}>Cancel</button>
              <button className="btn btn-outline-success" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )
      }

      {/* modal for skills info. */}
      {
        isEditing && (
          <div className="modal-overlay" onClick={() => setIsEditing(false)}>
            <div className="modal-card-1" onClick={(e) => e.stopPropagation()}>
              <div className="input-wrapper-2">
                <h1>Edit Profile</h1>
                <input type="text" placeholder="Enter Your Username" name="username" value={userData.username} onChange={handleChange} className="text-area-title mb-2" />
                <input type="email" name="email" value={userData.email} className="text-area-title mb-2" disabled />
                <input type="text" placeholder="Enter your Mobile No." name="phone" value={userData.phone} onChange={handleChange} className="text-area-title mb-2" />
                <select name="gender" value={userData.gender} onChange={handleChange} className="text-area-title mb-2">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input type="date" name="dob" value={userData.dob} onChange={handleChange} className="text-area-title mb-2" />
                <input type="text" placeholder="Enter your Address" name="address" value={userData.address} onChange={handleChange} className="text-area-title mb-2" />
              </div>
              {/* Buttons at bottom-right */}
              <div className="modal-buttons-1">
                <button className="btn btn-outline-danger " onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="btn btn-outline-success " onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )
      }
      {/* modal for education info. */}
      {
        EducationshowModal && (
          <div className="modal-overlay" onClick={() => setEducationShowModal(false)}>
            <div className="modal-card-e" onClick={(e) => e.stopPropagation()}>
              <div className="education-div">
                {/* <span className="modal-close-btn" onClick={() => setEducationShowModal(false)}>X</span> */}
                <h2>Edit Education</h2>
              </div>
              <div className="input-wrapper-e">
                <h4>School</h4>
                <input type="text" name="school" value={education.school} onChange={handleEduChange} placeholder="Ex: Chandigarh University" className="text-area-title mb-2" />

                <h4>Dates Attended</h4>
                <div>
                  <input type="date" name="fromDate" value={education.fromDate} onChange={handleEduChange} className="text-1 mb-2" />
                  <input type="date" name="toDate" value={education.toDate} onChange={handleEduChange} className="text-2 mb-2" />
                </div>

                <h4>Degree</h4>
                <select name="degree" value={education.degree} onChange={handleEduChange} className="text-area-title mb-2">
                  <option value="">Select Degree</option>
                  <option value="MCA">Master of Computer Applications (MCA)</option>
                  <option value="BTech">Bachelor of Technology (BTech)</option>
                  <option value="MBA">Master of Business Administration (MBA)</option>
                  {/* Add more options as needed */}
                </select>

                <h4>Area of Study</h4>
                <input type="text" name="areaOfStudy" value={education.areaOfStudy} onChange={handleEduChange} placeholder="Ex: Computer Science" className="text-area-title mb-2" />

                <h4>Description (Optional)</h4>
                <textarea name="description" value={education.description} onChange={handleEduChange} className="text-area-pro mb-2"></textarea>
              </div>

              <div className="modal-buttons-2">
                <button className="btn btn-outline-danger " onClick={() => setEducationShowModal(false)}>Cancel</button>
                <button className="btn btn-outline-success " onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        )
      }
      {/* modals end */}
    </div >
    // pro-card div end
  );
}

export default UserProfile;
