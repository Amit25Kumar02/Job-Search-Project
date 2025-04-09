import React from 'react';
import Image from '../img/about.jpg';
import ProImg from '../img/bn-1.webp';
import '../css/userAbout.css';

const ClientAboutPage = () => {
  return (
    <>
      <div className="about-container">
        <div className="about-cont-img">
          <div className='dark-overlay'></div>
          <img src={Image} alt="" />
          <div className="about-text">
            <h1>Who We are<br />
              & Our Smart Mission</h1>
          </div>
          <div className="about-text-p">
          <p> Our mission is to make the job search process easier and more efficient by providing a user-friendly platform
            that connects job seekers with the right employers. We are committed to offering a transparent, easy-to-navigate
            platform where you can discover job openings, apply directly, and manage your career path seamlessly.
          </p>
          </div>
        </div>
        <div className="about-con-2">
          <div className="about-con-2-text">
            <h2>Our Mission & Story</h2>
            <p className='text-muted'> Welcome to our job portal, where we connect job seekers with top companies looking to hire talented professionals. 
    Our platform offers a wide range of job opportunities across various industries and skill sets. Whether you're looking to 
    advance your career or explore new opportunities, we strive to help you achieve your goals.    Our mission is to make the job search process easier and more efficient by providing a user-friendly platform 
    that connects job seekers with the right employers. We are committed to offering a transparent, easy-to-navigate 
    platform where you can discover job openings, apply directly, and manage your career path seamlessly.</p>
          </div>
          <div className="about-con-2-img">
            <img src={ProImg} alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientAboutPage;
