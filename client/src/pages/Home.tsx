import React from "react";
import {useNavigate} from "react-router-dom"
import AppButton from "../components/Button";
import Appbar from "../components/Appbar";

const Home: React.FC = () => {

   const navigate = useNavigate();

   return (
    <div className="min-h-screen bg-slate-900">
      
        <Appbar>
            <span className="flex items-center gap-4 mr-4">
                <AppButton variant="contained" color="primary" 
                onClick={() => navigate("/signup")}>Get Started</AppButton>
                <AppButton variant="outlined"
                onClick={() => navigate("login")}>Login</AppButton>
            </span>
        </Appbar>
        
    </div>
   )
};

export default Home;