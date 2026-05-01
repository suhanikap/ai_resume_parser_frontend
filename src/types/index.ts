export interface Shoe {
  id: string;
  name: string;
  type: string;
  price: number;
  image_url: string;
  description: string;
  available_sizes: string[];
  suitable_skin_tones: string[];
  stock: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  session_id: string;
  shoe_id: string;
  size: string;
  quantity: number;
  shoe?: Shoe;
}

export type SkinTone = 'fair' | 'light' | 'medium' | 'tan' | 'deep';

export interface Resume {
  id: string;
  file_name: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  skills: string[];
  experience: string | null;
  education: string | null;
  raw_data: Record<string, unknown> | null;
  created_at: string;
}
