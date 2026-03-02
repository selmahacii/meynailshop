# 🚀 Comment Démarrer MEEY Nail Shop

## Option 1: Démarrer Rapidement (Recommandé)

### Étape 1: Vérifier que les services Docker sont actifs

```bash
docker-compose ps
```

Vous devriez voir:
- ✅ meey-postgres UP (port 5433)
- ✅ meey-redis UP (port 6380)

Si non, démarrez-les:
```bash
docker-compose up -d
```

### Étape 2: Démarrer l'API Mock

```bash
npm run dev:api
```

Ou directement:
```bash
node mock-api.js
```

Vous verrez:
```
✅ Mock API server running on http://localhost:3001
```

### Étape 3: Démarrer le Frontend

Dans un nouveau terminal:
```bash
npm run dev:web
```

Ou:
```bash
cd apps/web && npm run dev
```

Vous verrez:
```
✓ Ready in 2.1s
- Local:         http://localhost:3000
```

---

## Option 2: Démarrer Tout en Parallèle

```bash
npm run dev
```

Cela démarre:
- API Mock @ http://localhost:3001
- Frontend @ http://localhost:3000

(Si vous avez configuré `concurrently` dans le package.json root)

---

## Option 3: Démarrage Complet Pas à Pas

### Étape 1: Installation des dépendances
```bash
npm install
```

### Étape 2: Configuration des variables d'environnement

Vérifiez que les fichiers .env existent:

**Backend** (`apps/api/.env`):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/meey_db
REDIS_URL=redis://localhost:6380
API_PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`apps/web/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Étape 3: Démarrer Docker
```bash
docker-compose up -d
```

### Étape 4a: Option A - Démarrer uniquement le Frontend (avec Mock API)

Terminal 1 - Mock API:
```bash
node mock-api.js
```

Terminal 2 - Frontend:
```bash
cd apps/web && npm run dev
```

### Étape 4b: Option B - Démarrer tout avec npm

Terminal unique (si concurrently est configuré):
```bash
npm run dev
```

---

## 🌐 Accès à l'Application

Une fois démarrée:

| Component | URL | Statut |
|-----------|-----|--------|
| **Frontend** | http://localhost:3000 | ✅ |
| **API Health** | http://localhost:3001/api/health | ✅ |
| **API Products** | http://localhost:3001/api/products | ✅ |

---

## 🔐 Credentials pour Tester

```
Admin:
- Email:    admin@meey.dz
- Password: (n'importe quel mot de passe)
- Role:    Admin

Client:
- Email:    client@meey.dz
- Password: (n'importe quel mot de passe)
- Role:    Client
```

---

## 🧪 Vérifier que tout fonctionne

### 1. Vérifier l'API
```bash
curl http://localhost:3001/api/health
```

Réponse attendue:
```json
{"statusCode":200,"message":"API is running"}
```

### 2. Vérifier les produits
```bash
curl http://localhost:3001/api/products
```

Doit retourner une liste de produits.

### 3. Vérifier le Frontend
Ouvrir le navigateur:
```
http://localhost:3000
```

Vous devriez voir la page d'accueil avec hero, catégories, produits.

---

## 📋 Script npm Disponibles

```bash
# Frontend
npm run dev:web              # Démarrer dev frontend
npm run build:web            # Build pour production
npm run start:web            # Démarrer prod

# Backend
npm run dev:api              # Démarrer dev backend
npm run build:api            # Build backend

# Tout
npm run dev                  # Démarrer tout (si concurrently)
npm run dev:parallel         # Alternative parallèle
```

---

## 🐛 Si ça ne marche pas

### Le port 3000 est déjà utilisé
```bash
# Trouver le process
netstat -ano | findstr :3000

# Ou le tuer
taskkill /PID <PID> /F
```

### L'API ne répond pas
```bash
# Vérifier le mock-api.js
node mock-api.js

# Ou redémarrer les services Docker
docker-compose restart
```

### Problèmes de dépendances
```bash
# Réinstaller tout
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Next.js cache
```bash
# Nettoyer le cache
rm -rf apps/web/.next
npm run dev:web
```

---

## ✅ Checklist de Démarrage

- [ ] Docker Desktop installé et tourné
- [ ] `docker-compose up -d` exécuté (PostgreSQL + Redis actifs)
- [ ] `node mock-api.js` démarré (API sur 3001)
- [ ] `npm run dev:web` démarré (Frontend sur 3000)
- [ ] Navigateur ouvert sur http://localhost:3000
- [ ] Voir la home page s'afficher
- [ ] Cliquer sur "Catalogue" pour voir les produits
- [ ] Tester "Add to Cart"
- [ ] Tester le checkout
- [ ] Vérifier les ordres créées

---

## 🎉 C'est parti!

L'application est maintenant prête à être testée. Commencez par:

1. **Accueil**: http://localhost:3000
2. **Catalogue**: http://localhost:3000/catalogue
3. **Panier**: http://localhost:3000/panier
4. **Checkout**: Complétez une commande
5. **Admin**: http://localhost:3000/admin/dashboard

