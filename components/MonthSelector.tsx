import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import theme from '@/styles/theme'; // Import theme
import * as Haptics from 'expo-haptics'; // Import Haptics

interface MonthSelectorProps {
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number, year: number) => void;
}

export default function MonthSelector({
  currentMonth,
  currentYear,
  onMonthChange,
}: MonthSelectorProps) {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePreviousMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentMonth === 1) {
      onMonthChange(12, currentYear - 1);
    } else {
      onMonthChange(currentMonth - 1, currentYear);
    }
  };

  const handleNextMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const now = new Date();
    const isCurrentMonth = currentMonth === now.getMonth() + 1 && currentYear === now.getFullYear();
    
    if (isCurrentMonth) return; // No permitir ir al futuro
    
    if (currentMonth === 12) {
      onMonthChange(1, currentYear + 1);
    } else {
      onMonthChange(currentMonth + 1, currentYear);
    }
  };

  const isNextDisabled = () => {
    const now = new Date();
    return currentMonth === now.getMonth() + 1 && currentYear === now.getFullYear();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navButton}
        style={styles.arrowButton}
        onPress={handlePreviousMonth}
        activeOpacity={0.7}
      >
        <ChevronLeft size={24} color={theme.colors.primary} />
      </TouchableOpacity>

      <View style={styles.monthContainer}>
        <Text style={styles.monthText}>
          {monthNames[currentMonth - 1]} {currentYear}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.arrowButton, isNextDisabled() && styles.disabledButton]}
        onPress={handleNextMonth}
        disabled={isNextDisabled()}
        activeOpacity={0.7}
      >
        <ChevronRight 
          size={24} 
          color={isNextDisabled() ? theme.colors.mediumGray : theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background, // Or theme.colors.lightGray if on a different bg
  },
  arrowButton: { // Renamed from navButton and simplified
    padding: theme.spacing.sm, // Ensure decent tap area, no fixed size or bg unless specified
  },
  disabledButton: {
    // For future: could change opacity of the icon itself if no background
    // For now, the color change in ChevronRight handles this
  },
  monthContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthText: {
    fontFamily: theme.typography.fonts.semiBold,
    fontSize: theme.typography.fontSizes.lg, // Can be .xl if a larger title is preferred
    color: theme.colors.text,
  },
});