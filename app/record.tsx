import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { VideoStorage } from '@/utils/storage';
import * as FileSystem from 'expo-file-system';
import { generateThumbnailAsync } from 'expo-video-thumbnails';
import { X, RotateCcw, Circle, Square } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function RecordScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const cameraRef = useRef<CameraView>(null);
  const recordingInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 9) {
            stopRecording();
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Necesitamos acceso a tu cámara para grabar videos
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Permitir acceso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;

    try {
      // Haptic feedback
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      setIsRecording(true);
      const video = await cameraRef.current.recordAsync({
        maxDuration: 10,
        quality: '720p',
      });

      if (video) {
        await saveVideo(video.uri);
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'No se pudo grabar el video');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) return;

    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      cameraRef.current.stopRecording();
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const saveVideo = async (uri: string) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].substring(0, 5);
    let thumbnailUrl: string | undefined = undefined;

    try {
      // Generate thumbnail
      // console.log('Generating thumbnail for video URI:', uri);
      const videoId = uri.split('/').pop()?.split('.')[0] || `vid-${Date.now()}`; // Generate a somewhat unique ID from URI
      const { uri: generatedThumbnailUri } = await generateThumbnailAsync(
        uri,
        { time: 1000 } // Generate thumbnail at 1 second
      );
      // console.log('Thumbnail generated URI:', generatedThumbnailUri);

      // Create thumbnails directory if it doesn't exist
      const thumbnailsDir = FileSystem.documentDirectory + 'thumbnails/';
      // console.log('Ensuring thumbnails directory exists:', thumbnailsDir);
      await FileSystem.makeDirectoryAsync(thumbnailsDir, { intermediates: true });

      // Save thumbnail
      const thumbnailFilename = `thumb-${videoId}.jpg`;
      const newThumbnailPath = thumbnailsDir + thumbnailFilename;
      // console.log('Copying thumbnail from:', generatedThumbnailUri, 'to:', newThumbnailPath);
      await FileSystem.copyAsync({
        from: generatedThumbnailUri,
        to: newThumbnailPath,
      });
      // console.log('Thumbnail copied successfully to:', newThumbnailPath);
      thumbnailUrl = newThumbnailPath;

    } catch (error) {
      console.error('Detailed error during thumbnail generation/saving:', error);
      console.warn('Thumbnail generation failed. Video will be saved without a thumbnail.');
      // thumbnailUrl remains undefined, so the video saves without it.
    }

    const saved = await VideoStorage.saveVideo(uri, date, time, thumbnailUrl);
    
    if (saved) {
      Alert.alert(
        '¡Video guardado!',
        'Tu recuerdo del día ha sido guardado exitosamente.',
        [
          {
            text: 'Ver mis videos',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      Alert.alert('Error', 'No se pudo guardar el video');
    }
  };

  const handleClose = () => {
    if (isRecording) {
      Alert.alert(
        'Grabación en curso',
        '¿Estás seguro de que quieres cancelar la grabación?',
        [
          { text: 'Continuar grabando', style: 'cancel' },
          { 
            text: 'Cancelar', 
            style: 'destructive',
            onPress: () => {
              stopRecording();
              router.back();
            }
          },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <X size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Grabar Recuerdo</Text>
        
        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraFacing}
          disabled={isRecording}
          activeOpacity={0.7}
        >
          <RotateCcw size={24} color={isRecording ? '#666' : '#fff'} />
        </TouchableOpacity>
      </View>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="video"
      >
        <View style={styles.overlay}>
          {/* Timer */}
          <View style={styles.timerContainer}>
            <View style={[
              styles.timerDot,
              isRecording && styles.timerDotRecording
            ]} />
            <Text style={styles.timerText}>
              {recordingTime < 10 ? `0${recordingTime}` : recordingTime}s
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar,
                { width: `${(recordingTime / 10) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </CameraView>

      <View style={styles.controls}>
        <View style={styles.controlsContent}>
          <View style={styles.spacer} />
          
          <TouchableOpacity
            style={styles.recordButton}
            onPress={isRecording ? stopRecording : startRecording}
            activeOpacity={0.8}
          >
            <View style={[
              styles.recordButtonInner,
              isRecording && styles.recordButtonRecording
            ]}>
              {isRecording ? (
                <Square size={24} color="#fff" />
              ) : (
                <Circle size={48} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
          
          <View style={styles.spacer} />
        </View>
        
        <Text style={styles.instructionText}>
          {isRecording 
            ? 'Toca para detener' 
            : 'Toca para grabar (máx. 10 segundos)'
          }
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  permissionText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  permissionButton: {
    backgroundColor: '#000',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  flipButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginRight: 8,
  },
  timerDotRecording: {
    backgroundColor: '#ff4444',
  },
  timerText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  controls: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
  },
  controlsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  spacer: {
    width: 80,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonRecording: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ccc',
    textAlign: 'center',
  },
});