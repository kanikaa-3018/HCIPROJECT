# Project Architecture & Code Organization

## Overview
This document explains the architecture, design patterns, and code organization of the Mess Menu & Feedback System.

## Architecture

### Component-Based Architecture
The application follows React's component-based architecture with:
- Presentational components (pure, reusable)
- Container components (smart, data-aware)
- Layout components (structural)
- Page components (route-level)

### State Management
- **Zustand** for lightweight, scalable state
- **React Hooks** (useState, useEffect) for local component state
- **LocalStorage** for persistence (auth tokens)

### Routing
- **React Router v6** for client-side routing
- **Protected routes** for role-based access
- **Dynamic navigation** based on user role

## Folder Structure Detailed

### `/src/components`
Reusable UI components. Each component is self-contained and can be used across multiple pages.

```
Button.jsx          - Versatile button with variants
Card.jsx            - Container card component
EmptyState.jsx      - Display when no data exists
Input.jsx           - Controlled text input
MealCard.jsx        - Meal display card
ProtectedRoute.jsx  - Route protection wrapper
Select.jsx          - Dropdown select
Sidebar.jsx         - Navigation sidebar
SkeletonLoader.jsx  - Loading placeholder
StarRating.jsx      - Star rating input
StatCard.jsx        - Statistics display
Toast.jsx           - Toast notification system
```

**Key Principles:**
- Single responsibility
- No business logic
- Reusable across pages
- Well-documented props
- Responsive by default

### `/src/pages`
Page-level components that correspond to routes.

```
Login.jsx                - Authentication entry point
StudentDashboard.jsx     - Student home
DailyMenu.jsx            - Today's meals
WeeklyMenu.jsx           - 7-day meal planner
FeedbackPage.jsx         - Feedback submission
AdminDashboard.jsx       - Analytics dashboard
ReportsPage.jsx          - Report generation
```

**Responsibilities:**
- Data fetching
- Conditional rendering
- Business logic
- Using multiple components
- Handling page state

### `/src/layouts`
Layout wrapper components for multi-page structure.

```
MainLayout.jsx      - Sidebar + main content layout
```

### `/src/services`
External communication and business logic.

```
api.js              - API calls and mock data
```

**Structure:**
- API methods organized by domain
- Mock data for development
- Error handling
- Async operations
- Promise-based calls

### `/src/store`
Zustand stores for global state management.

```
authStore.js        - Authentication state
toastStore.js       - Notification state
```

**Store Pattern:**
```javascript
const useStore = create((set) => ({
  state: initialValue,
  action: (payload) => set({ state: newValue })
}))
```

## Design Patterns

### 1. Container/Presentational Pattern
```
Page (Container)
├── StatCard (Presentational)
├── MealCard (Presentational)
└── Button (Presentational)
```

### 2. Compound Component Pattern
```jsx
<Card>
  <Card.Header title="Title" />
  <Card.Body>Content</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>
```

### 3. Render Props (via components)
```jsx
<ProtectedRoute roles={['admin']}>
  <AdminPage />
</ProtectedRoute>
```

### 4. Hook Pattern
```jsx
const { user, setUser, logout } = useAuthStore()
const { addToast } = useToastStore()
```

### 5. Custom Hooks (Ready for expansion)
```jsx
// Future: custom hooks for common operations
// useMenu(), useFeedback(), useAnalytics()
```

## Data Flow

### Authentication Flow
```
Login Page
    ↓
authAPI.login()
    ↓
useAuthStore.setUser()
    ↓
localStorage.setItem()
    ↓
Redirect to Dashboard
```

### Menu Display Flow
```
DailyMenu Page
    ↓
useEffect() → menuAPI.getDailyMenu()
    ↓
setState(menu)
    ↓
Render MealCard components
    ↓
User interacts → rating/feedback
```

### Rating Flow
```
MealCard
    ↓
User clicks star
    ↓
menuAPI.rateMeal()
    ↓
setHasRated(true)
    ↓
Show success toast
```

## Styling Strategy

### Tailwind CSS
- Utility-first approach
- Custom theme configuration
- Responsive design system
- No custom CSS (except in index.css)

