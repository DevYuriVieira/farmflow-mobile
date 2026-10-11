import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePreferences } from '../contexts/PreferencesContext';
import { Point, pointsToSvgPath } from '../utils/signature';

export interface SignaturePadProps {
  onSaveSignature?: (signatureSvg: string) => void;
  onClearSignature?: () => void;
  title?: string;
  strokeColor?: string;
  strokeWidth?: number;
  height?: number;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSaveSignature,
  onClearSignature,
  title = 'Assinatura do Responsável Técnico / Operador',
  strokeColor = '#22C55E',
  strokeWidth = 3,
  height = 180,
}) => {
  const { themeColors, touchTargetMinHeight } = usePreferences();
  const [paths, setPaths] = useState<string[]>([]);
  const currentPathRef = useRef<Point[]>([]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          const { locationX, locationY } = evt.nativeEvent;
          currentPathRef.current = [{ x: locationX, y: locationY }];
        },
        onPanResponderMove: (evt: GestureResponderEvent) => {
          const { locationX, locationY } = evt.nativeEvent;
          currentPathRef.current.push({ x: locationX, y: locationY });

          const d = pointsToSvgPath(currentPathRef.current);

          setPaths((prev) => {
            const currentWithoutActive = prev.slice(0, -1);
            return [...currentWithoutActive, d];
          });
        },
        onPanResponderRelease: () => {
          if (currentPathRef.current.length > 0) {
            const d = pointsToSvgPath(currentPathRef.current);

            setPaths((prev) => {
              const base = prev.slice(0, -1);
              const updated = [...base, d];
              if (onSaveSignature) {
                onSaveSignature(updated.join(' '));
              }
              return updated;
            });
            currentPathRef.current = [];
          }
        },
      }),
    [onSaveSignature]
  );

  const handleClear = () => {
    setPaths([]);
    currentPathRef.current = [];
    if (onClearSignature) {
      onClearSignature();
    }
  };

  const handleUndo = () => {
    setPaths((prev) => {
      const updated = prev.slice(0, -1);
      if (onSaveSignature) {
        onSaveSignature(updated.join(' '));
      }
      return updated;
    });
  };

  const hasSignature = paths.length > 0;

  return (
    <View style={[styles.container, { borderColor: themeColors.border }]}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <MaterialCommunityIcons name="draw" size={18} color={themeColors.primaryVibrant} />
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>{title}</Text>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={handleUndo}
            disabled={!hasSignature}
            style={[
              styles.actionButton,
              { minHeight: touchTargetMinHeight, opacity: hasSignature ? 1 : 0.4 },
            ]}
          >
            <MaterialCommunityIcons name="undo" size={18} color={themeColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleClear}
            disabled={!hasSignature}
            style={[
              styles.actionButton,
              { minHeight: touchTargetMinHeight, opacity: hasSignature ? 1 : 0.4 },
            ]}
          >
            <MaterialCommunityIcons name="delete-outline" size={18} color={themeColors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        {...panResponder.panHandlers}
        style={[
          styles.canvasArea,
          { height, backgroundColor: themeColors.surfaceCard, borderColor: themeColors.borderLight },
        ]}
      >
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          {paths.map((d, index) => (
            <Path
              key={`stroke-${index}`}
              d={d}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </Svg>

        {!hasSignature && (
          <View style={styles.placeholderContainer} pointerEvents="none">
            <MaterialCommunityIcons
              name="gesture-swipe-horizontal"
              size={28}
              color={themeColors.textMuted}
            />
            <Text style={[styles.placeholderText, { color: themeColors.textMuted }]}>
              Assine com o dedo ou caneta stylus neste espaço
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footerNote}>
        <MaterialCommunityIcons name="shield-check" size={14} color={themeColors.success} />
        <Text style={[styles.legalText, { color: themeColors.textMuted }]}>
          Validação biométrica e assinatura digital com carimbo temporal.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  canvasArea: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  placeholderText: {
    fontSize: 12,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  legalText: {
    fontSize: 11,
  },
});
