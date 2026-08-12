import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Departments from "./pages/Departments/Departments";
import DepartmentDetail from "./pages/DepartmentDetail/DepartmentDetail";
import Employees from "./pages/Employees/Employees";
import EmployeeDetail from "./pages/EmployeeDetail/EmployeeDetail";

function RequireAuth({ children }) {
  const user = localStorage.getItem("sgrh_user");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/departamentos" element={<RequireAuth><Departments /></RequireAuth>} />
        <Route path="/departamentos/:id" element={<RequireAuth><DepartmentDetail /></RequireAuth>} />
        <Route path="/empleados" element={<RequireAuth><Employees /></RequireAuth>} />
        <Route path="/empleados/:id" element={<RequireAuth><EmployeeDetail /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
