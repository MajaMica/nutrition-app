# 🥗 Nutrition App — Full-Stack Nutrition Platform

A full-stack nutrition platform designed for the Serbian market, featuring a React Native mobile application, a Node.js REST API, and a web-based admin panel for managing recipes and food data.

The platform combines personalized nutrition onboarding, daily calorie and macronutrient targets, recipe discovery, food nutrition data, and centralized content management in a modern dark-themed interface.

**Live services**
- **Backend API:** [api.zencodelab.dev](https://api.zencodelab.dev)
- **Admin Panel:** [admin.zencodelab.dev](https://admin.zencodelab.dev)
- **Mobile App:** Development build; distribution planned

## ✨ Features

### 📱 Mobile Application

Built with Expo, React Native, and TypeScript.

- **Personalized onboarding** — A 10-step flow collecting nutrition goals, age, height, weight, activity level, dietary preferences, allergies, and disliked foods.
- **Calorie and macronutrient targets** — Calculates estimated daily energy requirements using BMR and TDEE formulas.
- **Authentication** — Registration, login, persistent sessions, and protected navigation using Supabase Auth.
- **Home dashboard** — Daily calorie target, progress indicators, suggested recipes, next-meal information, and e-book promotions.
- **Recipe discovery** — Browse and search recipes with images and nutrition information.
- **Weekly meal planning** — Browse meals by day and meal type, with daily calorie totals.
- **Food database** — Search foods, filter by category, and view nutritional information.
- **Dynamic food portions** — Adjust quantities in grams, tablespoons, teaspoons, and cups, with recalculated calorie and macronutrient values.
- **Recipe and meal details** — Dedicated screens for ingredients, preparation steps, and nutritional summaries.
- **E-book catalog** — Browse digital products, descriptions, covers, and prices.
- **Bilingual interface** — Serbian and English, with device-language detection and manual language selection.
- **User profile** — Account information, preferences, settings, and logout.
- **Custom dark theme** — Minimal interface with a lime-green accent palette and safe-area support.

### 🔌 Backend REST API

Built with Node.js, Express, and TypeScript, backed by PostgreSQL.

- RESTful endpoints for recipes, foods, and user profiles.
- Supabase JWT verification and protected routes.
- Role-based admin authorization using Supabase user metadata.
- CRUD operations for recipe and food management.
- Automatic nutritional calculations based on recipe ingredients and their quantities.
- Prisma ORM for database access, schema management, and migrations.
- CORS configuration and a health-check endpoint.

### 🛠️ Admin Panel

A dedicated React dashboard for managing the platform's nutritional content.

- Supabase authentication with admin-only access.
- Recipe listing, search, creation, editing, and deletion.
- Published/unpublished and premium recipe status.
- Dynamic ingredient selection from the food database.
- Real-time nutritional calculations while editing recipes.
- Dynamic preparation-step management.
- Food database management with search and CRUD operations.
- Serbian and English food names, categories, icons, and nutritional values per 100 g.
- Protected routes and authenticated API requests.

## 🧰 Tech Stack

| Component | Technologies |
|---|---|
| Mobile | Expo, React Native, TypeScript |
| Navigation | Expo Router |
| Mobile styling | NativeWind |
| Web admin | React, Vite, TypeScript |
| Admin routing | React Router DOM |
| Admin styling | Tailwind CSS v3 |
| Backend | Node.js 22, Express, TypeScript |
| ORM | Prisma |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth, JWT |
| Localization | i18n-js |
| Local session storage | Expo SQLite |
| Realtime compatibility | `ws` |
| Deployment | cPanel, Node.js application hosting |

## 🏗️ Architecture

The platform consists of three application layers sharing a centralized backend and database.

```text
┌─────────────────────────┐
│  Mobile Application     │
│  Expo + React Native    │
│  TypeScript             │
└────────────┬────────────┘
             │
             │ REST API + JWT
             ▼
┌─────────────────────────┐
│  Backend API            │
│  Node.js + Express      │
│  TypeScript + Prisma    │
└────────────┬────────────┘
             │
             │ Database access
             ▼
┌─────────────────────────┐
│  Supabase PostgreSQL    │
│  Recipes, foods,        │
│  ingredients, steps     │
└─────────────────────────┘
             ▲
             │
┌────────────┴────────────┐
│  Admin Panel            │
│  React + Vite           │
│  TypeScript             │
└─────────────────────────┘

Authentication: Supabase Auth
Authorization: JWT verification + admin role checks
```

The mobile application and admin panel consume the backend API for application data. Supabase Auth provides the shared authentication system, while the backend validates tokens and enforces administrative permissions.

## 🗄️ Database Design

The Prisma schema contains four core models.

### `Food`

Stores food items and their nutritional information.

- Localized names in Serbian and English
- Food category and icon
- Calories
- Protein, carbohydrates, and fats
- Fiber and sugar content

Nutritional values are maintained per 100 g.

### `Recipe`

Stores recipe metadata and nutritional summaries.

- Title, description, and image URL
- Meal type and dietary type
- Difficulty and preparation time
- Serving count
- Calories and macronutrients
- Premium and publication status

### `RecipeIngredient`

Connects recipes to food items.

- Recipe and food relationships
- Ingredient quantity
- Measurement unit

### `RecipeStep`

Stores ordered recipe preparation instructions.

- Recipe relationship
- Step description
- Display order

Prisma migrations are used to manage database schema changes.

## 🧮 Nutritional Calculation Engine

The backend calculates recipe nutrition from its ingredients rather than relying solely on manually entered recipe totals.

The calculation considers:

- The nutritional values of each food item
- Ingredient quantities and supported measurement units
- The combined nutritional contribution of all ingredients
- The resulting recipe calorie and macronutrient totals

The admin form also displays nutritional estimates dynamically as ingredients are added or modified.

The mobile application calculates estimated daily energy requirements from onboarding data using BMR and TDEE formulas.

*Nutrition calculations provide estimates and depend on the accuracy of the underlying food composition data and measurement conversions.*

## 🔐 Authentication & Authorization

The platform uses Supabase Auth for account management and JWT-based authentication for protected backend endpoints.

- Users register and log in using email and password.
- Authentication sessions persist across application restarts.
- Protected mobile routes redirect unauthenticated users to login.
- The admin panel requires an authenticated session and an `admin` role.
- The backend verifies JWTs before allowing access to protected endpoints.
- Recipe and food management operations require administrative authorization.

Authentication and authorization are enforced at the appropriate application and API layers.

## 🌐 API Reference

Base URL: `https://api.zencodelab.dev`

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | API health and food database status |
| GET | `/recipes` | List recipes with optional filters |
| GET | `/recipes/:id` | Retrieve recipe details |
| GET | `/foods` | List food items |
| GET | `/foods/search?q=` | Search foods |
| GET | `/foods/:id` | Retrieve food details |

Recipe listing supports filters such as `mealType`, `dietType`, and `premium`.

### Protected Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile` | Retrieve the authenticated user's profile |
| POST | `/recipes` | Create a recipe — admin only |
| PUT | `/recipes/:id` | Update a recipe — admin only |
| DELETE | `/recipes/:id` | Delete a recipe — admin only |
| POST | `/foods` | Create a food item — admin only |
| PUT | `/foods/:id` | Update a food item — admin only |
| DELETE | `/foods/:id` | Delete a food item — admin only |
| GET | `/admin/test` | Verify admin access |

Protected requests use a bearer token obtained from the Supabase authentication session.

```http
Authorization: Bearer <SUPABASE_ACCESS_TOKEN>
```

## 🎨 Design System

The interface follows a modern, minimal dark-theme design with high-contrast typography and lime-green accents.

| Token | Value |
|---|---|
| Primary accent | `#B3FF47` |
| Background | `#0D0D0D` |
| Surface | `#1A1A1A` |
| Primary text | `#FFFFFF` |
| Secondary text | `#A0A0A0` |
| Borders | `#2A2A2A` |
| Typeface | Plus Jakarta Sans |

The visual system is designed to keep nutritional information readable, make important actions easy to identify, and maintain a consistent experience across the mobile app and administrative interface.

## 🚀 Deployment

### Backend API

**Production:** [api.zencodelab.dev](https://api.zencodelab.dev)

- Hosted on cPanel using Node.js 22.
- TypeScript compiled into production JavaScript.
- Prisma Client generated for the target server environment.
- Production dependencies installed on the hosting server.
- Application restarted after deployment.

The Prisma deployment configuration accounts for native development and Linux OpenSSL engine compatibility.

### Admin Panel

**Production:** [admin.zencodelab.dev](https://admin.zencodelab.dev)

- Built using Vite.
- Production assets generated in the `dist/` directory.
- Static build uploaded to the admin subdomain.

### Database & Authentication

- Supabase Cloud hosts the PostgreSQL database.
- Supabase Auth handles user authentication.
- Prisma manages database access and migrations.

### Mobile Application

The mobile application is under development. APK distribution and a possible PWA delivery strategy are planned.

## ⚙️ Local Development

The following commands illustrate the typical development workflow. Exact commands and environment variables depend on the scripts and configuration in each application directory.

### Prerequisites

- Node.js 22
- npm
- A Supabase project
- Expo-compatible development environment
- Access to the project's environment variables

### Backend API

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Build the production version:

```bash
npm run build
```

### Admin Panel

```bash
npm install
npm run dev
```

Create the production build:

```bash
npm run build
```

### Mobile Application

```bash
npm install
npx expo start
```

Run the app using an available Expo development client or the supported local development environment.

> **Note:** These commands assume the corresponding scripts exist in each package's `package.json`. Run database migrations only against the intended database environment.

## 🔧 Environment Configuration

Configure environment variables separately for the backend, admin panel, and mobile application according to their respective configurations.

Typical backend configuration includes:

```dotenv
DATABASE_URL=
DIRECT_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_JWT_SECRET=
PORT=
```

The exact variables depend on the Prisma datasource, Supabase JWT verification implementation, and deployment setup.

For the admin panel and mobile application, configure the appropriate Supabase project URL, public authentication key, and backend API URL.

**Security considerations:**
- Never commit `.env` files or production credentials.
- Never expose database connection strings or JWT signing secrets in client-side code.
- Use only public, client-safe Supabase credentials in frontend applications.
- Keep admin role assignment under trusted server-side control.
- Apply appropriate access policies and permissions to database resources.

## 📍 Project Status

### Implemented

- [x] Expo / React Native mobile application with 20+ screens
- [x] Multi-step nutrition onboarding
- [x] Calorie and macronutrient target calculations
- [x] Supabase authentication and persistent sessions
- [x] Backend REST API deployed to production
- [x] Supabase PostgreSQL database and Prisma schema
- [x] Recipe and food management endpoints
- [x] Admin dashboard deployed to production
- [x] Role-based administrative access
- [x] Automatic recipe nutrition calculations
- [x] Serbian and English localization for onboarding and authentication

### Planned / In Progress

- [ ] Complete recipe detail integration with the mobile API
- [ ] Extend Serbian and English localization to remaining screens
- [ ] Expand the database to 500+ food items using Serbian food composition data
- [ ] Integrate Stripe payments for e-books
- [ ] Build and distribute an Android APK
- [ ] Evaluate PWA deployment
- [ ] Implement a light theme
- [ ] Explore AI-assisted recipe generation based on user preferences and nutritional targets

## 🎯 Project Goals

The goal is to build a maintainable, extensible nutrition platform with a clear separation of concerns between mobile presentation, backend business logic, data persistence, and administrative content management.

The architecture supports future enhancements such as a larger localized food database, subscription-based premium content, online payments, and personalized recipe recommendations.

---

**Built with Expo, React Native, TypeScript, Node.js, Express, Prisma, React, and Supabase.**
