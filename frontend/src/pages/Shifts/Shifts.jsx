import { useEffect, useState, Fragment } from "react";
import AppLayout from "../../components/AppLayout/AppLayout";
import { getShifts, updateShift, createShift, getEmployeesByShift } from "../../api/api";
import "./Shifts.css";

function toTimeInputValue(t) {
  // El backend devuelve algo tipo "07:00:00" o un datetime completo — nos
  // quedamos solo con HH:MM para el input type="time".
  if (!t) return "";
  const match = String(t).match(/(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : "";
}

export default function Shifts() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ startTime: "", endTime: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // --- Nuevo turno ---
  const [showNewForm, setShowNewForm] = useState(false);
  const [newShift, setNewShift] = useState({ name: "", startTime: "", endTime: "" });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // --- Ver empleados de un turno ---
  const [expandedShiftId, setExpandedShiftId] = useState(null);
  const [shiftEmployees, setShiftEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  useEffect(() => {
    loadShifts();
  }, []);

  function loadShifts() {
    setLoading(true);
    getShifts()
      .then(setShifts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  function startEdit(shift) {
    setEditingId(shift.shiftId);
    setSaveError("");
    setForm({
      startTime: toTimeInputValue(shift.startTime),
      endTime: toTimeInputValue(shift.endTime),
    });
  }

  async function handleSave(shiftId) {
    setSaving(true);
    setSaveError("");
    try {
      await updateShift(shiftId, {
        startTime: form.startTime,
        endTime: form.endTime,
      });
      setEditingId(null);
      loadShifts();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      await createShift(newShift);
      setNewShift({ name: "", startTime: "", endTime: "" });
      setShowNewForm(false);
      loadShifts();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function toggleEmployees(shiftId) {
    if (expandedShiftId === shiftId) {
      setExpandedShiftId(null);
      return;
    }
    setExpandedShiftId(shiftId);
    setLoadingEmployees(true);
    try {
      const data = await getEmployeesByShift(shiftId);
      setShiftEmployees(data);
    } catch (err) {
      setShiftEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  }

  return (
    <AppLayout searchPlaceholder="Buscar...">
      <div className="shifts">
        <div className="shifts__header">
          <h1 className="shifts__title">Turnos</h1>
          <button onClick={() => setShowNewForm((v) => !v)} className="shifts__new-btn">
            {showNewForm ? "Cancelar" : "+ Nuevo Turno"}
          </button>
        </div>
        <p className="shifts__subtitle">Horarios de trabajo disponibles en la empresa.</p>

        {showNewForm && (
          <form onSubmit={handleCreate} className="shifts__new-form">
            <div>
              <label>Nombre</label>
              <input
                type="text"
                value={newShift.name}
                onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                placeholder="Ej. Madrugada"
                className="shifts__input"
                required
              />
            </div>
            <div>
              <label>Hora de Inicio</label>
              <input
                type="time"
                value={newShift.startTime}
                onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                className="shifts__input"
                required
              />
            </div>
            <div>
              <label>Hora de Fin</label>
              <input
                type="time"
                value={newShift.endTime}
                onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                className="shifts__input"
                required
              />
            </div>
            <button type="submit" disabled={creating} className="shifts__new-submit">
              {creating ? "Creando..." : "Crear Turno"}
            </button>
            {createError && <p className="shifts__status shifts__status--error">{createError}</p>}
          </form>
        )}

        {loading && <p className="shifts__status">Cargando...</p>}
        {error && <p className="shifts__status shifts__status--error">{error}</p>}

        {!loading && !error && (
          <div className="shifts__table-wrap">
            <table className="shifts__table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Hora de Inicio</th>
                  <th>Hora de Fin</th>
                  <th className="shifts__col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((s) => (
                  <Fragment key={s.shiftId}>
                    <tr>
                      <td>{s.name}</td>
                      {editingId === s.shiftId ? (
                        <>
                          <td>
                            <input
                              type="time"
                              value={form.startTime}
                              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                              className="shifts__input"
                            />
                          </td>
                          <td>
                            <input
                              type="time"
                              value={form.endTime}
                              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                              className="shifts__input"
                            />
                          </td>
                          <td className="shifts__col-actions">
                            <button onClick={() => setEditingId(null)} className="shifts__link">Cancelar</button>
                            <button
                              onClick={() => handleSave(s.shiftId)}
                              disabled={saving}
                              className="shifts__link shifts__link--primary"
                            >
                              {saving ? "Guardando..." : "Guardar"}
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{toTimeInputValue(s.startTime)}</td>
                          <td>{toTimeInputValue(s.endTime)}</td>
                          <td className="shifts__col-actions">
                            <button onClick={() => toggleEmployees(s.shiftId)} className="shifts__link">
                              {expandedShiftId === s.shiftId ? "Ocultar empleados" : "Ver empleados"}
                            </button>
                            <button onClick={() => startEdit(s)} className="shifts__link">Editar</button>
                          </td>
                        </>
                      )}
                    </tr>
                    {expandedShiftId === s.shiftId && (
                      <tr>
                        <td colSpan={4} className="shifts__employees-row">
                          {loadingEmployees && <p className="shifts__status">Cargando empleados...</p>}
                          {!loadingEmployees && shiftEmployees.length === 0 && (
                            <p className="shifts__status">No hay empleados asignados a este turno.</p>
                          )}
                          {!loadingEmployees && shiftEmployees.length > 0 && (
                            <ul className="shifts__employees-list">
                              {shiftEmployees.map((emp) => (
                                <li key={emp.id ?? emp.businessEntityId}>{emp.name ?? emp.employeeName}</li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
            {saveError && <p className="shifts__status shifts__status--error" style={{ padding: "0 16px 16px" }}>{saveError}</p>}
          </div>
        )}
      </div>
    </AppLayout>
  );
}