# Modelo 3D (opcional)

Coloque **`aircraft.glb`** nesta pasta (`public/models/aircraft.glb`).

A aplicação valida o arquivo pelos primeiros bytes (`glTF`). Se o arquivo não existir, ou se o servidor devolver HTML (erro comum no Vite), usa automaticamente o **jato procedural** — a página não quebra.

## Fontes gratuitas (CC0 / glTF)

- https://market.pmnd.rs
- https://sketchfab.com (Downloadable + CC0)
- https://kenney.nl

## Download (PowerShell)

```powershell
cd public\models
Invoke-WebRequest -Uri "URL_DO_MODELO.glb" -OutFile "aircraft.glb"
```

Reinicie `npm run dev` após adicionar o arquivo.
