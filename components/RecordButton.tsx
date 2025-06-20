import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Camera, Clock } from 'lucide-react-native';
import { VideoStorage } from '@/utils/storage';

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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          hasRecordedToday ? styles.disabledButton : styles.activeButton
        ]}
        onPress={hasRecordedToday ? undefined : onPress}
        disabled={hasRecordedToday}
        activeOpacity={hasRecordedToday ? 1 : 0.8}
      >
        <View style={styles.content}>
          {hasRecordedToday ? (
            <Clock size={24} color="#999" />
          ) : (
            <Camera size={24} color="#fff" />
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
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  activeButton: {
    backgroundColor: '#000',
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  activeText: {
    color: '#fff',
  },
  disabledText: {
    color: '#999',
  },
});