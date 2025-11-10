import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token"); // check if user is logged in
  return token ? children : <Navigate to="/" replace />; // redirect to login if not
};

export default PrivateRoute;
