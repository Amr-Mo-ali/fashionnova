# FashionNova

<div align="center">
  <img src="https://via.placeholder.com/150x150?text=FashionNova+Logo" alt="FashionNova Logo" width="150" height="150" />

  <h1>FashionNova</h1>
  <p><strong>Production-ready luxury fashion e-commerce platform</strong></p>

  ![Next.js](https://img.shields.io/badge/Next.js-16-black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
  ![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)
  ![License](https://img.shields.io/badge/License-MIT-green)
  ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

  <br />

  <a href="https://fashionnova-navy.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-View%20Store-blue?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>

  <br />

  <img src="https://via.placeholder.com/800x400?text=Screenshot+Placeholder" alt="FashionNova Screenshot" width="800" />
</div>

## Table of Contents

- [✨ Overview](#-overview)
- [🖥️ Live Demo](#️-live-demo)
- [🚀 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🗄️ Database Schema](#️-database-schema)
- [🔌 API Reference](#-api-reference)
- [⚙️ Getting Started](#️-getting-started)
- [🚀 Deployment](#-deployment)
- [🔒 Security](#-security)
- [📈 Performance](#-performance)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

## ✨ Overview

FashionNova is a production-ready, luxury fashion e-commerce platform built with modern web technologies. It provides a seamless shopping experience for fashion brands and boutiques, featuring elegant product browsing, secure payments, and comprehensive admin management.

The platform solves the challenge of creating professional online stores for fashion businesses, offering features like product variants, deposit payments, and real-time order tracking. It's designed for fashion brands, boutiques, and retailers who want a scalable, customizable e-commerce solution without the complexity of building from scratch.

Key differentiators include the innovative 10% deposit payment system integrated with local payment methods (Vodafone Cash & Instapay), cinematic video hero sections, subtle 3D effects, and a mobile-optimized admin dashboard with WhatsApp notifications.

## 🖥️ Live Demo

| Link | Description |
|------|-------------|
| 🛍️ [Store](https://fashionnova-navy.vercel.app) | Customer-facing shopping experience |
| 🔐 [Admin](https://fashionnova-navy.vercel.app/admin/login) | Admin dashboard for store management |

> ⚠️ **Security Notice**: Change default credentials immediately after deployment.
>
> **Email:** admin@fashionnova.com  
> **Password:** admin123

## 🚀 Features

### Customer Experience
- 🛍️ Elegant product browsing with category filtering
- 🎨 Product variants (sizes, colors)
- 🛒 Persistent shopping cart
- 💳 Smart deposit payment system (10% upfront)
- 📱 Vodafone Cash & Instapay integration
- 📦 Real-time order tracking
- 🎬 Collections/editorial content section
- ✨ Cinematic hero with video background
- 🌟 Subtle 3D hover effects

### Admin Dashboard
- 📊 Revenue analytics with monthly charts
- 📦 Full order lifecycle management
- 🛍️ Product CRUD with media upload
- 🎬 Collections management
- 📱 WhatsApp order notifications
- 🔐 Role-based access control
- 📱 Mobile-optimized admin panel
- ☁️ Cloudinary media management

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first CSS |
| Animation | Framer Motion | Smooth animations & 3D effects |
| Database | PostgreSQL (Neon) | Serverless database |
| ORM | Prisma v5 | Type-safe database client |
| Auth | NextAuth.js v4 | Authentication |
| Media | Cloudinary | Image & video storage |
| Notifications | CallMeBot API | WhatsApp notifications |
| Deployment | Vercel | Edge deployment |

### System Design

```
┌─────────────────────────────────────────────────┐
│                   FashionNova                    │
├──────────────────┬──────────────────────────────┤
│   Customer Store │        Admin Panel            │
│   (Public)       │        (Protected)            │
├──────────────────┴──────────────────────────────┤
│              Next.js App Router                  │
├──────────────────┬──────────────────────────────┤
│   API Routes     │      NextAuth                 │
├──────────────────┴──────────────────────────────┤
│         Prisma ORM + PostgreSQL (Neon)           │
├──────────────────┬──────────────────────────────┤
│   Cloudinary     │    CallMeBot WhatsApp         │
└──────────────────┴──────────────────────────────┘
```

## 📁 Project Structure

```
fashionnova/
├── prisma/
│   ├── schema.prisma      # Database models
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Initial data seeder
├── public/
│   └── uploads/           # Local fallback uploads
├── src/
│   ├── app/
│   │   ├── (store)/       # Customer-facing pages
│   │   │   ├── page.tsx   # Homepage
│   │   │   ├── products/  # Product listing & detail
│   │   │   ├── cart/      # Shopping cart
│   │   │   ├── checkout/  # Order checkout
│   │   │   └── order-confirmation/
│   │   ├── admin/         # Protected admin pages
│   │   │   ├── dashboard/ # Analytics & overview
│   │   │   ├── products/  # Product management
│   │   │   ├── orders/    # Order management
│   │   │   ├── collections/ # Media collections
│   │   │   └── settings/  # Admin settings
│   │   └── api/           # API endpoints
│   │       ├── auth/      # NextAuth routes
│   │       ├── products/  # Products CRUD
│   │       ├── orders/    # Orders management
│   │       ├── collections/ # Collections CRUD
│   │       └── upload/    # Media upload (Cloudinary)
│   ├── components/
│   │   ├── store/         # Storefront components
│   │   └── admin/         # Admin panel components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utilities & configs
│       ├── prisma.ts      # Prisma client singleton
│       ├── cloudinary.ts  # Cloudinary config
│       ├── api-auth.ts    # Auth helpers
│       └── cart.ts        # Cart utilities
└── ...config files
```

## 🗄️ Database Schema

| Model | Fields | Relations |
|-------|--------|-----------|
| User | id, email, password, name, role | - |
| Product | id, name, description, price, stock, images, sizes, colors, category | OrderItem |
| Order | id, customerName, phone, address, total, status | OrderItem |
| OrderItem | id, quantity, size, color, price | Order, Product |
| Collection | id, title, description, mediaUrl, mediaType, order | - |

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/products | Public | List all products |
| POST | /api/products | Admin | Create product |
| GET | /api/products/[id] | Public | Get product |
| PUT | /api/products/[id] | Admin | Update product |
| DELETE | /api/products/[id] | Admin | Delete product |
| GET | /api/orders | Admin | List all orders |
| POST | /api/orders | Public | Create order |
| PUT | /api/orders/[id] | Admin | Update order status |
| GET | /api/collections | Public | List collections |
| POST | /api/collections | Admin | Create collection |
| POST | /api/upload | Admin | Upload to Cloudinary |
| PATCH | /api/admin/profile | Admin | Update password |

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (or Neon account)
- Cloudinary account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fashionnova.git
   cd fashionnova
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required variables (see Environment Variables section below).

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed the database**
   ```bash
   npx prisma db seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | ✅ | PostgreSQL connection string |
| NEXTAUTH_SECRET | ✅ | Random secret for NextAuth |
| NEXTAUTH_URL | ✅ | App URL (http://localhost:3000) |
| CLOUDINARY_CLOUD_NAME | ✅ | Cloudinary cloud name |
| CLOUDINARY_API_KEY | ✅ | Cloudinary API key |
| CLOUDINARY_API_SECRET | ✅ | Cloudinary API secret |
| WHATSAPP_PHONE | ⚡ | Admin WhatsApp number |
| WHATSAPP_API_KEY | ⚡ | CallMeBot API key |
| NEXT_PUBLIC_HERO_VIDEO_URL | 🎬 | Hero section video URL |

✅ Required | ⚡ Optional (WhatsApp notifications) | 🎬 Optional (video hero)

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add environment variables**
   - In Vercel dashboard, go to Project Settings > Environment Variables
   - Add all required variables from the Environment Variables section

4. **Deploy**
   - Vercel will automatically deploy your app
   - Your app will be available at `https://your-project-name.vercel.app`

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Self-hosted (VPS)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Install PM2 globally**
   ```bash
   npm install -g pm2
   ```

3. **Start the application**
   ```bash
   pm2 start npm --name "fashionnova" -- start
   ```

4. **Configure reverse proxy** (nginx example)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔒 Security

- All admin routes protected with NextAuth session
- Role-based access control (ADMIN, SUPERADMIN)
- Password hashing with bcryptjs (12 rounds)
- Input validation on all API routes
- SQL injection prevention via Prisma ORM
- XSS protection via React's built-in escaping
- Environment variables for all secrets

## 📈 Performance

- **Lighthouse Scores**: 95+ on all metrics (placeholder)
- Edge deployment via Vercel for global CDN
- Optimized images via Cloudinary transformations
- Lazy loading for all media assets
- Skeleton loading states for better UX
- Optimistic UI updates for instant feedback

## 🗺️ Roadmap

- [ ] Payment gateway integration (Paymob/Stripe)
- [ ] Customer accounts & order history
- [ ] Email notifications system
- [ ] Inventory alerts & stock management
- [ ] Advanced analytics dashboard
- [ ] PWA support for mobile app experience
- [ ] Multi-language support (AR/EN)
- [ ] Discount codes & promotions

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Amr Mohamed**
- 🎓 CS & AI Graduate, Beni Suef University (2024)
- 💼 ML/AI Engineer & Full-Stack Developer
- 🌍 Based in Egypt, open to UAE/Remote opportunities
- 📧 [your-email@example.com]
- 💼 [LinkedIn](https://linkedin.com/in/yourprofile)
- 🐙 [GitHub](https://github.com/yourusername)

---

<p align="center">
  Built with ❤️ by Amr Mohamed
  <br>
  ⭐ Star this repo if you found it helpful!
</p>