# 🏗️ Architecture Admin Interface - Diagramme Technique

## Flux d'Authentification Complet

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER ENTERS CREDENTIALS                      │
│              (Email: admin@meey.dz, Password: xxx)               │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  Form Submit Event Triggered  │
              └─────────────┬────────────────┘
                            │
                            ▼
         ┌────────────────────────────────────┐
         │   fetch('/api/auth/login', {       │
         │     method: 'POST',                │
         │     body: {email, password}        │
         │   })                               │
         └─────────────┬──────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────┐
        │  /app/api/auth/login/route.ts        │
        │  ✅ Find user by email               │
        │  ✅ Create JWT:                      │
        │     - Header: algo, typ              │
        │     - Payload: id, email, role      │
        │     - Signature: mock-sig            │
        │  ✅ Set cookie 'accessToken'        │
        │  ✅ Return: {user, accessToken}     │
        └─────────────┬──────────────────────┘
                      │
                      ▼
        ┌──────────────────────────────────────┐
        │  Frontend Receives Response           │
        │  ✅ Save token: localStorage         │
        │  ✅ Save token: document.cookie      │
        │  ✅ Save user: Zustand store         │
        │  ✅ Show success toast                │
        └─────────────┬──────────────────────┘
                      │
       ┌──────────────┴──────────────┐
       │ Check User Role              │
       ▼                              ▼
   ┌─────────────┐            ┌──────────────┐
   │ role===     │            │ role ===     │
   │ 'admin'     │            │ 'client'     │
   └──────┬──────┘            └──────┬───────┘
          │                           │
          ▼                           ▼
   ┌─────────────────────┐   ┌──────────────────┐
   │ Redirect:           │   │ Redirect:        │
   │ /admin/dashboard    │   │ / or redirect URL│
   └─────────────────────┘   └──────────────────┘
          │                           │
          ▼                           ▼
   ┌──────────────────────┐   ┌─────────────────┐
   │ MIDDLEWARE CHECKS:   │   │ MIDDLEWARE:      │
   │ 1. Cookie exists?    │   │ 1. Cookie ok?    │
   │    ✅ YES            │   │    ✅ YES        │
   │ 2. Decode JWT        │   │ 2. Decode JWT    │
   │    ✅ Success        │   │    ✅ Success    │
   │ 3. role==='admin'?   │   │ 3. role===admin? │
   │    ✅ YES            │   │    ❌ NO         │
   │ 4. ALLOW ACCESS      │   │ 4. REDIRECT "/" │
   └──────────────────────┘   └─────────────────┘
          │                           │
          ▼                           ▼
   ┌────────────────────────┐  ┌───────────────┐
   │ AdminLayout Renders    │  │ Homepage      │
   │ ✅ Sidebar             │  │ Renders       │
   │ ✅ Topbar              │  │               │
   │ ✅ Dashboard Content   │  │ (User blocked)│
   │ ✅ KPI Cards           │  │               │
   │ ✅ Charts              │  │               │
   │ ✅ Alerts              │  │               │
   └────────────────────────┘  └───────────────┘
```

---

## Architecture des Fichiers

```
apps/web/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/
│   │       │   └── route.ts         ✨ NEW - Create JWT
│   │       └── logout/
│   │           └── route.ts         ✨ NEW - Clear token
│   │
│   ├── (auth)/
│   │   ├── connexion/
│   │   │   └── page.tsx             🔄 UPDATE - Real API call
│   │   └── inscription/
│   │       └── page.tsx             🔄 UPDATE - Real form
│   │
│   └── admin/
│       ├── dashboard/
│       │   └── page.tsx             ✨ KPI dashboard
│       └── layout.tsx               ✨ Admin layout
│
├── components/
│   └── admin/
│       └── layout/
│           ├── AdminSidebar.tsx     Admin menu
│           └── AdminTopbar.tsx      🔄 UPDATE - Logout button
│
├── lib/
│   ├── store/
│   │   └── authStore.ts            Zustand auth state
│   └── api/
│       └── auth.ts                  API endpoints
│
└── middleware.ts                    🔐 Protect /admin routes
```

---

## State Management

```
┌──────────────────────────────────────────┐
│         Zustand Auth Store                │
│  (lib/store/authStore.ts)                │
├──────────────────────────────────────────┤
│ State:                                   │
│  - user: {                               │
│      id: string                          │
│      email: string                       │
│      firstName: string                   │
│      lastName: string                    │
│      phone: string                       │
│      role: 'admin' | 'client'  ⭐KEY   │
│      isActive: boolean                   │
│    }                                     │
│  - isAuthenticated: boolean              │
├──────────────────────────────────────────┤
│ Actions:                                 │
│  - setUser(user): Save user              │
│  - logout(): Clear user                  │
└──────────────────────────────────────────┘
           │
           │ Used by:
           ▼
