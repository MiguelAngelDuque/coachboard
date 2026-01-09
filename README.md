# CoachBoard

App web para gestionar un equipo: **jugadores**, **sesiones** (entrenos/partidos) y **partidos con convocatoria**.
Persistencia en **LocalStorage** + utilidades de **importar/exportar JSON**.

## Demo
https://miguelangelduque.github.io/coachboard/

## Funcionalidades
- Login mock (para demo)
- CRUD de Jugadores
- CRUD de Sesiones (Entreno / Partido)
- CRUD de Partidos + Convocatoria (checkbox por jugador)
- Botones: **Ejemplo / Exportar / Importar**
- Datos guardados en LocalStorage

## Stack
- React + Vite
- React Router
- LocalStorage

## Captura
![CoachBoard screenshot](./screenshot.png)

## Ejecutar en local
```bash
npm install
npm run dev


### B) Añade la captura
1) Abre tu demo local, entra en **Partidos**, y mete 2–3 cosas.
2) **Win + Shift + S** → captura.
3) Guarda como **`screenshot.png`** en la raíz del repo (misma carpeta que `package.json`).

### C) Commit + push
```powershell
git add README.md screenshot.png
git commit -m "Docs: add README and screenshot"
git push

