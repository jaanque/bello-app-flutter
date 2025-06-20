import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { VideoRecord } from '@/types/video';
import { Trash2, Play } from 'lucide-react-native';

interface VideoGridProps {
  videos: VideoRecord[];
  onVideoPress: (video: VideoRecord) => void;
  onDeleteVideo: (videoId: string) => void;
}

const { width } = Dimensions.get('window');
const GRID_PADDING = 16;
const GRID_SPACING = 8;
const ITEM_WIDTH = (width - GRID_PADDING * 2 - GRID_SPACING * 2) / 3;

export default function VideoGrid({ videos, onVideoPress, onDeleteVideo }: VideoGridProps) {
  const handleDeletePress = (video: VideoRecord) => {
    if (video.isRecap) {
      Alert.alert('No se puede eliminar', 'Los recaps no pueden eliminarse.');
      return;
    }

    Alert.alert(
      'Eliminar video',
      `¿Estás seguro de que quieres eliminar el video del ${video.date}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => onDeleteVideo(video.id)
        },
      ]
    );
  };

  if (videos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tienes videos para este mes</Text>
        <Text style={styles.emptySubtext}>¡Empieza a grabar tus recuerdos diarios!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {videos.map((video) => (
        <View key={video.id} style={styles.videoItem}>
          <TouchableOpacity
            style={styles.videoTouchable}
            onPress={() => onVideoPress(video)}
            activeOpacity={0.8}
          >
            <View style={styles.thumbnail}>
              {video.thumbnailUrl ? (
                <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnailImage} />
              ) : (
                <View style={styles.thumbnailPlaceholder}>
                  <Play size={24} color="#666" />
                </View>
              )}
              
              <View style={styles.videoInfo}>
                <Text style={styles.videoDate}>
                  {new Date(video.date).getDate()}
                </Text>
                <Text style={styles.videoTime}>{video.time}</Text>
              </View>

              {video.isRecap && (
                <View style={[
                  styles.recapBadge,
                  video.recapType === 'weekly' ? styles.weeklyBadge : styles.monthlyBadge
                ]}>
                  <Text style={styles.recapBadgeText}>
                    {video.recapType === 'weekly' ? 'S' : 'M'}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {!video.isRecap && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeletePress(video)}
              activeOpacity={0.7}
            >
              <Trash2 size={16} color="#ff4444" />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: GRID_PADDING,
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
  },
  videoItem: {
    width: ITEM_WIDTH,
    marginBottom: 16,
    position: 'relative',
  },
  videoTouchable: {
    width: '100%',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
  },
  videoDate: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  videoTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    opacity: 0.8,
  },
  recapBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weeklyBadge: {
    backgroundColor: '#B794F6', // Lilas pastel
  },
  monthlyBadge: {
    backgroundColor: '#F6E05E', // Dorado pastel
  },
  recapBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});