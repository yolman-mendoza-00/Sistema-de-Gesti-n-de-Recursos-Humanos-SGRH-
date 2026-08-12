import { Link } from "react-router-dom";
import AppLayout from "../../components/AppLayout/AppLayout";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <AppLayout searchPlaceholder="Buscar...">
      <div className="dashboard">
        <h1 className="dashboard__title">
          Bienvenido al Sistema de Gestión de Recursos Humanos
          </h1>
        <p className="dashboard__subtitle">
          Accede rápidamente a las herramientas principales para administrar la estructura organizacional
          de la empresa y la información de todo el personal activo.
        </p>

        <div className="dashboard__grid">
          <div className="dashboard__card">
            <div className="dashboard__card-icon dashboard__card-icon--blue">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2M5 21H3m16 0h-4m-6 0h4m-4 0v-4m4 4v-4" />
              </svg>
            </div>
            <h2 className="dashboard__card-title">Departamentos</h2>
            <p className="dashboard__card-text">
              Gestiona las áreas y estructuras organizacionales de la empresa. Define jerarquías,
              presupuestos y responsables por área.
            </p>
            <Link to="/departamentos" className="dashboard__card-btn">
              Gestionar Departamentos →
            </Link>
          </div>

          <div className="dashboard__card">
            <div className="dashboard__card-icon dashboard__card-icon--green">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 3a4 4 0 10-8 0" />
              </svg>
            </div>
            <h2 className="dashboard__card-title">Empleados</h2>
            <p className="dashboard__card-text">
              Consulta y administra la información detallada de todo el personal. Revisa perfiles,
              asignaciones, historial y datos de contacto.
            </p>
            <Link to="/empleados" className="dashboard__card-btn">
              Ver Directorio →
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
