import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './footer';
import NavbarSection from './navbar';
import CarouselImage from './img/istockphoto-1866121862-2048x2048.webp';
import CarouselImage1 from './img/job-search-im-unemployed-free-photo.webp';
import CarouselImage2 from './img/360_F_91216215_WxpS9G7Meffw4UCpJqZ3Ve254xUhx0aK.jpg';

function UserHome() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <>
            <div className='car-1'>
                <div id="carouselExampleIndicators" className="carousel slide mt-5" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className={index === 0 ? 'active' : ''} onClick={() => handleSelect(0)}></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" className={index === 1 ? 'active' : ''} onClick={() => handleSelect(1)}></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" className={index === 2 ? 'active' : ''} onClick={() => handleSelect(2)}></button>
                    </div>
                    <div className="carousel-inner mt-5">
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <img src={CarouselImage} className="d-block w-100 rounded-lg" alt="First slide" style={{ height: '400px', objectFit: 'cover' , borderRadius: "5px"}} />
                        </div>
                        <div className={`carousel-item ${index === 1 ? 'active' : ''}`}>
                            <img src={CarouselImage1} className="d-block w-100 rounded-lg" alt="Second slide" style={{ height: '400px', objectFit: 'cover', borderRadius: "5px" }} />
                        </div>
                        <div className={`carousel-item ${index === 2 ? 'active' : ''}`}>
                            <img src={CarouselImage2} className="d-block w-100 rounded-lg" alt="Third slide" style={{ height: '400px', objectFit: 'cover', borderRadius: "5px" }} />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
           
            <div className="bg-white shadow-lg rounded-2xl p-4 w-100 mx-auto text-center ">
                <h1 className="fs-4 fw-bold text-dark">Welcome to Job Finder!</h1>
                <p className="text-muted">Your next opportunity is just a click away.</p>
                <div className="mt-3">
                    <Link to="/userjob">
                        <button className="btn btn-primary btn-lg mb-3">Browse Jobs</button>
                    </Link>
                </div>
            </div>
            </div>
            
        </>
    );
}

export default UserHome;