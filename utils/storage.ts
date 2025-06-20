import * as FileSystem from 'expo-file-system';
import { VideoRecord, RecapVideo } from '@/types/video';

const VIDEOS_DIR = `${FileSystem.documentDirectory}bello_videos/`;
const METADATA_FILE = `${FileSystem.documentDirectory}bello_metadata.json`;

export class VideoStorage {
  static async initializeStorage(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(VIDEOS_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(VIDEOS_DIR, { intermediates: true });
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  static async saveVideo(uri: string, date: string, time: string, thumbnailUrl?: string): Promise<VideoRecord | null> {
    try {
      await this.initializeStorage();
      
      const filename = `${date}_${time.replace(':', '-')}.mp4`;
      const filepath = `${VIDEOS_DIR}${filename}`;
      
      await FileSystem.moveAsync({
        from: uri,
        to: filepath,
      });

      const videoRecord: VideoRecord = {
        id: `${date}_${time}`,
        filename,
        date,
        time,
        filepath,
        duration: 0, // Se actualizará cuando se reproduzca
        createdAt: Date.now(),
        thumbnailUrl, // Add thumbnailUrl here
      };

      await this.updateMetadata(videoRecord);
      return videoRecord;
    } catch (error) {
      console.error('Error saving video:', error);
      return null;
    }
  }

  static async getAllVideos(): Promise<VideoRecord[]> {
    try {
      const metadataExists = await FileSystem.getInfoAsync(METADATA_FILE);
      if (!metadataExists.exists) {
        return [];
      }

      const metadata = await FileSystem.readAsStringAsync(METADATA_FILE);
      const videos: VideoRecord[] = JSON.parse(metadata);
      
      // Verificar que los archivos existen físicamente
      const validVideos: VideoRecord[] = [];
      for (const video of videos) {
        const fileExists = await FileSystem.getInfoAsync(video.filepath);
        if (fileExists.exists) {
          validVideos.push(video);
        }
      }

      // Si algunos archivos no existen, actualizar metadata
      if (validVideos.length !== videos.length) {
        await this.saveMetadata(validVideos);
      }

      return validVideos.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('Error getting videos:', error);
      return [];
    }
  }

  static async getVideosByMonth(year: number, month: number): Promise<VideoRecord[]> {
    const allVideos = await this.getAllVideos();
    const monthStr = month.toString().padStart(2, '0');
    const yearStr = year.toString();
    
    return allVideos.filter(video => {
      const [videoYear, videoMonth] = video.date.split('-');
      return videoYear === yearStr && videoMonth === monthStr;
    });
  }

  static async deleteVideo(videoId: string): Promise<boolean> {
    try {
      const allVideos = await this.getAllVideos();
      const video = allVideos.find(v => v.id === videoId);
      
      if (!video) return false;
      
      // No permitir eliminar recaps
      if (video.isRecap) return false;

      // Eliminar archivo físico
      const fileExists = await FileSystem.getInfoAsync(video.filepath);
      if (fileExists.exists) {
        await FileSystem.deleteAsync(video.filepath);
      }

      // Eliminar thumbnail si existe
      if (video.thumbnailUrl) {
        try {
          const thumbnailExists = await FileSystem.getInfoAsync(video.thumbnailUrl);
          if (thumbnailExists.exists) {
            await FileSystem.deleteAsync(video.thumbnailUrl);
          }
        } catch (thumbError) {
          console.error('Error deleting thumbnail:', thumbError);
          // No impedir la eliminación del video si falla la del thumbnail
        }
      }

      // Actualizar metadata
      const updatedVideos = allVideos.filter(v => v.id !== videoId);
      await this.saveMetadata(updatedVideos);
      
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }

  static async hasVideoForDate(date: string): Promise<boolean> {
    const allVideos = await this.getAllVideos();
    return allVideos.some(video => video.date === date && !video.isRecap);
  }

  static async saveRecap(uri: string, type: 'weekly' | 'monthly', year: number, weekOrMonth: number): Promise<RecapVideo | null> {
    try {
      await this.initializeStorage();
      
      const filename = type === 'weekly' 
        ? `recap_week_${year}-${weekOrMonth.toString().padStart(2, '0')}.mp4`
        : `recap_${year}-${weekOrMonth.toString().padStart(2, '0')}.mp4`;
      
      const filepath = `${VIDEOS_DIR}${filename}`;
      
      await FileSystem.moveAsync({
        from: uri,
        to: filepath,
      });

      const recapVideo: RecapVideo = {
        id: `recap_${type}_${year}_${weekOrMonth}`,
        filename,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        filepath,
        duration: 0,
        isRecap: true,
        recapType: type,
        ...(type === 'weekly' ? { weekNumber: weekOrMonth } : { month: weekOrMonth }),
        year,
        createdAt: Date.now(),
      };

      await this.updateMetadata(recapVideo);
      return recapVideo;
    } catch (error) {
      console.error('Error saving recap:', error);
      return null;
    }
  }

  private static async updateMetadata(video: VideoRecord): Promise<void> {
    const allVideos = await this.getAllVideos();
    const existingIndex = allVideos.findIndex(v => v.id === video.id);
    
    if (existingIndex >= 0) {
      allVideos[existingIndex] = video;
    } else {
      allVideos.push(video);
    }
    
    await this.saveMetadata(allVideos);
  }

  private static async saveMetadata(videos: VideoRecord[]): Promise<void> {
    try {
      await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify(videos, null, 2));
    } catch (error) {
      console.error('Error saving metadata:', error);
    }
  }
}