# Active Context: RedOps Red Team Platform

## Current State

**Project Status**: ✅ Active Development

RedOps is a red teaming and penetration testing platform with AI-powered capabilities, war driving features, and PWA support for desktop installation.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] RedOps platform UI with cyber/hacker theme
- [x] Navigation component with route handling
- [x] AI assistant page with chat interface
- [x] Database page for access point management
- [x] Payloads page for exploit generation
- [x] Scanner page for network scanning
- [x] Terminal page with command execution
- [x] Wardriving page with GPS map integration
- [x] Settings page with PWA desktop installation
- [x] Nearby network discovery in scanner

## Current Structure

| `src/app/(app)/page.tsx` | Dashboard home | ✅ Ready |
| `src/app/(app)/ai/page.tsx` | AI assistant | ✅ Ready |
| `src/app/(app)/database/page.tsx` | Access point database | ✅ Ready |
| `src/app/(app)/payloads/page.tsx` | Payload generation | ✅ Ready |
| `src/app/(app)/scanner/page.tsx` | Network scanner | ✅ Ready |
| `src/app/(app)/terminal/page.tsx` | Terminal interface | ✅ Ready |
| `src/app/(app)/wardriving/page.tsx` | War driving map | ✅ Ready |
| `src/app/(app)/settings/page.tsx` | Settings with PWA install | ✅ Ready |
| `src/components/Navigation.tsx` | Navigation sidebar | ✅ Ready |
| `src/components/WarDriveMap.tsx` | GPS map component | ✅ Ready |

## Current Focus

The template is ready. Next steps depend on user requirements:

1. What type of application to build
2. What features are needed
3. Design/branding preferences

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To add components:

Create `src/components/` directory and add components:
```tsx
// src/components/ui/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### To add a database:

Follow `.kilocode/recipes/add-database.md`

### To add API routes:

Create `src/app/api/[route]/route.ts`:
```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add more recipes (auth, email, etc.)
- [ ] Add example components
- [ ] Add testing setup recipe

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-09 | Added RedOps platform with AI, scanner, terminal, war driving, and settings pages |
| 2026-03-09 | Added PWA desktop installation feature to settings |
