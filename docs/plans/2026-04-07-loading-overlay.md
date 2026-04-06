# Loading Overlay Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a reusable LoadingWrapper component that shows a semi-transparent overlay with spinner during Next.js navigation transitions.

**Architecture:** Use Next.js's `useNavigation()` hook to detect pending navigation state. Create a wrapper component with relative positioning that overlays its children when loading. Apply to the search results section on the homepage.

**Tech Stack:** Next.js 15, React, Tailwind CSS, Lucide icons (Loader2)

---

### Task 1: Create LoadingWrapper Component

**Files:**
- Create: `src/components/LoadingWrapper.tsx`

**Step 1: Create the LoadingWrapper component**

```tsx
'use client'

import { Loader2 } from 'lucide-react'

interface LoadingWrapperProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
}

export function LoadingWrapper({ isLoading, children, className = '' }: LoadingWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center transition-opacity">
          <Loader2 className="w-8 h-8 text-[#1a5276] animate-spin" />
        </div>
      )}
    </div>
  )
}
```

**Step 2: Verify component exists**

Run: `ls -la src/components/LoadingWrapper.tsx`
Expected: File exists

**Step 3: Commit**

```bash
git add src/components/LoadingWrapper.tsx
git commit -m "feat: add LoadingWrapper component for navigation loading state"
```

---

### Task 2: Create useNavigationLoading Hook

**Files:**
- Create: `src/hooks/useNavigationLoading.ts`

**Step 1: Create the hook using Next.js useNavigation**

```tsx
'use client'

import { useNavigation } from 'next/navigation'

export function useNavigationLoading() {
  const navigation = useNavigation()

  return {
    isPending: navigation.isPending,
    isLoading: navigation.isPending,
  }
}
```

**Step 2: Verify hook exists**

Run: `ls -la src/hooks/useNavigationLoading.ts`
Expected: File exists (hooks directory may need creation)

**Step 3: Commit**

```bash
git add src/hooks/useNavigationLoading.ts
git commit -m "feat: add useNavigationLoading hook for tracking navigation state"
```

---

### Task 3: Integrate LoadingWrapper into Homepage

**Files:**
- Modify: `src/app/(frontend)/page.tsx`

**Step 1: Create client wrapper component for results section**

Add this component at the top of the file (after imports):

```tsx
'use client'

import { useNavigationLoading } from '@/hooks/useNavigationLoading'
import { LoadingWrapper } from '@/components/LoadingWrapper'
import { ResultsWrapper } from '@/components/ResultsWrapper'
import type { Service } from '@/types/service'

function ResultsSection({ services }: { services: Service[] }) {
  const { isPending } = useNavigationLoading()

  return (
    <LoadingWrapper isLoading={isPending} className="min-h-[200px]">
      <ResultsWrapper services={services} />
    </LoadingWrapper>
  )
}
```

**Step 2: Update imports**

Remove the direct import of `ResultsWrapper` if it becomes unused in the server component part.

**Step 3: Replace ResultsWrapper usage with ResultsSection**

Find line ~176 where `<ResultsWrapper services={services} />` is used and replace with:

```tsx
<ResultsSection services={services} />
```

**Step 4: Verify the app builds**

Run: `pnpm build`
Expected: Build succeeds without errors

**Step 5: Test manually**

Run: `pnpm dev`
Test: Click filters, submit search, verify overlay appears during loading

**Step 6: Commit**

```bash
git add src/app/\(frontend\)/page.tsx
git commit -m "feat: integrate LoadingWrapper into homepage results section"
```

---

### Task 4: Verify and Final Commit

**Step 1: Run full build**

Run: `pnpm build`
Expected: Build succeeds

**Step 2: Run linter**

Run: `pnpm lint`
Expected: No errors

**Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: any lint or build fixes"
```

---

## Summary

- **Task 1:** Create reusable LoadingWrapper component
- **Task 2:** Create useNavigationLoading hook
- **Task 3:** Integrate into homepage results section
- **Task 4:** Verify and finalize

The LoadingWrapper is now reusable anywhere in the app - just pass `isLoading={isPending}` or any boolean state.
