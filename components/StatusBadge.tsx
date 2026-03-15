import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';

type Verdict = 'verified' | 'suspicious' | 'failed';

interface StatusBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md' | 'lg';
}

const CONFIG: Record<Verdict, { label: string; bg: string; text: string; icon: string }> = {
  verified: { label: 'Verified', bg: Colors.successLight, text: Colors.success, icon: '✓' },
  suspicious: { label: 'Suspicious', bg: Colors.warningLight, text: Colors.warning, icon: '⚠' },
  failed: { label: 'Failed', bg: Colors.dangerLight, text: Colors.danger, icon: '✕' },
};

export default function StatusBadge({ verdict, size = 'md' }: StatusBadgeProps) {
  const config = CONFIG[verdict];
  const sizeStyles = {
    sm: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, fontSize: FontSize.xs },
    md: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, fontSize: FontSize.sm },
    lg: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, fontSize: FontSize.lg },
  };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg, paddingHorizontal: sizeStyles[size].paddingHorizontal, paddingVertical: sizeStyles[size].paddingVertical }]}>
      <Text style={[styles.icon, { color: config.text, fontSize: sizeStyles[size].fontSize }]}>{config.icon} </Text>
      <Text style={[styles.text, { color: config.text, fontSize: sizeStyles[size].fontSize }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    fontWeight: '700',
  },
  text: {
    fontWeight: '600',
  },
});
