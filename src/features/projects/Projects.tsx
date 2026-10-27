import { useMemo, useState } from 'react';
import { FolderKanban, MoreHorizontal, Pencil, Plus, X } from 'lucide-react';
import type { Project } from '../../types';
import { getProjects, saveProjects } from '../../services/mockApi';
import { Button, PageIntro, Panel, SearchInput, Status } from '../../components/ui/Elements';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(getProjects());
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Todos');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [family, setFamily] = useState('');
  const families = ['Red convolucional (CNN)','Red generativa adversaria (GAN)', ];
  const filtered = useMemo(()=>projects.filter(p=>(p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())) && (status==='Todos'||p.status===status)),[projects,search,status]);
  const openNew = (p?: Project) => { setEditing(p || null); setName(p?.name || ''); setDescription(p?.description || ''); setOwner(p?.owner || ''); setFamily(p?.family || ''); setModal(true); };
  const save = (e: React.FormEvent) => { e.preventDefault(); if(!name.trim()) return; const next = editing ? projects.map(p=>p.id===editing.id?{...p,name:name.trim(),description,owner,family}:p) : [{id:Math.max(0,...projects.map(p=>p.id))+1,name:name.trim(),description,owner,family,status:'Borrador' as const,createdAt:new Date().toISOString().slice(0,10),architectures:0,trainings:0,activity:'Ahora',tags:['Nuevo']},...projects]; setProjects(next); saveProjects(next); setModal(false); };
  const archive = (p: Project) => { if(window.confirm(`¿Archivar el proyecto "${p.name}" ?`)){const next=projects.map(x=>x.id===p.id?{...x,status:'Archivado' as const}:x);setProjects(next);saveProjects(next);} };
  return <div className="page-stack"><PageIntro eyebrow="WORKSPACE / PROYECTOS" title="Proyectos de IA" description="Organiza tus experimentos, arquitecturas y ejecuciones en un solo espacio." action={<Button onClick={()=>openNew()}><Plus size={16}/> Nuevo proyecto</Button>}/>
    <div className="stats-strip"><div><span>Proyectos visibles</span><b>{projects.length.toString().padStart(2,'0')}</b></div><div><span>Activos</span><b>{projects.filter(p=>p.status==='Activo').length.toString().padStart(2,'0')}</b></div><div><span>Arquitecturas</span><b>{projects.reduce((n,p)=>n+p.architectures,0)}</b></div><div><span>Entrenamientos</span><b>{projects.reduce((n,p)=>n+p.trainings,0)}</b></div></div>
    <Panel title="Todos los proyectos" subtitle={`${filtered.length} proyectos encontrados`}><div className="table-toolbar"><SearchInput value={search} onChange={setSearch} placeholder="Buscar proyectos..."/><select className="filter-select" value={status} onChange={e=>setStatus(e.target.value)}><option>Todos</option><option>Activo</option><option>Borrador</option><option>Archivado</option></select></div>
      <div className="table-scroll"><table><thead><tr><th>PROYECTO</th><th>RESPONSABLE</th><th>FAMILIA DE RED NEURONAL</th><th>ESTADO</th><th>ARQUITECTURAS</th><th>ENTRENAMIENTOS</th><th>ÚLTIMA ACTIVIDAD</th><th></th></tr></thead><tbody>{filtered.map(p=><tr key={p.id}><td><div className="table-project"><div className="project-icon"><FolderKanban size={17}/></div><div><b>{p.name}</b><small>{p.description}</small><div className="tag-row">{p.tags.map(t=><span className="tag" key={t}>{t}</span>)}</div></div></div></td><td>{p.owner}</td><td>{p.family || 'Sin definir'}</td><td><Status>{p.status}</Status></td><td>{p.architectures}</td><td>{p.trainings}</td><td>{p.activity}</td><td><div className="row-actions"><button title="Editar" onClick={()=>openNew(p)}><Pencil size={15}/></button><button title="Archivar" onClick={()=>archive(p)}><MoreHorizontal size={16}/></button></div></td></tr>)}</tbody></table>{filtered.length===0&&<div className="empty-state">No hay proyectos que coincidan con los filtros.</div>}</div>
    </Panel>
    {modal&&<div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><form className="modal-card" onSubmit={save}><div className="modal-head"><div><span className="eyebrow">{editing?'EDITAR':'NUEVO'} PROYECTO </span><h3>{editing?'Editar proyecto':'Crear proyecto'}</h3></div><button type="button" className="icon-button" onClick={()=>setModal(false)}><X size={18}/></button></div><label>Nombre del proyecto<input autoFocus value={name} onChange={e=>setName(e.target.value)} required minLength={3} placeholder="Ej. Predicción de demanda"/></label><label>Descripción<textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3} placeholder="¿Qué problema quieres resolver?"/></label><label>Responsable<input value={owner} onChange={e=>setOwner(e.target.value)} required/></label><label>Familia de red neuronal<select className="project-family-select" value={family} onChange={e=>setFamily(e.target.value)} required><option value="">Selecciona una familia</option>{families.map(item=><option key={item} value={item}>{item}</option>)}</select></label><div className="demo-form-note">La información se guarda en este navegador, no en una base de datos compartida.</div><div className="modal-actions"><Button variant="secondary" onClick={()=>setModal(false)}>Cancelar</Button><Button type="submit"><Plus size={15}/>{editing?'Guardar cambios':'Crear proyecto'}</Button></div></form></div>}
  </div>;
}
