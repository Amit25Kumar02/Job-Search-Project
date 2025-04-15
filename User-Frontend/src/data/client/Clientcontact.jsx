import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/contsct.css'; // use your original CSS file

export const Clientcontact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5200/api/con/contact', formData);
            toast.success(res.data.message || "Submitted successfully", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored"
            });
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            const msg = error.response?.data?.message || "Something went wrong!";
            toast.error(msg, {
                position: "top-right",
                autoClose: 3000,
                theme: "colored"
            });
        }
    };

    return (
        <>
            <div className='container-con1'>
                <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "800px" }}>
                    <form className="mb-3" onSubmit={handleSubmit}>
                        <div><h2>Contact Us</h2></div>

                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <div className="form-text">We'll never share your email with anyone else.</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mob. No.</label>
                            <input
                                type="number"
                                className="form-control"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Message</label>
                            <textarea
                                className="form-control"
                                // rows="2"
                                placeholder="Write your message here..."
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </>
    );
};
