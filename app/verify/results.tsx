import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import ScoreGauge from '../../components/ScoreGauge';
import StatusBadge from '../../components/StatusBadge';
import type { FullVerificationResult } from '../../services/api';

const DOC_TYPE_LABELS: Record<string, string> = {
  citizenship_card: 'Citizenship Card',
  passport: 'Passport',
  driving_license: 'Driving License',
  other: 'Government ID',
};

export default function ResultsScreen() {
  const { resultJson } = useLocalSearchParams<{ resultJson: string }>();
  const router = useRouter();
  const result: FullVerificationResult = JSON.parse(resultJson);

  const { document_analysis: doc, face_match: face } = result;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Verdict Header */}
        <View style={styles.verdictSection}>
          <StatusBadge verdict={result.overall_verdict} size="lg" />
          <Text style={styles.verdictId}>Verification #{result.verification_id}</Text>
        </View>

        {/* Score Gauges */}
        <View style={styles.scoresRow}>
          <ScoreGauge score={result.overall_score} size={110} label="Overall" />
          <ScoreGauge score={doc.authenticity_score} size={100} label="Document" />
          <ScoreGauge score={face.match_score} size={100} label="Face Match" />
        </View>

        <Text style={styles.summaryText}>{result.summary}</Text>

        {/* Extracted Fields */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            📄 Extracted Information
          </Text>
          <Text style={styles.docTypeChip}>
            {DOC_TYPE_LABELS[doc.document_type] || doc.document_type}
          </Text>
          <View style={styles.fieldsCard}>
            {doc.extracted_fields.map((field, i) => (
              <View key={i} style={[styles.fieldRow, i > 0 && styles.fieldRowBorder]}>
                <Text style={styles.fieldName}>{field.field_name}</Text>
                <View style={styles.fieldValueRow}>
                  <Text style={styles.fieldValue}>{field.value}</Text>
                  <View style={[
                    styles.confidenceDot,
                    { backgroundColor: field.confidence >= 0.8 ? Colors.success : field.confidence >= 0.5 ? Colors.warning : Colors.danger }
                  ]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Authenticity Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛡️ Authenticity Analysis</Text>
          <View style={styles.detailsCard}>
            {doc.authenticity_details.map((detail, i) => (
              <View key={i} style={styles.detailRow}>
                <Text style={styles.detailBullet}>•</Text>
                <Text style={styles.detailText}>{detail}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Face Match */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Face Verification</Text>
          <View style={styles.faceCard}>
            <View style={styles.faceHeader}>
              <Text style={styles.faceScore}>
                {Math.round(face.match_score)}% Match
              </Text>
              <Text style={[styles.faceVerdict, { color: face.is_match ? Colors.success : Colors.danger }]}>
                {face.is_match ? '✓ Same Person' : '✕ Different Person'}
              </Text>
            </View>
            <Text style={styles.faceDetails}>{face.match_details}</Text>
          </View>
        </View>

        {/* Warnings */}
        {doc.warnings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ Warnings</Text>
            <View style={styles.warningsCard}>
              {doc.warnings.map((warning, i) => (
                <Text key={i} style={styles.warningText}>• {warning}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Done Button */}
        <TouchableOpacity
          style={styles.doneButton}
          activeOpacity={0.85}
          onPress={() => router.dismissAll()}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  verdictSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  verdictId: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: Spacing.xxl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  docTypeChip: {
    fontSize: FontSize.sm,
    color: Colors.primaryLight,
    fontWeight: '600',
    backgroundColor: '#EFF6FF',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  fieldsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  fieldRowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  fieldName: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  fieldValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.5,
    justifyContent: 'flex-end',
  },
  fieldValue: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'right',
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: Spacing.sm,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
  },
  detailBullet: {
    color: Colors.success,
    fontSize: FontSize.md,
    marginRight: Spacing.sm,
    fontWeight: '700',
  },
  detailText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  faceCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  faceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  faceScore: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
  },
  faceVerdict: {
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  faceDetails: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  warningsCard: {
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  warningText: {
    fontSize: FontSize.sm,
    color: '#92400E',
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  doneButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});
