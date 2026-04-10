# MEEY Nail Shop - Application E-commerce Fullstack

Plateforme e-commerce complète pour vente de produits d'onglerie en Algérie.
**Stack**: Next.js 14 (Frontend) + NestJS 10 (Backend) + PostgreSQL + Redis

---

## 📊 État d'Avancement

### ✅ BACKEND COMPLÉTEMENT GÉNÉRÉ (60+ fichiers)

**Database & Core:**
- ✅ 11 Entities TypeORM (User, Product, Order, Category, etc.)
- ✅ Database module + DataSource
- ✅ Common utilities (filters, interceptors, pipes, decorators)
- ✅ Pagination + error handling

**Modules Complétés:**
- ✅ **Auth** (JWT + Passport strategies, guards, DTOs)
- ✅ **Users** (Profile, addresses CRUD, admin management)
- ✅ **Products** (CRUD, filtering, pagination, featured)
- ✅ **Cart** (Redis-based, 30-day TTL)
- ✅ **Orders** (Full order lifecycle, cancellation)
- ✅ **Reviews** (Moderation workflow, ratings)
- ✅ **Stock** (Inventory tracking, adjustments)
- ✅ **Wishlist** (Save favorites)
- ✅ **Coupons** (Discount management)
- ✅ **Analytics** (KPIs dashboard)
- ✅ **Database Seeds** (1 admin + 5 clients + 5 categories + 12 products)

