
import apiCall from "./apiHandler"
import type { SignupFormData } from "../pages/Signup";
import type { LoginFormData } from "../pages/Login";

// Register user-------->>>>>>>

 export const registerUserApi = (formData : SignupFormData) => {
    const endpoint = '/users/register';
    const config = {
         method : "POST",
         headers : {
            "Content-Type": "application/json"
         },
         body : JSON.stringify(formData)
    };

    return apiCall(endpoint, config);
}


 //login user----->>>

 export const loginUserApi = (FormData : LoginFormData) => {
       const endpoint = '/users/login';
       const config = {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(FormData)
       };

       return apiCall(endpoint, config);
 }
