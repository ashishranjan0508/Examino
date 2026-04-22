
import apiCall from "./apiHandler"
import type { SignupFormData } from "../pages/Signup";

// Register user-------->>>>>>>

 const registerUserApi = (formData : SignupFormData) => {
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
 export default registerUserApi;