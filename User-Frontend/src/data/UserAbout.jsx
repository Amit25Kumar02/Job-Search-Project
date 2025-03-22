import React from 'react';
import NavbarSection from './navbar';
import Footer from './footer';

const UserAboutPage = () => {
  return (
    <>
      <div className="con-d mt-7">
        <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "800px" }}>
          <h3 className="text-center mb-4">About Us</h3>
          <p className="text-justify">
            Welcome to our job portal, where we connect job seekers with top companies looking to hire talented professionals. 
            Our platform offers a wide range of job opportunities across various industries and skill sets. Whether you're looking to 
            advance your career or explore new opportunities, we strive to help you achieve your goals.
          </p>
          <h5>Our Mission</h5>
          <p className="text-justify">
            Our mission is to make the job search process easier and more efficient by providing a user-friendly platform 
            that connects job seekers with the right employers. We are committed to offering a transparent, easy-to-navigate 
            platform where you can discover job openings, apply directly, and manage your career path seamlessly.
          </p>
          <h5>How it Works</h5>
          <ul>
            <li>Browse job listings across various categories and locations.</li>
            <li>Filter jobs by skills, salary, and deadlines to find the perfect fit.</li>
            <li>Apply to jobs directly through our platform with your profile and resume.</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default UserAboutPage;
