# 🚀 CashFlow App Telepítése Vercel-re

## Miért Vercel?
- ✅ **Ingyenes** (hobby projektekhez)
- ✅ **Automatikus deploy** (Git push után)
- ✅ **Next.js optimalizált** (a Vercel készítette a Next.js-t)
- ✅ **HTTPS** automatikusan
- ✅ **Gyors** (CDN, edge functions)

---

## 📋 Lépések (10 perc)

### 1. Git Repository létrehozása

Ha még nincs Git repo, inicializáld:

```bash
git init
git add .
git commit -m "Initial commit - CashFlow App"
```

### 2. GitHub Repository létrehozása

1. Menj a https://github.com/new címre
2. Repository név: `cashflow-app` (vagy bármi más)
3. **Private** vagy **Public** (te döntöd)
4. **NE** adj hozzá README-t, .gitignore-t (már van)
5. Kattints **"Create repository"**

### 3. Projekt feltöltése GitHub-ra

Másold be a GitHub által megadott parancsokat:

```bash
git remote add origin https://github.com/FELHASZNALONEV/cashflow-app.git
git branch -M main
git push -u origin main
```

### 4. Vercel Account létrehozása

1. Menj a https://vercel.com/signup címre
2. Jelentkezz be **GitHub fiókkal** (ez a legegyszerűbb)
3. Engedélyezd a Vercel-nek a GitHub hozzáférést

### 5. Projekt Deploy-olása

1. A Vercel Dashboard-on kattints **"Add New Project"**
2. Válaszd ki a `cashflow-app` repository-t
3. **Framework Preset:** Next.js (automatikusan felismeri)
4. **Root Directory:** `./` (alapértelmezett)
5. **Build Command:** `npm run build` (automatikusan)
6. **Output Directory:** `.next` (automatikusan)

### 6. Környezeti változók beállítása

**FONTOS!** A Deploy előtt add hozzá ezeket:

Kattints **"Environment Variables"** → Add meg:

```
NEXT_PUBLIC_SUPABASE_URL = https://gybbbwdrylmqcifkspcq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_YVTJ_DC-THDjVTt5xJonJA_NDD2WYsc
```

### 7. Deploy!

Kattints **"Deploy"** → Várj 2-3 percet ☕

---

## 🎉 Kész!

Az alkalmazásod elérhető lesz egy ilyen címen:
```
https://cashflow-app-XXXXXXX.vercel.app
```

### Automatikus deploy

Mostantól **minden Git push után** automatikusan újra deploy-ol:

```bash
git add .
git commit -m "Új funkció hozzáadva"
git push
```

---

## 🔧 Alternatívák (ha nem Vercel-t szeretnél)

### Netlify
- Hasonló a Vercel-hez
- Ingyenes tier
- https://netlify.com

### Railway
- Ingyenes $5 kredit havonta
- Jobb adatbázis támogatás
- https://railway.app

### Cloudflare Pages
- Ingyenes
- Gyors CDN
- https://pages.cloudflare.com

---

## ⚠️ Fontos megjegyzések

1. **Ne commitold a `.env.local` fájlt!** (már a `.gitignore`-ban van)
2. **Supabase URL-t** a Vercel-en állítsd be (Environment Variables)
3. **Production build** előtt teszteld lokálisan:
   ```bash
   npm run build
   npm start
   ```

---

## 🆘 Hibaelhárítás

### "Build failed" hiba
- Ellenőrizd a környezeti változókat
- Futtasd le lokálisan: `npm run build`
- Nézd meg a Vercel build log-okat

### "Database connection error"
- Ellenőrizd a Supabase URL-t és API key-t
- Győződj meg róla, hogy a Vercel-en is be vannak állítva

### "Page not found"
- Ellenőrizd a `middleware.ts` fájlt
- Nézd meg a Vercel Functions log-okat

---

Szólj, ha bármi kérdésed van a deploy során! 🚀
