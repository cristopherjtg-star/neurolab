import { useLocation } from 'react-router-dom';

const titles: Record<string, string> = {
  '/': 'Inicio', '/projects': 'Proyectos', '/fundamentals': 'Fundamentos neuronales',
  '/architectures': 'Arquitecturas', '/datasets': 'Datasets', '/training': 'Entrenamientos',
  '/evaluation': 'Evaluación', '/models': 'Modelos', '/reports': 'Reportes',
  '/administration': 'Administración'
};

export default function Header() {
  const location = useLocation();
  const title = titles[location.pathname] || 'NeuroLab Enterprise';
  return <header className="topbar simple-topbar"><div className="topbar-title"><div className="breadcrumbs">NeuroLab Enterprise <span>/</span> <b>{title}</b></div><h1>{title}</h1></div><div className="topbar-status"><span className="status-dot"/> Listo para agregar información</div></header>;
}
