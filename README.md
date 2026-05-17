# 📚 Expo Académica de Pósters

Plataforma académica para presentación de pósters de proyectos estudiantiles.

## 🚀 Inicio rápido

### Requisitos
- Node.js 18+ instalado
- npm o yarn

### Instalación

```bash
# 1. Entra a la carpeta del proyecto
cd poster-academico

# 2. Instala dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

La app abrirá en `http://localhost:3000`

### Build para producción

```bash
npm run build
npm run preview   # para probar el build localmente
```

---

## 🔐 Credenciales de acceso

### Grupos estudiantiles

| Grupo   | Correo                 | Contraseña      |
|---------|------------------------|-----------------|
| Grupo 1 | grupo1@poster.edu      | G1Poster2026*   |
| Grupo 2 | grupo2@poster.edu      | G2Poster2026*   |
| Grupo 3 | grupo3@poster.edu      | G3Poster2026*   |
| Grupo 4 | grupo4@poster.edu      | G4Poster2026*   |
| Grupo 5 | grupo5@poster.edu      | G5Poster2026*   |

### Administrador

| Usuario       | Correo               | Contraseña    |
|---------------|----------------------|---------------|
| Administrador | admin@poster.edu     | Admin2026*#   |

---

## ⚙️ Modificar credenciales

Edita el archivo `src/context/AuthContext.jsx`:

```js
export const GROUPS = [
  { id: 'grupo1', email: 'nuevo@correo.com', password: 'NuevaPass123*', name: 'Grupo 1', members: 3 },
  // ...
]

export const ADMIN = { email: 'admin@nuevo.com', password: 'AdminPass*' }
```

---

## 📁 Estructura del proyecto

```
poster-academico/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / .css
│   │   └── Footer.jsx / .css
│   ├── context/
│   │   └── AuthContext.jsx      ← Credenciales y persistencia
│   ├── pages/
│   │   ├── Login.jsx / .css
│   │   ├── Dashboard.jsx / .css ← Panel de grupo
│   │   ├── PublicGallery.jsx / .css ← Galería pública
│   │   └── Admin.jsx / .css     ← Panel admin
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

---

## 🛠️ Tecnologías

- **React 18** + **Vite**
- **localStorage** para persistencia (sin backend externo)
- **Lucide React** para íconos

## 💾 Almacenamiento

Los proyectos y archivos (imágenes/PDF) se guardan en el `localStorage` del navegador como Base64. Esto es ideal para desarrollo y pruebas.

> **Para producción universitaria real**, se recomienda migrar a Firebase Storage + Firestore o Supabase. La lógica de `AuthContext.jsx` ya está separada para facilitar esta migración.

---

## 🚀 Deploy en GitHub Pages

```bash
# 1. Agrega al package.json:
"homepage": "https://tuusuario.github.io/poster-academico"

# 2. Instala gh-pages
npm install --save-dev gh-pages

# 3. Agrega scripts en package.json:
"predeploy": "npm run build"
"deploy": "gh-pages -d dist"

# 4. Despliega
npm run deploy
```

---

## ✅ Funcionalidades

- [x] Login privado por grupo (5 grupos)
- [x] Panel de administrador
- [x] Subida de póster (JPG, PNG, PDF hasta 10 MB)
- [x] Formulario: título, objetivo general, resultados
- [x] Una sola publicación por grupo
- [x] Edición y eliminación del proyecto
- [x] Vista previa antes de publicar
- [x] Galería pública sin login
- [x] Buscador de proyectos
- [x] Filtro por grupo
- [x] Descarga de PDF
- [x] Contador de visitas
- [x] Diseño responsive (móvil y escritorio)
- [x] Mensajes de éxito y error
