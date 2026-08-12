import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/AppLayout/AppLayout";
import { getDepartments } from "../../api/api";
import "./Departments.css";

const PAGE_SIZE = 5;

export default function Departments() {
  const [all, setAll] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDepartments()
      .then(setAll)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return all.filter((d) => d.Name?.toLowerCase().includes(term));
  }, [all, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppLayout searchPlaceholder="Buscar...">
      <div className="departments">
        <div className="departments__header">
          <h1 className="departments__title">Departamentos</h1>
          <div className="departments__search">
            <span className="departments__search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Filtrar departamentos..."
              className="departments__search-input"
            />
          </div>
        </div>
        <p className="departments__subtitle">Gestión de departamentos</p>

        {loading && <p className="departments__status">Cargando...</p>}
        {error && <p className="departments__status departments__status--error">{error}</p>}

        {!loading && !error && (
          <div className="departments__table-wrap">
            <table className="departments__table">
              <thead>
                <tr>
                  <th>Nombre del Departamento</th>
                  <th>Grupo (GroupName)</th>
                  <th className="departments__col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={3} className="departments__empty">No se encontraron departamentos.</td>
                  </tr>
                )}
                {paginated.map((d) => (
                  <tr key={d.DepartmentID}>
                    <td className="departments__name">{d.Name}</td>
                    <td>{d.GroupName}</td>
                    <td className="departments__col-actions">
                      <Link to={`/departamentos/${d.DepartmentID}`} className="departments__link">
                        Ver Detalle →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="departments__pagination">
              <span>
                Mostrando {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
                {" "}a {Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length} registros
              </span>
              <div className="departments__pagination-controls">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
                <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
