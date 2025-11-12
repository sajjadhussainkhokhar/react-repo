import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/users/"; // adjust if needed

/**
 * Register a new user.
 * payload: { first_name, last_name, email, password, date_joined }
 * Returns response.data on success, or { error } on failure.
 */
export const handleRegister = async ({ first_name, last_name, email, password, date_joined } = {}) => {
  try {
    const body = {
      first_name,
      last_name,
      email,
      password,
    };
    if (date_joined) body.date_joined = date_joined;

    const response = await axios.post(`${API_URL}signup/`, body, {
      headers: { "Content-Type": "application/json" },
    });

    // Response shape may vary by backend. Persist access token if provided.
    if (response?.data) {
      const data = response.data;
      if (data.access) {
        localStorage.setItem("access_token", data.access);
      } else if (data.token) {
        localStorage.setItem("access_token", data.token);
      }
      return data;
    }

    return { error: "Unexpected response from server" };
  } catch (err) {
    console.error("Registration error:", err);
    const serverMsg = err.response?.data || err.response?.data?.detail;
    const message = serverMsg || err.message || "Registration failed";
    return { error: message };
  }
};

export const handleLogin = async (username,password) => {
    try {
      const response = await axios.post(API_URL + "token/", {
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