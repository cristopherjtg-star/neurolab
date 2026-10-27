import { Info } from 'lucide-react';
import { PageIntro, Panel } from '../../components/ui/Elements';
export default function Evaluation() {
 return <div className="page-stack"><PageIntro eyebrow="RESULTADOS EXPERIMENTALES" title="Evaluación y métricas" description="Consulta las métricas cuando agregues resultados reales de entrenamiento."/>
 <div className="metric-cards">{['Accuracy','Precision','Recall','F1-score'].map(x=><div className="metric-card" key={x}><span>{x}</span><b>—</b><small>Sin datos</small></div>)}</div>
 <div className="dashboard-grid"><Panel title="Pérdida por época" subtitle="Las curvas aparecerán cuando existan resultados"><div className="empty-state">No hay métricas para mostrar.</div></Panel><Panel title="Precisión por época" subtitle="Resultados de evaluación"><div className="empty-state">No hay resultados registrados.</div></Panel></div>
 <Panel title="Comparar ejecuciones" subtitle="La comparación estará disponible cuando existan entrenamientos"><div className="empty-state">Agrega entrenamientos y resultados para comparar métricas.</div></Panel>
 <div className="info-callout"><Info size={17}/><div><b>Sin datos precargados</b><p>Esta sección no contiene métricas ficticias. Los resultados se mostrarán cuando incorpores información real.</p></div></div>
 </div>;
}
