import axios, { isAxiosError } from "axios";
import type { SignupData, LoginData, ChangePasswordData } from '../types';

const base = `${import.meta.env.VITE_BASE_URL}/users`;


const signupQuery = {
    url:`${base}/signup`,
    method:"POST", 
    headers:{
        "Content-Type":"application/json"
    },
}


const loginQuery = {
    url:`${base}/signin`,
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    }
};


/** Executes the create new user API request. */
export async function createNewUser(body: SignupData) {
    try {
        const { data: { message } } = await axios.request({
            ...signupQuery,
            data:body
        })
    
        const messageInfo = message;  
        
        return { success: true, message: messageInfo };    
    } catch (error: unknown) {
        if(isAxiosError(error)){
             return { success: false, message: error.response?.data?.message || "An error occurred." };
        } else {
            return { success: false, message: "An error occurred during registration." };
        }
    }
}


/** Executes the login user API request. */
export async function loginUser(body: LoginData) {
    try {
        const { data: { data, message } } = await axios.request({
            ...loginQuery,
            data:body
        })
        const user_data = data.user;
        const token = data.token;

        return { success: true, message: message, token: token , user: user_data};
    } catch (error: unknown) { 
        if(isAxiosError(error)){
               return { success: false, message: error.response?.data?.message || "An error occurred." };
        } else {
            return { success: false, message: "An error occurred during login." };
        }
    }
}


const changePasswordQuery = {
    url:`${base}/change-password`,
    method:"PATCH",
    headers:{
        "Content-Type":"application/json"
    }
};

/** Executes the change password API request. */
export async function changePassword(body: ChangePasswordData) {
    try {
        const token = localStorage.getItem("user_token");
        const {data} = await axios.request({
            ...changePasswordQuery,
            headers: {
                ...changePasswordQuery.headers,
                "Authorization": `Bearer ${token}`,
                "token": token
            },
            data:body
        })
        return { success: true, message: data.message, token: data.token };
    } catch (error: unknown) { 
        if (isAxiosError(error)) {
            return { success: false, message: error.response?.data?.message || error.response?.data?.error || "Incorrect password" };
        } else {
            return { success: false, message: "An error occurred while changing the password." };
        }
    }
}
