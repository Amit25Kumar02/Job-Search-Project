import React from 'react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  return (
    <>
      <div className="con-d mt-7">
        <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "800px" }}>
          <h3 className="text-center mb-4">Our Services</h3>
          <p className="text-justify">
            We provide a range of services designed to simplify the job search and hiring process. Whether you're looking for your 
            next career opportunity or hiring for your organization, we have the tools and support to help you succeed.
          </p>

          {/* Job Seeker Services */}
          <h4 className="text-primary mb-3">For Job Seekers</h4>
          <ul>
            <li>
              <strong>Job Search and Application:</strong> Easily browse and search for job opportunities based on your skills, 
              location, and preferences. Apply directly through the platform and track your applications in real-time.
            </li>
            <li>
              <strong>Resume Builder:</strong> Use our resume builder tool to create and update your professional resume with ease.
            </li>
            <li>
              <strong>Job Alerts:</strong> Set up job alerts to receive notifications for new job listings that match your profile.
            </li>
            <li>
              <strong>Career Resources:</strong> Access valuable resources, tips, and guides on interview preparation, resume writing, 
              and career advancement.
            </li>
          </ul>

          {/* Employer Services */}
          <h4 className="text-primary mb-3">For Employers</h4>
          <ul>
            <li>
              <strong>Post Job Openings:</strong> Easily create and post job offers to attract top talent. Specify requirements, 
              salary, location, and skills.
            </li>
            <li>
              <strong>Applicant Tracking System:</strong> Use our applicant tracking system to review resumes, manage applicants, 
              and streamline the hiring process.
            </li>
            <li>
              <strong>Advanced Filtering:</strong> Filter and search candidates based on skills, experience, and qualifications 
              to find the perfect fit for your team.
            </li>
            <li>
              <strong>Employer Branding:</strong> Build your company's brand with a complete company profile showcasing your 
              values, culture, and mission to attract the right candidates.
            </li>
          </ul>

          {/* Additional Services */}
          <h4 className="text-primary mb-3">Additional Services</h4>
          <ul>
            <li>
              <strong>Job Matching:</strong> We offer job matching services to recommend the best-fit candidates for your open 
              positions based on their skills and experience.
            </li>
            <li>
              <strong>Employee Onboarding:</strong> For employers, we offer tools and resources to streamline your onboarding 
              process, ensuring smooth transitions for new hires.
            </li>
          </ul>

          <h5 className="text-center mt-5">
            Ready to explore new opportunities? <Link to="/signup" className="text-primary">Sign up</Link> today and start your journey!
          </h5>
        </div>
      </div>
    </>
  );
};

export default ServicesPage;