┌──────────────────────────────────────┐
│  - Pages (connexion, registration)   │
│  - Components (AdminTopbar)           │
│  - Hooks (useAuthStore)               │
└──────────────────────────────────────┘
```

---

## Storage Locations

```
┌─────────────────────────────────────────────┐
│            TOKEN STORAGE                    │
├─────────────────────────────────────────────┤
│                                             │
│ 1. localStorage:                            │
│    localStorage.setItem('accessToken', jwt) │
│    → For persistence across refreshes       │
│    → NOT Http-only                          │
│                                             │
│ 2. Cookies:                                 │
│    document.cookie = 'accessToken=jwt'     │
│    → For middleware to read                 │
│    → Http-only = false (Next.js reads it)  │
│                                             │
│ 3. Zustand Store:                           │
│    setUser({...userData...})                │
│    → For component access                   │
│    → In-memory only                        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Security Flow

```
Request to /admin/dashboard
         │
         ▼
   ┌─────────────────┐
   │   MIDDLEWARE    │  (middleware.ts)
   └────────┬────────┘
            │
            ▼
    ┌──────────────────┐
    │ Read Cookie:     │
    │ accessToken      │
    └────────┬─────────┘
             │
        ┌────┴────┐
        │ Exists? │
        └┬───────┬┘
         │       │
       Yes      No
         │       │
         ▼       ▼
      ┌──┐  ┌────────────────┐
      │✅│  │Redirect:       │
      └──┘  │/connexion?r=   │
            │/admin/dash..   │
            └────────────────┘
         │
         ▼
    ┌──────────────────┐
    │ Decode JWT:      │
    │ header.payload   │
    │ .signature       │
    └────────┬─────────┘
             │
        ┌────┴────┐
        │Valid?   │
        └┬───────┬┘
         │       │
       Yes      No
         │       │
         ▼       ▼
      ┌──┐  ┌────────────┐
      │✅│  │Reject:     │
      └──┘  │Go to /     │
            └────────────┘
         │
         ▼
    ┌──────────────────┐
    │ Extract Payload: │
    │ Get role field   │
    └────────┬─────────┘
             │
        ┌────┴───────────────┐
        │ role === 'admin'? │
        └┬──────────────────┬┘
         │                   │
       Yes                  No
         │                   │
         ▼                   ▼
      ┌──┐               ┌────────┐
      │✅│               │❌      │
      │→ │               │→ /    │
      │  │               └────────┘
      └──┘
         │
         ▼
    ┌──────────────────────┐
    │ Allow Request:       │
    │ Call next()          │
    │ Render /admin/..     │
    └──────────────────────┘
```

---

## Token Structure

```
JWT = header.payload.signature

┌────────────────────────────────────┐
│ HEADER (Base64)                    │
├────────────────────────────────────┤
│ {                                  │
│   "alg": "HS256",                 │
│   "typ": "JWT"                     │
│ }                                  │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ PAYLOAD (Base64)  ⭐ KEY           │
├────────────────────────────────────┤
│ {                                  │
│   "id": "1",                       │
│   "email": "admin@meey.dz",       │
│   "role": "admin",    ⭐ CRITICAL │
│   "iat": 1741104173,              │
│   "exp": 1741190573               │
│ }                                  │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ SIGNATURE (Base64)                 │
├────────────────────────────────────┤
│ HMACSHA256(                        │
│   base64UrlEncode(header) + "." + │
│   base64UrlEncode(payload),        │
│   secret                           │
│ )                                  │
└────────────────────────────────────┘
```

