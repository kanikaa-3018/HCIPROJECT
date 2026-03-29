# SETUP & DEPLOYMENT GUIDE

## Prerequisites
- Node.js 16+ 
- npm or yarn

## Installation Steps

1. **Clone/Download the project**
   ```bash
   cd d:\HCIPROJECT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## Demo Credentials

### Student (B.Tech)
- Email: student@college.edu
- Password: password
- Role: btech

### Student (M.Tech/PhD)
- Email: student@college.edu
- Password: password
- Role: mtech

### Admin (Warden)
- Email: student@college.edu
- Password: password
- Role: admin

## Project Features

### ✅ Complete Implementation

1. **Daily Menu Display** ✓
   - Breakfast, Lunch, Dinner
   - Time slots
   - Veg/Non-veg indicators
   - Average ratings

2. **Rating System** ✓
   - 1-5 star rating
   - One rating per meal per user
   - Visual feedback
   - Hover effects

3. **Feedback Form** ✓
   - Meal selection dropdown
   - Issue type categorization
   - Text feedback area
   - Anonymous toggle
   - Success/error messages

4. **Weekly Menu View** ✓
   - 7-day calendar layout
   - All meals visible
   - Current day highlight
   - Responsive cards

5. **Admin Dashboard** ✓
   - Average ratings bar chart
   - Issue distribution pie chart
   - Weekly trend line chart
   - Summary statistics
   - Quick action buttons

6. **Reports Page** ✓
   - Generate reports
   - Download functionality
   - Key observations
   - Recommendations
   - Report history
   - Export options

7. **Role-Based Access** ✓
   - Student views
   - Admin views
   - Protected routes
   - Proper redirects

## UI/UX Features

- ✓ Clean, modern design
- ✓ Card-based layout
- ✓ Smooth animations & transitions
- ✓ Skeleton loaders
- ✓ Empty states
- ✓ Toast notifications
- ✓ Responsive sidebar
- ✓ Mobile-friendly navigation
- ✓ Consistent color scheme
- ✓ Hover effects

## Code Quality

- ✓ Modular component structure
- ✓ Reusable components
- ✓ Clean code organization
- ✓ Proper error handling
- ✓ Loading states
- ✓ Type-safe props
- ✓ Consistent naming
- ✓ Well-commented code

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 5174
```

### Modules not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind not working
```bash
npm run dev
# Vite will rebuild automatically
```

## Production Build

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Preview build**
   ```bash
   npm run preview
   ```

3. **Deploy** (choose your platform)
   - Vercel: `vercel`
   - Netlify: `netlify deploy`
   - Traditional: Copy `dist/` to web server

## Performance Tips

- Use code splitting with React Router
- Lazy load components as needed
- Compress images
- Enable GZIP compression
- Use CDN for assets
- Monitor bundle size

## Next Steps for Production

1. Replace mock API with real backend
2. Implement proper authentication
3. Add database integration
4. Set up CI/CD pipeline
5. Add unit/integration tests
6. Set up monitoring
7. Configure security headers
8. Add rate limiting
9. Implement caching
10. Set up error tracking

## Support & Documentation

- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- React Router: https://reactrouter.com
- Recharts: https://recharts.org
- Zustand: https://github.com/pmndrs/zustand

---

**Project Status**: ✅ Production Ready (Demo)
**Last Updated**: March 2026
