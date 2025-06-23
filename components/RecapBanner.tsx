import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { RecapVideo } from '@/types/video';
import { Play, Share } from 'lucide-react-native';
import theme from '@/styles/theme'; // Import theme
import * as Haptics from 'expo-haptics'; // Import Haptics

interface RecapBannerProps {
  recap: RecapVideo;
  onPlay: () => void;
  onShare: () => void;
}

export default function RecapBanner({ recap, onPlay, onShare }: RecapBannerProps) {
  const isWeekly = recap.recapType === 'weekly';

  const handlePlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPlay();
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onShare();
  };
  
  const getTitle = () => {
    if (isWeekly) {
      return `Recap Semana ${recap.weekNumber}`;
    } else {
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      return `Recap ${monthNames[(recap.month || 1) - 1]} ${recap.year}`;
    }
  };

  // Use a single container style and adjust text colors based on theme
  const titleColor = isWeekly ? theme.colors.primary : theme.colors.text; // Example: primary for weekly, black for monthly

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: titleColor }]}>
            {getTitle()}
          </Text>
          <Text style={styles.subtitle}>
            {isWeekly ? 'Tus mejores momentos de la semana' : 'Lo mejor de tu mes'}
          </Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePlay}
            activeOpacity={0.7} // Standard active opacity
          >
            <Play size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.7} // Standard active opacity
          >
            <Share size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.radii.lg, // Larger radius for card feel
    backgroundColor: theme.colors.white, // White card background
    borderWidth: 1,
    borderColor: theme.colors.mediumGray, // Subtle border
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, // Very subtle shadow
    shadowRadius: 4,
    elevation: 3, // For Android
  },
  // Removed weeklyContainer and monthlyContainer as they are now unified
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md, // Use theme spacing
  },
  textContainer: {
    flex: 1,
    marginRight: theme.spacing.md, // Add margin to prevent text touching buttons
  },
  title: {
    fontFamily: theme.typography.fonts.semiBold, // Use theme font
    fontSize: theme.typography.fontSizes.lg,    // Use theme font size
    // Color is now set dynamically inline
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontFamily: theme.typography.fonts.regular, // Use theme font
    fontSize: theme.typography.fontSizes.sm,     // Use theme font size
    color: theme.colors.secondary,             // Use theme color for subtitle
    opacity: 0.9,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md, // Use theme spacing for gap
  },
  actionButton: {
    width: 44, // Standard iOS tap target size
    height: 44, // Standard iOS tap target size
    borderRadius: theme.radii.full, // Circular buttons
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.lightGray, // Light gray background for buttons
    // Removed specific weekly/monthly button styles
  },
  // Removed playButton, shareButton, weeklyButton, monthlyButton as styles are merged/simplified
});