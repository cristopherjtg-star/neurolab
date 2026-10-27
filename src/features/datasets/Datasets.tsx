import { useEffect, useMemo, useRef, useState } from 'react';
import { FileUp, FileSpreadsheet, Info, Plus, UploadCloud, Trash2 } from 'lucide-react';
import { Button, PageIntro, Panel, Status } from '../../components/ui/Elements';

type DatasetRecord = {
  id: string;
  name: string;
  size: number;
  records: number;
  columns: string[];
  previewRows: string[][];
  date: string;
  content: string;
};
const STORAGE_KEY = 'neurolab-datasets-v1';

function parseCsv(text: string): { columns: string[]; rows: string[][] } {
  const lines: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const source = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (char === '"') {
      if (quoted && source[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(cell); cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && source[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some(value => value.trim() !== '')) lines.push(row);
      row = [];
    } else cell += char;
  }
  row.push(cell);
  if (row.some(value => value.trim() !== '')) lines.push(row);
  if (lines.length < 2) throw new Error('El CSV debe contener una fila de encabezados y al menos un registro.');
  const columns = lines[0].map((value, index) => value.trim() || `columna_${index + 1}`);
  const rows = lines.slice(1).map(values => columns.map((_, index) => (values[index] ?? '').trim()));
  return { columns, rows };
}
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
function readSavedDatasets(): DatasetRecord[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as DatasetRecord[]; }
  catch { return []; }
}

