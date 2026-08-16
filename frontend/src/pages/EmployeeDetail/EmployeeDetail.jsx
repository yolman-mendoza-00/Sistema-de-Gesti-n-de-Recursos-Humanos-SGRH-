import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout/AppLayout";
import { getEmployeeById, updateEmployee } from "../../api/api";
import "./EmployeeDetail.css";

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

  useEffect(() => {
    getEmployeeById(id)
      .then((data) => {
        setEmployee(data);
        setForm(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

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
            <button onClick={() => setEditing(true)} className="employee-detail__btn-primary">
              Editar Perfil
            </button>
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
