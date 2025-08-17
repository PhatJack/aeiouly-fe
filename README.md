````markdown
# Next.js 15 with pnpm

This project is built with **Next.js 15** and uses **pnpm** as the package manager.  

## 📦 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) `>=18.18` or `>=20.x`
- [pnpm](https://pnpm.io/) `>=9.x`

Check versions:
```bash
node -v
pnpm -v
````

## ⚡ Getting Started

1. **Clone the repo**

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Run the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

4. **Build for production**

```bash
pnpm build
```

5. **Start production server**

```bash
pnpm start
```

6. **Lint the project**

```bash
pnpm lint
```

## 📂 Project Structure

```bash
.
├── app/                # App Router (Next.js 13+)
├── public/             # Static files
├── components/         # Reusable UI components
├── styles/             # Global styles
├── package.json
├── pnpm-lock.yaml
└── next.config.js
```

## 🚀 Deployment

For deployment, you can use:

* [Vercel](https://vercel.com/) (recommended, first-class support for Next.js)
* [Docker](https://www.docker.com/)
* Any Node.js server with `pnpm build && pnpm start`

---

## 🔑 Scripts

| Script       | Description              |
| ------------ | ------------------------ |
| `pnpm dev`   | Start development server |
| `pnpm build` | Build for production     |
| `pnpm start` | Run production server    |
| `pnpm lint`  | Run ESLint checks        |

---

## 📝 Notes

* Using `pnpm` instead of `npm`/`yarn` ensures faster installs and disk space savings.
* Next.js 15 introduces **React 19** and improved App Router stability.

---

Made with ❤️ using [Next.js](https://nextjs.org/) and [pnpm](https://pnpm.io/).
