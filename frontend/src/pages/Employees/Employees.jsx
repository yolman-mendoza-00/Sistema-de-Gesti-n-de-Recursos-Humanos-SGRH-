import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/AppLayout/AppLayout";
import { getEmployees } from "../../api/api";
import "./Employees.css";

const PAGE_SIZE = 10;

export default function Employees() {
  const [all, setAll] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEmployees()
      .then(setAll)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return all.filter(
      (e) =>
        e.name?.toLowerCase().includes(term) ||
        e.jobTitle?.toLowerCase().includes(term) ||
        String(e.id).includes(term)
    );
  }, [all, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function initials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  }

  return (
    <AppLayout searchPlaceholder="Buscar empleados o departamentos...">
      <div className="employees">
        <div className="employees__header">
          <h1 className="employees__title">Empleados</h1>
          <button
            onClick={() => alert("Crear empleados aún no está implementado en el backend (solo lectura y edición por ahora).")}
            className="employees__new-btn"
          >
            + Nuevo Empleado
          </button>
        </div>
        <p className="employees__subtitle">Gestiona el directorio de personal, cargos y estados.</p>

        <div className="employees__search">
          <span className="employees__search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por Nombre, ID o cargo..."
            className="employees__search-input"
          />
        </div>

        {loading && <p className="employees__status">Cargando...</p>}
        {error && <p className="employees__status employees__status--error">{error}</p>}

        {!loading && !error && (
          <div className="employees__table-wrap">
            <table className="employees__table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cargo</th>
                  <th>Fecha de Contratación</th>
                  <th>Fecha de Nacimiento</th>
                  <th>Hrs. Vacaciones</th>
                  <th>Hrs. Incapacidad</th>
                  <th className="employees__col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="employees__empty">No se encontraron empleados.</td>
                  </tr>
                )}
                {paginated.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div className="employees__name-cell">
                        <div className="employees__avatar">{initials(e.name)}</div>
                        <div>
                          <p className="employees__name">{e.name}</p>
                          <p className="employees__id">ID {e.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>{e.jobTitle}</td>
                    <td>{e.hireDate ? new Date(e.hireDate).toLocaleDateString() : "—"}</td>
                    <td>{e.birthDate ? new Date(e.birthDate).toLocaleDateString() : "—"}</td>
                    <td>{e.vacationHours ?? "—"}</td>
                    <td>{e.sickLeaveHours ?? "—"}</td>
                    <td className="employees__col-actions">
                      <Link to={`/empleados/${e.id}`} className="employees__edit-link">Editar</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="employees__pagination">
              <span>
                Mostrando {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
                {" "}a {Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length} empleados
              </span>
              <div className="employees__pagination-controls">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Anterior</button>
                <span>{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Siguiente</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
