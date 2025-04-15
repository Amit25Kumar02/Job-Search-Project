
import "@fortawesome/fontawesome-free/css/all.min.css";
import './css/footer.css';

function ClientFooter() {
    return (
        <footer className="footer text-white">
            <div className="footer-img">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>About Us</h4>
                        <p>Our mission is to help businesses connect with qualified candidates quickly and efficiently.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/client">Home</a></li>
                            <li><a href="/clientabout">About</a></li>
                            <li><a href="/clientcontact">Contact</a></li>
                            <li><a href="/services">Services</a></li>

                            <li><a href="/jobrequest">Job-Request</a></li>


                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
                            <a href="https://x.com/?lang=en" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; 2025 AmitJobsHub. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}

export default ClientFooter;