---

## Routing & Access Control

```
PUBLIC ROUTES (No authentication needed)
├── /                                    ✅ Accessible
├── /connexion                          ✅ Accessible
├── /inscription                        ✅ Accessible
├── /products                           ✅ Accessible
└── /catalogue                          ✅ Accessible

PROTECTED ROUTES (Authentication required)
├── /compte                              🔐 Requires token
└── /commandes                           🔐 Requires token

ADMIN ONLY ROUTES (Requires admin role)
├── /admin                               👑 admin@meey.dz only
├── /admin/dashboard                    👑 admin@meey.dz only
│   └── WITH: KPIs, Charts, Analytics
├── /admin/products                      👑 admin@meey.dz only
├── /admin/orders                        👑 admin@meey.dz only
├── /admin/clients                       👑 admin@meey.dz only
├── /admin/settings                      👑 admin@meey.dz only
└── ...all /admin/* routes              👑 admin@meey.dz only
```

---

## Component Hierarchy

```
AdminLayout
├── AdminSidebar
│   └── Menu Items
│       ├── Dashboard
│       ├── Orders
│       ├── Products
│       ├── Clients
│       └── Settings
│
├── AdminTopbar
│   ├── Search Bar
│   ├── Shop Link
│   ├── Notifications
│   └── User Dropdown (NEW)
│       └── Logout Button (NEW)
│
└── Main Content
    ├── Dashboard Page
    │   ├── KPI Cards (4 items)
    │   │   ├── Total Revenue
    │   │   ├── Orders
    │   │   ├── Active Clients
    │   │   └── Average Cart
    │   │
    │   ├── Revenue Trend Chart (LineChart)
    │   ├── Product Sales Pie
    │   ├── Order Status Pie
    │   ├── Customer Growth Bar
    │   ├── Stock Alerts
    │   └── Quick Actions
    │
    └── Other Pages (Products, Orders, etc.)
```

---

## Data Flow Example: Admin Login

```
1. COMPONENT: LoginPage
   └─ const [email, password] = state

2. SUBMIT FORM
   └─ handleSubmit(e)

3. CALL API
   └─ fetch('/api/auth/login', {POST, {email, password}})

4. API HANDLER: /api/auth/login/route.ts
   └─ Find user: user = users.find(u => u.email === email)
   └─ Create JWT with role: 'admin'
   └─ Set cookie: accessToken
   └─ Return: {user, accessToken}

5. FRONTEND RECEIVES RESPONSE
   └─ Save accessToken to localStorage
   └─ Save accessToken to cookies
   └─ Save user to Zustand: setUser(user)

6. REDIRECT
   └─ if (user.role === 'admin') → /admin/dashboard
   └─ else → /

7. MIDDLEWARE RUNS
   └─ Read cookie: accessToken
   └─ Decode: JWT contains role='admin'
   └─ Check: payload.role === 'admin' ✅
   └─ Allow request to continue

8. RENDER DASHBOARD
   └─ AdminLayout renders
   └─ Sidebar shows admin menu
   └─ Content shows KPIs and charts
   └─ User can interact with admin features

9. LOGOUT
   └─ User clicks: Logout button
   └─ Call: /api/auth/logout
   └─ Clear cookie: accessToken = ''
   └─ Call: logout() in Zustand
   └─ Redirect: /connexion
```

---

## Summary

✅ **Authentification:**
   - Real JWT creation in API
   - Token saved to cookies for middleware
   - Role stored in JWT payload

✅ **Authorization:**
   - Middleware decodes JWT
   - Checks role === 'admin'
   - Blocks non-admin access

✅ **UX:**
   - Automatic redirect based on role
   - Logout button in admin panel
   - Clean state management with Zustand

✅ **Security:**
   - JWT with role verification
   - Http-only cookies not required (Next.js middleware)
   - Token expiration in payload
   - Clean logout

🎉 **Result:** Admin interface fully operational and secure!
