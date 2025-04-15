// import { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from "./img/pngtree-top-view-working-desk-with-keyboard-mouse-and-notebook-on-white-picture-image_15719793.jpg";
import './css/userHome.css'
import logoImg1 from "./img/abstract-building-logo-company-name-simple-logos-icons-illustrations-symbols_1375031-976-removebg-preview.png"
import logoImg2 from "./img/GitLab_logo.svg.png"
import logoImg3 from "./img/box-with-ladder-logo-design_26758-1233-removebg-preview.png"
import logoImg4 from "./img/group-people-with-data-logo-design_26758-1288-removebg-preview.png"
import logoImg5 from "./img/illustrator-all-design_751754-4-removebg-preview.png"
import getImg from './img/happy-smiling-young-man-sitting-260nw-1854705112.jpg';
function UserHome() {


    return (
        <>
            <div className="main-container">
                <div className="home-main-cont">
                    <div className="img-div">
                        <img src={Image} className="home-img" alt="Job Search" />
                        <div className="text-overlay">
                            <Link to="/userjob">
                                <button className="btn btn-outline-success">Get Your Hot Jobs</button>
                            </Link>
                            <h1 className=" fw-bold mt-2 text-center">
                                Find the great jobs<br />offer for you
                            </h1>
                            <p className="text-muted text-center">
                                Getting a new job is never easy. Check what new jobs we have in store for you on AmitJobsHub.
                            </p>

                        </div>
                    </div>
                    <div className="comp-name">
                        <h3>The fastedt-growing companies use AmitJobsHub</h3>
                                <div className="comp-name-div">
                                    <div className="col"><img src={logoImg1} className='col-img'></img></div>
                                    <div className="col"><img src={logoImg2} className='col-img'></img></div>
                                    <div className="col"><img src={logoImg3} className='col-img'></img></div>
                                    <div className="col"><img src={logoImg4} className='col-img'></img></div>
                                    <div className="col"><img src={logoImg5} className='col-img'></img></div>
                                </div>
                    </div>
                </div>
                <div className="get-us-div">
                    <div className="get-img-div">
                        <img src={getImg} alt="" />
                    </div>
                    <div className="get-text-div">
                        <div className="get-text-div-text">
                            <p className='btn-1-success'>Our Showcase</p>
                            <h4>Best Job Search platform<br />
                                Experience for you</h4>
                            <p className="text-muted ">Finding the perfect job has never been easier! Our platform connects you with top employers, offering a seamless and personalized job search experience.
                                Discover job opportunities tailored to your skills and preferences.</p>
                        </div>
                        <div className="get-ul">
                            <ul className='get-ul-ul'>
                                <li className="get-ul-li">👉 Corporate Business jobs</li>
                                <li className="get-ul-li">👉 Creative Services</li>
                                <li className="get-ul-li">👉 New Business Innovation</li>
                                <li className="get-ul-li">👉 Online E-commerce</li>
                                <li className="get-ul-li">👉 Residential Services</li>
                            </ul>
                            <ul className='get-ul-ul'>
                                <li className="get-ul-li">👉 Company Showcase</li>
                                <li className="get-ul-li">👉 News & Updates</li>
                                <li className="get-ul-li">👉 Online Bookings</li>
                                <li className="get-ul-li">👉 and much more...</li>
                            </ul>
                        </div>
                        <Link to="/userjob">
                            <button className="btn btn-outline-success">Get Started</button>
                        </Link>
                    </div>
                </div>
                <div className="card-div">
                    <h2>Choose What You Need</h2>
                    <p>Finding the perfect job has never been easier! Our platform connects you with top employers,<br /> offering a seamless and personalized job search experience.</p>
                    <div className="card-div-main">
                        <div className="main-card-div">
                            <h1>01.</h1>
                            <h5>Create An Account</h5>
                            <p className="text-muted ">Post A Job To Tell Us About Your Project. We'll Quickly Match You With The Right Freelancers Find Place Best. Nor again is there anyone who loves.</p>
                        </div>
                        <div className="main-card-div">
                            <h1>02.</h1>
                            <h5>Search Jobs</h5>
                            <p className="text-muted ">Post A Job To Tell Us About Your Project. We'll Quickly Match You With The Right Freelancers Find Place Best. Nor again is there anyone who loves.</p>
                        </div>
                        <div className="main-card-div">
                            <h1>03.</h1>
                            <h5>Save & Apply Jobs</h5>
                            <p className="text-muted ">Post A Job To Tell Us About Your Project. We'll Quickly Match You With The Right Freelancers Find Place Best. Nor again is there anyone who loves.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserHome;