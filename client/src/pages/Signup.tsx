import React, { useState } from "react";
import registerUserApi from "../services/services";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Appbar from "../components/Appbar";
import AppButton from "../components/Button";

export interface SignupFormData {
    name: string;
    email: string;
    studentRollNo: string;
    password: string;
    userRole: string; 
}

const Signup = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<SignupFormData>({
        name: "",
        email: "",
        studentRollNo: "",
        password: "",
        userRole: "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form Submitted Data:", formData);
        const result = await registerUserApi(formData);
        if(result.ok) {
         toast.success("Signup successful! Please login.");
         // navigate("/login");
        } else {
         toast.error(result.error || "Signup failed!");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="w-full min-h-screen bg-slate-900">
            <Appbar>
                <span className="flex items-center gap-4 mr-4">
                    <AppButton 
                        variant="contained" 
                        color="primary"
                        onClick={() => navigate("/signup")}
                    >
                        Get Started
                    </AppButton>
                    <AppButton 
                        variant="outlined"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </AppButton>
                </span>
            </Appbar>

            <div className="flex flex-col items-center p-6">
                <div className="sm:w-full md:w-1/3 lg:w-1/3 bg-slate-700 shadow-md rounded-xl p-8 mt-10">
                    <div className="flex justify-center text-3xl font-bold text-white mb-6">
                        Signup
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Examinee Roll No <span className="text-gray-500 text-xs ml-1">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="studentRollNo"
                                placeholder="Enter Roll No (if applicable)"
                                value={formData.studentRollNo}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                User Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="userRole"
                                value={formData.userRole}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 cursor-pointer"
                                required
                            >
                                <option value="" disabled>Select User Role</option>
                                <option value="teacher">Examiner</option>
                                <option value="student">Examinee</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg 
                                focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 bg-blue-600 text-white font-semibold py-2.5 
                            rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Create Account
                        </button>
                    </form>

                    <span className="block text-center mt-6 text-gray-400">
                        Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 hover:underline">Login here</Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Signup;