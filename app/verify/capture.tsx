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
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CameraOverlay from '../../components/CameraOverlay';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';

export default function CaptureScreen() {
  const { docType } = useLocalSearchParams<{ docType: string }>();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);

  const processImage = async (uri: string) => {
    const manipulated = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    return manipulated.base64!;
  };

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      if (!photo) throw new Error('Failed to capture photo');
      const base64 = await processImage(photo.uri);
      router.push({
        pathname: '/verify/selfie',
        params: { docType, documentBase64: base64 },
      });
    } catch (error) {
      Alert.alert('Capture Failed', 'Please try again.');
    } finally {
      setCapturing(false);
    }
  };

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    const base64 = await processImage(result.assets[0].uri);
    router.push({
      pathname: '/verify/selfie',
      params: { docType, documentBase64: base64 },
    });
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
        <Text style={styles.permissionIcon}>📷</Text>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          NagarikVerify needs camera access to scan your document.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.galleryAltButton} onPress={handleGallery}>
          <Text style={styles.galleryAltText}>Or upload from gallery instead</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        <CameraOverlay type="document" />

        <SafeAreaView style={styles.controlsContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.galleryButton} onPress={handleGallery}>
              <Text style={styles.galleryIcon}>🖼️</Text>
              <Text style={styles.galleryLabel}>Gallery</Text>
            </TouchableOpacity>

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

            <View style={styles.galleryButton}>
              <Text style={styles.docTypeLabel}>
                {docType === 'citizenship' ? '🪪' : docType === 'passport' ? '📘' : '🚗'}
              </Text>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.xxl,
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
  galleryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  galleryIcon: {
    fontSize: 28,
  },
  galleryLabel: {
    color: '#fff',
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
  docTypeLabel: {
    fontSize: 28,
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
  galleryAltButton: {
    marginTop: Spacing.xl,
  },
  galleryAltText: {
    color: Colors.primaryLight,
    fontSize: FontSize.md,
  },
});
