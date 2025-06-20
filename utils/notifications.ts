import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export class NotificationManager {
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async scheduleDaily reminder(): Promise<void> {
    if (Platform.OS === 'web') return;
    
    try {
      // Cancelar notificaciones previas
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      // Programar notificación diaria a las 20:00
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Bello',
          body: '¡No olvides grabar tu recuerdo de hoy!',
          sound: true,
        },
        trigger: {
          hour: 20,
          minute: 0,
          repeats: true,
        },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  static async cancelNotifications(): Promise<void> {
    if (Platform.OS === 'web') return;
    
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  static async checkTodayVideoAndCancelNotification(): Promise<void> {
    // Esta función se llamaría después de grabar un video
    // Para cancelar la notificación de ese día
    if (Platform.OS === 'web') return;
    
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      // Lógica para cancelar solo la notificación de hoy si es necesario
    } catch (error) {
      console.error('Error managing today notification:', error);
    }
  }
}

// Configurar el handler de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});