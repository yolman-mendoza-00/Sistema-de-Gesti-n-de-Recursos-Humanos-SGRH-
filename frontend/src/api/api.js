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
// Ahora el backend devuelve también nombre, email y cargo (no solo el id)
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
// Campos actuales: id, name, nationalId, organizationLevel, jobTitle,
// birthDate, hireDate, vacationHours, sickLeaveHours
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