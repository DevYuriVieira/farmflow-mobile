import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Rect, Circle, G, Line, Path, Polygon, Ellipse, Text as SvgText } from 'react-native-svg';

import type { CropCatalogItem, MapLayerMode, SectorZone } from '../screens/InteractiveFarmMapScreen';

const VB_W = 360;
const VB_H = 340;

/** Dirt road network */
const ROADS = 'M 120 8 L 120 221 M 8 115 L 352 115 M 8 221 L 352 221 M 219 221 L 219 332';

interface Props {
  sectors: SectorZone[];
  selectedId: string;
  mapLayer: MapLayerMode;
  language: string;
  catalog: Record<string, CropCatalogItem>;
  onSelect: (id: string) => void;
}

const Cow: React.FC<{ x: number; y: number; flip?: boolean }> = ({ x, y, flip }) => (
  <G transform={`translate(${x}, ${y}) scale(${flip ? -1 : 1}, 1)`}>
    <Ellipse cx={0} cy={0} rx={8} ry={5} fill="#FFFFFF" stroke="#1F2937" strokeWidth={0.8} />
    <Circle cx={-3} cy={-1} r={2} fill="#1F2937" />
    <Circle cx={3} cy={2} r={1.6} fill="#1F2937" />
    <Ellipse cx={9} cy={-3} rx={3.2} ry={2.6} fill="#FFFFFF" stroke="#1F2937" strokeWidth={0.8} />
    <Line x1={-5} y1={4} x2={-5} y2={8} stroke="#1F2937" strokeWidth={1.2} />
    <Line x1={5} y1={4} x2={5} y2={8} stroke="#1F2937" strokeWidth={1.2} />
  </G>
);

const Chicken: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <G transform={`translate(${x}, ${y})`}>
    <Circle cx={0} cy={0} r={2.6} fill="#FFFBEB" stroke="#92400E" strokeWidth={0.5} />
    <Circle cx={1.8} cy={-1.8} r={1} fill="#EF4444" />
  </G>
);

const Tree: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 7 }) => (
  <G>
    <Circle cx={x + 1.5} cy={y + 2} r={r} fill="#00000022" />
    <Circle cx={x} cy={y} r={r} fill="#2F8F3A" />
    <Circle cx={x - r / 3} cy={y - r / 3} r={r / 2.2} fill="#4CB050" />
  </G>
);

