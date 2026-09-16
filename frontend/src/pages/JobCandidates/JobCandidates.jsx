import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../components/AppLayout/AppLayout";
import { getJobCandidates, getJobCandidateById, createJobCandidate } from "../../api/api";
import "./JobCandidates.css";

export default function JobCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [newResume, setNewResume] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  function loadAll() {
    setLoading(true);
    getJobCandidates()
      .then(setCandidates)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const term = search.trim();
      if (!term) {
        await loadAll();
        return;
      }
      if (!/^\d+$/.test(term)) {
        setError("Por ahora solo se puede buscar por ID (número).");
        setCandidates([]);
        return;
      }
      const result = await getJobCandidateById(term);
      setCandidates(result ? [result] : []);
    } catch (err) {
      setError(err.message);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      await createJobCandidate({ resume: newResume });
      setNewResume("");
      setShowForm(false);
      loadAll();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout searchPlaceholder="Buscar candidatos...">
      <div className="job-candidates">
        <div className="job-candidates__header">
          <h1 className="job-candidates__title">Candidatos</h1>
          <button onClick={() => setShowForm((v) => !v)} className="job-candidates__new-btn">
            {showForm ? "Cancelar" : "+ Nuevo Candidato"}
          </button>
        </div>
        <p className="job-candidates__subtitle">Personas que han aplicado a un puesto en la empresa.</p>

        {showForm && (
          <form onSubmit={handleCreate} className="job-candidates__form">
            <label>Resume (XML o texto)</label>
            <textarea
              value={newResume}
              onChange={(e) => setNewResume(e.target.value)}
              placeholder="Pega aquí el contenido del resume..."
              rows={5}
              className="job-candidates__textarea"
              required
            />
            {saveError && <p className="job-candidates__status job-candidates__status--error">{saveError}</p>}
            <button type="submit" disabled={saving} className="job-candidates__submit-btn">
              {saving ? "Guardando..." : "Registrar Candidato"}
            </button>
          </form>
        )}

        <form onSubmit={handleSearch} className="job-candidates__search">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID de candidato..."
            className="job-candidates__search-input"
          />
          <button type="submit" className="job-candidates__search-btn">Buscar</button>
        </form>

        {loading && <p className="job-candidates__status">Cargando...</p>}
        {error && <p className="job-candidates__status job-candidates__status--error">{error}</p>}

        {!loading && !error && (
          <div className="job-candidates__table-wrap">
            <table className="job-candidates__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estado</th>
                  <th className="job-candidates__col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {candidates.length === 0 && (
                  <tr>
                    <td colSpan={3} className="job-candidates__empty">No se encontraron candidatos.</td>
                  </tr>
                )}
                {candidates.map((c) => (
                  <tr key={c.jobCandidateId}>
                    <td>{c.jobCandidateId}</td>
                    <td>
                      {c.businessEntityId ? (
                        <span className="job-candidates__badge job-candidates__badge--hired">Contratado</span>
                      ) : (
                        <span className="job-candidates__badge">Sin contratar</span>
                      )}
                    </td>
                    <td className="job-candidates__col-actions">
                      <Link to={`/candidatos/${c.jobCandidateId}`} className="job-candidates__link">Ver Detalle</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}