import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';

interface CameraOverlayProps {
  type: 'document' | 'selfie';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CameraOverlay({ type }: CameraOverlayProps) {
  if (type === 'selfie') {
    const ovalSize = SCREEN_WIDTH * 0.65;
    return (
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.topSection}>
          <Text style={styles.instructionText}>Position your face within the oval</Text>
        </View>
        <View style={styles.centerSection}>
          <View style={[styles.ovalGuide, { width: ovalSize, height: ovalSize * 1.3, borderRadius: ovalSize }]} />
        </View>
        <View style={styles.bottomSection}>
          <Text style={styles.hintText}>Ensure good lighting and look directly at the camera</Text>
        </View>
      </View>
    );
  }

  const frameWidth = SCREEN_WIDTH * 0.88;
  const frameHeight = frameWidth * 0.63;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.topSection}>
        <Text style={styles.instructionText}>Align document within the frame</Text>
      </View>
      <View style={styles.centerSection}>
        <View style={[styles.documentFrame, { width: frameWidth, height: frameHeight }]}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.hintText}>Keep the document flat and well-lit</Text>
      </View>
    </View>
  );
}

const CORNER_SIZE = 30;
const CORNER_THICKNESS = 4;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  instructionText: {
    color: Colors.textOnDark,
    fontSize: FontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  hintText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxxl,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  documentFrame: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: BorderRadius.md,
    position: 'relative',
  },
  ovalGuide: {
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
    borderStyle: 'dashed',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  topLeft: {
    top: -1,
    left: -1,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: Colors.accent,
    borderTopLeftRadius: BorderRadius.md,
  },
  topRight: {
    top: -1,
    right: -1,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: Colors.accent,
    borderTopRightRadius: BorderRadius.md,
  },
  bottomLeft: {
    bottom: -1,
    left: -1,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: Colors.accent,
    borderBottomLeftRadius: BorderRadius.md,
  },
  bottomRight: {
    bottom: -1,
    right: -1,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: Colors.accent,
    borderBottomRightRadius: BorderRadius.md,
  },
});
