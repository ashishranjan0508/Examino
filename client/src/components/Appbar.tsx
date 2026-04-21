import React from "react";
import logo from "../assets/logo.png"
import AppButton from "../components/Button";
import { useNavigate } from "react-router-dom";

interface AppbarProps {
    children: React.ReactNode;
}
const Appbar : React.FC<AppbarProps> = ({ children }) => {

     const navigate = useNavigate();

     return (
        <div className="h-15 bg-slate-800">
           <div className="flex justify-between">
             <div className="h-15 w-15">
              <AppButton onClick={() => navigate("/")}>
                <img src={logo} alt="#" className="border-green-400 border-1 rounded-3xl"></img>
              </AppButton>             
             </div>
             {children}
           </div>
        </div>
      )
}

export default Appbar;