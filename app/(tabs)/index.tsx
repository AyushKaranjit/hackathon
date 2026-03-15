import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import VerificationCard from '../../components/VerificationCard';
import { getStoredVerifications } from '../../services/storage';
import type { FullVerificationResult } from '../../services/api';

export default function HomeScreen() {
  const router = useRouter();
  const [recentVerifications, setRecentVerifications] = useState<FullVerificationResult[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecent = useCallback(async () => {
    const all = await getStoredVerifications();
    setRecentVerifications(all.slice(0, 5));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecent();
    }, [loadRecent])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecent();
    setRefreshing(false);
  };

  const stats = {
    total: recentVerifications.length,
    verified: recentVerifications.filter((v) => v.overall_verdict === 'verified').length,
    suspicious: recentVerifications.filter((v) => v.overall_verdict === 'suspicious').length,
    failed: recentVerifications.filter((v) => v.overall_verdict === 'failed').length,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🛡️</Text>
        <Text style={styles.heroTitle}>NagarikVerify</Text>
        <Text style={styles.heroSubtitle}>
          AI-Powered Government Document Verification
        </Text>
      </View>

      <TouchableOpacity
        style={styles.verifyButton}
        activeOpacity={0.85}
        onPress={() => router.push('/verify/select-type')}
      >
        <Text style={styles.verifyButtonIcon}>📄</Text>
        <View style={styles.verifyButtonText}>
          <Text style={styles.verifyButtonTitle}>Verify a Document</Text>
          <Text style={styles.verifyButtonDesc}>
            Scan ID, passport, or license with AI
          </Text>
        </View>
        <Text style={styles.verifyButtonArrow}>→</Text>
      </TouchableOpacity>

      {stats.total > 0 && (
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: Colors.successLight }]}>
            <Text style={[styles.statNumber, { color: Colors.success }]}>{stats.verified}</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.warningLight }]}>
            <Text style={[styles.statNumber, { color: Colors.warning }]}>{stats.suspicious}</Text>
            <Text style={styles.statLabel}>Suspicious</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.dangerLight }]}>
            <Text style={[styles.statNumber, { color: Colors.danger }]}>{stats.failed}</Text>
            <Text style={styles.statLabel}>Failed</Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Verifications</Text>
        {recentVerifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No verifications yet</Text>
            <Text style={styles.emptyHint}>
              Tap "Verify a Document" to get started
            </Text>
          </View>
        ) : (
          recentVerifications.map((v) => (
            <VerificationCard
              key={v.verification_id}
              verificationId={v.verification_id}
              documentType={v.document_analysis.document_type}
              verdict={v.overall_verdict}
              overallScore={v.overall_score}
              timestamp={v.timestamp}
            />
          ))
        )}
      </View>

      <View style={styles.featureGrid}>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🤖</Text>
          <Text style={styles.featureTitle}>AI-Powered</Text>
          <Text style={styles.featureDesc}>GPT-4 Vision analyzes document authenticity</Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>👤</Text>
          <Text style={styles.featureTitle}>Face Match</Text>
          <Text style={styles.featureDesc}>Compare selfie with document photo</Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>⚡</Text>
          <Text style={styles.featureTitle}>Instant</Text>
          <Text style={styles.featureDesc}>Get results in seconds, not hours</Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🔒</Text>
          <Text style={styles.featureTitle}>Secure</Text>
          <Text style={styles.featureDesc}>Images processed securely via encrypted API</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.huge,
  },
  hero: {
    backgroundColor: Colors.secondary,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.huge,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: Colors.textOnDark,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.xxl,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  verifyButtonIcon: {
    fontSize: 32,
    marginRight: Spacing.lg,
  },
  verifyButtonText: {
    flex: 1,
  },
  verifyButtonTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textOnPrimary,
  },
  verifyButtonDesc: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Spacing.xs,
  },
  verifyButtonArrow: {
    fontSize: FontSize.xxl,
    color: Colors.textOnPrimary,
    fontWeight: '300',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  emptyHint: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xxl,
    gap: Spacing.md,
  },
  featureCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: Spacing.sm,
  },
  featureTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  featureDesc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    lineHeight: 16,
  },
});
