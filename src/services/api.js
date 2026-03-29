import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Mock data for development - Real College Menu
const MOCK_MENU_DATA = {
  today: {
    date: new Date().toISOString().split('T')[0],
    dayName: 'Monday',
    breakfast: {
      id: 1,
      name: 'Breakfast',
      time: '7:00 AM - 10:00 AM',
      items: [
        { id: 1, name: 'Aloo Sandwich', type: 'veg', rating: 4.3, spice: 'medium' },
        { id: 2, name: 'Upma', type: 'veg', rating: 4.1, spice: 'low' },
        { id: 3, name: 'Corn Flakes + Milk', type: 'veg', rating: 3.9, spice: 'none' },
      ]
    },
    lunch: {
      id: 2,
      name: 'Lunch',
      time: '12:00 PM - 2:00 PM',
      items: [
        { id: 4, name: 'Aloo Sabzi', type: 'veg', rating: 4.2, spice: 'medium' },
        { id: 5, name: 'Kadoo (Pumpkin) Curry', type: 'veg', rating: 3.8, spice: 'low' },
        { id: 6, name: 'Rice', type: 'veg', rating: 4.0, spice: 'none' },
      ]
    },
    hiTea: {
      id: 2.5,
      name: 'Hi-Tea',
      time: '4:00 PM - 5:00 PM',
      items: [
        { id: 6.5, name: 'Dahi Bhalla (1pc.)', type: 'veg', rating: 4.4, spice: 'low' },
        { id: 6.7, name: 'Tea', type: 'veg', rating: 4.1, spice: 'none' },
      ]
    },
    dinner: {
      id: 3,
      name: 'Dinner',
      time: '7:00 PM - 9:00 PM',
      items: [
        { id: 7, name: 'Kadai Paneer', type: 'veg', rating: 4.6, spice: 'high' },
        { id: 8, name: 'Tomar Dal', type: 'veg', rating: 4.0, spice: 'medium' },
        { id: 9, name: 'Rotli', type: 'veg', rating: 4.2, spice: 'none' },
      ]
    }
  }
}

const MOCK_WEEKLY_MENU = [
  { 
    day: 'Monday', 
    breakfast: 'Aloo Sandwich, Upma, Corn Flakes + Milk', 
    lunch: 'Aloo Sabzi, Kadoo Curry, Rice',
    hiTea: 'Dahi Bhalla, Tea',
    dinner: 'Kadai Paneer, Tomar Dal, Rotli' 
  },
  { 
    day: 'Tuesday', 
    breakfast: 'Pav Bhaji, Sprout', 
    lunch: 'Kadhi Aloo, Fried Mirch, Papad',
    hiTea: 'Tea, Namkeen, Semai',
    dinner: 'Dosa, Sambhar, Chutney, Ice Cream' 
  },
  { 
    day: 'Wednesday', 
    breakfast: 'Poha, Jalebi, Omlet', 
    lunch: 'Chhote Bhature, Boodi Raita, Fried Mirch',
    hiTea: 'Tea-Coffee, Dhokla, Green Chutney',
    dinner: 'Bhindi, Mix Dal Tadka' 
  },
  { 
    day: 'Thursday', 
    breakfast: 'Paneer Bhuri, Paratha', 
    lunch: 'Black Chana Sabzi, Todar Dal, Papad, Peas',
    hiTea: 'Tea, Bread, Pakoda',
    dinner: 'Black Masoor Dal, Sabzi, Aloo Pea, Gulab Jamun' 
  },
  { 
    day: 'Friday', 
    breakfast: 'Idli, Sambhar, Chutney', 
    lunch: 'Veg Biryani, Onion Raita, Aloo Shimla, Green Chutney',
    hiTea: 'Tea, Samosa, Green Chutney, Imli Chutney',
    dinner: 'Malai Kofta, Dal Yellow' 
  },
  { 
    day: 'Saturday', 
    breakfast: 'Onion Paratha, Aloo Sabzi, Sprout', 
    lunch: 'Rajma, Sabzi, Dhal Loki, Chana Sabzi, Dry Papad',
    hiTea: 'Tea-Coffee, Poha/Pasta',
    dinner: 'Punjabi Dal Tada, Aloo Baigan, Custard' 
  },
  { 
    day: 'Sunday', 
    breakfast: 'Uttapam, Chutney, Ambhar', 
    lunch: 'Chana Dal, Dahi Aloo, Paratha, Green Chutney',
    hiTea: 'Tea, Pani Puri, Imly Chutney',
    dinner: 'Dum Aloo, Egg Curry' 
  },
]

const MOCK_RATINGS = [
  { mealId: 1, userId: 'user1', rating: 5 },
  { mealId: 1, userId: 'user2', rating: 4 },
  { mealId: 4, userId: 'user1', rating: 5 },
  { mealId: 2, userId: 'user2', rating: 3 },
]

