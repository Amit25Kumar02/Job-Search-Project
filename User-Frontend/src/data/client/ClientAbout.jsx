import React from 'react';

const ClientAboutPage = () => {
  return (
    <>
      <div className="con-d mt-7">
        <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "800px" }}>
          <h3 className="text-center mb-4">About Us</h3>
          <p className="text-justify">
            Welcome to our employer portal, where businesses can find and hire top talent. Our platform allows you to post job 
            offers, manage applicants, and build a team of skilled professionals. Whether you're a startup or an established 
            company, we provide the tools you need to hire the best candidates.
          </p>
          <h5>Our Mission</h5>
          <p className="text-justify">
            Our mission is to streamline the hiring process by providing employers with a simple and effective platform to 
            post job openings and connect with qualified candidates. We are committed to helping businesses find the right 
            talent quickly and efficiently.
          </p>
          <h5>How it Works</h5>
          <ul>
            <li>Create a company profile and post job offers.</li>
            <li>Browse through applications and review candidate profiles.</li>
            <li>Connect with candidates via messages and arrange interviews.</li>
            <li>Manage your hiring process from start to finish on our platform.</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ClientAboutPage;
