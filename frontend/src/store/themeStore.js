import { create } from 'zustand'

const useThemeStore = create((set) => {
  // Initialize theme from localStorage or system preference
  const storedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light')
  
  // Apply initial theme
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  return {
    theme: initialTheme,
    toggleTheme: () => {
      set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark'
        localStorage.setItem('theme', newTheme)
        
        // Update DOM
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        
        return { theme: newTheme }
      })
    },
    setTheme: (theme) => {
      set({ theme })
      localStorage.setItem('theme', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
  }
})

export { useThemeStore }
