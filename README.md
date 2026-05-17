# 📚 Pósters
### Ciclo de Profundización: PreIngeniería 2026
### Politécnico Los Alpes

Plataforma web académica para la presentación y consulta pública de pósters estudiantiles del curso de PreIngeniería sobre Cálculo Diferencial, Integral y Álgebra Lineal.

---

## 🚀 Inicio rápido

### Requisitos
- Node.js 18+ instalado
- npm

### Instalación y ejecución local

```bash
npm install
npm run dev
```

La app abrirá en `http://localhost:3000`

---

## 🔐 Credenciales de acceso

### Grupos estudiantiles

| Grupo   | Correo                 | Contraseña      | Integrantes |
|---------|------------------------|-----------------|-------------|
| Grupo 1 | grupo1@poster.edu      | G1Poster2026*   | 3           |
| Grupo 2 | grupo2@poster.edu      | G2Poster2026*   | 3           |
| Grupo 3 | grupo3@poster.edu      | G3Poster2026*   | 3           |
| Grupo 4 | grupo4@poster.edu      | G4Poster2026*   | 3           |
| Grupo 5 | grupo5@poster.edu      | G5Poster2026*   | 4           |

### Administrador

| Correo               | Contraseña    |
|----------------------|---------------|
| admin@poster.edu     | Admin2026*#   |

---

## ⚙️ Modificar credenciales

Edita `src/context/AuthContext.jsx`, las constantes `GROUPS` y `ADMIN` al inicio del archivo.

---

## 📁 Estructura del proyecto
web-poster/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / .css
│   │   └── Footer.jsx / .css
│   ├── context/
│   │   └── AuthContext.jsx        ← Credenciales y persistencia
│   ├── pages/
│   │   ├── Login.jsx / .css
│   │   ├── Dashboard.jsx / .css
│   │   ├── PublicGallery.jsx / .css
│   │   └── Admin.jsx / .css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json

---

## ✅ Funcionalidades

- [x] Login privado por grupo (5 grupos predefinidos)
- [x] Sin registro libre de usuarios
- [x] Subida de póster (JPG, PNG, PDF — máx. 10 MB)
- [x] Formulario: título, objetivo general, resultados
- [x] Una sola publicación por grupo
- [x] Edición y eliminación del proyecto
- [x] Vista previa antes de publicar
- [x] Galería pública sin login
- [x] Buscador de proyectos y filtro por grupo
- [x] Descarga de imágenes y PDF
- [x] Panel de administrador con estadísticas
- [x] Contador de visitas por proyecto
- [x] Diseño responsive (móvil y escritorio)

---

## 🚀 Deploy en GitHub Pages

```bash
npm install --save-dev gh-pages
```

Agrega en `package.json`:
```json
"homepage": "https://JhonatanSolano.github.io/Posters-PreIngenieria",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Luego:
```bash
npm run deploy
```

---

## 👨‍💻 Repositorio

[github.com/JhonatanSolano/Posters-PreIngenieria](https://github.com/JhonatanSolano/Posters-PreIngenieria)
