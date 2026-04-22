const BaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
     ok : boolean;
     data: T | {error : string};
}
const apiCall =async <T>(endpoint : string, config : RequestInit = {}) : Promise<ApiResponse<T>> => {
    try{
      const response = await fetch(`${BaseURL}${endpoint}`, config);
      const data = await response.json();
       return{ok: response.ok, data}
    } catch(error) {
       console.error("Api call failed", error);
       return{ok: false , data: {error: "Network error"}}
    }
     
}

export default apiCall;