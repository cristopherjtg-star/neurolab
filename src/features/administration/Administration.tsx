import { useState } from 'react';
import { LockKeyhole, Settings2, ShieldCheck, Users } from 'lucide-react';
import { Button, PageIntro, Panel } from '../../components/ui/Elements';
export default function Administration() {
 const [tab,setTab]=useState('Usuarios'); const [limit,setLimit]=useState(1); const [saved,setSaved]=useState(false);
 return <div className="page-stack"><PageIntro eyebrow="GOVERNANCE & ACCESS" title="Administración" description="Configura las preferencias del espacio y agrega usuarios cuando corresponda."/>
 <div className="admin-summary"><div><div className="admin-summary-icon"><Users size={18}/></div><span>Usuarios registrados</span><b>0</b></div><div><div className="admin-summary-icon"><ShieldCheck size={18}/></div><span>Roles configurables</span><b>0</b></div><div><div className="admin-summary-icon"><LockKeyhole size={18}/></div><span>Eventos de auditoría</span><b>0</b></div><div><div className="admin-summary-icon"><Settings2 size={18}/></div><span>Seguridad</span><b className="security-demo">Sin configurar</b></div></div>
 <div className="admin-tabs">{['Usuarios','Auditoría','Recursos','Preferencias'].map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
 {tab==='Usuarios'&&<Panel title="Usuarios y permisos" subtitle="No hay usuarios precargados"><div className="empty-state">No hay usuarios registrados. Agrega la información de los usuarios que necesites.</div></Panel>}
 {tab==='Auditoría'&&<Panel title="Registro de actividad" subtitle="Los eventos aparecerán cuando existan acciones registradas"><div className="empty-state">No hay eventos de auditoría.</div></Panel>}
 {tab==='Recursos'&&<Panel title="Preferencias de recursos" subtitle="Configura el límite de ejecuciones para tu espacio"><div className="resource-setting"><div><b>Entrenamientos simultáneos</b><p>Preferencia de configuración del espacio de trabajo.</p></div><select value={limit} onChange={e=>{setLimit(Number(e.target.value));setSaved(false)}}>{[1,2,3,4,5,8].map(n=><option key={n} value={n}>{n} ejecuciones</option>)}</select></div><Button onClick={()=>setSaved(true)}><Settings2 size={15}/> Guardar preferencia</Button>{saved&&<p className="saved-message">Preferencia guardada en esta vista: {limit} ejecuciones.</p>}</Panel>}
 {tab==='Preferencias'&&<Panel title="Preferencias de interfaz" subtitle="Opciones generales"><div className="preference-row"><div><b>Modo oscuro</b><p>Tema de alto contraste para el espacio de trabajo.</p></div><span className="preference-enabled">Activado</span></div><div className="preference-row"><div><b>Notificaciones de actividad</b><p>Indicadores visuales de nuevas ejecuciones y cambios.</p></div><span className="preference-enabled">Activado</span></div></Panel>}
 <div className="info-callout"><LockKeyhole size={17}/><div><b>Configuración inicial</b><p>No hay usuarios, permisos ni eventos precargados. La autenticación real requiere conectarse a un backend.</p></div></div>
 </div>;
}
