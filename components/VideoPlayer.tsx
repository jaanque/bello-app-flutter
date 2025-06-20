import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { AVPlaybackStatus, Video, ResizeMode } from 'expo-av';
import { VideoRecord } from '@/types/video';
import { X, Share } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';

interface VideoPlayerProps {
  video: VideoRecord | null;
  visible: boolean;
  onClose: () => void;
}

export default function VideoPlayer({ video, visible, onClose }: VideoPlayerProps) {
  const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);

  if (!video) return null;

  const handleShare = async () => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(video.filepath, {
          mimeType: 'video/mp4',
          dialogTitle: 'Compartir video de Bello',
        });
      } else {
        Alert.alert('Error', 'No se puede compartir en esta plataforma');
      }
    } catch (error) {
      console.error('Error sharing video:', error);
      Alert.alert('Error', 'No se pudo compartir el video');
    }
  };

  const getTitle = () => {
    if (video.isRecap) {
      if (video.recapType === 'weekly') {
        return `Recap Semana ${video.weekNumber}`;
      } else {
        const monthNames = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return `Recap ${monthNames[(video.month || 1) - 1]} ${video.year}`;
      }
    } else {
      const date = new Date(video.date);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.title}>{getTitle()}</Text>
          
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.videoContainer}>
          <Video
            source={{ uri: video.filepath }}
            style={styles.video}
            shouldPlay
            isLooping
            resizeMode={ResizeMode.CONTAIN}
            onPlaybackStatusUpdate={setStatus}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.dateText}>
            {new Date(video.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <Text style={styles.timeText}>{video.time}</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  shareButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  info: {
    padding: 16,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginTop: 4,
  },
});