export default function Datasets() {
  const [datasets, setDatasets] = useState<DatasetRecord[]>(() => readSavedDatasets());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [train, setTrain] = useState(70);
  const [valid, setValid] = useState(15);
  const inputRef = useRef<HTMLInputElement>(null);
  const test = 100 - train - valid;
  const allRecords = useMemo(() => datasets.reduce((sum, dataset) => sum + dataset.records, 0), [datasets]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(datasets)); }
    catch { setError('No se pudo guardar en el navegador. Libera espacio del almacenamiento del sitio e inténtalo de nuevo.'); }
  }, [datasets]);

  async function handleFile(file?: File) {
    if (!file) return;
    setError(''); setSuccess(''); setSelectedFile(null); setFileContent(''); setColumns([]); setRows([]);
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Selecciona un archivo .csv. Esta versión procesa archivos CSV.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    if (file.size === 0) { setError('El archivo está vacío. Comprueba que el CSV tenga contenido.'); return; }
    try {
      const content = await file.text();
      const parsed = parseCsv(content);
      // Registrar en cuanto el CSV se lee correctamente, sin depender de que el usuario
      // encuentre y pulse un segundo botón al final de la vista previa.
      const record: DatasetRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        size: file.size,
        records: parsed.rows.length,
        columns: parsed.columns,
        previewRows: parsed.rows.slice(0, 5),
        date: new Date().toLocaleString('es-PE'),
        content,
      };
      const current = readSavedDatasets();
      const updated = [record, ...current.filter(item => item.name !== record.name)];
      // Persistir antes de actualizar la interfaz; si falla, se muestra el error real.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setDatasets(updated);
      window.dispatchEvent(new CustomEvent('neurolab-datasets-updated', { detail: updated }));
      setSelectedFile(file);
      setFileContent(content);
      setColumns(parsed.columns);
      setRows(parsed.rows);
      setError('');
      setSuccess(`Dataset "${record.name}" registrado correctamente: ${record.records} registros y ${record.columns.length} columnas.`);
    } catch (e) {
      setError(e instanceof Error && e.message.includes('cuota')
        ? 'El navegador no tiene espacio suficiente para guardar este CSV. Elimina datasets antiguos o usa un archivo más pequeño.'
        : e instanceof Error && (e.message.includes('CSV') || e.message.includes('encabezados'))
          ? e.message
          : 'No se pudo leer o registrar el CSV en el navegador. Comprueba que el archivo sea válido y que el almacenamiento del sitio esté habilitado.');
    }
  }

  function removeDataset(id: string) {
    setDatasets(current => {
      const updated = current.filter(dataset => dataset.id !== id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* useEffect mostrará el error si corresponde */ }
      window.dispatchEvent(new CustomEvent('neurolab-datasets-updated', { detail: updated }));
      return updated;
    });
  }

  return <div className="page-stack">
    <PageIntro eyebrow="GESTIÓN DE DATOS" title="Datasets" description="Importa archivos CSV, revisa sus columnas y registra conjuntos de datos para tus experimentos." action={<Button onClick={() => inputRef.current?.click()}><Plus size={16}/> Registrar dataset</Button>}/>
    <div className="stats-strip"><div><span>Datasets registrados</span><b>{datasets.length}</b></div><div><span>Registros importados</span><b>{allRecords}</b></div><div><span>Archivos CSV</span><b>{datasets.length}</b></div><div><span>Columnas detectadas</span><b>{datasets.reduce((sum, d) => sum + d.columns.length, 0)}</b></div></div>
    <Panel title="Conjuntos de datos" subtitle={`${datasets.length} dataset(s) guardado(s) en este navegador`}>
      <div className="table-scroll"><table><thead><tr><th>DATASET</th><th>TIPO</th><th>TAMAÑO</th><th>REGISTROS</th><th>COLUMNAS</th><th>VERSIÓN</th><th>ESTADO</th><th></th></tr></thead>
        <tbody>{datasets.map(d => <tr key={d.id}><td><div className="table-project"><div className="project-icon"><FileSpreadsheet size={17}/></div><div><b>{d.name}</b><small>Importado {d.date}</small></div></div></td><td>CSV</td><td>{formatBytes(d.size)}</td><td>{d.records}</td><td>{d.columns.length}</td><td>v1</td><td><Status>Validado</Status></td><td><Button variant="danger" onClick={() => removeDataset(d.id)}><Trash2 size={13}/> Eliminar</Button></td></tr>)}</tbody>
      </table>{datasets.length === 0 && <div className="empty-state">Todavía no hay datasets. Selecciona un archivo CSV para importar tus propios datos.</div>}</div>
    </Panel>
    <div className="two-column">
      <Panel title="Importar archivo CSV" subtitle="El archivo se lee y procesa localmente en tu navegador">
        <input ref={inputRef} type="file" hidden accept=".csv,text/csv" onChange={event => void handleFile(event.target.files?.[0])}/>
        <button className="upload-zone" onClick={() => inputRef.current?.click()} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); void handleFile(event.dataTransfer.files?.[0]); }}>
          <div className="upload-icon"><UploadCloud size={23}/></div><b>{selectedFile?.name || 'Selecciona o arrastra un archivo CSV'}</b>
          <span>{selectedFile ? `Tamaño real: ${formatBytes(selectedFile.size)}` : 'Haz clic aquí o arrastra el CSV desde tu computadora'}</span><small>Formato compatible: .csv · El contenido se lee en este navegador</small>
        </button>
        {error && <div className="dataset-error" role="alert">{error}</div>}
        {success && <div className="dataset-success" role="status">{success}</div>}
        {selectedFile && <>
          <div className="dataset-metadata"><b>Archivo leído correctamente</b><div><span>Registros detectados</span><strong>{rows.length}</strong></div><div><span>Columnas detectadas</span><strong>{columns.length}</strong></div><div className="dataset-columns"><span>Columnas</span><p>{columns.join(' · ')}</p></div></div>
          <div className="dataset-preview"><b>Vista previa (primeras {Math.min(rows.length, 5)} filas)</b><div className="table-scroll"><table><thead><tr>{columns.map((column, index) => <th key={`${column}-${index}`}>{column}</th>)}</tr></thead><tbody>{rows.slice(0, 5).map((row, ri) => <tr key={ri}>{columns.map((_, ci) => <td key={ci}>{row[ci]}</td>)}</tr>)}</tbody></table></div></div>
          <div className="upload-actions"><Button variant="secondary" onClick={() => { setSelectedFile(null); setFileContent(''); setColumns([]); setRows([]); setError(''); setSuccess(''); if (inputRef.current) inputRef.current.value = ''; }}>Cerrar vista previa</Button><Button disabled><FileUp size={15}/> Dataset registrado</Button></div>
        </>}
        <div className="info-callout compact"><Info size={16}/><div><b>Almacenamiento local</b><p>El CSV se procesa y guarda en este navegador. No se envía a un servidor ni se comparte con otros dispositivos.</p></div></div>
      </Panel>
      <Panel title="Distribución del dataset" subtitle="Porcentajes de referencia para tus experimentos"><div className="split-summary"><div><b>{train}%</b><span>Entrenamiento</span></div><div><b>{valid}%</b><span>Validación</span></div><div><b>{test}%</b><span>Prueba</span></div></div><div className="split-bar"><i style={{width:`${train}%`}}/><i style={{width:`${valid}%`}}/><i style={{width:`${test}%`}}/></div><label className="range-label">Entrenamiento <b>{train}%</b><input type="range" min="50" max="90" value={train} onChange={event => { const value = Number(event.target.value); setTrain(value); if (value + valid > 95) setValid(100 - value - 5); }}/></label><label className="range-label">Validación <b>{valid}%</b><input type="range" min="5" max={Math.max(5, Math.min(30, 100 - train - 5))} value={valid} onChange={event => setValid(Math.min(Number(event.target.value), 100 - train - 5))}/></label><div className="split-footnote">Total: {train + valid + test}% · Distribución de referencia; no modifica el CSV original.</div></Panel>
    </div>
  </div>;
}
