import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout/AppLayout";
import {
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  getEmployeeDepartmentHistory,
  assignDepartment,
  changeEmployeeDepartment,
  getDepartments,
} from "../../api/api";
import "./EmployeeDetail.css";

// No existe un endpoint de Shifts en el backend todavía (solo existe la tabla
// en la BD). Estos son los 3 turnos estándar de AdventureWorks — confirmar
// los IDs reales con la base de datos o pedir que se construya el endpoint.
const SHIFTS = [
  { id: 1, name: "Día (7:00 AM - 3:00 PM)" },
  { id: 2, name: "Tarde (3:00 PM - 11:00 PM)" },
  { id: 3, name: "Noche (11:00 PM - 7:00 AM)" },
];

function toDateInputValue(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
}

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Departamento actual ---
  const [history, setHistory] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [assigningDept, setAssigningDept] = useState(false);
  const [savingDept, setSavingDept] = useState(false);
  const [deptError, setDeptError] = useState("");
  const [deptForm, setDeptForm] = useState({
    departmentId: "",
    shiftId: "",
    startDate: new Date().toISOString().split("T")[0],
  });

  const currentAssignment = history.find((h) => !h.endDate) || null;
  const pastAssignments = history.filter((h) => h.endDate);

  useEffect(() => {
    getEmployeeById(id)
      .then((data) => {
        setEmployee(data);
        setForm(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    // Si el empleado no tiene historial todavía, el backend responde 404 —
    // lo tratamos como "sin departamento asignado", no como un error real.
    getEmployeeDepartmentHistory(id)
      .then(setHistory)
      .catch(() => setHistory([]));

    getDepartments().then(setDepartments).catch(() => {});
  }, [id]);

  async function handleSaveDepartment() {
    setSavingDept(true);
    setDeptError("");
    try {
      const payload = {
        departmentId: Number(deptForm.departmentId),
        shiftId: Number(deptForm.shiftId),
        startDate: deptForm.startDate,
      };

      if (currentAssignment) {
        await changeEmployeeDepartment(id, payload);
      } else {
        await assignDepartment({ employeeId: Number(id), ...payload });
      }

      const updatedHistory = await getEmployeeDepartmentHistory(id).catch(() => []);
      setHistory(updatedHistory);
      setAssigningDept(false);
    } catch (err) {
      setDeptError(err.message);
    } finally {
      setSavingDept(false);
    }
  }

  const [deactivating, setDeactivating] = useState(false);
  const [statusError, setStatusError] = useState("");

  async function handleDeactivate() {
    const confirmed = window.confirm(
      `¿Seguro que quieres desactivar a ${employee.name}? Después de esto ya no va a aparecer en el listado ni se va a poder consultar su perfil.`
    );
    if (!confirmed) return;

    setDeactivating(true);
    setStatusError("");
    try {
      await updateEmployeeStatus(id, false);
      // El empleado deja de ser consultable (CurrentFlag=0 lo filtra el
      // backend), así que no tiene sentido quedarnos en esta página.
      navigate("/empleados");
    } catch (err) {
      setStatusError(err.message);
    } finally {
      setDeactivating(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const updated = await updateEmployee(id, {
        jobTitle: form.jobTitle,
        hireDate: form.hireDate,
        vacationHours: Number(form.vacationHours),
        sickLeaveHours: Number(form.sickLeaveHours),
      });
      setEmployee(updated);
      setForm(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function initials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="employee-detail__status">Cargando...</div>
      </AppLayout>
    );
  }

  if (error && !employee) {
    return (
      <AppLayout>
        <div className="employee-detail__status employee-detail__status--error">{error}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="employee-detail">
        <button onClick={() => navigate("/empleados")} className="employee-detail__back">
          ← Volver al Listado
        </button>

        <div className="employee-detail__header">
          <div>
            <h1 className="employee-detail__title">Perfil del Empleado</h1>
            <p className="employee-detail__subtitle">ID: {employee.id}</p>
          </div>
          {!editing ? (
            <div className="employee-detail__actions">
              <button
                onClick={handleDeactivate}
                disabled={deactivating}
                className="employee-detail__btn-danger"
              >
                {deactivating ? "Desactivando..." : "Desactivar Empleado"}
              </button>
              <button onClick={() => setEditing(true)} className="employee-detail__btn-primary">
                Editar Perfil
              </button>
            </div>
          ) : (
            <div className="employee-detail__actions">
              <button onClick={() => { setForm(employee); setEditing(false); }} className="employee-detail__btn-secondary">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="employee-detail__btn-primary">
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          )}
        </div>

        <div className="employee-detail__profile-card">
          <div className="employee-detail__avatar">{initials(employee.name)}</div>
          <div>
            <p className="employee-detail__name">{employee.name}</p>
            <p className="employee-detail__job">{employee.jobTitle}</p>
          </div>
        </div>

        {error && <p className="employee-detail__error">{error}</p>}
        {statusError && <p className="employee-detail__error">{statusError}</p>}

        <div className="employee-detail__grid">
          <section className="employee-detail__section">
            <h3 className="employee-detail__section-title">Datos Básicos</h3>
            <dl className="employee-detail__dl">
              <div>
                <dt>ID Nacional</dt>
                <dd>{employee.nationalId}</dd>
              </div>
              <div>
                <dt>Fecha de Nacimiento</dt>
                <dd>{employee.birthDate ? new Date(employee.birthDate).toLocaleDateString() : "—"}</dd>
              </div>
              <div>
                <dt>Nivel Organizacional</dt>
                <dd>{employee.organizationLevel ?? "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="employee-detail__section">
            <h3 className="employee-detail__section-title">Departamento Actual</h3>

            {!assigningDept ? (
              <>
                {currentAssignment ? (
                  <dl className="employee-detail__dl">
                    <div>
                      <dt>Departamento</dt>
                      <dd>{currentAssignment.departmentName}</dd>
                    </div>
                    <div>
                      <dt>Turno</dt>
                      <dd>{SHIFTS.find((s) => s.id === currentAssignment.shiftId)?.name ?? `ID ${currentAssignment.shiftId}`}</dd>
                    </div>
                    <div>
                      <dt>Desde</dt>
                      <dd>{new Date(currentAssignment.startDate).toLocaleDateString()}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="employee-detail__no-department">Sin departamento asignado.</p>
                )}

                <button
                  onClick={() => {
                    setDeptError("");
                    setDeptForm({
                      departmentId: currentAssignment?.departmentId ?? "",
                      shiftId: currentAssignment?.shiftId ?? "",
                      startDate: new Date().toISOString().split("T")[0],
                    });
                    setAssigningDept(true);
                  }}
                  className="employee-detail__btn-secondary employee-detail__btn-department"
                >
                  {currentAssignment ? "Cambiar Departamento" : "Asignar Departamento"}
                </button>
              </>
            ) : (
              <div className="employee-detail__dept-form">
                <div>
                  <label>Departamento</label>
                  <select
                    value={deptForm.departmentId}
                    onChange={(e) => setDeptForm({ ...deptForm, departmentId: e.target.value })}
                    className="employee-detail__input"
                  >
                    <option value="">Selecciona...</option>
                    {departments.map((d) => (
                      <option key={d.DepartmentID} value={d.DepartmentID}>{d.Name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Turno</label>
                  <select
                    value={deptForm.shiftId}
                    onChange={(e) => setDeptForm({ ...deptForm, shiftId: e.target.value })}
                    className="employee-detail__input"
                  >
                    <option value="">Selecciona...</option>
                    {SHIFTS.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Fecha de inicio</label>
                  <input
                    type="date"
                    value={deptForm.startDate}
                    onChange={(e) => setDeptForm({ ...deptForm, startDate: e.target.value })}
                    className="employee-detail__input"
                  />
                </div>

                {deptError && <p className="employee-detail__error">{deptError}</p>}

                <div className="employee-detail__actions">
                  <button onClick={() => setAssigningDept(false)} className="employee-detail__btn-secondary">
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveDepartment}
                    disabled={savingDept || !deptForm.departmentId || !deptForm.shiftId || !deptForm.startDate}
                    className="employee-detail__btn-primary"
                  >
                    {savingDept ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            )}

            {pastAssignments.length > 0 && (
              <div className="employee-detail__history">
                <p className="employee-detail__history-title">Historial anterior</p>
                {pastAssignments.map((h, i) => (
                  <div key={i} className="employee-detail__history-item">
                    {h.departmentName} — {new Date(h.startDate).toLocaleDateString()} a {new Date(h.endDate).toLocaleDateString()}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="employee-detail__section">
            <h3 className="employee-detail__section-title">Información Laboral</h3>
            <dl className="employee-detail__dl">
              <div>
                <dt>Cargo</dt>
                {editing ? (
                  <input
                    value={form.jobTitle || ""}
                    onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                    className="employee-detail__input"
                  />
                ) : (
                  <dd>{employee.jobTitle}</dd>
                )}
              </div>
              <div>
                <dt>Fecha de Contratación</dt>
                {editing ? (
                  <input
                    type="date"
                    value={toDateInputValue(form.hireDate)}
                    onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
                    className="employee-detail__input"
                  />
                ) : (
                  <dd>{employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : "—"}</dd>
                )}
              </div>
            </dl>
          </section>

          <section className="employee-detail__section">
            <h3 className="employee-detail__section-title">Beneficios y Tiempo</h3>
            <div className="employee-detail__benefits">
              <div className="employee-detail__benefit-box">
                <p className="employee-detail__benefit-label">Hrs. Vacaciones</p>
                {editing ? (
                  <input
                    type="number"
                    value={form.vacationHours ?? ""}
                    onChange={(e) => setForm({ ...form, vacationHours: e.target.value })}
                    className="employee-detail__input"
                  />
                ) : (
                  <p className="employee-detail__benefit-value employee-detail__benefit-value--blue">
                    {employee.vacationHours} hrs
                  </p>
                )}
              </div>
              <div className="employee-detail__benefit-box">
                <p className="employee-detail__benefit-label">Hrs. Incapacidad</p>
                {editing ? (
                  <input
                    type="number"
                    value={form.sickLeaveHours ?? ""}
                    onChange={(e) => setForm({ ...form, sickLeaveHours: e.target.value })}
                    className="employee-detail__input"
                  />
                ) : (
                  <p className="employee-detail__benefit-value employee-detail__benefit-value--green">
                    {employee.sickLeaveHours} hrs
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}