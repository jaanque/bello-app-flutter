import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

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

  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      onMonthChange(12, currentYear - 1);
    } else {
      onMonthChange(currentMonth - 1, currentYear);
    }
  };

  const goToNextMonth = () => {
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
        onPress={goToPreviousMonth}
        activeOpacity={0.7}
      >
        <ChevronLeft size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.monthContainer}>
        <Text style={styles.monthText}>
          {monthNames[currentMonth - 1]} {currentYear}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.navButton, isNextDisabled() && styles.disabledButton]}
        onPress={goToNextMonth}
        disabled={isNextDisabled()}
        activeOpacity={0.7}
      >
        <ChevronRight 
          size={24} 
          color={isNextDisabled() ? '#ccc' : '#000'} 
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  navButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
  },
  disabledButton: {
    backgroundColor: '#f9f9f9',
  },
  monthContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
});