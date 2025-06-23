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
import { VideoView, useVideoPlayer } from 'expo-video';
import { VideoRecord } from '@/types/video';
import { X, Share } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import theme from '@/styles/theme'; // Import theme
import * as Haptics from 'expo-haptics'; // Import Haptics

interface VideoPlayerProps {
  video: VideoRecord | null;
  visible: boolean;
  onClose: () => void;
}

export default function VideoPlayer({ video, visible, onClose }: VideoPlayerProps) {
  if (!video) return null;

  const player = useVideoPlayer(video.filepath, (player) => {
    player.loop = true;
    player.play();
  });

  const triggerShareHaptics = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSharePress = async () => {
    triggerShareHaptics();
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

  const handleClosePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
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
            onPress={handleClosePress}
            activeOpacity={0.7}
          >
            <X size={24} color={theme.colors.white} />
          </TouchableOpacity>
          
          <Text style={styles.title}>{getTitle()}</Text>
          
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleSharePress}
            activeOpacity={0.7}
          >
            <Share size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.videoContainer}>
          <VideoView
            player={player}
            style={styles.video}
            contentFit="contain"
            allowsFullscreen
            allowsPictureInPicture
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Translucent background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    zIndex: 1,
    // backgroundColor: 'rgba(0,0,0,0.3)' // Example if overlaying on content
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...theme.typography.textStyles.title2, // Using a title style
    fontSize: theme.typography.fontSizes.lg, // Adjust size as needed
    color: theme.colors.white,
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
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  dateText: {
    ...theme.typography.textStyles.body,
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.white,
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: theme.spacing.xs,
  },
  timeText: {
    ...theme.typography.textStyles.caption,
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.mediumGray, // Lighter gray for secondary info
  },
});