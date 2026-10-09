# 🌐 Sphera Social

**Sphera Social** is a modern, fully responsive social media application built with React, Vite, and Tailwind CSS. It features a rich, dynamic user interface with a robust backend integration, allowing users to connect, share moments, and interact seamlessly.

---

## ✨ Key Features

- **🔐 Authentication & Security:** Secure Login and Registration flows using JWT authentication and form validation.
- **📰 Dynamic Newsfeed:** Endless scrolling feed displaying posts with text, images, likes, and comments.
- **📝 Post Creation:** Create posts, upload images, and express your thoughts effortlessly.
- **💬 Interactive Comments & Reactions:** Like posts, comment with text or images, and reply to friends.
- **👥 Friends & Connections:** Discover suggested friends, follow/unfollow users, and view mutual connections.
- **👤 User Profiles:** Detailed profile pages with cover photos, avatars, bios, and personalized feeds.
- **🔖 Saved Posts:** Save your favorite posts to read later in a dedicated private view.
- **🌙 Dark Mode:** First-class dark mode support with automatic system-preference detection and manual toggling.
- **📱 Fully Responsive:** Carefully crafted mobile-first design that scales perfectly to tablets and large desktop screens.

---

## 🛠️ Tech Stack

**Frontend Framework & Build Tool:**

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

**Styling & UI Components:**

- [Tailwind CSS v4](https://tailwindcss.com/)
- [HeroUI](https://heroui.com/)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Lucide React](https://lucide.dev/) (Icons)

**State Management & Data Fetching:**

- [TanStack Query (React Query)](https://tanstack.com/query/latest)
- [Axios](https://axios-http.com/)

**Form Handling & Validation:**

- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

**Routing:**

- [React Router DOM v7](https://reactrouter.com/)

---

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have **Node.js** (v18+) and **npm** (or pnpm/yarn) installed.

### 2. Clone and Install

```bash
git clone https://github.com/yourusername/sphera-social.git
cd sphera-social
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and configure your backend API endpoint:

```env
VITE_BASE_URL=<YOUR_API_BASE_URL>
```

### 4. Run the Development Server

```bash
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```text
src/
├── assets/         # Static assets (images, vectors, brand logos)
├── components/     # Reusable UI components (Navbar, Sidebar, Loaders, Alerts)
├── contexts/       # React Context providers (UserData, Theme Context)
├── Layouts/        # Page layouts (Main Layout, Auth Layout)
├── pages/          # Application routes (Newsfeed, Profile, Friends, Settings, etc.)
├── services/       # API integration layers and Axios setup
├── App.tsx         # Main application entry point and routing config
└── main.tsx        # React DOM rendering
```

---

## © Copyright

© 2026 Eslam Gamil. All Rights Reserved.
