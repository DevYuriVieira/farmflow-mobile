import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Platform, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Rect, Circle, G, Line, Path, Polygon, Ellipse, Text as SvgText } from 'react-native-svg';

import type { CropCatalogItem, MapLayerMode, SectorZone } from '../screens/InteractiveFarmMapScreen';

const VB_W = 360;
const VB_H = 340;

/** Dirt road network (must match the walker route below). */
const ROADS = 'M 120 8 L 120 221 M 8 115 L 352 115 M 8 221 L 352 221 M 219 221 L 219 332';

/** Farmer patrol route along the roads (viewBox coordinates). */
const ROUTE: [number, number][] = [
  [120, 14], [120, 115], [345, 115], [120, 115], [14, 115], [120, 115],
  [120, 221], [345, 221], [219, 221], [219, 326], [219, 221], [14, 221],
  [120, 221], [120, 14],
];
const WALK_SPEED = 28; // viewBox units per second

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

export const FarmIllustration: React.FC<Props> = ({ sectors, selectedId, mapLayer, language, catalog, onSelect }) => {
  // ---- Walking farmer animation ----
  const progress = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;

  const { input, xs, ys, flips, total } = useMemo(() => {
    const inputArr: number[] = [0];
    const xArr: string[] = [`${(ROUTE[0][0] / VB_W) * 100}%`];
    const yArr: string[] = [`${(ROUTE[0][1] / VB_H) * 100}%`];
    const flipIn: number[] = [];
    const flipOut: number[] = [];
    let dist = 0;
    for (let i = 1; i < ROUTE.length; i++) {
      const [x0, y0] = ROUTE[i - 1];
      const [x1, y1] = ROUTE[i];
      const dir = x1 < x0 ? -1 : x1 > x0 ? 1 : flipOut.length ? flipOut[flipOut.length - 1] : 1;
      flipIn.push(dist + 0.001);
      flipOut.push(dir);
      dist += Math.hypot(x1 - x0, y1 - y0);
      flipIn.push(dist);
      flipOut.push(dir);
      inputArr.push(dist);
      xArr.push(`${(x1 / VB_W) * 100}%`);
      yArr.push(`${(y1 / VB_H) * 100}%`);
    }
    return { input: inputArr, xs: xArr, ys: yArr, flips: { input: [0, ...flipIn], output: [flipOut[0], ...flipOut] }, total: dist };
  }, []);

  useEffect(() => {
    const walk = Animated.loop(
      Animated.timing(progress, {
        toValue: total,
        duration: (total / WALK_SPEED) * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    const step = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(bob, { toValue: 0, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    walk.start();
    step.start();
    return () => {
      walk.stop();
      step.stop();
    };
  }, [progress, bob, total]);

  const left = progress.interpolate({ inputRange: input, outputRange: xs });
  const top = progress.interpolate({ inputRange: input, outputRange: ys });
  const scaleX = progress.interpolate({ inputRange: flips.input, outputRange: flips.output });
  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });
  const rotate = bob.interpolate({ inputRange: [0, 1], outputRange: ['-6deg', '6deg'] });

  // ---- Sector artwork ----
  const renderSector = (sec: SectorZone) => {
    const crop = catalog[sec.cropKey] || catalog.soybeans;
    const isSelected = sec.id === selectedId;
    const { width: w, height: h } = sec;
    const visual = crop.renderVisual;

    let fill = visual === 'building' || visual === 'pasture' ? '#A6D86F' : visual === 'pivots' || visual === 'silos' || visual === 'water' ? '#B9DE8C' : '#8CC765';
    if (mapLayer === 'ndvi') {
      fill = crop.defaultNdvi > 0.8 ? '#059669' : crop.defaultNdvi > 0.5 ? '#65A30D' : crop.defaultNdvi > 0 ? '#CA8A04' : '#1E3A8A';
    } else if (mapLayer === 'moisture') {
      fill = crop.defaultMoisture > 85 ? '#0284C7' : crop.defaultMoisture > 70 ? '#38BDF8' : '#7DD3FC';
    }
    const showArt = mapLayer === 'standard';

    const label =
      mapLayer === 'ndvi'
        ? `${crop.defaultNdvi.toFixed(2)} NDVI`
        : mapLayer === 'moisture'
        ? `${crop.defaultMoisture}% H₂O`
        : (sec.customName || (language === 'en' ? crop.nameEn : crop.namePt)).slice(0, 16);
    const pillW = Math.min(w - 10, 22 + label.length * 5.2);

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

        {showArt && (visual === 'rows' || visual === 'orchard') && (
          <G>
            {Array.from({ length: Math.floor((h - 30) / 11) }).map((_, r) =>
              Array.from({ length: Math.floor((w - 14) / 11) }).map((__, c) => {
                const cx = 12 + c * 11;
                const cy = 34 + r * 11;
                if (sec.cropKey === 'vegetables' || visual === 'orchard') {
                  return (
                    <G key={`${r}-${c}`}>
                      <Circle cx={cx} cy={cy} r={4} fill="#2E7D32" />
                      <Circle cx={cx - 1} cy={cy - 1} r={2} fill={visual === 'orchard' ? crop.color : '#66BB6A'} />
                    </G>
                  );
                }
                return (
                  <Path
                    key={`${r}-${c}`}
                    d={`M ${cx} ${cy + 4} L ${cx - 3} ${cy - 3} M ${cx} ${cy + 4} L ${cx} ${cy - 4} M ${cx} ${cy + 4} L ${cx + 3} ${cy - 3}`}
                    stroke={sec.cropKey === 'corn' ? '#4D7C0F' : '#2E7D32'}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                  />
                );
              }),
            )}
          </G>
        )}

        {showArt && visual === 'tomatoes' && (
          <G>
            {Array.from({ length: Math.floor((h - 30) / 10) }).map((_, r) => {
              const cy = 34 + r * 10;
              return (
                <G key={r}>
                  <Line x1={8} y1={cy} x2={w - 8} y2={cy} stroke="#8B5A2B" strokeWidth={5} strokeLinecap="round" />
                  {Array.from({ length: Math.floor((w - 16) / 9) }).map((__, c) => (
                    <G key={c}>
                      <Circle cx={12 + c * 9} cy={cy} r={2.6} fill="#2E7D32" />
                      {(c + r) % 2 === 0 && <Circle cx={13 + c * 9} cy={cy + 0.5} r={1.4} fill="#EF4444" />}
                    </G>
                  ))}
                </G>
              );
            })}
          </G>
        )}

        {showArt && visual === 'building' && (
          <G>
            <Tree x={14} y={38} r={8} />
            <Tree x={16} y={h - 16} r={7} />
            <Tree x={w - 14} y={h - 14} r={6} />
            {/* House */}
            <Rect x={w / 2 - 20} y={40} width={40} height={30} fill="#FFF7ED" stroke="#7C2D12" strokeWidth={1} />
            <Polygon points={`${w / 2 - 25},42 ${w / 2},24 ${w / 2 + 25},42`} fill="#DC2626" stroke="#7F1D1D" strokeWidth={1} />
            <Rect x={w / 2 - 4} y={56} width={8} height={14} fill="#92400E" />
            <Rect x={w / 2 - 15} y={48} width={7} height={7} fill="#93C5FD" stroke="#7C2D12" strokeWidth={0.6} />
            <Rect x={w / 2 + 8} y={48} width={7} height={7} fill="#93C5FD" stroke="#7C2D12" strokeWidth={0.6} />
            {/* Path + car */}
            <Path d={`M ${w / 2} 70 L ${w / 2} ${h}`} stroke="#E7C9A0" strokeWidth={5} />
            <Rect x={w / 2 + 10} y={h - 20} width={9} height={14} rx={2.5} fill="#2563EB" />
          </G>
        )}

        {showArt && visual === 'pasture' && (
          <G>
            <Rect x={6} y={28} width={w - 12} height={h - 34} rx={6} fill="none" stroke="#B45309" strokeWidth={1.2} strokeDasharray="5,2" />
            {/* Barn */}
            <Rect x={14} y={36} width={26} height={20} fill="#B91C1C" stroke="#7F1D1D" strokeWidth={1} />
            <Polygon points="11,37 27,27 43,37" fill="#7F1D1D" />
            <Path d="M 22 56 L 22 44 L 32 44 L 32 56 M 22 44 L 32 56 M 32 44 L 22 56" stroke="#FFFFFF" strokeWidth={1} fill="none" />
            {/* Hay + pond */}
            <Circle cx={w - 30} cy={40} r={5} fill="#FACC15" stroke="#CA8A04" strokeWidth={1} />
            <Circle cx={w - 18} cy={44} r={5} fill="#FACC15" stroke="#CA8A04" strokeWidth={1} />
            <Ellipse cx={w / 2 + 10} cy={42} rx={14} ry={7} fill="#60A5FA" />
            <Cow x={36} y={h - 18} />
            <Cow x={w / 2 - 6} y={h - 26} flip />
            <Cow x={w - 34} y={h - 14} />
            <Chicken x={60} y={56} />
            <Chicken x={68} y={62} />
            <Chicken x={56} y={66} />
            <Chicken x={w - 50} y={62} />
          </G>
        )}

        {showArt && (visual === 'pivots' || visual === 'water') && (
          <G>
            <Circle cx={w * 0.32} cy={h / 2 + 8} r={Math.min(15, h / 2 - 9)} fill="#3B82F6" stroke="#BFDBFE" strokeWidth={2} />
            <Circle cx={w * 0.7} cy={h / 2 + 8} r={Math.min(15, h / 2 - 9)} fill="#0EA5E9" stroke="#BFDBFE" strokeWidth={2} />
            <Path d={`M ${w * 0.32 - 7} ${h / 2 + 8} q 3.5 -3 7 0 t 7 0`} stroke="#DBEAFE" strokeWidth={1.2} fill="none" />
            <Path d={`M ${w * 0.7 - 7} ${h / 2 + 8} q 3.5 -3 7 0 t 7 0`} stroke="#DBEAFE" strokeWidth={1.2} fill="none" />
          </G>
        )}

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
          <Rect x={0} y={0} width={pillW} height={18} rx={9} fill="#FFFFFFF2" stroke={isSelected ? '#FACC15' : '#D9F99D'} strokeWidth={1} />
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

      {/* Walking farmer */}
      <Animated.View pointerEvents="none" style={[s.walker, { left, top }]}>
        <View style={s.shadow} />
        <Animated.View style={{ transform: [{ translateY }, { rotate }] }}>
          <Animated.View style={{ transform: [{ scaleX }] }}>
            <MaterialCommunityIcons name="account-cowboy-hat" size={26} color="#7C2D12" />
          </Animated.View>
        </Animated.View>
      </Animated.View>
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
  walker: {
    position: 'absolute',
    width: 26,
    height: 30,
    marginLeft: -13,
    marginTop: -26,
    alignItems: 'center',
  },
  shadow: {
    position: 'absolute',
    bottom: 0,
    width: 16,
    height: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
});