export const FarmIllustration: React.FC<Props> = ({
  sectors,
  selectedId,
  mapLayer,
  language,
  catalog,
  onSelect,
}) => {
  // Ultra-smooth native driver pulse for the central RTK GPS patrol station (zero JS layout overhead)
  const pulse = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.4,
            duration: 1600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1600,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0.2,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.7,
            duration: 1600,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [pulse, pulseOpacity]);

  // ---- Sector artwork ----
  const renderSector = (sec: SectorZone) => {
    const crop = catalog[sec.cropKey] || catalog.soybeans;
    const isSelected = sec.id === selectedId;
    const { width: w, height: h } = sec;
    const visual = crop.renderVisual;

    let fill =
      visual === 'building' || visual === 'pasture'
        ? '#A6D86F'
        : visual === 'pivots' || visual === 'silos' || visual === 'water'
        ? '#B9DE8C'
        : '#8CC765';

    if (mapLayer === 'ndvi') {
      fill =
        crop.defaultNdvi > 0.8
          ? '#059669'
          : crop.defaultNdvi > 0.5
          ? '#65A30D'
          : crop.defaultNdvi > 0
          ? '#CA8A04'
          : '#1E3A8A';
    } else if (mapLayer === 'moisture') {
      fill =
        crop.defaultMoisture > 85
          ? '#0284C7'
          : crop.defaultMoisture > 70
          ? '#38BDF8'
          : '#7DD3FC';
    }
    const showArt = mapLayer === 'standard';

    const label =
      mapLayer === 'ndvi'
        ? `${crop.defaultNdvi.toFixed(2)} NDVI`
        : mapLayer === 'moisture'
        ? `${crop.defaultMoisture}% H₂O`
        : (sec.customName || (language === 'en' ? crop.nameEn : crop.namePt)).slice(0, 16);
    const pillW = Math.min(w - 10, 22 + label.length * 5.2);

    // Optimized row count to avoid large DOM/SVG trees
    const rowLinesCount = Math.min(5, Math.max(2, Math.floor((h - 32) / 14)));
    const tomatoLinesCount = Math.min(3, Math.max(1, Math.floor((h - 32) / 16)));

    return (
      <G key={sec.id} transform={`translate(${sec.x}, ${sec.y})`} onPress={() => onSelect(sec.id)}>
        <Rect x={1.5} y={2.5} width={w} height={h} rx={10} fill="#00000018" />
        <Rect
          x={0}
          y={0}
          width={w}
          height={h}
          rx={10}
          fill={fill}
          stroke={isSelected ? '#FACC15' : '#EAF7D4'}
          strokeWidth={isSelected ? 3 : 2}
        />

        {/* Clean GPS laser planting rows */}
        {showArt && visual === 'rows' && (
          <G>
            {Array.from({ length: rowLinesCount }).map((_, r) => {
              const cy = 34 + r * 13;
              return (
                <Line
                  key={r}
                  x1={12}
                  y1={cy}
                  x2={w - 12}
                  y2={cy}
                  stroke={sec.cropKey === 'corn' ? '#4D7C0F' : '#15803D'}
                  strokeWidth={2}
                  strokeDasharray="5,5"
                  strokeLinecap="round"
                />
              );
            })}
          </G>
        )}

        {/* Orchard with balanced tree layout */}
        {showArt && visual === 'orchard' && (
          <G>
            <Tree x={22} y={38} r={6.5} />
            <Tree x={w / 2} y={40} r={7} />
            <Tree x={w - 24} y={38} r={6.5} />
            {h > 70 && (
              <>
                <Tree x={30} y={h - 20} r={6} />
                <Tree x={w / 2 + 10} y={h - 18} r={6.5} />
                <Tree x={w - 28} y={h - 20} r={6} />
              </>
            )}
          </G>
        )}

        {/* Tomato trellis rows */}
        {showArt && visual === 'tomatoes' && (
          <G>
            {Array.from({ length: tomatoLinesCount }).map((_, r) => {
              const cy = 36 + r * 16;
              return (
                <G key={r}>
                  <Line x1={12} y1={cy} x2={w - 12} y2={cy} stroke="#854D0E" strokeWidth={3} strokeLinecap="round" />
                  <Circle cx={24} cy={cy} r={2.8} fill="#EF4444" />
                  <Circle cx={w / 2 - 24} cy={cy} r={2.8} fill="#EF4444" />
                  <Circle cx={w / 2 + 20} cy={cy} r={2.8} fill="#EF4444" />
                  <Circle cx={w - 24} cy={cy} r={2.8} fill="#EF4444" />
                </G>
              );
            })}
          </G>
        )}

        {/* Headquarters & Depot */}
        {showArt && visual === 'building' && (
          <G>
            <Tree x={14} y={38} r={7} />
            <Tree x={16} y={h - 16} r={6} />
            <Tree x={w - 14} y={h - 14} r={6} />
            {/* House */}
            <Rect x={w / 2 - 20} y={38} width={40} height={28} fill="#FFF7ED" stroke="#7C2D12" strokeWidth={1} />
            <Polygon points={`${w / 2 - 25},40 ${w / 2},22 ${w / 2 + 25},40`} fill="#DC2626" stroke="#7F1D1D" strokeWidth={1} />
            <Rect x={w / 2 - 4} y={52} width={8} height={14} fill="#92400E" />
            <Rect x={w / 2 - 15} y={45} width={7} height={7} fill="#93C5FD" stroke="#7C2D12" strokeWidth={0.6} />
            <Rect x={w / 2 + 8} y={45} width={7} height={7} fill="#93C5FD" stroke="#7C2D12" strokeWidth={0.6} />
            {/* Path + pickup */}
            <Path d={`M ${w / 2} 66 L ${w / 2} ${h}`} stroke="#E7C9A0" strokeWidth={4} />
            <Rect x={w / 2 + 10} y={h - 18} width={9} height={13} rx={2} fill="#2563EB" />
          </G>
        )}

        {/* Pasture & Livestock */}
        {showArt && visual === 'pasture' && (
          <G>
            <Rect x={6} y={26} width={w - 12} height={h - 32} rx={6} fill="none" stroke="#B45309" strokeWidth={1.2} strokeDasharray="5,2" />
            {/* Barn */}
            <Rect x={14} y={34} width={26} height={20} fill="#B91C1C" stroke="#7F1D1D" strokeWidth={1} />
            <Polygon points="11,35 27,25 43,35" fill="#7F1D1D" />
            {/* Hay + pond */}
            <Circle cx={w - 28} cy={38} r={5} fill="#FACC15" stroke="#CA8A04" strokeWidth={1} />
            <Ellipse cx={w / 2 + 10} cy={40} rx={14} ry={7} fill="#60A5FA" />
            <Cow x={34} y={h - 16} />
            <Cow x={w / 2 - 6} y={h - 22} flip />
            <Cow x={w - 30} y={h - 14} />
            <Chicken x={58} y={54} />
            <Chicken x={w - 48} y={58} />
          </G>
        )}

        {/* Pivots & Reservoir */}
        {showArt && (visual === 'pivots' || visual === 'water') && (
          <G>
            <Circle cx={w * 0.32} cy={h / 2 + 8} r={Math.min(15, h / 2 - 9)} fill="#3B82F6" stroke="#BFDBFE" strokeWidth={2} />
            <Circle cx={w * 0.7} cy={h / 2 + 8} r={Math.min(15, h / 2 - 9)} fill="#0EA5E9" stroke="#BFDBFE" strokeWidth={2} />
            <Path d={`M ${w * 0.32 - 7} ${h / 2 + 8} q 3.5 -3 7 0 t 7 0`} stroke="#DBEAFE" strokeWidth={1.2} fill="none" />
            <Path d={`M ${w * 0.7 - 7} ${h / 2 + 8} q 3.5 -3 7 0 t 7 0`} stroke="#DBEAFE" strokeWidth={1.2} fill="none" />
          </G>
        )}

        {/* Storage Silos */}
        {showArt && visual === 'silos' && (
          <G>
            <Rect x={w / 2 - 26} y={h - 24} width={52} height={20} fill="#CBD5E1" stroke="#475569" strokeWidth={1} />
            <Rect x={w / 2 - 28} y={h - 28} width={56} height={6} fill="#64748B" />
            <Rect x={w / 2 - 8} y={h - 16} width={16} height={12} fill="#475569" />
            <Circle cx={w / 2 + 38} cy={h - 12} r={7} fill="#94A3B8" stroke="#475569" strokeWidth={1} />
          </G>
        )}

        {/* Label pill */}
        <G transform={`translate(${(w - pillW) / 2}, 6)`}>
          <Rect
            x={0}
            y={0}
            width={pillW}
            height={18}
            rx={9}
            fill="#FFFFFFF2"
            stroke={isSelected ? '#FACC15' : '#D9F99D'}
            strokeWidth={1}
          />
          <Circle cx={10} cy={9} r={4} fill={crop.color} />
          <SvgText x={18} y={12.5} fill="#14532D" fontSize="9.5" fontWeight="bold">
            {label}
          </SvgText>
        </G>
      </G>
    );
  };

  return (
    <View style={s.wrap}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <Rect x={0} y={0} width={VB_W} height={VB_H} rx={20} fill="#7DBB55" />
        <Path d={ROADS} stroke="#E9CFA3" strokeWidth={12} strokeLinecap="round" />
        <Path d={ROADS} stroke="#D6B07A" strokeWidth={1} strokeDasharray="3,5" />
        {sectors.map(renderSector)}
      </Svg>

      <View pointerEvents="none" style={s.patrolStation}>
        <Animated.View
          style={[
            s.pulseRing,
            {
              transform: [{ scale: pulse }],
              opacity: pulseOpacity,
            },
          ]}
        />
        <View style={s.patrolBadge}>
          <MaterialCommunityIcons name="account-cowboy-hat" size={17} color="#FFFFFF" />
        </View>
        <View style={s.patrolTag}>
          <View style={s.rtkDot} />
          <Text style={s.patrolTagText}>RTK GPS</Text>
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  wrap: {
    width: '100%',
    aspectRatio: VB_W / VB_H,
    borderRadius: 20,
    overflow: 'hidden',
  },
  patrolStation: {
    position: 'absolute',
    left: '33.3%',
    top: '33.8%',
    marginLeft: -14,
    marginTop: -14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#10B981',
    zIndex: 1,
  },
  patrolBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#047857',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 2,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  patrolTag: {
    position: 'absolute',
    top: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
    zIndex: 3,
  },
  rtkDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#4ADE80',
  },
  patrolTagText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
