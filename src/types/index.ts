export interface Game {
  name: string;
  image: string;
  imagePath: string;
  provider: string;
  rtp: number;
  status: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  jamGacor: string; // format "HH:MM - HH:MM" WIB, per game per bucket
  polaMain: { type: 'Manual' | 'Auto' | 'Spin'; total: number; turbo: boolean }[]; // 3 pola random per game per bucket
  playing: number; // jumlah player aktif, bias by RTP tier (0-100)
}