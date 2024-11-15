export interface Staff {
  id: number;
  name: string;
  phone: string;
  address: string;
  skills: string;
  status: 'active' | 'inactive' | 'retired';
}

export interface Location {
  id: number;
  name: string;
  address: string;
  required_staff: number;
  difficulty: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'planned';
}

export interface Shift {
  id: number;
  date: string;
  staff_id: number | null;
  location_id: number;
  status: 'pending' | 'confirmed' | 'completed';
  staff_name?: string;
  location_name: string;
  location_address: string;
}