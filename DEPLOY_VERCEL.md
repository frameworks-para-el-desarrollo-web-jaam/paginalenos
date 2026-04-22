# Despliegue en Vercel

## 1. Frontend en Vercel
- Crea un proyecto en Vercel apuntando a la carpeta `lenos-front`.
- Build command: `npm run build`
- Output directory: `dist`
- Variables de entorno:
  - `VITE_API_URL=https://TU-BACKEND.vercel.app/api`

## 2. Backend en Vercel
- Crea otro proyecto en Vercel apuntando a la carpeta `lenos-backend`.
- Vercel puede ejecutar Express directamente en Node.js. Mantuvimos la API preparada para leer variables de entorno y cookies cross-site en produccion.
- Variables de entorno recomendadas:
  - `TOKEN_SECRET=un_valor_largo_y_seguro`
  - `FRONTEND_URL=https://TU-FRONTEND.vercel.app`
  - `CORS_ORIGINS=` opcional, lista separada por comas si quieres permitir mas origins
  - `MONGODB_URI=` se puede inyectar automaticamente desde la integracion de MongoDB Atlas en Vercel

## 3. MongoDB Atlas desde Vercel
- En Vercel Marketplace agrega la integracion `MongoDB Atlas` al proyecto backend.
- Esa integracion puede aprovisionar un cluster Atlas y agregar `MONGODB_URI` automaticamente al proyecto.
- La API ya prioriza `MONGODB_URI` y luego hace fallback a valores locales para desarrollo.

## 4. Desarrollo local
- Frontend: `lenos-front/.env`
  - `VITE_API_URL=http://localhost:3000/api`
- Backend: `lenos-backend/.env`
  - `PORT=3000`
  - `TOKEN_SECRET=...`
  - `MONGODB_URI=mongodb://localhost:27017/ventalenos`
  - `FRONTEND_URL=http://localhost:5173`

## 5. Importante sobre imagenes
- Hoy los productos usan `multer` con carpeta local `uploads`.
- En Vercel ese almacenamiento no es persistente.
- Con la configuracion actual, la app y Mongo pueden desplegarse, pero las imagenes de productos no son una solucion de produccion estable.
- Para cerrar ese punto bien hay que mover imagenes a un storage externo como Cloudinary, S3 o Vercel Blob.

## 6. Nota sobre la URL del backend
- Vercel si inyecta variables de entorno durante el build de Vite.
- Lo correcto en este proyecto es definir `VITE_API_URL` en el proyecto frontend de Vercel.
- Esa inyeccion es automatica en build una vez configurada la variable, pero Vercel no descubre por si solo la URL de otro proyecto separado.
