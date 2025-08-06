// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://job-search-project-330t.onrender.com";
// const API_URL = "http://localhost:5200";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");

    const handleReset = async () => {
        if (!password) {
            toast.warning("Please enter new password");
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/api/users/reset-password`, {
                token,
                newPassword: password,
            });

            toast.success(res.data.message);
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error resetting password");
        }
    };

    return (
        <div className="container con">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card p-4 shadow rounded">
                        <h3 className="text-center text-dark mb-3">Reset Password</h3>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="btn btn-primary w-100" onClick={handleReset}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;