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

## 🎨 Choix de design UX/UI et Immersion

Conformément aux attentes du test technique, l'expérience utilisateur (UX) a été placée au centre de la conception. L'objectif était de créer une interface qui ne soit pas simplement fonctionnelle, mais **immersive et engageante**, rompant avec l'austérité habituelle des logiciels B2B.

### L'approche de l'Immersion Visuelle et Interactive

Pour atteindre cette immersion, je me suis basé sur les principes du **Material Design 3 (M3)** tout en les adaptant à la thématique agricole :

1. **Cohérence Chromatique et Thématique** : J'ai opté pour une palette de couleurs organiques dominée par des tons de vert forêt (`#036b55`), symbolisant la croissance et la nature, contrastée par des surfaces claires pour maximiser la lisibilité. Cette palette évoque immédiatement le secteur des fertilisants.
2. **Micro-interactions et Feedback Visuel** : L'immersion passe par la réactivité de l'interface. Chaque action de l'utilisateur déclenche une animation subtile (effets de survol fluides, transitions `fadeSlideUp` lors de l'apparition de modales, boutons qui réagissent au clic via des effets `scaleIn`). L'utilisateur n'est jamais laissé dans l'attente sans indicateur visuel.
3. **Hiérarchie Spatiale (Glassmorphism & Ombres)** : L'utilisation d'ombres teintées (`rgba(30,107,82, 0.08)`) et d'effets de translucidité subtils donne de la profondeur aux cartes et aux menus, créant un environnement en trois dimensions plutôt qu'une simple page plate.

### Défis UX Spécifiques et Solutions Apportées

| Défi UX Identifié | Solution Implémentée dans le Design |
|-------------------|-------------------------------------|
| **Surcharge d'information (Dashboard B2B)** | Les CRM affichent souvent trop de données. J'ai aéré l'interface en utilisant de larges espaces blancs (Whitespace) et en regroupant les KPIs dans des cartes épurées aux coins arrondis. Les graphiques (Recharts) sont interactifs (tooltips au survol) pour ne dévoiler la donnée précise qu'à la demande. |
| **Complexité de la saisie de commande** | Saisir une commande agricole (Client > Engrais > Quantité > Livraison) est fastidieux. **Solution** : Un formulaire *Wizard* multi-étapes avec un *Stepper* visuel. L'utilisateur se concentre sur une tâche à la fois, ce qui réduit drastiquement la charge cognitive. |
| **Feedback des actions (Incertitude)** | Dans les applications web, l'utilisateur doute souvent si son action a réussi. **Solution** : Intégration de notifications "Toast" en bas de l'écran, de spinners de chargement pendant les appels API, et de changements d'état immédiats (boutons désactivés pendant la soumission). |
| **Assistance et Prise de Décision** | Comment aider le commercial à vendre le bon engrais ? **Solution** : Intégration d'un Chatbot IA flottant. L'icône du bot pulse subtilement pour attirer l'attention sans être intrusive. Les suggestions d'engrais apparaissent contextuellement dans le flux de travail. |

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

## 🌐 Liens de démonstration

Le projet est déployé et accessible en ligne :
- **Application Web (Frontend)** : [https://agri-smart-rho.vercel.app](https://agri-smart-rho.vercel.app)
- **API (Backend)** : [https://agrismart-1-wsk3.onrender.com/api/](https://agrismart-1-wsk3.onrender.com/api/)

*(Veuillez noter que le backend est hébergé sur une instance gratuite Render et peut prendre jusqu'à 50 secondes pour se réveiller lors de la première requête).*

---

## 🔧 Défis techniques et compromis

### 1. Stratégie de Déploiement et DevOps (Le plus grand compromis)
**Défi Initial** : Mon intention première était de démontrer une maîtrise complète de l'infrastructure en configurant un serveur **Debian Linux de zéro**. L'architecture DevOps que j'avais préparée comprenait :
- L'utilisation de `docker-compose.yml` pour orchestrer le Backend, le Frontend et la base de données.
- La configuration d'un reverse proxy **Nginx** (dont le fichier `nginx.conf` est présent dans le repo).
- L'exposition sécurisée des ports et la gestion interne des réseaux Docker.

**Le Compromis (Time-to-Market)** : Bien que l'infrastructure Dockerisée soit prête et fonctionnelle localement, la configuration propre d'un serveur Debian distant (VPS), la gestion DNS, et l'installation des certificats SSL Let's Encrypt demandent un temps incompressible. Face à la limite de temps stricte du test technique (24h), j'ai préféré assurer une démonstration irréprochable et immédiate aux évaluateurs. J'ai donc pivoté vers des solutions PaaS modernes (Platform as a Service) :
- **Render** pour héberger le conteneur Docker du backend Django.
- **Vercel** pour servir le frontend React en Edge Network.
Ce choix garantit une haute disponibilité pour l'évaluation tout en gardant le projet "Cloud-Agnostic" grâce aux Dockerfiles.

### 2. Pagination serveur vs client
**Défi** : Avec 85+ commandes, le chargement complet impactait les performances.
**Solution** : Pagination serveur personnalisée (`FlexiblePagination`) avec `page_size` dynamique côté frontend.

### 3. Invalidation du cache
**Défi** : Après création d'une commande, le dashboard et la liste n'étaient pas à jour.
**Solution** : TanStack Query avec `invalidateQueries` ciblé sur les clés `['orders']` et `['kpis']`.

### 4. Sécurité des rôles
**Défi** : Empêcher les commerciaux d'accéder à la gestion utilisateurs.
**Solution** : Double protection — backend (vérification `is_staff`/`is_superuser` dans le ViewSet) + frontend (`AdminRoute` + sidebar conditionnelle).

### 5. Traduction Figma → Code
**Défi** : Reproduire fidèlement le design M3 de Figma de manière immersive.
**Solution** : Mise en place d'un système de design CSS vanilla (sans Tailwind pour montrer la maîtrise pure de l'UI), utilisation d'animations subtiles (micro-interactions, fadeSlideUp) et de retours visuels immédiats (feedback) pour garantir une expérience utilisateur engageante et non-statique.

### 6. Intégration IA
**Défi** : Obtenir des réponses pertinentes en français sur l'agriculture marocaine.
**Solution** : Intégration de l'API Google Gemini avec un prompt engineering fournissant un contexte spécialisé.

---

## 🎨 Design Figma (UX/UI)

Le processus de conception a commencé par un maquettage rigoureux sur Figma pour planifier l'UX immersive.

> **Lien interactif** : [Lien Figma du projet](https://www.figma.com/) *(à compléter avec votre lien)*
> 
> **Fichier PDF** : Au cas où le lien Figma rencontrerait des problèmes de permissions ou expirerait, **un export PDF complet des maquettes a été ajouté à la racine de ce dépôt GitHub** sous le nom `AgroSmart_Figma_Design.pdf`.

Les écrans conçus incluent la totalité des parcours utilisateurs :
- Écran de connexion (Login)
- Tableau de bord immersif (Dashboard)
- Formulaire de commande multi-étapes interactif
- Interface du Chatbot IA
- Écran de feedback (confirmation de commande dynamique)

---

## 📄 Licence

Projet développé dans le cadre du test technique — Développeur Full Stack.

© 2024 Abdelhamid Lamtioui
