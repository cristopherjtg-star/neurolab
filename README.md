# NeuroLab Enterprise — Frontend simplificado

Interfaz modular creada con React, TypeScript y Vite. La aplicación inicia sin registros precargados y permite agregar información propia en los formularios disponibles.

## Requisitos
- Node.js 20.19+ o 22.12+
- npm

## Ejecutar en Windows / VS Code
```bash
npm install
npm run dev
```
Abre la dirección local que muestre Vite (normalmente `http://localhost:5173`).

## Comprobar la compilación
```bash
npm run typecheck
npm run build
```

## Módulos
Inicio, Proyectos, Fundamentos neuronales, Arquitecturas, Datasets, Entrenamientos, Evaluación, Modelos, Reportes y Administración.

## Importante
- No se incluyen registros de ejemplo precargados.
- Los proyectos que agregues se guardan en el almacenamiento local de este navegador. No se guardan en una base de datos compartida.
- La selección de archivos y las configuraciones de entrenamiento son de interfaz; no se cargan archivos a un servidor ni se ejecutan modelos reales.
- Para guardar y compartir información entre usuarios o equipos será necesario conectar un backend y una base de datos.
