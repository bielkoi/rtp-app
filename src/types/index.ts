export interface Game {
  name: string;
  image: string;
  imagePath: string; // Tambahkan ini
  provider: string;
  rtp: number;
  status: 'high' | 'medium' | 'low';
}