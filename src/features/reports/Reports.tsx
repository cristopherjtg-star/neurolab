import { FileBarChart, Printer } from 'lucide-react';
import { Button, PageIntro, Panel } from '../../components/ui/Elements';
export default function Reports() {
 return <div className="page-stack"><PageIntro eyebrow="REPORTING & GOVERNANCE" title="Reportes" description="Prepara informes a partir de la información que agregues al sistema." action={<Button variant="secondary" onClick={()=>window.print()}><Printer size={15}/> Imprimir vista</Button>}/>
 <Panel title="Configurar informe" subtitle="Los informes se construirán con tus propios registros"><div className="empty-state">Todavía no hay información para generar un informe.</div></Panel>
 <div className="report-paper"><div className="report-paper-head"><div className="brand-mark"><FileBarChart size={22}/></div><div><span>NEUROLAB ENTERPRISE</span><h2>Informe de experimentación</h2><p>Vista previa sin datos</p></div></div><div className="report-rule"/><div className="report-overview"><div><span>Proyectos</span><b>0</b></div><div><span>Entrenamientos</span><b>0</b></div><div><span>Modelos</span><b>0</b></div><div><span>Estado</span><b>Vacío</b></div></div><div className="empty-state">Agrega información para que el reporte pueda mostrar resultados.</div><div className="report-paper-foot"><span>NeuroLab Enterprise</span><span>Sin información registrada</span></div></div>
 </div>;
}
