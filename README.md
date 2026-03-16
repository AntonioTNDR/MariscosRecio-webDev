# 🦞 Mariscos Recio — Web

> Sitio web "oficial" para **Mariscos Recio**. Desde esta web podrás crear ver el pescado más fresco de mi pescadería. Orgullos patrocinadores de Los Leones de Montepinar F.C.

<!-- Captura de pantalla (opcional pero recomendado) -->
<!-- ![Preview](public/img/preview.png) -->

---

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|---|---|
| [Next.js 14](https://nextjs.org/) | Framework React con App Router |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático |
| [Tailwind CSS](https://tailwindcss.com/) | Estilos utility-first |
| ESLint + Prettier | Linting y formateo de código |

---

## 📁 Estructura del proyecto

```
MariscosRecio-webDev/
├── src/              # Código fuente (componentes, páginas, lógica)
├── public/
│   └── img/          # Imágenes estáticas
├── db/               # Base de datos / esquema
├── .env.local        # Variables de entorno (no incluido en el repo)
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Instalación y uso

### Prerrequisitos

- Node.js 18+
- npm / yarn / pnpm

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/AntonioTNDR/MariscosRecio-webDev.git
cd MariscosRecio-webDev

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Edita .env.local con tus valores

# 4. Arrancar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Build optimizado para producción |
| `npm run start` | Arrancar el servidor de producción |
| `npm run lint` | Análisis de código con ESLint |

---

## ⚙️ Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env

DATABASE_URL=mongodb://127.0.0.1:27017/
NEXT_PUBLIC_API_URL=SuperSecretKey
```

---

## 👤 Autor

**Antonio Tendero Beltrán**

---

## 📄 Licencia

Este proyecto es de uso privado.
