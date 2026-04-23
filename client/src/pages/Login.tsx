import React, { useContext, useState } from "react";
import {loginUserApi} from "../services/services";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Appbar from "../components/Appbar";
import AppButton from "../components/Button";
import  {AuthContext} from "../context/AuthContext";

export interface LoginFormData {
    email: string;
    password: string; 
}

const Login = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("AuthContext not provided");
    const { setToken } = authContext;
    
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Form Submitted Data:", formData);

        const result = await loginUserApi(formData);

        console.log("Login API Result:", result);
        
        if(result.ok && result.data?.token) {
         localStorage.setItem("token", result.data.token);
         setToken(result.data.token);
         toast.success("Login successful!");
         //navigate("/studentdashboard");
        } else {
         toast.error(result.error || "Login failed!");
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
                        Login
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

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
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
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
                            Login
                        </button>
                    </form>

                    <span className="block text-center mt-6 text-gray-400">
                        Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300 hover:underline">Signup</Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;