const MOCK_FEEDBACK = [
  { 
    id: 1, 
    mealId: 4, 
    meal: 'Aloo Sabzi', 
    issue: 'taste', 
    description: 'The aloo sabzi was too bland. Could use more spices and salt.',
    mealDate: '2024-03-23',
    submittedDate: '2024-03-23',
    anonymous: false, 
    resolved: true,
    resolution: 'Increased seasoning and spices in the recipe. Will implement from next week.',
    resolvedDate: '2024-03-24',
    userId: 'user2',
    tags: ['seasoning', 'taste']
  },
  { 
    id: 2, 
    mealId: 8, 
    meal: 'Tomar Dal', 
    issue: 'quantity', 
    description: 'The dal portion was too small. Students need more nutrition.',
    mealDate: '2024-03-23',
    submittedDate: '2024-03-23',
    anonymous: true, 
    resolved: true,
    resolution: 'Adjusted serving size. Now giving 50% more dal per plate.',
    resolvedDate: '2024-03-23',
    userId: 'user3',
    tags: ['portion size', 'nutrition']
  },
  { 
    id: 3, 
    mealId: 5, 
    meal: 'Kadoo Curry', 
    issue: 'hygiene', 
    description: 'Found a stone in the curry. Raised serious hygiene concern.',
    mealDate: '2024-03-22',
    submittedDate: '2024-03-22',
    anonymous: true, 
    resolved: true,
    resolution: 'Reviewed preparation procedures with kitchen staff. Added extra screening process.',
    resolvedDate: '2024-03-22',
    userId: 'user1',
    tags: ['hygiene', 'safety']
  },
  { 
    id: 4, 
    mealId: 6, 
    meal: 'Rice', 
    issue: 'taste', 
    description: 'Rice quality could be better. Some grains are broken.',
    maleDate: '2024-03-22',
    submittedDate: '2024-03-22',
    anonymous: false, 
    resolved: false,
    userId: 'user4',
    tags: ['quality', 'rice']
  },
  { 
    id: 5, 
    mealId: 1, 
    meal: 'Aloo Sandwich', 
    issue: 'other', 
    description: 'Great sandwich! Would like more varieties. Maybe cheese option?',
    mealDate: '2024-03-21',
    submittedDate: '2024-03-21',
    anonymous: false, 
    resolved: false,
    userId: 'user2',
    tags: ['suggestions', 'variety']
  },
  { 
    id: 6, 
    mealId: 7, 
    meal: 'Kadai Paneer', 
    issue: 'taste', 
    description: 'Excellent paneer dish. Crispy and flavorful!',
    mealDate: '2024-03-20',
    submittedDate: '2024-03-20',
    anonymous: false, 
    resolved: false,
    userId: 'user5',
    tags: ['positive', 'tasty']
  },
  { 
    id: 7, 
    mealId: 3, 
    meal: 'Corn Flakes + Milk', 
    issue: 'quantity', 
    description: 'Milk portion too less. Need more milk with cereals.',
    mealDate: '2024-03-19',
    submittedDate: '2024-03-19',
    anonymous: true, 
    resolved: true,
    resolution: 'Increased milk serving from 150ml to 200ml per bowl.',
    resolvedDate: '2024-03-20',
    userId: 'user6',
    tags: ['portion', 'milk']
  },
]

// Mock analytics data
const MOCK_ANALYTICS = {
  ratings: [
    { meal: 'Kadai Paneer', avg: 4.6, count: 48 },
    { meal: 'Dahi Bhalla', avg: 4.4, count: 35 },
    { meal: 'Aloo Sandwich', avg: 4.3, count: 42 },
    { meal: 'Aloo Sabzi', avg: 4.2, count: 40 },
    { meal: 'Tomar Dal', avg: 4.0, count: 38 },
    { meal: 'Corn Flakes + Milk', avg: 3.9, count: 45 },
  ],
  issues: [
    { type: 'taste', count: 18 },
    { type: 'quantity', count: 12 },
    { type: 'hygiene', count: 3 },
    { type: 'other', count: 5 },
  ],
  dailyRatings: [
    { day: 'Mon', avg: 4.1 },
    { day: 'Tue', avg: 4.3 },
    { day: 'Wed', avg: 4.0 },
    { day: 'Thu', avg: 4.4 },
    { day: 'Fri', avg: 4.5 },
    { day: 'Sat', avg: 3.9 },
    { day: 'Sun', avg: 4.2 },
  ]
}

// Auth API calls
export const authAPI = {
  login: async (email, password, role) => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: 'user' + Math.random().toString(36).substr(2, 9),
            email,
            name: email.split('@')[0],
            role,
          }
        })
      }, 500)
    })
  },
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  },
}

// Menu API calls
export const menuAPI = {
  getDailyMenu: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_MENU_DATA);
      }, 600);
    });
  },
  getWeeklyMenu: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_WEEKLY_MENU);
      }, 600);
    });
  },
  rateMeal: async (mealId, rating) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, mealId, rating });
      }, 400);
    });
  },
  getMealRatings: async (mealId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ratings = MOCK_RATINGS.filter(r => r.mealId === mealId);
        const avg = ratings.length > 0 ? (ratings.reduce((a, r) => a + r.rating, 0) / ratings.length).toFixed(1) : 0;
        resolve({ avg, count: ratings.length, ratings });
      }, 400);
    });
  },
}

// Feedback API calls
export const feedbackAPI = {
  submitFeedback: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, id: MOCK_FEEDBACK.length + 1, ...data });
      }, 600);
    });
  },
  getFeedback: async (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let feedback = [...MOCK_FEEDBACK];
        if (filters.issue) {
          feedback = feedback.filter(f => f.issue === filters.issue);
        }
        if (filters.mealId) {
          feedback = feedback.filter(f => f.mealId === filters.mealId);
        }
        resolve(feedback);
      }, 500);
    });
  },
  getSummary: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalFeedback: MOCK_FEEDBACK.length,
          avgRating: 4.2,
          mostCommonIssue: 'taste',
          bestMeal: 'Biryani',
          worstMeal: 'Dal Tadka',
        });
      }, 500);
    });
  },
}

// Analytics API calls
export const analyticsAPI = {
  getAnalytics: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_ANALYTICS);
      }, 700);
    });
  },
  generateReport: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          report: {
            date: new Date().toLocaleDateString(),
            avgRating: 4.2,
            totalFeedback: MOCK_FEEDBACK.length,
            topMeal: 'Biryani',
            issues: MOCK_ANALYTICS.issues,
          }
        });
      }, 1000);
    });
  },
}

export default api
