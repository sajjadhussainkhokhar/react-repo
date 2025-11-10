import axios from "axios";

const API_URL = "http://127.0.0.1:8000/books/api"; // adjust if needed

export const handleLogin = async (username,password) => {
    try {
      const response = await axios.post(API_URL + "/token/", {
        username,
        password,
      });

      // assuming API returns token or user data
      console.log("Login successful:", response.data);

      // store token if available
      if (response.data.access) {
        alert("Login successful!");
        return response.data.access
      }
     
    } catch (err) {
        console.log(err)
        return false;
    } 
};