import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import VerificationCard from '../../components/VerificationCard';
import { getStoredVerifications, clearVerifications } from '../../services/storage';
import type { FullVerificationResult } from '../../services/api';

export default function HistoryScreen() {
  const [verifications, setVerifications] = useState<FullVerificationResult[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAll = useCallback(async () => {
    const all = await getStoredVerifications();
    setVerifications(all);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [loadAll])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  const onClear = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all verification history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearVerifications();
            setVerifications([]);
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {verifications.length > 0 && (
        <View style={styles.headerRow}>
          <Text style={styles.countText}>
            {verifications.length} verification{verifications.length !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={onClear}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {verifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No verification history</Text>
          <Text style={styles.emptyHint}>
            Completed verifications will appear here
          </Text>
        </View>
      ) : (
        verifications.map((v) => (
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  countText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  clearText: {
    fontSize: FontSize.sm,
    color: Colors.danger,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.huge * 2,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
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
});
