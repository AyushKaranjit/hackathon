import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';
import StatusBadge from './StatusBadge';

interface VerificationCardProps {
  verificationId: string;
  documentType: string;
  verdict: 'verified' | 'suspicious' | 'failed';
  overallScore: number;
  timestamp: string;
  onPress?: () => void;
}

const DOC_TYPE_LABELS: Record<string, string> = {
  citizenship_card: 'Citizenship Card',
  passport: 'Passport',
  driving_license: 'Driving License',
  other: 'Government ID',
};

export default function VerificationCard({
  verificationId,
  documentType,
  verdict,
  overallScore,
  timestamp,
  onPress,
}: VerificationCardProps) {
  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.docInfo}>
          <Text style={styles.docType}>
            {DOC_TYPE_LABELS[documentType] || documentType}
          </Text>
          <Text style={styles.idText}>#{verificationId}</Text>
        </View>
        <StatusBadge verdict={verdict} size="sm" />
      </View>
      <View style={styles.footer}>
        <Text style={styles.scoreText}>Score: {Math.round(overallScore)}%</Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  docInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  docType: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  idText: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  scoreText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.primaryLight,
  },
  dateText: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
});
