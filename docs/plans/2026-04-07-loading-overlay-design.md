# Loading Overlay Component Design

## Overview
A reusable loading overlay component that provides visual feedback during Next.js navigation transitions, specifically for URL-based filter changes.

## Problem
When users click filters or submit search, the URL changes and Next.js fetches new data from PocketBase. There's no visual feedback during this transition.

## Solution
Create a `LoadingWrapper` component that uses Next.js's `useNavigation()` hook to detect pending navigation and display a semi-transparent overlay with a spinner.

## Components

### LoadingWrapper
A wrapper component that overlays its children with a loading indicator.

```tsx
interface LoadingWrapperProps {
  isLoading: boolean
  children: React.ReactNode
  opacity?: number  // default: 0.7
  spinnerSize?: 'sm' | 'md' | 'lg'  // default: 'md'
}
```

**Usage:**
```tsx
<LoadingWrapper isLoading={isPending}>
  <ResultsGrid services={services} />
</LoadingWrapper>
```

### LoadingSpinner
A simple spinner component used inside the overlay.

```tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}
```

## Integration Points

1. **Homepage (`src/app/(frontend)/page.tsx`)** — Wrap the search results section with LoadingWrapper
2. **HeaderClient component** — May need to expose navigation state or handle it at page level

## Technical Approach

1. Use `useNavigation()` from `next/navigation` to get `isPending` state
2. Create `LoadingWrapper` component with relative positioning
3. Overlay uses absolute positioning with backdrop blur
4. Spinner centered within overlay

## File Structure
```
src/components/LoadingWrapper.tsx    # Main wrapper component
src/components/LoadingSpinner.tsx    # Spinner component (or inline)
```

## Styling
- Overlay: `absolute inset-0 bg-white/70 backdrop-blur-sm z-10`
- Spinner: Using existing brand colors (#1a5276)
- Transitions: Smooth fade in/out with `transition-opacity`
