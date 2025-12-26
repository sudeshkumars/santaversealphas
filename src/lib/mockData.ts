// SantaVerse OS Mock Data

export interface Child {
  id: string;
  name: string;
  age: number;
  country: string;
  region: string;
  behaviorScore: number;
  status: 'nice' | 'naughty' | 'pending';
  wishlist: WishlistItem[];
  avatar?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected' | 'modified';
  ageAppropriate: boolean;
  inStock: boolean;
}

export interface Gift {
  id: string;
  name: string;
  category: string;
  stock: number;
  maxStock: number;
  status: 'designing' | 'manufacturing' | 'packed' | 'ready';
  demandLevel: 'high' | 'medium' | 'low';
  productionProgress: number;
}

export interface Elf {
  id: string;
  name: string;
  skill: 'toymaker' | 'wrapper' | 'logistics' | 'quality' | 'tech';
  energyLevel: number;
  tasksCompleted: number;
  currentTask?: string;
  morale: 'excellent' | 'good' | 'tired' | 'exhausted';
  efficiency: number;
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  deadline: string;
  category: string;
}

export interface Delivery {
  id: string;
  region: string;
  country: string;
  totalGifts: number;
  delivered: number;
  status: 'pending' | 'in_transit' | 'delivered';
  eta?: string;
  weatherRisk: 'low' | 'medium' | 'high';
  timezone: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Dashboard Stats
export const dashboardStats = {
  totalChildren: 2_847_392_156,
  wishesApproved: 2_234_891_423,
  giftsInProduction: 1_892_456_789,
  deliveriesCompleted: 0,
  activeElves: 847_293,
  christmasReadiness: 87,
  naughtyPercentage: 12,
  nicePercentage: 88,
};

// Mock Children Data
export const mockChildren: Child[] = [
  {
    id: 'c1',
    name: 'Emma Thompson',
    age: 7,
    country: 'United States',
    region: 'North America',
    behaviorScore: 92,
    status: 'nice',
    wishlist: [
      { id: 'w1', name: 'Lego Star Wars Set', category: 'Toys', priority: 'high', status: 'approved', ageAppropriate: true, inStock: true },
      { id: 'w2', name: 'Art Supplies Kit', category: 'Creative', priority: 'medium', status: 'approved', ageAppropriate: true, inStock: true },
    ],
  },
  {
    id: 'c2',
    name: 'Lucas Schmidt',
    age: 9,
    country: 'Germany',
    region: 'Europe',
    behaviorScore: 78,
    status: 'nice',
    wishlist: [
      { id: 'w3', name: 'Nintendo Switch Game', category: 'Electronics', priority: 'high', status: 'pending', ageAppropriate: true, inStock: false },
      { id: 'w4', name: 'Soccer Ball', category: 'Sports', priority: 'low', status: 'approved', ageAppropriate: true, inStock: true },
    ],
  },
  {
    id: 'c3',
    name: 'Yuki Tanaka',
    age: 5,
    country: 'Japan',
    region: 'Asia',
    behaviorScore: 95,
    status: 'nice',
    wishlist: [
      { id: 'w5', name: 'Stuffed Unicorn', category: 'Plush', priority: 'high', status: 'approved', ageAppropriate: true, inStock: true },
    ],
  },
  {
    id: 'c4',
    name: 'Oliver Brown',
    age: 11,
    country: 'United Kingdom',
    region: 'Europe',
    behaviorScore: 45,
    status: 'naughty',
    wishlist: [
      { id: 'w6', name: 'Gaming Console', category: 'Electronics', priority: 'high', status: 'rejected', ageAppropriate: true, inStock: true },
    ],
  },
  {
    id: 'c5',
    name: 'Sofia Martinez',
    age: 8,
    country: 'Mexico',
    region: 'North America',
    behaviorScore: 88,
    status: 'nice',
    wishlist: [
      { id: 'w7', name: 'Dollhouse', category: 'Toys', priority: 'high', status: 'approved', ageAppropriate: true, inStock: true },
      { id: 'w8', name: 'Piano Keyboard', category: 'Music', priority: 'medium', status: 'pending', ageAppropriate: true, inStock: true },
    ],
  },
  {
    id: 'c6',
    name: 'Aiden Johnson',
    age: 6,
    country: 'Canada',
    region: 'North America',
    behaviorScore: 82,
    status: 'nice',
    wishlist: [
      { id: 'w9', name: 'Remote Control Car', category: 'Toys', priority: 'high', status: 'approved', ageAppropriate: true, inStock: true },
    ],
  },
  {
    id: 'c7',
    name: 'Isabella Rossi',
    age: 10,
    country: 'Italy',
    region: 'Europe',
    behaviorScore: 91,
    status: 'nice',
    wishlist: [
      { id: 'w10', name: 'Book Collection', category: 'Books', priority: 'high', status: 'approved', ageAppropriate: true, inStock: true },
      { id: 'w11', name: 'Telescope', category: 'Science', priority: 'medium', status: 'approved', ageAppropriate: true, inStock: false },
    ],
  },
  {
    id: 'c8',
    name: 'Liam Chen',
    age: 4,
    country: 'China',
    region: 'Asia',
    behaviorScore: 67,
    status: 'pending',
    wishlist: [
      { id: 'w12', name: 'Building Blocks', category: 'Toys', priority: 'high', status: 'pending', ageAppropriate: true, inStock: true },
    ],
  },
];

// Mock Gifts Data
export const mockGifts: Gift[] = [
  { id: 'g1', name: 'Lego Star Wars Set', category: 'Toys', stock: 45000, maxStock: 100000, status: 'manufacturing', demandLevel: 'high', productionProgress: 45 },
  { id: 'g2', name: 'Stuffed Unicorn', category: 'Plush', stock: 89000, maxStock: 100000, status: 'ready', demandLevel: 'high', productionProgress: 100 },
  { id: 'g3', name: 'Nintendo Switch Game', category: 'Electronics', stock: 12000, maxStock: 80000, status: 'manufacturing', demandLevel: 'high', productionProgress: 15 },
  { id: 'g4', name: 'Art Supplies Kit', category: 'Creative', stock: 67000, maxStock: 75000, status: 'packed', demandLevel: 'medium', productionProgress: 90 },
  { id: 'g5', name: 'Remote Control Car', category: 'Toys', stock: 34000, maxStock: 60000, status: 'manufacturing', demandLevel: 'medium', productionProgress: 57 },
  { id: 'g6', name: 'Dollhouse', category: 'Toys', stock: 28000, maxStock: 50000, status: 'packed', demandLevel: 'medium', productionProgress: 85 },
  { id: 'g7', name: 'Soccer Ball', category: 'Sports', stock: 95000, maxStock: 100000, status: 'ready', demandLevel: 'low', productionProgress: 100 },
  { id: 'g8', name: 'Book Collection', category: 'Books', stock: 72000, maxStock: 80000, status: 'ready', demandLevel: 'medium', productionProgress: 100 },
  { id: 'g9', name: 'Telescope', category: 'Science', stock: 8000, maxStock: 40000, status: 'designing', demandLevel: 'low', productionProgress: 20 },
  { id: 'g10', name: 'Piano Keyboard', category: 'Music', stock: 18000, maxStock: 30000, status: 'manufacturing', demandLevel: 'medium', productionProgress: 60 },
];

// Mock Elves Data
export const mockElves: Elf[] = [
  { id: 'e1', name: 'Jingle Sparklefoot', skill: 'toymaker', energyLevel: 85, tasksCompleted: 1247, currentTask: 'Building Lego Sets', morale: 'excellent', efficiency: 94 },
  { id: 'e2', name: 'Tinsel McWrap', skill: 'wrapper', energyLevel: 72, tasksCompleted: 2891, currentTask: 'Gift Wrapping Station A', morale: 'good', efficiency: 88 },
  { id: 'e3', name: 'Cookie Sugarplum', skill: 'quality', energyLevel: 45, tasksCompleted: 892, currentTask: 'Quality Inspection', morale: 'tired', efficiency: 76 },
  { id: 'e4', name: 'Snowball Mintberry', skill: 'logistics', energyLevel: 91, tasksCompleted: 456, currentTask: 'Sleigh Loading', morale: 'excellent', efficiency: 97 },
  { id: 'e5', name: 'Pepper Candycane', skill: 'tech', energyLevel: 68, tasksCompleted: 234, currentTask: 'Route Optimization', morale: 'good', efficiency: 91 },
  { id: 'e6', name: 'Frost Tinkerton', skill: 'toymaker', energyLevel: 23, tasksCompleted: 1567, morale: 'exhausted', efficiency: 45 },
  { id: 'e7', name: 'Holly Jinglebell', skill: 'wrapper', energyLevel: 88, tasksCompleted: 3102, currentTask: 'Ribbon Station', morale: 'excellent', efficiency: 96 },
  { id: 'e8', name: 'Nutmeg Starshine', skill: 'quality', energyLevel: 79, tasksCompleted: 1023, currentTask: 'Electronics Testing', morale: 'good', efficiency: 89 },
];

// Mock Tasks Data
export const mockTasks: Task[] = [
  { id: 't1', title: 'Assemble 500 Lego Sets', assignedTo: 'Jingle Sparklefoot', priority: 'urgent', status: 'in_progress', deadline: '2024-12-20', category: 'Production' },
  { id: 't2', title: 'Wrap Europe Region Gifts', assignedTo: 'Tinsel McWrap', priority: 'high', status: 'in_progress', deadline: '2024-12-22', category: 'Wrapping' },
  { id: 't3', title: 'Quality Check Electronics', assignedTo: 'Cookie Sugarplum', priority: 'high', status: 'in_progress', deadline: '2024-12-21', category: 'Quality' },
  { id: 't4', title: 'Load Sleigh Section A', assignedTo: 'Snowball Mintberry', priority: 'medium', status: 'todo', deadline: '2024-12-24', category: 'Logistics' },
  { id: 't5', title: 'Optimize Asian Routes', assignedTo: 'Pepper Candycane', priority: 'high', status: 'in_progress', deadline: '2024-12-23', category: 'Tech' },
  { id: 't6', title: 'Build Plush Toys Batch', assignedTo: 'Frost Tinkerton', priority: 'medium', status: 'completed', deadline: '2024-12-19', category: 'Production' },
  { id: 't7', title: 'Special Gift Wrapping', assignedTo: 'Holly Jinglebell', priority: 'low', status: 'todo', deadline: '2024-12-23', category: 'Wrapping' },
  { id: 't8', title: 'Test Remote Vehicles', assignedTo: 'Nutmeg Starshine', priority: 'medium', status: 'completed', deadline: '2024-12-18', category: 'Quality' },
];

// Mock Deliveries Data
export const mockDeliveries: Delivery[] = [
  { id: 'd1', region: 'North America', country: 'Multiple', totalGifts: 892456, delivered: 0, status: 'pending', weatherRisk: 'low', timezone: 'UTC-5' },
  { id: 'd2', region: 'Europe', country: 'Multiple', totalGifts: 678234, delivered: 0, status: 'pending', weatherRisk: 'medium', timezone: 'UTC+1' },
  { id: 'd3', region: 'Asia', country: 'Multiple', totalGifts: 1234567, delivered: 0, status: 'pending', weatherRisk: 'low', timezone: 'UTC+8' },
  { id: 'd4', region: 'South America', country: 'Multiple', totalGifts: 345678, delivered: 0, status: 'pending', weatherRisk: 'low', timezone: 'UTC-3' },
  { id: 'd5', region: 'Africa', country: 'Multiple', totalGifts: 234567, delivered: 0, status: 'pending', weatherRisk: 'medium', timezone: 'UTC+2' },
  { id: 'd6', region: 'Oceania', country: 'Multiple', totalGifts: 156789, delivered: 0, status: 'pending', weatherRisk: 'high', timezone: 'UTC+10' },
];

// Mock Alerts Data
export const mockAlerts: Alert[] = [
  { id: 'a1', type: 'warning', title: 'Low Stock Alert', message: 'Nintendo Switch Games running low (15% inventory)', timestamp: '2 min ago', read: false },
  { id: 'a2', type: 'danger', title: 'Elf Exhaustion', message: 'Frost Tinkerton energy critically low - needs rest', timestamp: '15 min ago', read: false },
  { id: 'a3', type: 'info', title: 'Route Optimized', message: 'Asian delivery route reduced by 12% flight time', timestamp: '1 hour ago', read: true },
  { id: 'a4', type: 'success', title: 'Production Complete', message: 'Stuffed Unicorn batch fully manufactured', timestamp: '2 hours ago', read: true },
  { id: 'a5', type: 'warning', title: 'Weather Advisory', message: 'Oceania region showing storm patterns', timestamp: '3 hours ago', read: false },
];

// Regional Analytics Data
export const regionalData = [
  { name: 'North America', gifts: 892456, children: 456789, readiness: 92 },
  { name: 'Europe', gifts: 678234, children: 345678, readiness: 88 },
  { name: 'Asia', gifts: 1234567, children: 678901, readiness: 85 },
  { name: 'South America', gifts: 345678, children: 189012, readiness: 79 },
  { name: 'Africa', gifts: 234567, children: 156789, readiness: 74 },
  { name: 'Oceania', gifts: 156789, children: 89012, readiness: 81 },
];

// Weekly Production Data
export const weeklyProduction = [
  { day: 'Mon', produced: 4500000, target: 5000000 },
  { day: 'Tue', produced: 5200000, target: 5000000 },
  { day: 'Wed', produced: 4800000, target: 5000000 },
  { day: 'Thu', produced: 5500000, target: 5000000 },
  { day: 'Fri', produced: 5100000, target: 5000000 },
  { day: 'Sat', produced: 6200000, target: 6000000 },
  { day: 'Sun', produced: 5800000, target: 6000000 },
];

// Elf Productivity Data
export const elfProductivity = [
  { skill: 'Toymakers', count: 45, avgEfficiency: 87 },
  { skill: 'Wrappers', count: 32, avgEfficiency: 91 },
  { skill: 'Quality', count: 18, avgEfficiency: 84 },
  { skill: 'Logistics', count: 25, avgEfficiency: 93 },
  { skill: 'Tech', count: 12, avgEfficiency: 95 },
];
