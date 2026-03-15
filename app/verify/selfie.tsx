import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CameraOverlay from '../../components/CameraOverlay';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';

export default function SelfieScreen() {
  const { docType, documentBase64 } = useLocalSearchParams<{
    docType: string;
    documentBase64: string;
  }>();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      if (!photo) throw new Error('Failed to capture selfie');

      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      router.push({
        pathname: '/verify/processing',
        params: {
          docType,
          documentBase64,
          selfieBase64: manipulated.base64!,
        },
      });
    } catch (error) {
      Alert.alert('Capture Failed', 'Please try again.');
    } finally {
      setCapturing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.permissionIcon}>🤳</Text>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          We need the front camera to take your selfie for face verification.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
        mirror={true}
      >
        <CameraOverlay type="selfie" />

        <SafeAreaView style={styles.controlsContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={[styles.captureButton, capturing && styles.captureButtonDisabled]}
              onPress={handleCapture}
              disabled={capturing}
            >
              {capturing ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xxl,
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  backButton: {
    marginTop: Spacing.xl,
    marginLeft: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: Spacing.xxxl,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  permissionIcon: {
    fontSize: 64,
    marginBottom: Spacing.xl,
  },
  permissionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  permissionText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
  },
  permissionButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});
