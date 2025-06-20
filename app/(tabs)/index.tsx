import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { VideoRecord, RecapVideo } from '@/types/video';
import { VideoStorage } from '@/utils/storage';
import { RecapGenerator } from '@/utils/recap';
import VideoGrid from '@/components/VideoGrid';
import RecapBanner from '@/components/RecapBanner';
import RecordButton from '@/components/RecordButton';
import MonthSelector from '@/components/MonthSelector';
import VideoPlayer from '@/components/VideoPlayer';

export default function HomeScreen() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [recaps, setRecaps] = useState<RecapVideo[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedVideo, setSelectedVideo] = useState<VideoRecord | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadMonthData = useCallback(async () => {
    try {
      const monthVideos = await VideoStorage.getVideosByMonth(currentYear, currentMonth);
      const regularVideos = monthVideos.filter(v => !v.isRecap);
      const monthRecaps = monthVideos.filter(v => v.isRecap) as RecapVideo[];
      
      setVideos(regularVideos);
      setRecaps(monthRecaps);
    } catch (error) {
      console.error('Error loading month data:', error);
    }
  }, [currentMonth, currentYear]);

  useEffect(() => {
    loadMonthData();
  }, [loadMonthData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await RecapGenerator.checkAndGenerateRecaps();
    await loadMonthData();
    setRefreshing(false);
  }, [loadMonthData]);

  const handleRecordPress = () => {
    router.push('/record');
  };

  const handleVideoPress = (video: VideoRecord) => {
    setSelectedVideo(video);
  };

  const handleDeleteVideo = async (videoId: string) => {
    const success = await VideoStorage.deleteVideo(videoId);
    if (success) {
      await loadMonthData();
    } else {
      Alert.alert('Error', 'No se pudo eliminar el video');
    }
  };

  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleRecapPlay = (recap: RecapVideo) => {
    setSelectedVideo(recap);
  };

  const handleRecapShare = async (recap: RecapVideo) => {
    // La funcionalidad de compartir se maneja en el VideoPlayer
    setSelectedVideo(recap);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MonthSelector
        currentMonth={currentMonth}
        currentYear={currentYear}
        onMonthChange={handleMonthChange}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Banners de Recaps */}
        {recaps.map((recap) => (
          <RecapBanner
            key={recap.id}
            recap={recap}
            onPlay={() => handleRecapPlay(recap)}
            onShare={() => handleRecapShare(recap)}
          />
        ))}

        {/* Grid de Videos */}
        <VideoGrid
          videos={videos}
          onVideoPress={handleVideoPress}
          onDeleteVideo={handleDeleteVideo}
        />
      </ScrollView>

      {/* Botón de Grabar - Solo visible en el mes actual */}
      {currentMonth === new Date().getMonth() + 1 && 
       currentYear === new Date().getFullYear() && (
        <RecordButton onPress={handleRecordPress} />
      )}

      {/* Video Player Modal */}
      <VideoPlayer
        video={selectedVideo}
        visible={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
});