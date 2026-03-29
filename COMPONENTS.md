# Component Documentation

## Overview
This document provides quick reference for using components in the Mess Menu & Feedback System.

## Core Components

### Button
Versatile button component with multiple variants.

```jsx
import Button from '@/components/Button'

<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `disabled`: boolean
- `className`: string

---

### Card
Container component for grouping content.

```jsx
import Card from '@/components/Card'

<Card hover className="p-6">
  Content goes here
</Card>
```

**Props:**
- `hover`: boolean (adds hover effect)
- `className`: string (additional classes)

---

### Input
Text input field with validation support.

```jsx
import Input from '@/components/Input'

<Input 
  label="Email"
  type="email"
  placeholder="you@example.com"
  error={error}
/>
```

**Props:**
- `label`: string
- `error`: string (error message)
- All standard input attributes

---

### Select
Dropdown select component.

```jsx
import Select from '@/components/Select'

<Select
  label="Choose option"
  options={[
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' }
  ]}
  onChange={handler}
/>
```

**Props:**
- `label`: string
- `options`: Array<{value: string, label: string}>
- `error`: string

---

### StarRating
Star rating component for meal ratings.

```jsx
import StarRating from '@/components/StarRating'

<StarRating 
  rating={4}
  onRate={(star) => console.log(star)}
  readonly={false}
  size="md"
/>
```

**Props:**
- `rating`: number (0-5)
- `onRate`: (star: number) => void
- `readonly`: boolean
- `size`: 'sm' | 'md' | 'lg'

---

### MealCard
Card component for displaying individual meals.

```jsx
import MealCard from '@/components/MealCard'

<MealCard 
  meal={{ id: 1, name: 'Biryani', type: 'non-veg', rating: 4.5 }}
  mealType="lunch"
/>
```

**Properties:**
- meal: { id, name, type, rating }
- mealType: 'breakfast' | 'lunch' | 'dinner'

---

### StatCard
Statistics display card.

```jsx
import StatCard from '@/components/StatCard'
import { TrendingUp } from 'lucide-react'

<StatCard
  label="Total Feedback"
  value="42"
  icon={TrendingUp}
  color="purple"
  trend={5}
/>
```

**Props:**
- `label`: string
- `value`: string | number
- `icon`: React component
- `color`: 'purple' | 'green' | 'blue' | 'orange' | 'red'
- `trend`: number (optional)

---

### Sidebar
Navigation sidebar component.

```jsx
import Sidebar from '@/components/Sidebar'

<Sidebar />
```

Automatically adapts based on user role and provides navigation.

---

### Toast
Toast notification system.

```jsx
import { useToastStore } from '@/store/toastStore'

const { addToast } = useToastStore()
addToast('Success!', 'success', 3000)
addToast('Error occurred', 'error')
addToast('Info message', 'info')
```

**Types:** 'success' | 'error' | 'info'

---

### SkeletonLoader
Loading placeholder component.

```jsx
import SkeletonLoader from '@/components/SkeletonLoader'

<SkeletonLoader count={3} height="h-32" />
```

**Props:**
- `count`: number (default: 1)
- `height`: string (Tailwind height class)

---

### EmptyState
Display when no data is available.

```jsx
import EmptyState from '@/components/EmptyState'
import { Package } from 'lucide-react'

<EmptyState
  title="No items found"
  description="Try adjusting your filters"
  icon={Package}
/>
```

**Props:**
- `title`: string
- `description`: string
- `icon`: React component

---

### ProtectedRoute
Route protection component.

```jsx
import ProtectedRoute from '@/components/ProtectedRoute'

<ProtectedRoute roles={['admin']} layout={MainLayout}>
  <AdminPage />
</ProtectedRoute>
```

**Props:**
- `roles`: string[] (allowed roles)
- `layout`: React component

---

## State Management

### useAuthStore
Authentication state management.

```jsx
import { useAuthStore } from '@/store/authStore'

const { user, setUser, logout } = useAuthStore()

// setUser
setUser({ id: '1', name: 'John', role: 'btech' })

// logout
logout()
```

### useToastStore
Toast notifications management.

```jsx
import { useToastStore } from '@/store/toastStore'

const { toasts, addToast, removeToast } = useToastStore()

// Add notification
addToast('Hello!', 'success', 3000)

// Remove notification
removeToast(toastId)
```

## API Hooks

### Usage Pattern
```jsx
import { menuAPI, feedbackAPI, analyticsAPI } from '@/services/api'

const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true)
      const result = await menuAPI.getDailyMenu()
      setData(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  fetchData()
}, [])
```

---

## Pages

### Login
`src/pages/Login.jsx` - Authentication landing page

### StudentDashboard
`src/pages/StudentDashboard.jsx` - Student home page

### DailyMenu
`src/pages/DailyMenu.jsx` - Today's menu display

### WeeklyMenu
`src/pages/WeeklyMenu.jsx` - Weekly meal planner

### FeedbackPage
`src/pages/FeedbackPage.jsx` - Feedback submission

### AdminDashboard
`src/pages/AdminDashboard.jsx` - Analytics dashboard

### ReportsPage
`src/pages/ReportsPage.jsx` - Report generation

---

## Styling Guide

### Using Tailwind CSS
All components use Tailwind CSS for styling. Common patterns:

```jsx
// Spacing
<div className="p-6 m-4">Not bad</div>

// Colors
<div className="bg-purple-600 text-white">Primary color</div>

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  Grid layout
</div>

// Hover effects
<button className="hover:bg-purple-700 transition-colors duration-200">
  Hover button
</button>
```

### Custom Colors
Primary: `bg-purple-600`
Secondary: `bg-gray-200`
Success: `text-green-600`
Error: `text-red-600`
Warning: `text-orange-600`
Info: `text-blue-600`

---

## Common Patterns

### Loading State
```jsx
{loading ? <SkeletonLoader /> : <YourComponent />}
```

### Data Fetching
```jsx
useEffect(() => {
  fetchData()
}, [addToast])
```

### Error Handling
```jsx
try {
  // operation
} catch (error) {
  addToast('Error message', 'error')
}
```

---

**Version**: 1.0.0
**Last Updated**: March 2026
