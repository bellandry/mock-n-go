# Mock'n Go 🚀

> **Create realistic REST API mocks instantly. No configuration, no setup.**

Mock'n Go is a powerful SaaS platform that allows developers to generate realistic mock APIs in seconds. Perfect for frontend development, testing, and prototyping.

🌐 **Live Demo**: [mngo.laclass.dev](https://mngo.laclass.dev)

---

## ✨ Features

- ⚡ **Lightning Fast** - Generate mock APIs in seconds
- 🎯 **Full REST Support** - GET, POST, PUT, PATCH, DELETE methods
- 📊 **Realistic Data** - Powered by Faker.js for authentic mock data
- 🔄 **Pagination** - Built-in pagination support with customizable page sizes
- ⏱️ **Custom Delays** - Simulate real-world latency
- 🎲 **Random Errors** - Test error handling with configurable error rates
- 🔐 **Secure & Reliable** - Rate limiting, expiration controls, and organization-based access
- 🌐 **Instant Deployment** - Your mock API is live instantly with a unique URL
- 📱 **Responsive Dashboard** - Manage all your mocks from a beautiful interface
- 👥 **Team Collaboration** - Share mocks with your team (Team plan)
- 💳 **Flexible Subscriptions** - Free, Pro, and Team plans with Dodo Payments
- 📤 **Export Options** - Export to MSW, Postman, or OpenAPI (Pro/Team)
- 🎨 **Beautiful UI** - Modern, responsive design with dark mode

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Lucide Icons** - Modern icon library

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Production database
- **Better Auth** - Authentication & authorization
- **Faker.js** - Realistic data generation
- **Dodo Payments** - Subscription & payment processing
- **Svix** - Webhook signature verification

### **Infrastructure**
- **Vercel** - Hosting & deployment
- **Uploadthing** - File uploads
- **Nodemailer** - Email notifications
- **React Email** - Beautiful email templates
- **Dodo Payments** - Payment infrastructure

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ 
- PostgreSQL database
- npm/yarn/pnpm

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/bellandry/mock-n-go.git
cd mock-n-go
```

2. **Install dependencies**
```bash
npm install
```

if any installation error, run:
```bash
npm install --legacy-peer-deps
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mockngo"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth (optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="Mock'n Go <noreply@mngo.laclass.dev>"

# Dodo Payments (Subscription Management)
DODO_PAYMENTS_API_KEY="your-dodo-api-key"
DODO_WEBHOOK_KEY="whsec_your-webhook-secret"
DODO_PRO_PRODUCT_ID="pdt_your-pro-product-id"
DODO_TEAM_PRODUCT_ID="pdt_your-team-product-id"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
mock-n-go/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   ├── api/                 # API routes
│   │   └── mock/           # Mock API endpoints
│   ├── dashboard/          # Dashboard pages
│   ├── check-email/        # Email verification
│   └── pricing/            # Pricing page
├── components/              # React components
│   ├── landing/            # Landing page components
│   ├── mocks/              # Mock management components
│   ├── ui/                 # shadcn/ui components
│   └── email/              # Email templates
├── lib/                     # Utility functions
│   ├── auth.ts             # Better Auth configuration
│   ├── prisma.ts           # Prisma client
│   ├── faker-generator.ts  # Mock data generation
│   ├── subscription-*.ts   # Subscription management
│   └── mock-*.ts           # Mock management utilities
├── prisma/                  # Database schema
├── public/                  # Static assets
└── types/                   # TypeScript types
```

---

## 🎯 Key Features Explained

### **Mock API Generation**

Create a mock API by defining:
- **Fields**: Choose from 100+ field types (name, email, phone, etc.)
- **Count**: Number of records to generate
- **Pagination**: Enable/disable pagination
- **Delays**: Simulate network latency
- **Error Rates**: Test error handling

### **Subscription Plans**

Mock'n Go offers three tiers to fit your needs:

#### **Free (Starter)**
- ✅ 5 active mocks
- ✅ 24-hour mock duration
- ✅ 100 requests per day per mock
- ✅ All HTTP methods (GET, POST, PUT, PATCH, DELETE)
- ✅ Pagination & error simulation
- ❌ No GraphQL support
- ❌ No export features
- ❌ No team collaboration

#### **Pro - $9/month**
- ✅ **Unlimited** active mocks
- ✅ 30-day mock duration
- ✅ **Unlimited** requests
- ✅ All HTTP methods
- ✅ GraphQL support
- ✅ Export to MSW, Postman, OpenAPI
- ✅ Priority support
- ✅ 14-day free trial
- ❌ No team collaboration

#### **Team - $29/user/month**
- ✅ **Everything in Pro**
- ✅ **Unlimited** mock duration
- ✅ Team collaboration
- ✅ Shared workspaces
- ✅ Version control
- ✅ Priority support (<24h)
- ✅ Custom onboarding

> **Payment Processing**: Powered by [Dodo Payments](https://dodopayments.com) for secure, reliable subscription management.

### **Authentication**

- Email/Password
- Magic Link (passwordless)
- GitHub OAuth
- Organization-based access control

---

## 🔧 Development

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### **Database Management**

```bash
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema changes
npx prisma migrate dev # Create migration
```

---

## 📦 Deployment

### **Vercel (Recommended)**

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### **Environment Variables for Production**

Make sure to set all required environment variables in your hosting platform.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Better Auth](https://www.better-auth.com/) - Authentication for Next.js
- [Faker.js](https://fakerjs.dev/) - Generate massive amounts of fake data
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Vercel](https://vercel.com/) - Hosting & deployment
- [Dodo Payments](https://dodopayments.com/) - Payment infrastructure
- [Svix](https://www.svix.com/) - Webhook infrastructure

---

## 📞 Support

- **Website**: [mngo.laclass.dev](https://mngo.laclass.dev)
- **Email**: contact@laclass.dev
- **GitHub Issues**: [Create an issue](https://github.com/bellandry/mock-n-go/issues)

---

Made with ❤️ by [Landry Bella](https://github.com/bellandry)
