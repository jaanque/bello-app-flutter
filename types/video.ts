export interface VideoRecord {
  id: string;
  filename: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  filepath: string;
  duration: number;
  isRecap?: boolean;
  recapType?: 'weekly' | 'monthly';
  createdAt: number; // timestamp
}

export interface RecapVideo extends VideoRecord {
  isRecap: true;
  recapType: 'weekly' | 'monthly';
  weekNumber?: number; // para recaps semanales
  month?: number; // para recaps mensuales
  year?: number;
}

export interface DayVideos {
  [date: string]: VideoRecord[];
}

export interface MonthData {
  videos: VideoRecord[];
  recaps: RecapVideo[];
}