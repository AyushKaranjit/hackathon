import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';

const DOCUMENT_TYPES = [
  {
    id: 'citizenship',
    label: 'Citizenship Card',
    description: 'Nepali Nagarikta / Citizenship Certificate',
    icon: '🪪',
  },
  {
    id: 'passport',
    label: 'Passport',
    description: 'Nepali Machine-Readable Passport',
    icon: '📘',
  },
  {
    id: 'driving_license',
    label: 'Driving License',
    description: 'Nepal Government Driving License',
    icon: '🚗',
  },
];

export default function SelectTypeScreen() {
  const router = useRouter();

  const onSelect = (docType: string) => {
    router.push({ pathname: '/verify/capture', params: { docType } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>What document are you verifying?</Text>
        <Text style={styles.subtitle}>Select the type of government-issued ID</Text>

        <View style={styles.options}>
          {DOCUMENT_TYPES.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={styles.optionCard}
              activeOpacity={0.7}
              onPress={() => onSelect(doc.id)}
            >
              <Text style={styles.optionIcon}>{doc.icon}</Text>
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>{doc.label}</Text>
                <Text style={styles.optionDesc}>{doc.description}</Text>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxxl,
  },
  options: {
    gap: Spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    fontSize: 36,
    marginRight: Spacing.lg,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  optionDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  optionArrow: {
    fontSize: 28,
    color: Colors.textTertiary,
    fontWeight: '300',
  },
});
