# Despliegue — Admin (Vite/React en Vercel)

El admin se despliega automáticamente en Vercel cada vez que haces `git push` a `main`. Esta guía cubre el **setup inicial** (una sola vez).

---

## Prerequisito

Necesitas primero tener desplegado el backend y conocer su URL pública.

---

## Paso 1 — Crear proyecto en Vercel

1. Ir a https://vercel.com → **Add New Project**
2. Importar el repositorio `crokete-admin`
3. Vercel detecta Vite. El `vercel.json` ya configura todo:
   - `outputDirectory: "build"`
   - Rutas SPA manejadas correctamente

No cambies nada en la config de build.

---

## Paso 2 — Configurar variables de entorno

En Vercel: **Settings → Environment Variables** → Agrega cada una:

| Variable | Valor |
|---|---|
| `VITE_APP_API_BASE_URL` | `https://TU-BACKEND-URL/v1` |
| `VITE_APP_API_SOCKET_URL` | `https://TU-BACKEND-URL` |
| `VITE_APP_STORE_DOMAIN` | `https://tu-store.vercel.app` |
| `VITE_APP_ADMIN_DOMAIN` | `https://tu-admin.vercel.app` |
| `VITE_APP_SHOP_NAME` | `Crokete` |
| `VITE_APP_CLOUD_NAME` | Tu cloud name de Cloudinary |
| `VITE_APP_CLOUDINARY_API_KEY` | Tu API key de Cloudinary |
| `VITE_APP_CLOUDINARY_UPLOAD_PRESET` | Tu upload preset de Cloudinary |
| `VITE_APP_CLOUDINARY_URL` | `https://api.cloudinary.com/v1_1/TU_CLOUD_NAME/image/upload` |
| `VITE_APP_ENCRYPT_PASSWORD` | El mismo valor que `ENCRYPT_PASSWORD` del backend |
| `VITE_APP_MYMEMORY_API_KEY` | (opcional) API key de MyMemory para traducción |

> **IMPORTANTE:** `VITE_APP_ENCRYPT_PASSWORD` debe ser exactamente igual al `ENCRYPT_PASSWORD` del backend. Si no coinciden, el cifrado de datos del admin fallará.

---

## Paso 3 — Primer despliegue

```bash
git push origin main
```

---

## Paso 4 — Dominio personalizado (opcional)

En Vercel: **Settings → Domains** → Agrega tu dominio (ej: `admin.tudominio.com`).

Después de agregar el dominio:
1. Actualiza `VITE_APP_ADMIN_DOMAIN` con el dominio real
2. Actualiza el secret `admin-url-secret` en GCP Secret Manager con la nueva URL
3. Redespliega el backend para actualizar CORS: `git push` en `crokete-backend`

---

## Despliegues futuros

Solo haz `git push origin main`. Vercel despliega en ~1-2 min.

```bash
git add .
git commit -m "descripción del cambio"
git push origin main
```
