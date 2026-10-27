import { ArrowRight, Boxes, Database, FileBarChart, Layers3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageIntro, Panel } from '../../components/ui/Elements';

const shortcuts = [
  { to: '/projects', title: 'Proyectos', description: 'Agrega y organiza tus proyectos.', icon: Boxes },
  { to: '/datasets', title: 'Datasets', description: 'Selecciona los archivos que utilizarás.', icon: Database },
  { to: '/models', title: 'Modelos', description: 'Registra la información de tus modelos.', icon: Layers3 },
  { to: '/reports', title: 'Reportes', description: 'Consulta informes cuando tengas registros.', icon: FileBarChart }
];

export default function Dashboard() {
  return <div className="page-stack simple-dashboard">
    <PageIntro eyebrow="ESPACIO DE TRABAJO" title="Bienvenido a NeuroLab Enterprise" description="La aplicación está vacía. Agrega únicamente la información que necesitas; no hay registros de ejemplo." />
    <div className="simple-shortcuts">{shortcuts.map(({ to, title, description, icon: Icon }) => <Link className="simple-shortcut" to={to} key={to}><div className="simple-shortcut-icon"><Icon size={20}/></div><div><b>{title}</b><p>{description}</p></div><ArrowRight className="simple-shortcut-arrow" size={17}/></Link>)}</div>
    <Panel title="Estado del sistema" subtitle="Los datos aparecerán aquí cuando los agregues"><div className="simple-empty"><div className="simple-empty-mark"><Database size={22}/></div><h3>Sin información registrada</h3><p>Comienza agregando un proyecto o un dataset. Las secciones se irán completando con tus propios registros.</p><Link to="/projects" className="text-action">Agregar primer proyecto <ArrowRight size={15}/></Link></div></Panel>
  </div>;
}
