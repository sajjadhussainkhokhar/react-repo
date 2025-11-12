import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/auth/Login";
import TaskForm from "./components/tasks/TaskForm";
import TaskList from "./components/tasks/TaskList";
import PrivateRoute from "./components/auth/PrivateRoute";
import Signup from "./components/auth/SignUp";
import ProjectForm from "./components/tasks/ProjectForm";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tasklist-create" element={
          <PrivateRoute>
            <TaskForm />
          </PrivateRoute>
          } />
        <Route path="/project-create" element={
          <PrivateRoute>
            <ProjectForm />
          </PrivateRoute>
          } />  
        <Route path="/tasklist" element={
          <PrivateRoute>  
            <TaskList />
          </PrivateRoute>  
          } />
      </Routes>
    </Router>
  );
}
