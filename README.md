# 🌱 AgroSmart — Plateforme CRM Agricole Intelligente

> Application fullstack B2B de gestion commerciale pour le secteur des fertilisants agricoles au Maroc, intégrant un assistant IA basé sur Gemini.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Django](https://img.shields.io/badge/Django-5.1-092E20?logo=django)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)

---

## 📋 Table des matières

1. [Présentation du projet](#-présentation-du-projet)
2. [Choix de design UX/UI](#-choix-de-design-uxui)
3. [Technologies utilisées](#-technologies-utilisées)
4. [Architecture du projet](#-architecture-du-projet)
5. [Fonctionnalités](#-fonctionnalités)
6. [Installation et exécution](#-installation-et-exécution)
7. [Comptes de démonstration](#-comptes-de-démonstration)
8. [Défis techniques et compromis](#-défis-techniques-et-compromis)
9. [Lien Figma](#-lien-figma)

---

## 🎯 Présentation du projet

**AgroSmart** est une application web CRM (Customer Relationship Management) dédiée au secteur agricole marocain. Elle permet aux commerciaux de gérer les commandes de fertilisants, suivre les clients par région, et bénéficier de recommandations intelligentes grâce à l'IA.

### Pourquoi AgroSmart ?

Le secteur agricole marocain manque d'outils digitaux adaptés aux spécificités locales (régions, saisons, types de cultures). AgroSmart répond à ce besoin avec :
- Un **tableau de bord** interactif avec KPIs en temps réel
- Un **système de commandes** multi-étapes avec suggestions IA
- Un **assistant IA** expert en fertilisants et agriculture marocaine
- Un **contrôle d'accès** par rôles (Admin / Commercial)

---

## 🎨 Choix de design UX/UI

### Système de design Material Design 3

L'interface suit les principes du **Material Design 3** (M3) de Google, adapté au domaine agricole :

| Principe | Implémentation |
|----------|---------------|
| **Palette couleurs** | Tons verts (#036b55 primary) inspirés de la nature |
| **Typographie** | Manrope — moderne, lisible, avec tracking -0.02em |
| **Surfaces** | Hiérarchie via `surface-container`, `surface-variant` |
| **Ombres** | Ambient shadows teintées de vert (rgba(30,107,82)) |
| **Bordures** | `outline-variant` (#bec9c3) pour la subtilité |
| **Feedback** | Animations fadeSlideUp, scaleIn sur les actions |

### Expérience utilisateur immersive

1. **Formulaire multi-étapes** : La création de commande utilise un stepper visuel (Client → Produits → Livraison → Confirmation) qui réduit la surcharge cognitive.

2. **Suggestions IA contextuelles** : Après sélection des produits, l'IA Gemini analyse la région et les choix pour recommander des compléments pertinents.

3. **Feedback en temps réel** : Chaque action utilisateur génère un retour visuel immédiat — confirmations animées, badges de statut colorés, indicateurs de chargement.

4. **Responsive design** : L'interface s'adapte aux écrans desktop et tablette avec un sidebar rétractable.

### Défis UX adressés

- **Surcharge d'information** → Résolu par la pagination serveur et les filtres
- **Navigation complexe** → Résolu par le sidebar avec icônes et labels
- **Saisie de commande** → Résolu par le wizard multi-étapes avec validation progressive
- **Compréhension des données** → Résolu par les graphiques interactifs (Recharts)

---

## 🛠 Technologies utilisées

### Frontend
| Technologie | Version | Rôle |
|-------------|---------|------|
| React | 19 | Framework UI |
| TypeScript | 5.6 | Typage statique |
| Vite | 6 | Build tool |
| TanStack Query | 5 | Gestion d'état serveur & cache |
| TanStack Table | 8 | Tableaux interactifs |
| Recharts | 2 | Graphiques & visualisation |
| Zustand | 5 | État global (auth, sidebar) |
| React Router | 7 | Navigation SPA |
| Lucide React | — | Icônes SVG cohérentes |

### Backend
| Technologie | Version | Rôle |
|-------------|---------|------|
| Django | 5.1 | Framework web |
| Django REST Framework | 3.15 | API REST |
| SimpleJWT | 5 | Authentification JWT |
| Google Gemini | — | IA (suggestions + chat) |
| SQLite | — | Base de données (dev) |

### Justification des choix

- **React + TypeScript** : Typage fort pour la fiabilité, écosystème riche
- **Vite** : Build ultra-rapide vs Create React App
- **TanStack Query** : Cache intelligent, invalidation automatique, pas de sur-requêtes
- **Django REST** : Robuste, batteries incluses (auth, ORM, admin)
- **Zustand** : Plus léger que Redux, API simple pour un CRM
- **Gemini AI** : API gratuite, excellente compréhension du français

---

## 📐 Architecture du projet

```
agrosmart/
├── backend/                    # Django REST API
│   ├── agrosmart/             # Configuration Django
│   │   ├── settings.py        # JWT, CORS, pagination
│   │   └── urls.py
│   ├── api/                   # Application API
│   │   ├── models.py          # Region, Client, Category, Product, Order
│   │   ├── serializers.py     # DRF serializers + validation
│   │   ├── views.py           # ViewSets + permissions
│   │   ├── pagination.py      # FlexiblePagination custom
│   │   ├── ai_service.py      # Intégration Gemini
│   │   └── urls.py            # Routage API
│   ├── seed/                  # Données de démonstration
│   └── requirements.txt
│
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── Layout.tsx # Sidebar + Header + Outlet
│   │   ├── pages/
│   │   │   ├── Login.tsx      # Page de connexion (Figma M3)
│   │   │   ├── Dashboard.tsx  # KPIs + 4 graphiques
│   │   │   ├── Orders.tsx     # Liste paginée + filtres
│   │   │   ├── NewOrder.tsx   # Wizard multi-étapes + IA
│   │   │   ├── OrderDetail.tsx
│   │   │   ├── Products.tsx   # Catalogue TanStack Table
│   │   │   ├── Chat.tsx       # Assistant IA Gemini
│   │   │   └── Users.tsx      # Gestion utilisateurs (admin)
│   │   ├── hooks/
│   │   │   └── useApi.ts      # Hooks TanStack Query
│   │   ├── stores/
│   │   │   └── index.ts       # Zustand (auth + sidebar + chat)
│   │   ├── lib/
│   │   │   ├── axios.ts       # Intercepteur JWT
│   │   │   └── utils.ts       # Formatage MAD, dates
│   │   ├── types/
│   │   │   └── index.ts       # Interfaces TypeScript
│   │   ├── index.css          # Design system M3 complet
│   │   ├── App.tsx            # Routes + AdminRoute guard
│   │   └── main.tsx
│   └── package.json
│
└── README.md
```

### Relation Backend ↔ Frontend

```
Frontend (React)          API REST (Django)           Base de données
    │                         │                           │
    ├── POST /token/    ───►  ├── SimpleJWT          ───► │ auth_user
    ├── GET  /kpis/     ───►  ├── Aggregation        ───► │ orders, products
    ├── GET  /orders/   ───►  ├── Pagination + Filter ──► │ orders
    ├── POST /orders/   ───►  ├── Validation         ───► │ orders + items
    ├── POST /ai/chat/  ───►  ├── Gemini API         ───► │ (externe)
    └── GET  /users/    ───►  └── IsAdmin check      ───► │ auth_user
```

---

## ✨ Fonctionnalités

### 1. Tableau de bord (Dashboard)
- 4 KPIs en temps réel (CA, commandes, produits, clients)
- Graphique d'évolution des ventes sur 12 mois (Area Chart)
- Répartition par région (Pie Chart donut)
- Ventes par catégorie (Bar Chart horizontal)
- Top 6 produits par revenus
- 5 dernières commandes

### 2. Gestion des commandes
- Liste complète avec **pagination serveur** (10/page)
- **Recherche** par référence ou nom de client
- **Filtre par statut** (Brouillon, Confirmée, Expédiée, Livrée, Annulée)
- Création via **formulaire multi-étapes** avec stepper visuel
- **Suggestions IA** automatiques basées sur la sélection

### 3. Catalogue produits
- Tableau interactif avec **tri** sur chaque colonne
- **Filtres par catégorie** (Engrais Bio, NPK Composés, etc.)
- Indicateur de stock faible (⚠️)
- Recommandation par saison

### 4. Assistant IA (AgroBot)
- Chat en temps réel avec **Gemini AI**
- Expert en fertilisants et agriculture marocaine
- Suggestions rapides pré-définies
- Historique de conversation persistant

### 5. Contrôle d'accès (RBAC)
- **Admin** : accès complet + gestion utilisateurs
- **Commercial** : pas d'accès à la gestion utilisateurs
- Protection backend (permissions DRF) + frontend (route guard)

---

## 🚀 Installation et exécution

### Option 1 : Docker (recommandé) 🐳

```bash
# Cloner le repo
git clone https://github.com/Abdelhamidlamtioui/AgriSmart.git
cd AgriSmart

# Lancer avec Docker Compose
docker-compose up --build
```

L'application sera accessible sur **http://localhost:3000**

> Pour activer l'assistant IA, ajoutez votre clé Gemini :
> ```bash
> GEMINI_API_KEY=votre_cle docker-compose up --build
> ```

### Option 2 : Installation manuelle
- Python 3.10+
- Node.js 18+
- npm ou yarn

### Backend

```bash
cd backend

# Environnement virtuel
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

# Dépendances
pip install -r requirements.txt

# Configuration
cp .env.example .env
# Modifier .env avec votre clé API Gemini

# Base de données
python manage.py migrate

# Données de démonstration
python manage.py shell < seed/seed_data.py

# Lancer le serveur
python manage.py runserver
```

### Frontend

```bash
cd frontend

# Dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur **http://localhost:5173**

---

## 👤 Comptes de démonstration

| Rôle | Utilisateur | Mot de passe | Accès |
|------|-------------|--------------|-------|
| Super Admin | `admin` | `admin123` | Tout + gestion utilisateurs |
| Commercial | `commercial` | `commercial123` | Dashboard, commandes, produits, chat |

---

## 🔧 Défis techniques et compromis

### 1. Pagination serveur vs client
**Défi** : Avec 85+ commandes, le chargement complet impactait les performances.
**Solution** : Pagination serveur personnalisée (`FlexiblePagination`) avec `page_size` dynamique côté frontend.

### 2. Invalidation du cache
**Défi** : Après création d'une commande, le dashboard et la liste n'étaient pas à jour.
**Solution** : TanStack Query avec `invalidateQueries` ciblé sur les clés `['orders']` et `['kpis']`.

### 3. Sécurité des rôles
**Défi** : Empêcher les commerciaux d'accéder à la gestion utilisateurs.
**Solution** : Double protection — backend (vérification `is_staff`/`is_superuser` dans le ViewSet) + frontend (`AdminRoute` + sidebar conditionnelle).

### 4. Traduction Figma → Code
**Défi** : Reproduire fidèlement le design M3 de Figma sans Tailwind.
**Solution** : Système de variables CSS mappées 1:1 avec les tokens Figma M3 (primary, surface-container, outline-variant, etc.).

### 5. Intégration IA
**Défi** : Obtenir des réponses pertinentes en français sur l'agriculture marocaine.
**Solution** : Prompt engineering avec contexte spécialisé (régions du Maroc, types de sols, saisons).

---

## 🎨 Lien Figma

> Le design Figma est disponible ici :
> [Lien Figma du projet](https://www.figma.com/) *(à compléter avec votre lien)*

Les écrans conçus dans Figma incluent :
- Écran de connexion (Login)
- Tableau de bord (Dashboard)
- Formulaire de commande multi-étapes
- Assistant IA (Chat)
- Écran de feedback (confirmation de commande)

---

## 📄 Licence

Projet développé dans le cadre du test technique — Développeur Full Stack.

© 2024 Abdelhamid Lamtioui
