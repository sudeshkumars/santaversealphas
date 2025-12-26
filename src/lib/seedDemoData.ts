import { supabase } from '@/integrations/supabase/client';

export async function seedDemoData(userId: string) {
  // Check if user already has data
  const { data: existingChildren } = await supabase
    .from('children')
    .select('id')
    .eq('user_id', userId)
    .limit(1);
  
  if (existingChildren && existingChildren.length > 0) {
    return; // User already has data
  }

  // Seed children
  const childrenData = [
    { user_id: userId, name: 'Emma Thompson', age: 7, country: 'United States', region: 'North America', behavior_score: 92, status: 'nice' as const },
    { user_id: userId, name: 'Lucas Schmidt', age: 9, country: 'Germany', region: 'Europe', behavior_score: 78, status: 'nice' as const },
    { user_id: userId, name: 'Yuki Tanaka', age: 5, country: 'Japan', region: 'Asia', behavior_score: 95, status: 'nice' as const },
    { user_id: userId, name: 'Oliver Brown', age: 11, country: 'United Kingdom', region: 'Europe', behavior_score: 45, status: 'naughty' as const },
    { user_id: userId, name: 'Sofia Martinez', age: 8, country: 'Mexico', region: 'North America', behavior_score: 88, status: 'nice' as const },
  ];

  const { data: insertedChildren } = await supabase
    .from('children')
    .insert(childrenData)
    .select();

  // Seed wishlist items for first child
  if (insertedChildren && insertedChildren.length > 0) {
    const wishlistData = [
      { child_id: insertedChildren[0].id, user_id: userId, name: 'Lego Star Wars Set', category: 'Toys', priority: 'high' as const, status: 'approved' as const },
      { child_id: insertedChildren[0].id, user_id: userId, name: 'Art Supplies Kit', category: 'Creative', priority: 'medium' as const, status: 'approved' as const },
      { child_id: insertedChildren[1].id, user_id: userId, name: 'Nintendo Switch Game', category: 'Electronics', priority: 'high' as const, status: 'pending' as const },
      { child_id: insertedChildren[2].id, user_id: userId, name: 'Stuffed Unicorn', category: 'Plush', priority: 'high' as const, status: 'approved' as const },
    ];

    await supabase.from('wishlist_items').insert(wishlistData);
  }

  // Seed gifts
  const giftsData = [
    { user_id: userId, name: 'Lego Star Wars Set', category: 'Toys', stock: 45000, max_stock: 100000, status: 'manufacturing' as const, demand_level: 'high' as const, production_progress: 45 },
    { user_id: userId, name: 'Stuffed Unicorn', category: 'Plush', stock: 89000, max_stock: 100000, status: 'ready' as const, demand_level: 'high' as const, production_progress: 100 },
    { user_id: userId, name: 'Nintendo Switch Game', category: 'Electronics', stock: 12000, max_stock: 80000, status: 'manufacturing' as const, demand_level: 'high' as const, production_progress: 15 },
    { user_id: userId, name: 'Art Supplies Kit', category: 'Creative', stock: 67000, max_stock: 75000, status: 'packed' as const, demand_level: 'medium' as const, production_progress: 90 },
    { user_id: userId, name: 'Remote Control Car', category: 'Toys', stock: 34000, max_stock: 60000, status: 'manufacturing' as const, demand_level: 'medium' as const, production_progress: 57 },
  ];

  await supabase.from('gifts').insert(giftsData);

  // Seed elves
  const elvesData = [
    { user_id: userId, name: 'Jingle Sparklefoot', skill: 'toymaker' as const, energy_level: 85, tasks_completed: 1247, current_task: 'Building Lego Sets', morale: 'excellent' as const, efficiency: 94 },
    { user_id: userId, name: 'Tinsel McWrap', skill: 'wrapper' as const, energy_level: 72, tasks_completed: 2891, current_task: 'Gift Wrapping Station A', morale: 'good' as const, efficiency: 88 },
    { user_id: userId, name: 'Cookie Sugarplum', skill: 'quality' as const, energy_level: 45, tasks_completed: 892, current_task: 'Quality Inspection', morale: 'tired' as const, efficiency: 76 },
    { user_id: userId, name: 'Snowball Mintberry', skill: 'logistics' as const, energy_level: 91, tasks_completed: 456, current_task: 'Sleigh Loading', morale: 'excellent' as const, efficiency: 97 },
    { user_id: userId, name: 'Pepper Candycane', skill: 'tech' as const, energy_level: 68, tasks_completed: 234, current_task: 'Route Optimization', morale: 'good' as const, efficiency: 91 },
  ];

  const { data: insertedElves } = await supabase
    .from('elves')
    .insert(elvesData)
    .select();

  // Seed tasks
  if (insertedElves && insertedElves.length > 0) {
    const tasksData = [
      { user_id: userId, elf_id: insertedElves[0].id, title: 'Assemble 500 Lego Sets', category: 'Production', priority: 'urgent' as const, status: 'in_progress' as const, deadline: '2024-12-20' },
      { user_id: userId, elf_id: insertedElves[1].id, title: 'Wrap Europe Region Gifts', category: 'Wrapping', priority: 'high' as const, status: 'in_progress' as const, deadline: '2024-12-22' },
      { user_id: userId, elf_id: insertedElves[2].id, title: 'Quality Check Electronics', category: 'Quality', priority: 'high' as const, status: 'in_progress' as const, deadline: '2024-12-21' },
      { user_id: userId, elf_id: insertedElves[3].id, title: 'Load Sleigh Section A', category: 'Logistics', priority: 'medium' as const, status: 'todo' as const, deadline: '2024-12-24' },
      { user_id: userId, elf_id: null, title: 'Special Gift Wrapping', category: 'Wrapping', priority: 'low' as const, status: 'todo' as const, deadline: '2024-12-23' },
    ];

    await supabase.from('tasks').insert(tasksData);
  }

  // Seed deliveries
  const deliveriesData = [
    { user_id: userId, region: 'North America', country: 'Multiple', total_gifts: 892456, delivered: 0, status: 'pending' as const, weather_risk: 'low' as const, timezone: 'UTC-5' },
    { user_id: userId, region: 'Europe', country: 'Multiple', total_gifts: 678234, delivered: 0, status: 'pending' as const, weather_risk: 'medium' as const, timezone: 'UTC+1' },
    { user_id: userId, region: 'Asia', country: 'Multiple', total_gifts: 1234567, delivered: 0, status: 'pending' as const, weather_risk: 'low' as const, timezone: 'UTC+8' },
    { user_id: userId, region: 'South America', country: 'Multiple', total_gifts: 345678, delivered: 0, status: 'pending' as const, weather_risk: 'low' as const, timezone: 'UTC-3' },
    { user_id: userId, region: 'Africa', country: 'Multiple', total_gifts: 234567, delivered: 0, status: 'pending' as const, weather_risk: 'medium' as const, timezone: 'UTC+2' },
    { user_id: userId, region: 'Oceania', country: 'Multiple', total_gifts: 156789, delivered: 0, status: 'pending' as const, weather_risk: 'high' as const, timezone: 'UTC+10' },
  ];

  await supabase.from('deliveries').insert(deliveriesData);
}
