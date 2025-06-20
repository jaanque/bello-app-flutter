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

  static async scheduleDaily(): Promise<void> {
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
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 20,
          minute: 0,
        },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  // Alternativa usando timeInterval para notificaciones cada 24 horas
  static async scheduleDailyAlternative(): Promise<void> {
    if (Platform.OS === 'web') return;
    
    try {
      // Cancelar notificaciones previas
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      // Calcular segundos hasta las 20:00 de hoy
      const now = new Date();
      const target = new Date();
      target.setHours(20, 0, 0, 0);
      
      // Si ya pasaron las 20:00, programar para mañana
      if (now > target) {
        target.setDate(target.getDate() + 1);
      }
      
      const secondsUntilTarget = Math.floor((target.getTime() - now.getTime()) / 1000);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Bello',
          body: '¡No olvides grabar tu recuerdo de hoy!',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilTarget,
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
      const today = new Date();
      const todayString = today.toDateString();
      
      for (const notification of notifications) {
        // Aquí puedes implementar la lógica específica para identificar
        // y cancelar solo las notificaciones del día actual
        if (notification.trigger && 'date' in notification.trigger) {
          const notificationDate = new Date(notification.trigger.date);
          if (notificationDate.toDateString() === todayString) {
            await Notifications.cancelScheduledNotificationAsync(notification.identifier);
          }
        }
      }
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