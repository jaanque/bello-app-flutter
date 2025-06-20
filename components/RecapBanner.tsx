import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { RecapVideo } from '@/types/video';
import { Play, Share } from 'lucide-react-native';

interface RecapBannerProps {
  recap: RecapVideo;
  onPlay: () => void;
  onShare: () => void;
}

export default function RecapBanner({ recap, onPlay, onShare }: RecapBannerProps) {
  const isWeekly = recap.recapType === 'weekly';
  
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

  return (
    <View style={[
      styles.container,
      isWeekly ? styles.weeklyContainer : styles.monthlyContainer
    ]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[
            styles.title,
            isWeekly ? styles.weeklyTitle : styles.monthlyTitle
          ]}>
            {getTitle()}
          </Text>
          <Text style={styles.subtitle}>
            {isWeekly ? 'Tus mejores momentos de la semana' : 'Lo mejor de tu mes'}
          </Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.playButton,
              isWeekly ? styles.weeklyButton : styles.monthlyButton
            ]}
            onPress={onPlay}
            activeOpacity={0.8}
          >
            <Play size={16} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.shareButton,
              isWeekly ? styles.weeklyButton : styles.monthlyButton
            ]}
            onPress={onShare}
            activeOpacity={0.8}
          >
            <Share size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  weeklyContainer: {
    backgroundColor: '#B794F6', // Lilas pastel
  },
  monthlyContainer: {
    backgroundColor: '#F6E05E', // Dorado pastel
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  weeklyTitle: {
    color: '#fff',
  },
  monthlyTitle: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    opacity: 0.9,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  shareButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  weeklyButton: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
  monthlyButton: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
});