import { useEffect, useState } from 'react';
import { Activity, CircleStop, Play, RotateCcw, Settings2 } from 'lucide-react';
import type { TrainingJob } from '../../types';
import { Button, PageIntro, Panel, Status } from '../../components/ui/Elements';

type SavedDataset = { id: string; name: string; records: number; columns: string[]; size: number; date: string; };
const DATASETS_KEY = 'neurolab-datasets-v1';
const JOBS_KEY = 'neurolab-training-jobs-v1';
function readDatasets(): SavedDataset[] {
  try { return JSON.parse(localStorage.getItem(DATASETS_KEY) || '[]') as SavedDataset[]; }
  catch { return []; }
}
function readJobs(): TrainingJob[] {
  try { return JSON.parse(localStorage.getItem(JOBS_KEY) || '[]') as TrainingJob[]; }
  catch { return []; }
}

export default function Training() {
  const [datasets, setDatasets] = useState<SavedDataset[]>(() => readDatasets());
  const [jobs, setJobs] = useState<TrainingJob[]>(() => readJobs());
  const [name, setName] = useState('');
  const [architecture, setArchitecture] = useState('');
  const [datasetId, setDatasetId] = useState('');
  const [epochs, setEpochs] = useState(30);
  const [batch, setBatch] = useState(32);
  const [optimizer, setOptimizer] = useState('Adam');
  const [runningId, setRunningId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const refresh = () => {
      const latest = readDatasets();
      setDatasets(latest);
      setDatasetId(current => latest.some(d => d.id === current) ? current : '');
    };
    window.addEventListener('storage', refresh);
    window.addEventListener('neurolab-datasets-updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('neurolab-datasets-updated', refresh);
    };
  }, []);

  useEffect(() => {
    try { localStorage.setItem(JOBS_KEY, JSON.stringify(jobs)); } catch { setMessage('No se pudieron guardar las ejecuciones en el almacenamiento local.'); }
  }, [jobs]);

  useEffect(() => {
    if (!runningId) return;
    const timer = window.setInterval(() => setJobs(old => old.map(j => {
      if (j.id !== runningId || j.status !== 'Ejecutando') return j;
      const progress = Math.min(100, j.progress + Math.ceil(Math.random() * 7));
      const epoch = Math.min(j.totalEpochs, j.epoch + 2);
      return { ...j, progress, epoch, duration: '00:00:' + String(Math.floor(Math.random() * 59)).padStart(2, '0'), status: progress >= 100 || epoch >= j.totalEpochs ? 'Completado' : 'Ejecutando' };
    })), 1000);
    return () => window.clearInterval(timer);
  }, [runningId]);

  useEffect(() => {
    const current = jobs.find(j => j.id === runningId);
    if (current && current.status === 'Completado') setRunningId(null);
  }, [jobs, runningId]);

  const selectedDataset = datasets.find(dataset => dataset.id === datasetId);
  const start = () => {
    if (!name.trim() || !architecture || !selectedDataset) {
      setMessage('Completa el nombre, selecciona una arquitectura y un dataset registrado.');
      return;
    }
    const id = `TR-${Date.now().toString().slice(-6)}`;
    const job: TrainingJob = {
      id, project: name.trim(), architecture, dataset: selectedDataset.name,
      status: 'Ejecutando', progress: 0, epoch: 0, totalEpochs: epochs,
      started: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }), duration: '00:00:00'
    };
    setJobs(old => [job, ...old]);
    setRunningId(id);
    setMessage(`Configuración registrada con el dataset ${selectedDataset.name}. La ejecución es una simulación de interfaz.`);
  };
  const cancel = (id: string) => {
    setJobs(old => old.map(j => j.id === id ? { ...j, status: 'Cancelado' } : j));
    if (runningId === id) setRunningId(null);
  };
  const retry = (job: TrainingJob) => {
    const id = `TR-${Date.now().toString().slice(-6)}`;
    setJobs(old => [{ ...job, id, status: 'Ejecutando', progress: 0, epoch: 0, started: 'Ahora', duration: '00:00:00' }, ...old]);
    setRunningId(id);
  };

  return <div className="page-stack">
    <PageIntro eyebrow="EXPERIMENT TRACKING" title="Entrenamientos" description="Configura ejecuciones y observa su progreso simulado sin ejecutar machine learning real." action={<span className="demo-pill large"><span/> CONFIGURACIÓN</span>}/>
    <div className="stats-strip"><div><span>En ejecución</span><b>{jobs.filter(j => j.status === 'Ejecutando').length.toString().padStart(2, '0')}</b></div><div><span>En cola</span><b>{jobs.filter(j => j.status === 'En cola').length.toString().padStart(2, '0')}</b></div><div><span>Completados</span><b>{jobs.filter(j => j.status === 'Completado').length.toString().padStart(2, '0')}</b></div><div><span>Fallidos</span><b>{jobs.filter(j => j.status === 'Fallido').length.toString().padStart(2, '0')}</b></div></div>
    <div className="two-column training-columns">
      <Panel title="Configurar entrenamiento" subtitle="Define los parámetros de tu experimento"><div className="properties-form">
        <label>Nombre del experimento<input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Prueba de clasificación"/></label>
        <label>Arquitectura<select value={architecture} onChange={e => setArchitecture(e.target.value)}><option value="">Seleccionar arquitectura</option>{['Perceptrón multicapa (MLP)', 'CNN', 'RNN', 'LSTM / GRU', 'Transformer', 'Autoencoder', 'GAN', 'GNN', 'SOM', 'Feedforward'].map(option => <option key={option} value={option}>{option}</option>)}</select></label>
        <label>Dataset<select value={datasetId} onChange={e => { setDatasetId(e.target.value); setMessage(''); }}><option value="">Seleccionar dataset</option>{datasets.map(dataset => <option key={dataset.id} value={dataset.id}>{dataset.name} — {dataset.records} registros · {dataset.columns.length} columnas</option>)}</select></label>
        {datasets.length === 0 && <p className="form-caption">No hay datasets registrados. Ve a Datasets, importa un CSV y guárdalo; aparecerá aquí automáticamente.</p>}
        {selectedDataset && <div className="dataset-metadata"><b>Dataset seleccionado</b><div><span>Registros</span><strong>{selectedDataset.records}</strong></div><div><span>Columnas</span><strong>{selectedDataset.columns.length}</strong></div><div className="dataset-columns"><span>Variables disponibles</span><p>{selectedDataset.columns.join(' · ')}</p></div></div>}
        <div className="form-row"><label>Épocas<input type="number" min="1" max="500" value={epochs} onChange={e => setEpochs(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}/></label><label>Batch size<select value={batch} onChange={e => setBatch(Number(e.target.value))}>{[16, 32, 64, 128].map(n => <option key={n} value={n}>{n}</option>)}</select></label></div>
        <label>Optimizador<select value={optimizer} onChange={e => setOptimizer(e.target.value)}>{['Adam', 'SGD', 'RMSprop', 'Adagrad'].map(x => <option key={x}>{x}</option>)}</select></label>
        <div className="config-chips"><span><Settings2 size={13}/>{optimizer}</span><span>Batch {batch}</span><span>{epochs} épocas</span></div>
        {message && <div className={message.startsWith('No se') || message.startsWith('Completa') ? 'dataset-error' : 'dataset-success'} role="status">{message}</div>}
        <Button onClick={start} disabled={!name.trim() || !architecture || !selectedDataset || epochs < 1}><Play size={15}/> Registrar configuración</Button>
        <p className="form-caption">La configuración y sus ejecuciones se guardan en este navegador. El entrenamiento de IA es simulado.</p>
      </div></Panel>
      <Panel title="Ejecuciones recientes" subtitle="Estado y progreso de los trabajos"><div className="training-list">{jobs.length === 0 && <div className="empty-state">No hay entrenamientos registrados. Selecciona un dataset y completa la configuración para agregar información.</div>}{jobs.map(j => <article className="training-item" key={j.id}><div className="training-item-top"><div className="training-symbol"><Activity size={17}/></div><div className="training-title"><b>{j.id} <span>{j.project}</span></b><small>{j.architecture} · {j.dataset}</small></div><Status>{j.status}</Status></div><div className="training-progress-head"><span>Progreso simulado</span><b>{j.progress}%</b></div><div className="progress-track"><i style={{ width: `${j.progress}%` }}/></div><div className="training-meta"><span>Época {j.epoch}/{j.totalEpochs}</span><span>Inicio: {j.started}</span><span>Duración: {j.duration}</span></div><div className="training-item-actions">{j.status === 'Ejecutando' || j.status === 'En cola' ? <Button variant="secondary" onClick={() => cancel(j.id)}><CircleStop size={14}/> Solicitar cancelación</Button> : j.status === 'Fallido' || j.status === 'Cancelado' ? <Button variant="secondary" onClick={() => retry(j)}><RotateCcw size={14}/> Reintentar DEMO</Button> : <span className="completed-note">✓ Finalizado en modo DEMO</span>}</div></article>)}</div></Panel>
    </div>
    <div className="info-callout"><Activity size={17}/><div><b>Sin ejecución real de modelos</b><p>Los temporizadores, métricas y estados son simulados en el navegador. La ejecución TensorFlow/Keras requiere la API y los workers.</p></div></div>
  </div>;
}
