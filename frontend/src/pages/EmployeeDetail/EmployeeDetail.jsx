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
  getShifts,
} from "../../api/api";
import "./EmployeeDetail.css";

function toDateInputValue(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
}

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
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
  const [shifts, setShifts] = useState([]);
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

  // --- Desactivar empleado ---
  const [deactivating, setDeactivating] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    getEmployeeById(id)
      .then((data) => {
        setEmployee(data);
        setForm(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    getEmployeeDepartmentHistory(id)
      .then(setHistory)
      .catch(() => setHistory([]));

    getDepartments().then(setDepartments).catch(() => {});
    getShifts().then(setShifts).catch(() => {});
  }, [id]);

  function shiftName(shiftId) {
    const s = shifts.find((s) => s.shiftId === shiftId);
    return s ? s.name : `Turno ${shiftId}`;
  }

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

  async function handleDeactivate() {
    const confirmed = window.confirm(
      `¿Seguro que quieres desactivar a ${employee.name}? Después de esto ya no va a aparecer en el listado ni se va a poder consultar su perfil.`
    );
    if (!confirmed) return;

    setDeactivating(true);
    setStatusError("");
    try {
      await updateEmployeeStatus(id, false);
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

  // Vacaciones e incapacidad como % de una barra, tope visual en 160h (~4 semanas)
  const vacationPct = Math.min(100, ((employee.vacationHours || 0) / 160) * 100);
  const sickPct = Math.min(100, ((employee.sickLeaveHours || 0) / 160) * 100);

  return (
    <AppLayout searchPlaceholder="Buscar empleados...">
      <div className="employee-detail">
        <button onClick={() => navigate("/empleados")} className="employee-detail__back">
          ← 
        </button>
        <h1 className="employee-detail__title">Perfil del Empleado</h1>
        <p className="employee-detail__id-row">
          ID: <span className="employee-detail__id-badge">EMP-{String(employee.id).padStart(4, "0")}</span>
        </p>

        {/* Tarjeta de perfil */}
        <div className="employee-detail__profile-card">
          <div className="employee-detail__profile-left">
            <div className="employee-detail__avatar">{initials(employee.name)}</div>
            <div>
              <p className="employee-detail__name">{employee.name}</p>
              <p className="employee-detail__job">{employee.jobTitle}</p>
              <div className="employee-detail__badges">
                {currentAssignment && (
                  <span className="employee-detail__tag">
                    <span className="employee-detail__tag-dot" />
                    {currentAssignment.departmentName}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!editing ? (
            <div className="employee-detail__actions">
              <button
                onClick={handleDeactivate}
                disabled={deactivating}
                className="employee-detail__btn-danger"
              >
                {deactivating ? "Desactivando..." : "Desactivar"}
              </button>
              <button onClick={() => setEditing(true)} className="employee-detail__btn-primary">
                ✎ Editar Perfil
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

        {error && <p className="employee-detail__error">{error}</p>}
        {statusError && <p className="employee-detail__error">{statusError}</p>}

        {/* 3 tarjetas */}
        <div className="employee-detail__grid">
          <section className="employee-detail__section">
            <h3 className="employee-detail__section-title">
              <span className="employee-detail__section-icon">👤</span> Datos Básicos
            </h3>
            <dl className="employee-detail__dl">
              <div className="employee-detail__row">
                <dt>ID Nacional</dt>
                <dd>{employee.nationalId}</dd>
              </div>
              <div className="employee-detail__row">
                <dt>Fecha de Nacimiento</dt>
                <dd>{employee.birthDate ? new Date(employee.birthDate).toLocaleDateString() : "—"}</dd>
              </div>
              <div className="employee-detail__row">
                <dt>Nivel Organizacional</dt>
                <dd>{employee.organizationLevel ?? "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="employee-detail__section">
            <h3 className="employee-detail__section-title">
              <span className="employee-detail__section-icon">📁</span> Información Laboral
            </h3>
            <dl className="employee-detail__dl">
              <div className="employee-detail__row">
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
              <div className="employee-detail__row">
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
              <div className="employee-detail__row">
                <dt>Departamento</dt>
                <dd>{currentAssignment ? currentAssignment.departmentName : "Sin asignar"}</dd>
              </div>
              <div className="employee-detail__row">
                <dt>Turno</dt>
                <dd>{currentAssignment ? shiftName(currentAssignment.shiftId) : "—"}</dd>
              </div>

              {!assigningDept ? (
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
                  className="employee-detail__btn-link"
                >
                  {currentAssignment ? "Cambiar Departamento" : "Asignar Departamento"}
                </button>
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
                      {shifts.map((s) => (
                        <option key={s.shiftId} value={s.shiftId}>{s.name}</option>
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
            </dl>
          </section>

          <section className="employee-detail__section">
            <h3 className="employee-detail__section-title">
              <span className="employee-detail__section-icon">⏱</span> Beneficios y Tiempo
            </h3>
            <div className="employee-detail__benefits">
              <div className="employee-detail__benefit-box">
                <p className="employee-detail__benefit-label">Horas Vacaciones</p>
                {editing ? (
                  <input
                    type="number"
                    value={form.vacationHours ?? ""}
                    onChange={(e) => setForm({ ...form, vacationHours: e.target.value })}
                    className="employee-detail__input"
                  />
                ) : (
                  <>
                    <p className="employee-detail__benefit-value employee-detail__benefit-value--blue">
                      {employee.vacationHours}<span className="employee-detail__benefit-unit"> hrs</span>
                    </p>
                    <div className="employee-detail__bar">
                      <div className="employee-detail__bar-fill employee-detail__bar-fill--blue" style={{ width: `${vacationPct}%` }} />
                    </div>
                  </>
                )}
              </div>
              <div className="employee-detail__benefit-box">
                <p className="employee-detail__benefit-label">Hrs Incapacidad</p>
                {editing ? (
                  <input
                    type="number"
                    value={form.sickLeaveHours ?? ""}
                    onChange={(e) => setForm({ ...form, sickLeaveHours: e.target.value })}
                    className="employee-detail__input"
                  />
                ) : (
                  <>
                    <p className="employee-detail__benefit-value employee-detail__benefit-value--green">
                      {employee.sickLeaveHours}<span className="employee-detail__benefit-unit"> hrs</span>
                    </p>
                    <div className="employee-detail__bar">
                      <div className="employee-detail__bar-fill employee-detail__bar-fill--green" style={{ width: `${sickPct}%` }} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}