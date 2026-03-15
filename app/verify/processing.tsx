import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '../../constants/theme';
import { verifyComplete } from '../../services/api';
import { saveVerification } from '../../services/storage';

const STEPS = [
  { icon: '📄', label: 'Uploading document...' },
  { icon: '🔍', label: 'Extracting text fields...' },
  { icon: '🛡️', label: 'Analyzing authenticity...' },
  { icon: '👤', label: 'Matching face...' },
  { icon: '✅', label: 'Generating report...' },
];

export default function ProcessingScreen() {
  const { docType, documentBase64, selfieBase64 } = useLocalSearchParams<{
    docType: string;
    documentBase64: string;
    selfieBase64: string;
  }>();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 3000);

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 15000,
      useNativeDriver: false,
    }).start();

    return () => clearInterval(stepInterval);
  }, [progressAnim]);

  useEffect(() => {
    let cancelled = false;

    const runVerification = async () => {
      try {
        const result = await verifyComplete(documentBase64, selfieBase64, docType);
        if (cancelled) return;
        await saveVerification(result);
        router.replace({
          pathname: '/verify/results',
          params: { resultJson: JSON.stringify(result) },
        });
      } catch (error: any) {
        if (cancelled) return;
        Alert.alert('Verification Failed', error.message || 'Please try again.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    };

    runVerification();
    return () => {
      cancelled = true;
    };
  }, [documentBase64, selfieBase64, docType, router]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.Text style={[styles.mainIcon, { transform: [{ scale: pulseAnim }] }]}>
          🤖
        </Animated.Text>

        <Text style={styles.title}>Analyzing Document</Text>
        <Text style={styles.subtitle}>Our AI is carefully examining your document</Text>

        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: progressWidth as any }]} />
        </View>

        <View style={styles.steps}>
          {STEPS.map((step, index) => (
            <View
              key={index}
              style={[
                styles.stepRow,
                index <= currentStep && styles.stepRowActive,
                index < currentStep && styles.stepRowComplete,
              ]}
            >
              <Text style={styles.stepIcon}>
                {index < currentStep ? '✅' : step.icon}
              </Text>
              <Text
                style={[
                  styles.stepLabel,
                  index <= currentStep && styles.stepLabelActive,
                  index < currentStep && styles.stepLabelComplete,
                ]}
              >
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.waitText}>
          This typically takes 10-20 seconds...
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  mainIcon: {
    fontSize: 72,
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textOnDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xxxl,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.xxxl,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  steps: {
    width: '100%',
    gap: Spacing.lg,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.3,
  },
  stepRowActive: {
    opacity: 1,
  },
  stepRowComplete: {
    opacity: 0.6,
  },
  stepIcon: {
    fontSize: 22,
    width: 36,
    textAlign: 'center',
  },
  stepLabel: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.5)',
    marginLeft: Spacing.md,
  },
  stepLabelActive: {
    color: Colors.textOnDark,
    fontWeight: '600',
  },
  stepLabelComplete: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '400',
  },
  waitText: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.4)',
    marginTop: Spacing.xxxl,
  },
});
