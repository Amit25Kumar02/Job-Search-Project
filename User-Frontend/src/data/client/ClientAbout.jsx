import React from 'react';
import Image from '../img/about.jpg';
import ProImg from '../img/bn-1.webp';
import '../css/userAbout.css';
import AmitImg from '../img/Amit_Photo.jpg'

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
            <p>Our mission is to simplify job searching by connecting seekers with the right employers through a transparent and user-friendly platform.
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
        <div className="main-team-card  shadow-lg p-4 mx-auto mt-5">
          <div className="team-card-text">
            <h2>Meet Our Team</h2>
            <p> Professional & Dedicated Team</p>
          </div>
          <div className="team-card">
            <div className="card1 shadow-lg p-4 mx-auto">
              <img src={AmitImg} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Amit Kumar</h5>
                <p className="card-text">Co-Founder & CEO</p>
              </div>
            </div>
            <div className="card1 shadow-lg p-4 mx-auto">
              <img src={AmitImg} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Amit Kumar</h5>
                <p className="card-text">Web Developer</p>
              </div>
            </div>
            <div className="card1 shadow-lg p-4 mx-auto">
              <img src={AmitImg} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Amit Kumar</h5>
                <p className="card-text">Content Writer</p>
              </div>
            </div>
            <div className="card1 shadow-lg p-4 mx-auto">
              <img src={AmitImg} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Amit Kumar</h5>
                <p className="card-text">Web Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientAboutPage;
