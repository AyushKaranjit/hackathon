import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, FontSize, Spacing } from '../constants/theme';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
  strokeWidth?: number;
}

export default function ScoreGauge({ score, size = 120, label, strokeWidth = 10 }: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  const getColor = () => {
    if (score >= 80) return Colors.success;
    if (score >= 50) return Colors.warning;
    return Colors.danger;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={Colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${progress} ${circumference}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={[styles.scoreContainer, { width: size, height: size }]}>
        <Text style={[styles.scoreText, { color: getColor(), fontSize: size * 0.25 }]}>
          {Math.round(score)}
        </Text>
        {label && <Text style={styles.labelText}>{label}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontWeight: '800',
  },
  labelText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