### Color System
```
Primary:    #9333ea (purple-600)
Secondary:  #d1d5db (gray-300)
Success:    #10b981 (green-600)
Error:      #ef4444 (red-600)
Warning:    #f59e0b (orange-500)
Info:       #3b82f6 (blue-600)
```

### Spacing Scale
```
2px, 4px, 6px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
```

## Component Props Convention

### Button Props
```javascript
{
  variant: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost',
  size: 'sm' | 'md' | 'lg',
  loading: boolean,
  disabled: boolean,
  children: ReactNode,
  className: string,
  ...props // spread remaining
}
```

### Card Props
```javascript
{
  hover: boolean,
  className: string,
  children: ReactNode,
  ...props
}
```

## Error Handling Strategy

### API Errors
```javascript
try {
  const data = await menuAPI.getDailyMenu()
  setState(data)
} catch (error) {
  addToast('Failed to load menu', 'error')
  // Render fallback UI
}
```

### Validation
```javascript
if (!formData.mealId || !formData.description.trim()) {
  addToast('Please fill required fields', 'error')
  return
}
```

### Protected Routes
```javascript
if (!user) {
  return <Navigate to="/login" replace />
}
if (!roles.includes(user.role)) {
  return <Navigate to="/login" replace />
}
```

## Performance Optimization

### Code Splitting (Ready)
```javascript
const DailyMenu = lazy(() => import('./pages/DailyMenu'))
```

### Memoization (When needed)
```javascript
const MealCard = memo(({ meal }) => (...))
```

### Effect Dependencies
```javascript
useEffect(() => {
  fetchData()
}, [addToast]) // Only run when dependency changes
```

## Testing Strategy (Future)

### Unit Tests
- Component snapshot tests
- Props validation
- Event handlers

### Integration Tests
- User flows
- Form submission
- Navigation

### E2E Tests
- Full user journey
- Complete workflows

## Security Considerations

### Implemented
- [x] Protected routes
- [x] Role-based access control
- [x] Input validation
- [x] No sensitive data in localStorage (demo)

### Future Implementation
- [ ] JWT token management
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] HTTPS enforcement
- [ ] API key management

## Scalability Considerations

### Current Implementation
- Component reusability: ✅
- State management flexibility: ✅
- Service separation: ✅
- Layout modularity: ✅

### For Scaling
- Implement feature-based folder structure
- Add service layer abstraction
- Implement caching layer
- Add request debouncing
- Implement pagination
- Add search indexing

## Development Workflow

### Local Development
```bash
npm install
npm run dev
```

### Feature Development
1. Create component in `/src/components`
2. Create page in `/src/pages` if needed
3. Add to router in `App.jsx`
4. Add API methods in `services/api.js`
5. Test all flows
6. Document changes

### Build & Deploy
```bash
npm run build
npm run preview
# Deploy dist/ folder
```

## API Integration Points

### Menu Service
- `getDailyMenu()` - Today's meals
- `getWeeklyMenu()` - 7-day menu
- `rateMeal(mealId, rating)` - Submit rating
- `getMealRatings(mealId)` - Get meal ratings

### Feedback Service
- `submitFeedback(data)` - Submit feedback
- `getFeedback(filters)` - Get feedback list
- `getSummary()` - Feedback summary

### Analytics Service
- `getAnalytics()` - Dashboard data
- `generateReport()` - Create report

## Environment Configuration

### Development
- Fast refresh enabled
- Source maps enabled
- Console logging enabled

### Production
- Minified code
- Tree-shaking enabled
- Asset optimization
- Error tracking ready

## Browser DevTools

### Recommended Extensions
- React Developer Tools
- Redux DevTools (optional)
- Tailwind CSS IntelliSense

## Debugging Strategy

### Console Logging
```javascript
console.log({ data, loading, error })
```

### React DevTools
- Component inspection
- Props examination
- State tracking

### Network Tab
- API call monitoring
- Response inspection
- Performance analysis

---

## Migration to Real Backend

When connecting to a real backend:

1. Create `.env.local` with API base URL
2. Replace mock data with real API calls
3. Implement proper error handling
4. Add interceptors for auth tokens
5. Implement retry logic
6. Add request/response transformers
7. Set up API documentation

---

**Version**: 1.0.0
**Last Updated**: March 2026
