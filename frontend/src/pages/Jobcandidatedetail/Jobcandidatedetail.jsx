import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AppLayout from "../../components/AppLayout/AppLayout";
import { getJobCandidateById, updateJobCandidate } from "../../api/api";
import "./JobCandidateDetail.css";

export default function JobCandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [resumeDraft, setResumeDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    getJobCandidateById(id)
      .then((data) => {
        setCandidate(data);
        setResumeDraft(data.resume ?? "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    try {
      const updated = await updateJobCandidate(id, { resume: resumeDraft });
      setCandidate(updated);
      setEditing(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="job-candidate-detail__status">Cargando...</div>
      </AppLayout>
    );
  }

  if (error && !candidate) {
    return (
      <AppLayout>
        <div className="job-candidate-detail__status job-candidate-detail__status--error">{error}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="job-candidate-detail">
        <button onClick={() => navigate("/candidatos")} className="job-candidate-detail__back">
          ← Volver al Listado
        </button>

        <div className="job-candidate-detail__header">
          <div>
            <h1 className="job-candidate-detail__title">Candidato #{candidate.jobCandidateId}</h1>
            <p className="job-candidate-detail__subtitle">
              Última modificación: {candidate.modifiedDate ? new Date(candidate.modifiedDate).toLocaleDateString() : "—"}
            </p>
          </div>
          <div className="job-candidate-detail__header-right">
            {candidate.businessEntityId ? (
              <span className="job-candidate-detail__badge job-candidate-detail__badge--hired">Contratado</span>
            ) : (
              <span className="job-candidate-detail__badge">Sin contratar</span>
            )}
            {!editing && (
              <button onClick={() => setEditing(true)} className="job-candidate-detail__edit-btn">
                Editar
              </button>
            )}
          </div>
        </div>

        {candidate.businessEntityId && (
          <div className="job-candidate-detail__hired-box">
            Este candidato ya es empleado: <strong>{candidate.employeeName}</strong>.{" "}
            <Link to={`/empleados/${candidate.businessEntityId}`} className="job-candidate-detail__link">
              Ver su perfil de empleado →
            </Link>
          </div>
        )}

        <div className="job-candidate-detail__resume-box">
          <p className="job-candidate-detail__resume-label">Resume</p>
          {editing ? (
            <>
              <textarea
                value={resumeDraft}
                onChange={(e) => setResumeDraft(e.target.value)}
                rows={10}
                className="job-candidate-detail__resume-textarea"
              />
              {saveError && <p className="job-candidate-detail__status job-candidate-detail__status--error">{saveError}</p>}
              <div className="job-candidate-detail__edit-actions">
                <button
                  onClick={() => { setResumeDraft(candidate.resume ?? ""); setEditing(false); }}
                  className="job-candidate-detail__cancel-btn"
                >
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving} className="job-candidate-detail__save-btn">
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </>
          ) : (
            <pre className="job-candidate-detail__resume">{candidate.resume}</pre>
          )}
        </div>
      </div>
    </AppLayout>
  );
}