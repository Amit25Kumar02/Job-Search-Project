import React from 'react';
import { Link } from 'react-router-dom';

const UserServices = () => {
    return (
        <>
            <div className="con-d mt-7">
                <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "800px" }}>
                    <h3 className="text-center mb-4">Our Services for Users</h3>
                    <p className="text-justify">
                        We provide a range of services designed to streamline the hiring process and help businesses connect with top talent.
                        Whether you're a startup or an enterprise, we offer tailored solutions to meet your recruitment needs.
                    </p>

                    <h4 className="text-primary mb-3">For Employers</h4>
                    <ul>
                        <li>
                            <strong>Job Listings:</strong> Explore thousands of job opportunities from top
                            companies across various industries. Filter jobs based on location, experience level, salary, and job type.
                        </li>
                        <li>
                            <strong>Resume Builder:</strong> Create a professional resume using our easy-to-use resume builder. Choose from
                            multiple templates and get suggestions to improve your resume for better visibility.
                        </li>
                        <li>
                            <strong>Job Alerts:</strong> Stay updated with real-time job notifications tailored to your preferences.
                            Get job alerts via email or mobile notifications.
                        </li>
                        <li>
                            <strong> Application Tracking:</strong>Keep track of all your job applications in one place. Know the status
                            of your applications and get updates from employers.
                        </li>
                        <li>
                            <strong>AI-Based Job Matching:</strong> Our intelligent AI system
                            suggests the best job opportunities based on your skills, experience, and preferences.
                        </li>
                        <li>
                            <strong>Career Guidance:</strong> Get expert advice on career growth,
                            resume writing, and interview preparation. Access career-related blogs and video tutorials.
                        </li>
                        <li>
                            <strong>Employer Connections:</strong> Connect directly with employers and recruiters.
                            Attend virtual job fairs and networking events to boost your chances of getting hired.
                        </li>
                        <li>
                            <strong>Skill Assessment Tests:</strong>
                            Take skill assessment tests to showcase your expertise to potential employers. Get certifications that enhance your profile.
                        </li>
                        <li>
                            <strong>Freelance & Remote Jobs:</strong> Find freelance, part-time, and remote job opportunities 
                            that fit your schedule and expertise.
                        </li>
                        <li>
                            <strong>Salary Insights:</strong>Get insights into industry salaries, compare job offers,
                             and make informed decisions about your career growth.
                        </li>
                    </ul>


                    <h5 className="text-center mt-5">
                        Ready to hire top talent? <Link to="/signup" className="text-primary">Sign up</Link> today and start recruiting!
                    </h5>
                </div>
            </div>
        </>
    );
};

export default UserServices;
