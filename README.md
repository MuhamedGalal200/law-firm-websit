#  Law Firm Website

A modern and professional law firm website built with **Next.js** (frontend) and **Strapi CMS** (backend).  
This project is designed to showcase team members, services, and provide smooth client interaction.

---

## Technologies Used

### Frontend:
-  Next.js 14
-  TypeScript
-  TailwindCSS
-  i18next (Translation)
-  SwiperJS
-  React Icons

### Backend:
-  Strapi CMS (v4)
-  SQLite (can switch to PostgreSQL or MongoDB)
-  REST API with image uploads

---

##  Features

-  Multi-language support (i18next)
-  Dynamic team and service management
-  Real-time search filtering (Team & Services)
-  Email subscription via Strapi
-  Responsive & mobile-friendly design
-  Image/video handling with fallback logic

---

## Project Structure

```bash
IO-task/
├── frontend/         # Next.js app
│   ├── components/
│   ├── pages/
│   └── public/
├── backend/          # Strapi backend
│   ├── api/
│   └── config/
```

---

##  Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/MuhamedGalal200/law-firm-websit
cd law-firm-website
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run develop
```

Visit: `http://localhost:1337/admin` to configure your CMS.

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:3000` to view the frontend.

---

##  Author

Developed by **[Muhamed Galal](https://github.com/MuhamedGalal200)**  
 Email: mogoo992@gmail.com
