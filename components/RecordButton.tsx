import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Camera, Clock } from 'lucide-react-native';
import { VideoStorage } from '@/utils/storage';
import theme from '@/styles/theme'; // Import theme
import * as Haptics from 'expo-haptics'; // Import Haptics

interface RecordButtonProps {
  onPress: () => void;
}

export default function RecordButton({ onPress }: RecordButtonProps) {
  const [hasRecordedToday, setHasRecordedToday] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState('');

  useEffect(() => {
    checkTodayStatus();
    const interval = setInterval(checkTodayStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const checkTodayStatus = async () => {
    const today = new Date().toISOString().split('T')[0];
    const hasVideo = await VideoStorage.hasVideoForDate(today);
    setHasRecordedToday(hasVideo);
    
    if (hasVideo) {
      updateCountdown();
    }
  };

  const updateCountdown = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeDiff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    setTimeUntilNext(`${hours}h ${minutes}m`);
  };

  const handlePress = () => {
    if (!hasRecordedToday) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          hasRecordedToday ? styles.disabledButton : styles.activeButton
        ]}
        onPress={handlePress}
        disabled={hasRecordedToday}
        activeOpacity={hasRecordedToday ? 1 : 0.7} // Standard active opacity for enabled state
      >
        <View style={styles.content}>
          {hasRecordedToday ? (
            <Clock size={24} color={theme.colors.secondary} />
          ) : (
            <Camera size={24} color={theme.colors.white} />
          )}
          
          <Text style={[
            styles.text,
            hasRecordedToday ? styles.disabledText : styles.activeText
          ]}>
            {hasRecordedToday
              ? `Disponible en ${timeUntilNext}`
              : 'Grabar video de hoy'
            }
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl, // Ensure enough space if it's at the bottom
  },
  button: {
    borderRadius: theme.radii.lg, // Softer, more iOS like radius
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 }, // More subtle shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Adjusted elevation
  },
  activeButton: {
    backgroundColor: theme.colors.red, // Prominent red for active recording action
  },
  disabledButton: {
    backgroundColor: theme.colors.lightGray, // Muted background for disabled state
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm, // Use theme spacing for gap
  },
  text: {
    ...theme.typography.textStyles.button, // Use button text style from theme
    fontSize: theme.typography.fontSizes.md, // Ensure base size or slightly larger
  },
  activeText: {
    color: theme.colors.white, // White text on red background
    fontFamily: theme.typography.fonts.medium, // Ensure medium font for active
  },
  disabledText: {
    color: theme.colors.secondary, // Secondary color for disabled text
    fontFamily: theme.typography.fonts.regular, // Regular font for disabled
  },
});