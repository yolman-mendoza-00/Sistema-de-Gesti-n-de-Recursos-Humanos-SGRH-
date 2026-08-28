const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.mensaje || data.message || `Error ${res.status}`);
  }
  return data;
}

// --- Auth ---
export function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// --- Departments ---
export function getDepartments() {
  return request("/departments");
}
export function getDepartmentById(id) {
  return request(`/departments/${id}`);
}
export function updateDepartment(id, data) {
  return request(`/departments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// --- Employees ---
export function getEmployees() {
  return request("/employees");
}
export function getEmployeeById(id) {
  return request(`/employees/${id}`);
}

// El PATCH solo acepta estos 4 campos ahora
export function updateEmployee(id, data) {
  return request(`/employees/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      jobTitle: data.jobTitle,
      hireDate: data.hireDate,
      vacationHours: data.vacationHours,
      sickLeaveHours: data.sickLeaveHours,
    }),
  });
}

// Activa (true) o desactiva (false) un empleado (CurrentFlag en la BD).
// Revisar el desactivar 
export function updateEmployeeStatus(id, active) {
  return request(`/employees/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });
}

// Registro de qué departamento y turno tiene (o tuvo) cada empleado.
export function getAllDepartmentHistory() {
  return request("/employee-department-history");
}

// Trae el historial completo de UN empleado (más reciente primero)
export function getEmployeeDepartmentHistory(employeeId) {
  return request(`/employee-department-history/${employeeId}`);
}

// Asigna por primera vez un departamento/turno a un empleado que no tiene ninguno
export function assignDepartment(data) {
  return request("/employee-department-history", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Cambia de departamento: cierra la asignación actual y abre una nueva
export function changeEmployeeDepartment(employeeId, data) {
  return request(`/employee-department-history/${employeeId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Cierra la asignación actual sin abrir una nueva (el empleado queda sin departamento)
export function finishDepartmentAssignment(employeeId, endDate) {
  return request(`/employee-department-history/${employeeId}/finish`, {
    method: "PATCH",
    body: JSON.stringify({ endDate }),
  });
}