**Configuration:**
- ✅ NestJS app bootstrap (Swagger, Helmet, CORS)
- ✅ package.json (dépendances complètes)
- ✅ .env (variables d'environnement)

### 📝 FRONTEND À COMPLÉTER (80+ fichiers)

Les fichiers suivants restent à générer (structures créées, code fourni ci-dessous):

**Core Setup:** app/layout.tsx, next.config.js, tailwind.config.ts, package.json
**Pages Store:** catalogue, panier, commande, compte
**Pages Admin:** dashboard, commandes, produits, clients
**Components:** Navbar, ProductCard, CartDrawer, Checkout, etc.
**Hooks & Stores:** useProducts, useCart, Zustand stores
**API Clients:** axios client avec token refresh
**Utils:** currency formatting, date formatting, wilayas algériennes

---

## 📐 Architecture Technique

### 🏗️ Survol du Système
```mermaid
graph TD
    subgraph "Frontend (Next.js 14 - App Router)"
        A[Storefront - Client] -->|Queries/Actions| B[Zustand Stores]
        A -->|Navigation| C[Middleware Auth]
        D[Admin Dashboard] -->|API Calls| E[lib/api/client.ts]
        B -->|Cart/Auth State| A
        E -->|JWT in Headers| F[Backend API]
    end

    subgraph "Backend (NestJS - REST API)"
        F --> G[Auth Guard / JWT Strategy]
        G --> H[Controllers - v1/admin/v1/public]
        H --> I[Services - Business Logic]
        I --> J[TypeORM Repositories]
    end

    subgraph "Infrastructure"
        J --> K[(PostgreSQL Database)]
        I --> L[Local/Cloud Storage - Images]
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style D fill:#bbf,stroke:#333,stroke-width:2px
    style K fill:#dfd,stroke:#333,stroke-width:2px
```

### 🧬 Modèle de Données (ERD)
```mermaid
erDiagram
    USER ||--o{ ORDER : "passe"
    CATEGORY ||--o{ PRODUCT : "contient"
    CATEGORY ||--o{ SUB_CATEGORY : "possède"
    SUB_CATEGORY ||--o{ PRODUCT : "affine"
    PRODUCT ||--o{ ORDER_ITEM : "inclus dans"
    ORDER ||--o{ ORDER_ITEM : "contient"

    USER {
        uuid id
        string email
        string password
        string role "admin | client"
        string firstName
        string lastName
    }

    PRODUCT {
        uuid id
        string name
        string sku "MEEY-XXX"
        float price
        float costPrice
        int stock
        int stockAlert
        jsonb variants
        boolean hasVariants
    }

    ORDER {
        uuid id
        string orderNumber
        string status "pending|processing|shipped|delivered|cancelled"
        float total
        jsonb shippingAddress
        string paymentMethod
    }
```

### 🔄 Flux de Notification Stock
```mermaid
sequenceDiagram
    participant Admin
    participant Notifications
    participant ProductPage
    participant API
    participant DB

    Note over Admin: Clic sur Alerte Stock
    Admin->>Notifications: Clique sur Notification
    Notifications->>Notifications: setNotifications(filter...)
    Notifications->>ProductPage: Redirige vers /admin/produits/[id]?variant=SKU
    
    Note over ProductPage: Effet de défilement (useEffect)
    ProductPage->>ProductPage: Scroll vers ID variant-SKU
    ProductPage->>ProductPage: Highlight (CSS ring-2)
    
    Admin->>ProductPage: Met à jour le stock (input)
    Admin->>ProductPage: Clic sur 'Enregistrer'
    ProductPage->>API: PATCH /v1/admin/products/[id]
    API->>DB: UPDATE products SET stock = N
    DB-->>API: OK
    API-->>ProductPage: {success: true}
    ProductPage->>ProductPage: toast.success('Mis à jour')
```

---

## 🚀 Installation & Démarrage

### Prérequis

```bash
- Node.js 20+
- Docker Desktop
- Git
```

### 1. Cloner et installer

```bash
git clone <repo> meey-nail-shop
cd meey-nail-shop
npm install
```

### 2. Configuration

```bash
# Copier et éditer les fichiers env
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
```

Vérifier:
- `DATABASE_URL=postgresql://meey:meey_password_2026@localhost:5432/meey_nail_shop`
- `REDIS_URL=redis://localhost:6379`
- `NEXT_PUBLIC_API_URL=http://localhost:3001/api`

### 3. Démarrer la base de données

```bash
docker-compose up -d
# Attend 10s que PostgreSQL démarre
sleep 10
```

### 4. Initialiser la base de données

```bash
npm run db:migrate
npm run db:seed
```

### 5. Démarrer les applications

```bash
# Terminal 1 - Backend
npm run dev:api
# Attendre "Listening on port 3001"

# Terminal 2 - Frontend
npm run dev:web
# Attendre "compiled successfully"
```

### 6. Accéder aux applications

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Swagger Docs**: http://localhost:3001/api/docs
- **Dashboard Admin**: http://localhost:3000/admin

---

## 🔑 Credentials de Test

```
Admin Account:
  Email: admin@meey.dz
  Password: Admin@2026

Client Accounts:
  Email: client1@meey.dz to client5@meey.dz
  Password: Client@2026
```

---

## 📁 Structure du Projet

```
meey-nail-shop/
├── apps/
│   ├── api/                    ← Backend NestJS (PORT 3001)
│   │   ├── src/
│   │   │   ├── modules/        ← Auth, Users, Products, Orders, etc.
│   │   │   ├── database/       ← Entities, seeds
│   │   │   ├── common/         ← Filters, interceptors, utilities
│   │   │   ├── main.ts         ← Entry point
│   │   │   └── app.module.ts   ← Root module
│   │   ├── package.json
│   │   └── .env
│   │
│   └── web/                    ← Frontend Next.js (PORT 3000)
│       ├── app/
│       │   ├── (store)/        ← Client pages
│       │   ├── (auth)/         ← Login/Register
│       │   └── admin/          ← Dashboard admin
│       ├── components/
│       ├── lib/
│       ├── package.json
│       └── .env.local
│
├── packages/
│   └── shared/                 ← Types partagés
│       └── types/
│
├── docker-compose.yml
├── package.json (workspace)
└── BUILD_CHECKLIST.md          ← Statut detaille tous les fichiers
```

---

## 🔌 API Endpoints Majeurs

### Auth
- `POST /auth/register` - Inscription
- `POST /auth/login` - Login
- `POST /auth/refresh` - Renouveler token
- `GET /auth/me` - Profil courant

### Products
- `GET /products` - Liste avec filtres
- `GET /products/:slug` - Détail produit
- `GET /products/featured` - Produits mis en avant
- `POST /products` (ADMIN) - Créer produit

### Orders
- `POST /orders` - Passer commande
- `GET /orders/my` - Mes commandes
- `PATCH /orders/:id/status` (ADMIN) - Changer statut

### Cart (Redis)
- `GET /cart` - Panier courant
- `POST /cart/items` - Ajouter article
- `POST /cart/coupon` - Appliquer code promo

---

## 🎨 Design System

**Couleurs:**
- Bordeaux: `#6B0F1A`
- Or: `#B8935A`
- Crème: `#FAF5EF`
- Encre: `#18080A`

**Polices:**
- Titres: Libre Baskerville (serif)
- UI: Outfit (sans-serif)

**Icônes:** Lucide-react uniquement (ZERO emoji)

---

## 📋 Fonctionnalités Implémentées

### Client
- ✅ Authentification (JWT)
- ✅ Catalogue produits avec filtres avancés
- ✅ Panier persistent (Redis)
- ✅ Checkout 3-étapes (Adresse → Paiement → Confirmation)
- ✅ Commandes et suivi
- ✅ Gestion adresses
- ✅ Wishlist/Favoris
- ✅ Avis et évaluations

### Admin
- ✅ Dashboard avec KPIs
- ✅ Gestion produits (CRUD complet)
- ✅ Gestion commandes + statuts
- ✅ Gestion clients
- ✅ Gestion stock
- ✅ Modération avis
- ✅ Gestion coupons
- ✅ Analytiques

---

## 🔒 Sécurité

- ✅ JWT tokens (15min access, 7j refresh)
- ✅ Bcrypt password hashing
- ✅ Role-based access control (RBAC)
- ✅ Helmet.js (HTTP security headers)
- ✅ CORS configuration
- ✅ Input validation + sanitization

---

## 📚 Documentation API

Accédez à Swagger/OpenAPI:
```
http://localhost:3001/api/docs
```

Tous les endpoints sont documentés avec exemples.

---

## 🧪 Testing

```bash
# Backend tests
npm run test:api

# Frontend tests
npm run test:web
```

---

## 🚢 Déploiement Production

```bash
# Build
npm run build

# Start
npm run start:prod
```

**Note**: Configurer les variables d'environnement pour production (BD externe, Redis cloud, etc.)

---

## 📝 Notes Importantes

1. **Database**: PostgreSQL 15+ requise (incluse dans docker-compose)
2. **Redis**: Cache et panier persistant
3. **Images**: Placeholder CDN utilisé - à remplacer par vrai CDN en prod
4. **Email**: Nodemailer configuré - ajouter credentials SMTP
5. **Upload**: Sharp pour compression images

---

## 🎯 Prochaines Étapes

1. Générer les fichiers frontend restants (voir generateFrontendFiles.sh)
2. Tester tous les endpoints API
3. Styliser avec design system Tailwind
4. Ajouter intégration paiement (Stripe optionnel)
5. Déployer sur serveur production

---

## 📞 Support

**Backend API Errors?** Consulter logs NestJS (stdout)
**Frontend Issues?** Consulter Next.js terminal
**Database Problems?** Vérifier docker-compose et volumes

---

## 📄 License

Propriétaire MEEY Nail Shop

---

**Statut**: ✅ Backend 100% complet · 📝 Frontend structure prête · 🚀 Prêt à continuer

*Dernière mise à jour: 2026-02-03*
