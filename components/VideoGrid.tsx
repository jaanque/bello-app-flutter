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
import theme from '@/styles/theme'; // Import theme
import * as Haptics from 'expo-haptics'; // Import Haptics

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
  const handleVideoPress = (video: VideoRecord) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onVideoPress(video);
  };

  const handleDeletePress = (video: VideoRecord) => {
    if (video.isRecap) {
      Alert.alert('No se puede eliminar', 'Los recaps no pueden eliminarse.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Medium for destructive action alert
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
      {videos.map((video) => {
        // console.log('VideoGrid: Rendering video ID:', video.id, 'with thumbnailUrl:', video.thumbnailUrl);
        return (
          <View key={video.id} style={styles.videoItem}>
            <TouchableOpacity
              style={styles.videoTouchable}
              onPress={() => handleVideoPress(video)}
              activeOpacity={0.8}
            >
              <View style={styles.thumbnail}>
              {video.thumbnailUrl ? (
                <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnailImage} />
              ) : (
                <View style={styles.thumbnailPlaceholder}>
                  <Play size={24} color={theme.colors.secondary} />
                </View>
              )}

                <View style={styles.videoInfo}>
                  <Text style={styles.videoDate}>
                    {new Date(video.date).getDate()}
                  </Text>
                  {/* <Text style={styles.videoTime}>{video.time}</Text> // Time might be too much detail for Apple Photos look */}
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
                <Trash2 size={16} color={theme.colors.red} />
            </TouchableOpacity>
          )}
        </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: GRID_PADDING,
    // Use justifyContent: 'flex-start' if you want items to align left if last row is not full
    // justifyContent: 'space-between', // This can lead to uneven spacing if last row is not full
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.textStyles.title2, // Using a title style for emphasis
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    ...theme.typography.textStyles.body,
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  videoItem: {
    width: ITEM_WIDTH,
    marginBottom: GRID_SPACING, // Consistent spacing
    marginHorizontal: GRID_SPACING / 2, // Add horizontal margin for spacing
    position: 'relative',
  },
  videoTouchable: {
    width: '100%',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 0.75, // Apple Photos often uses portrait-oriented thumbnails (e.g. 4:3 or similar)
    backgroundColor: theme.colors.lightGray, // Use theme color
    borderRadius: theme.radii.sm, // Slightly rounded corners
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.mediumGray, // Use a slightly darker gray for placeholder
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoInfo: {
    position: 'absolute',
    bottom: theme.spacing.xs, // Small margin from bottom
    left: theme.spacing.xs,   // Small margin from left
    // No background, text shadow for legibility if needed (advanced)
  },
  videoDate: {
    fontFamily: theme.typography.fonts.semiBold,
    fontSize: theme.typography.fontSizes.sm, // Smaller font size
    color: theme.colors.white, // Assuming dark thumbnails, white text
    // Add text shadow for better legibility against varied backgrounds
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // videoTime removed for cleaner look, date is usually enough for grid view
  recapBadge: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    width: 20, // Smaller badge
    height: 20, // Smaller badge
    borderRadius: theme.radii.full, // Circular badge
    justifyContent: 'center',
    alignItems: 'center',
  },
  weeklyBadge: {
    backgroundColor: theme.colors.primary, // Use theme primary color
  },
  monthlyBadge: {
    backgroundColor: '#FF9500', // Apple's orange accent
  },
  recapBadgeText: {
    fontFamily: theme.typography.fonts.bold,
    fontSize: theme.typography.fontSizes.xs, // Smaller text
    color: theme.colors.white,
  },
  deleteButton: {
    position: 'absolute',
    top: theme.spacing.xs - 2,
    right: theme.spacing.xs - 2 + GRID_SPACING / 2,
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.radii.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
});