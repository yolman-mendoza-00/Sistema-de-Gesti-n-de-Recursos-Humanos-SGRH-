import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout/AppLayout";
import { getDepartmentById, updateDepartment } from "../../api/api";
import "./DepartmentDetail.css";

export default function DepartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState(null);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDepartmentById(id)
      .then((data) => {
        setDepartment(data);
        setForm(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const updated = await updateDepartment(id, {
        name: form.Name,
        groupName: form.GroupName,
      });
      setDepartment(updated);
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
        <div className="department-detail__status">Cargando...</div>
      </AppLayout>
    );
  }

  if (error && !department) {
    return (
      <AppLayout>
        <div className="department-detail__status department-detail__status--error">{error}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="department-detail">
        <button onClick={() => navigate("/departamentos")} className="department-detail__back">
          ← Volver al Listado
        </button>

        <div className="department-detail__header">
          <div>
            <h1 className="department-detail__title">{department.Name}</h1>
            <p className="department-detail__subtitle">Detalle de Departamento</p>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="department-detail__btn-primary">
              Editar
            </button>
          ) : (
            <div className="department-detail__actions">
              <button onClick={() => { setForm(department); setEditing(false); }} className="department-detail__btn-secondary">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="department-detail__btn-primary">
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          )}
        </div>

        {error && <p className="department-detail__error">{error}</p>}

        <div className="department-detail__grid">
          <div className="department-detail__card">
            <p className="department-detail__label">Nombre</p>
            {editing ? (
              <input
                value={form.Name || ""}
                onChange={(e) => setForm({ ...form, Name: e.target.value })}
                className="department-detail__input"
              />
            ) : (
              <p className="department-detail__value">{department.Name}</p>
            )}
          </div>

          <div className="department-detail__card">
            <p className="department-detail__label">Grupo</p>
            {editing ? (
              <input
                value={form.GroupName || ""}
                onChange={(e) => setForm({ ...form, GroupName: e.target.value })}
                className="department-detail__input"
              />
            ) : (
              <span className="department-detail__group">
                <span className="department-detail__dot" />
                {department.GroupName}
              </span>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
