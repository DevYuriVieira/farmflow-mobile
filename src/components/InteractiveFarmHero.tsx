import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  LayoutChangeEvent,
  ViewStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Polygon,
  Line,
  Ellipse,
} from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePreferences } from '../contexts/PreferencesContext';
import { styles } from './styles/interactiveFarmHero.styles';

export type WeatherMode = 'sunny' | 'cloudy' | 'windy' | 'rain' | 'rainbow' | 'night';

export interface InteractiveFarmHeroProps {
  onWeatherCardPress?: () => void;
  onHealthCardPress?: () => void;
  farmHealthPercentage?: number;
  temperature?: number;
  humidity?: number;
  rainProbability?: number;
  currentMode?: WeatherMode;
  onModeChange?: (mode: WeatherMode) => void;
  autoPlay?: boolean;
  variant?: 'home' | 'weather';
}

const VB_W = 400;
const VB_H = 280;
const ND = Platform.OS !== 'web';

const MODES: WeatherMode[] = ['sunny', 'cloudy', 'windy', 'rain', 'rainbow', 'night'];

const SKY: Record<WeatherMode, [string, string]> = {
  sunny: ['#5BC0F8', '#CDEFFF'],
  cloudy: ['#94A3B8', '#E2E8F0'],
  windy: ['#7DD3FC', '#E0F7FF'],
  rain: ['#334155', '#7C8BA1'],
  rainbow: ['#60A5FA', '#FDE7F3'],
  night: ['#0A192F', '#0D241C'],
};

const MODE_META: Record<
  WeatherMode,
  { labelPt: string; labelEn: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; delta: number; hum: string; rain: string }
> = {
  sunny: { labelPt: 'Ensolarado', labelEn: 'Sunny', icon: 'white-balance-sunny', delta: 0, hum: '68%', rain: '15%' },
  cloudy: { labelPt: 'Nublado', labelEn: 'Cloudy', icon: 'weather-cloudy', delta: -3, hum: '74%', rain: '35%' },
  windy: { labelPt: 'Ventania', labelEn: 'Windy', icon: 'weather-windy', delta: -1, hum: '62%', rain: '20%' },
  rain: { labelPt: 'Chuva', labelEn: 'Rain shower', icon: 'weather-pouring', delta: -7, hum: '94%', rain: '92%' },
  rainbow: { labelPt: 'Arco-íris', labelEn: 'Rainbow', icon: 'weather-partly-cloudy', delta: -2, hum: '82%', rain: '15%' },
  night: { labelPt: 'Noite Limpa', labelEn: 'Clear Night', icon: 'weather-night', delta: -8, hum: '88%', rain: '5%' },
};

const MODE_LABEL: Record<WeatherMode, { pt: string; en: string }> = {
  sunny: { pt: 'Sol', en: 'Sun' },
  cloudy: { pt: 'Nuvens', en: 'Clouds' },
  windy: { pt: 'Vento', en: 'Wind' },
  rain: { pt: 'Chuva', en: 'Rain' },
  rainbow: { pt: 'Arco-íris', en: 'Rainbow' },
  night: { pt: 'Noite', en: 'Night' },
};

const useLoop = (duration: number, { delay = 0, pingPong = false } = {}) => {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const easing = pingPong ? Easing.inOut(Easing.sin) : Easing.linear;
    const forward = Animated.timing(v, { toValue: 1, duration, easing, useNativeDriver: ND });
    const anim = pingPong
      ? Animated.sequence([forward, Animated.timing(v, { toValue: 0, duration, easing, useNativeDriver: ND })])
      : forward;
    const loop = Animated.loop(anim, { resetBeforeIteration: !pingPong });
    const t = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(t);
      loop.stop();
    };
  }, [duration, delay, pingPong, v]);
  return v;
};

const useTo = (target: number, duration = 900) => {
  const v = useRef(new Animated.Value(target)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: target,
      duration,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: ND,
    }).start();
  }, [target, duration, v]);
  return v;
};

interface SpriteProps {
  x: number;
  y: number;
  w: number;
  h: number;
  style?: StyleProp<ViewStyle> | Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  children: React.ReactNode;
}

const Sprite: React.FC<SpriteProps> = ({ x, y, w, h, style, children }) => (
  <Animated.View
    pointerEvents="none"
    style={[
      {
        position: 'absolute',
        left: `${(x / VB_W) * 100}%`,
        top: `${(y / VB_H) * 100}%`,
        width: `${(w / VB_W) * 100}%`,
        height: `${(h / VB_H) * 100}%`,
      },
      style as StyleProp<ViewStyle>,
    ]}
  >
    <Svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}>
      {children}
    </Svg>
  </Animated.View>
);

const FullLayer: React.FC<{ style?: any; children: React.ReactNode; vbH?: number }> = ({
  style,
  children,
  vbH = VB_H,
}) => (
  <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
    <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${vbH}`} preserveAspectRatio="none">
      {children}
    </Svg>
  </Animated.View>
);

const Cloud: React.FC<{ fill: string }> = ({ fill }) => (
  <G fill={fill}>
    <Ellipse cx="22" cy="26" rx="18" ry="11" />
    <Ellipse cx="42" cy="18" rx="17" ry="15" />
    <Ellipse cx="62" cy="24" rx="16" ry="12" />
    <Rect x="10" y="24" width="64" height="12" rx="6" />
  </G>
);

const Blades: React.FC<{ color?: string }> = ({ color = '#FFFFFF' }) => (
  <G>
    <Path d="M20 20 L18 2 Q20 0 22 2 Z" fill={color} />
    <Path d="M20 20 L36 29 Q36 32 33 32 Z" fill={color} />
    <Path d="M20 20 L4 29 Q4 32 7 32 Z" fill={color} />
    <Circle cx="20" cy="20" r="3" fill="#CBD5E1" />
  </G>
);

const Crop: React.FC<{ ripe?: boolean }> = ({ ripe }) => (
  <G>
    <Path d="M10 30 Q10 18 10 10" stroke="#15803D" strokeWidth="2" />
    <Path d="M10 22 Q2 18 3 10 Q9 13 10 22" fill="#22C55E" />
    <Path d="M10 18 Q18 14 17 6 Q11 9 10 18" fill="#4ADE80" />
    <Path d="M10 12 Q6 6 10 1 Q14 6 10 12" fill="#16A34A" />
    {ripe && <Circle cx="15" cy="20" r="2.6" fill="#EF4444" />}
  </G>
);

export const InteractiveFarmHero: React.FC<InteractiveFarmHeroProps> = ({
  onWeatherCardPress,
  onHealthCardPress,
  farmHealthPercentage = 92,
  temperature,
  humidity,
  rainProbability,
  currentMode: externalMode,
  onModeChange,
  autoPlay: _autoPlay = false,
  variant,
}) => {
  const isHome = variant === 'home' || (!variant && (Boolean(onWeatherCardPress) || Boolean(onHealthCardPress)));
  const { isDark, language, t } = usePreferences();
  const [internalMode, setInternalMode] = useState<WeatherMode>(() => externalMode || (isDark ? 'night' : 'sunny'));
  const [size, setSize] = useState({ w: 360, h: 252 });

  const mode = externalMode ?? internalMode;

  const selectMode = (m: WeatherMode) => {
    if (onModeChange) {
      onModeChange(m);
    } else {
      setInternalMode(m);
    }
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width && height) setSize({ w: width, h: height });
  };

  const skySunny = useTo(mode === 'sunny' ? 1 : 0);
  const skyCloudy = useTo(mode === 'cloudy' ? 1 : 0);
  const skyWindy = useTo(mode === 'windy' ? 1 : 0);
  const skyRain = useTo(mode === 'rain' ? 1 : 0);
  const skyRainbow = useTo(mode === 'rainbow' ? 1 : 0);
  const skyNight = useTo(mode === 'night' ? 1 : 0);
  const skyOpacity: Record<WeatherMode, Animated.Value> = {
    sunny: skySunny,
    cloudy: skyCloudy,
    windy: skyWindy,
    rain: skyRain,
    rainbow: skyRainbow,
    night: skyNight,
  };

  const sunVis = useTo({ sunny: 1, windy: 1, rainbow: 0.95, cloudy: 0.35, rain: 0, night: 0 }[mode]);
  const darkClouds = useTo({ sunny: 0, windy: 0.15, rainbow: 0.1, cloudy: 0.75, rain: 1, night: 0 }[mode]);
  const rainVis = useTo(mode === 'rain' ? 1 : 0, 600);
  const windVis = useTo(mode === 'windy' ? 1 : 0, 600);
  const rainbowVis = useTo(mode === 'rainbow' ? 1 : 0, 1400);
  const nightVis = useTo(mode === 'night' ? 1 : 0, 800);
  const sprinklerOn = useTo(mode === 'rain' || mode === 'night' ? 0 : 1, 500);
  const shade = useTo({ sunny: 0, windy: 0, rainbow: 0, cloudy: 0.12, rain: 0.28, night: 0.45 }[mode]);
  const birdsVis = useTo(mode === 'rain' || mode === 'night' ? 0 : 1);
  const wetness = useTo({ sunny: 0, windy: 0, cloudy: 0.1, rain: 1, rainbow: 0.6, night: 0.1 }[mode], 2500);
  const lightning = useLoop(4200);
  const splashA = useLoop(650);
  const splashB = useLoop(800, { delay: 300 });
  const flash = Animated.multiply(
    rainVis,
    lightning.interpolate({ inputRange: [0, 0.03, 0.06, 0.09, 0.14, 1], outputRange: [0, 0.75, 0.1, 0.55, 0, 0] })
  );

  const turbine = useLoop(mode === 'windy' ? 1100 : 3600);
  const sunRays = useLoop(18000);
  const sunPulse = useLoop(2600, { pingPong: true });
  const cloudA = useLoop(mode === 'windy' ? 9000 : 26000);
  const cloudB = useLoop(mode === 'windy' ? 12000 : 34000, { delay: 1200 });
  const cloudC = useLoop(mode === 'windy' ? 7000 : 22000, { delay: 600 });
  const rainA = useLoop(520);
  const rainB = useLoop(760, { delay: 180 });
  const windStreak = useLoop(1400);
  const sway = useLoop(mode === 'windy' ? 700 : 1900, { pingPong: true });
  const swayAlt = useLoop(mode === 'windy' ? 820 : 2300, { pingPong: true, delay: 400 });
  const cowWalk = useLoop(7000, { pingPong: true });
  const cowGraze = useLoop(1200, { pingPong: true });
  const cowGraze2 = useLoop(1500, { pingPong: true, delay: 500 });
  const birdsFly = useLoop(14000);
  const birdFlap = useLoop(260, { pingPong: true });
  const spray = useLoop(1600, { pingPong: true });
  const ripple = useLoop(2400);
  const farmerBreath = useLoop(2200, { pingPong: true });
  const tabletGlow = useLoop(1500, { pingPong: true });

  const rot = (v: Animated.Value, deg = 360) =>
    v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${deg}deg`] });
  const swing = (v: Animated.Value, a: number) =>
    v.interpolate({ inputRange: [0, 1], outputRange: [`-${a}deg`, `${a}deg`] });
  const across = (v: Animated.Value, from: number, to: number) =>
    v.interpolate({ inputRange: [0, 1], outputRange: [from, to] });

  const swayAmp = mode === 'windy' ? 14 : 5;

  const drops = useMemo(() => {
    const arr: { x: number; y: number; l: number }[] = [];
    let seed = 7;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 90; i++) arr.push({ x: rnd() * VB_W, y: rnd() * VB_H, l: 8 + rnd() * 8 });
    return arr;
  }, []);

  const renderRain = (offset: number, opacity: number) => (
    <G stroke="#E0F2FE" strokeWidth="1.8" strokeLinecap="round" opacity={opacity}>
      {[0, VB_H].map((tileY) =>
        drops.map((d, i) => (
          <Line
            key={`${tileY}-${i}`}
            x1={(d.x + offset) % VB_W}
            y1={d.y + tileY}
            x2={(d.x + offset) % VB_W - 3}
            y2={d.y + tileY + d.l}
          />
        ))
      )}
    </G>
  );

  const meta = MODE_META[mode];
  const temp = temperature !== undefined ? temperature : 28 + meta.delta;

  return (
    <View style={styles.container}>
      <View style={styles.canvas} onLayout={onLayout}>
        {MODES.map((m) => (
          <FullLayer key={m} style={{ opacity: skyOpacity[m] }}>
            <Defs>
              <LinearGradient id={`sky-${m}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={SKY[m][0]} />
                <Stop offset="0.75" stopColor={SKY[m][1]} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width={VB_W} height={VB_H} fill={`url(#sky-${m})`} />
          </FullLayer>
        ))}

        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: sunVis }]}>
          <Sprite x={278} y={6} w={76} h={76} style={{ transform: [{ rotate: rot(sunRays) }] }}>
            <G stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" opacity="0.8">
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * Math.PI) / 6;
                return (
                  <Line
                    key={i}
                    x1={38 + Math.cos(a) * 24}
                    y1={38 + Math.sin(a) * 24}
                    x2={38 + Math.cos(a) * 34}
                    y2={38 + Math.sin(a) * 34}
                  />
                );
              })}
            </G>
          </Sprite>
          <Sprite
            x={290}
            y={18}
            w={52}
            h={52}
            style={{ transform: [{ scale: across(sunPulse, 0.94, 1.08) }] }}
          >
            <Defs>
              <RadialGradient id="sunCore" cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor="#FFF7AE" />
                <Stop offset="0.6" stopColor="#FACC15" />
                <Stop offset="1" stopColor="#F59E0B" />
              </RadialGradient>
            </Defs>
            <Circle cx="26" cy="26" r="25" fill="#FDE047" opacity="0.3" />
            <Circle cx="26" cy="26" r="17" fill="url(#sunCore)" />
          </Sprite>
        </Animated.View>

        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: nightVis }]}>
          <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`}>
            {[
              [24, 28, 1.8],
              [60, 18, 1.4],
              [94, 38, 2.0],
              [130, 22, 1.5],
              [168, 44, 2.2],
              [205, 16, 1.8],
              [240, 36, 1.5],
              [278, 20, 2.4],
              [310, 48, 1.6],
              [365, 26, 2.0],
              [382, 54, 1.4],
              [52, 60, 1.6],
              [115, 70, 1.4],
              [180, 64, 1.8],
            ].map(([sx, sy, sr], idx) => (
              <Circle key={idx} cx={sx} cy={sy} r={sr} fill="#FFFFFF" opacity={0.88} />
            ))}

            <Circle cx="330" cy="40" r="32" fill="#FEF08A" opacity={0.12} />
            <Circle cx="330" cy="40" r="22" fill="#FEF08A" opacity={0.25} />
            <Circle cx="330" cy="40" r="16" fill="#FEF08A" />
            <Circle cx="337" cy="36" r="14" fill="#0A192F" />

            <Circle cx="84" cy="220" r="3" fill="#A3E635" opacity={0.9} />
            <Circle cx="84" cy="220" r="7" fill="#A3E635" opacity={0.3} />
            <Circle cx="160" cy="205" r="2.5" fill="#86EFAC" opacity={0.9} />
            <Circle cx="160" cy="205" r="6" fill="#86EFAC" opacity={0.3} />
            <Circle cx="260" cy="235" r="3" fill="#FDE047" opacity={0.9} />
            <Circle cx="260" cy="235" r="7" fill="#FDE047" opacity={0.3} />
            <Circle cx="330" cy="210" r="2.5" fill="#A3E635" opacity={0.9} />
            <Circle cx="330" cy="210" r="6" fill="#A3E635" opacity={0.3} />
          </Svg>
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: rainbowVis,
              transform: [{ scale: across(rainbowVis, 0.85, 1) }, { translateY: across(rainbowVis, 20, 0) }],
            },
          ]}
        >
          <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`}>
            <G fill="none" strokeWidth="6" opacity="0.75">
              {['#EF4444', '#F97316', '#FACC15', '#22C55E', '#38BDF8', '#6366F1', '#A855F7'].map((c, i) => (
                <Path key={c} d={`M ${70 + i * 6} 160 A ${130 - i * 6} ${110 - i * 6} 0 0 1 ${330 - i * 6} 160`} stroke={c} />
              ))}
            </G>
          </Svg>
        </Animated.View>

        <Sprite
          x={0}
          y={14}
          w={80}
          h={40}
          style={{ opacity: 0.95, transform: [{ translateX: across(cloudA, -size.w * 0.25, size.w * 1.05) }] }}
        >
          <Cloud fill="#FFFFFF" />
        </Sprite>
        <Sprite
          x={0}
          y={44}
          w={64}
          h={32}
          style={{ opacity: 0.85, transform: [{ translateX: across(cloudB, size.w * 1.05, -size.w * 0.2) }] }}
        >
          <Cloud fill="#FFFFFF" />
        </Sprite>
        <Sprite
          x={0}
          y={2}
          w={56}
          h={28}
          style={{ opacity: 0.7, transform: [{ translateX: across(cloudC, -size.w * 0.2, size.w * 1.05) }] }}
        >
          <Cloud fill="#F1F5F9" />
        </Sprite>

        <FullLayer style={{ opacity: darkClouds }}>
          <G fill="#64748B" opacity="0.9">
            <Ellipse cx="40" cy="20" rx="70" ry="30" />
            <Ellipse cx="150" cy="10" rx="80" ry="32" />
            <Ellipse cx="270" cy="18" rx="85" ry="34" />
            <Ellipse cx="380" cy="12" rx="70" ry="30" />
          </G>
          <G fill="#475569">
            <Ellipse cx="100" cy="0" rx="90" ry="22" />
            <Ellipse cx="320" cy="0" rx="100" ry="22" />
          </G>
        </FullLayer>

        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { opacity: birdsVis, transform: [{ translateX: across(birdsFly, -size.w * 0.3, size.w * 1.1) }] },
          ]}
        >
          {[
            [20, 60, 1],
            [44, 50, 0.8],
            [36, 72, 0.7],
          ].map(([bx, by, s], i) => (
            <Sprite
              key={i}
              x={bx}
              y={by}
              w={16 * s}
              h={8 * s}
              style={{ transform: [{ scaleY: across(birdFlap, 1, 0.35) }] }}
            >
              <Path
                d={`M0 ${4 * s} Q ${4 * s} 0 ${8 * s} ${4 * s} Q ${12 * s} 0 ${16 * s} ${4 * s}`}
                stroke="#1E293B"
                strokeWidth="1.6"
                fill="none"
              />
            </Sprite>
          ))}
        </Animated.View>

        <FullLayer>
          <Defs>
            <LinearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#A7E3A1" />
              <Stop offset="1" stopColor="#7CCB76" />
            </LinearGradient>
            <LinearGradient id="field" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#86D86F" />
              <Stop offset="1" stopColor="#4CAF50" />
            </LinearGradient>
            <LinearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#A47A4F" />
              <Stop offset="1" stopColor="#6F4E2F" />
            </LinearGradient>
            <LinearGradient id="pond" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#7DD3FC" />
              <Stop offset="1" stopColor="#0EA5E9" />
            </LinearGradient>
          </Defs>

          <Path d="M0 140 Q60 108 130 128 T260 118 T400 124 L400 280 L0 280 Z" fill="url(#hillFar)" />
          <Path d="M0 158 Q100 136 210 154 T400 146 L400 280 L0 280 Z" fill="url(#field)" />
          {isHome ? (
            <>
              <Polygon points="88,68 86,134 90,134" fill="#F8FAFC" />
              <Polygon points="126,86 124,138 128,138" fill="#F1F5F9" />
              <Polygon points="352,78 350,136 354,136" fill="#F8FAFC" />

              <Path d="M18 152 Q70 146 110 152 L98 170 L8 170 Z" fill="#E6D095" opacity="0.9" />
              <G>
                <Rect x="26" y="146" width="4" height="12" fill="#78350F" />
                <Circle cx="28" cy="138" r="14" fill="#15803D" />
                <Circle cx="35" cy="144" r="9" fill="#16A34A" />

                <Rect x="54" y="150" width="3.5" height="10" fill="#78350F" />
                <Circle cx="56" cy="143" r="11" fill="#166534" />
                <Circle cx="62" cy="148" r="7" fill="#15803D" />
              </G>

              <G>
                <Polygon points="140,140 152,98 164,140" fill="#14532D" />
                <Polygon points="143,126 152,94 161,126" fill="#166534" />
                <Polygon points="145,114 152,90 159,114" fill="#15803D" />

                <Polygon points="154,142 165,106 176,142" fill="#14532D" />
                <Polygon points="156,130 165,102 174,130" fill="#166534" />
              </G>

              <G>
                <Rect x="338" y="132" width="3.5" height="11" fill="#78350F" />
                <Circle cx="340" cy="124" r="11" fill="#15803D" />
                <Circle cx="346" cy="128" r="7.5" fill="#22C55E" opacity="0.85" />

                <Rect x="362" y="134" width="3" height="8" fill="#78350F" />
                <Polygon points="353,134 363.5,118 374,134" fill="#14532D" />
                <Polygon points="355,124 363.5,111 372,124" fill="#166534" />
                <Polygon points="358,114 363.5,103 369,114" fill="#15803D" />

                <Rect x="382" y="130" width="4" height="12" fill="#78350F" />
                <Circle cx="384" cy="122" r="12" fill="#166534" />
                <Circle cx="391" cy="127" r="8" fill="#15803D" />
                <Circle cx="378" cy="126" r="7" fill="#14532D" />
              </G>

              <Rect x="250" y="96" width="24" height="58" rx="4" fill="#CBD5E1" />
              <Path d="M250 100 Q262 82 274 100 Z" fill="#94A3B8" />
              <Line x1="250" y1="114" x2="274" y2="114" stroke="#94A3B8" />
              <Line x1="250" y1="130" x2="274" y2="130" stroke="#94A3B8" />

              <Polygon points="160,112 205,84 250,112" fill="#991B1B" />
              <Rect x="164" y="112" width="82" height="44" fill="#DC2626" />
              <Polygon points="156,114 205,80 254,114 250,116 205,86 160,116" fill="#7F1D1D" />
              <Rect x="190" y="126" width="30" height="30" fill="#FFFFFF" />
              <Rect x="193" y="129" width="24" height="27" fill="#B91C1C" />
              <Line x1="193" y1="129" x2="217" y2="156" stroke="#FFFFFF" strokeWidth="2.5" />
              <Line x1="217" y1="129" x2="193" y2="156" stroke="#FFFFFF" strokeWidth="2.5" />
              <Rect x="198" y="96" width="14" height="11" fill="#FFFFFF" />
              <Rect x="200" y="98" width="10" height="7" fill={mode === 'night' ? '#FDE047' : '#1E3A8A'} />

              <G stroke="#F5DEB3" strokeWidth="2.2">
                <Line x1="222" y1="168" x2="345" y2="168" />
                <Line x1="222" y1="176" x2="345" y2="176" />
              </G>
              <G stroke="#B45309" strokeWidth="2.6">
                {[226, 256, 286, 316, 342].map((fx) => (
                  <Line key={fx} x1={fx} y1="164" x2={fx} y2="182" />
                ))}
              </G>

              <Path d="M0 206 L196 186 L222 280 L0 280 Z" fill="url(#soil)" />
              {[214, 230, 248, 266].map((fy, i) => (
                <Path
                  key={fy}
                  d={`M0 ${fy} Q100 ${fy - 10 - i} ${200 + i * 6} ${fy - 18 - i * 2}`}
                  stroke="#5C3D22"
                  strokeWidth={2 + i * 0.6}
                  fill="none"
                />
              ))}

              <Path d="M222 280 L196 186 Q300 176 400 184 L400 280 Z" fill="#5DBB4F" />

              <Ellipse cx="324" cy="220" rx="98" ry="33" fill="url(#pond)" />
              <Ellipse cx="300" cy="212" rx="48" ry="9" fill="#E0F2FE" opacity="0.65" />
              <Ellipse cx="350" cy="228" rx="36" ry="6" fill="#E0F2FE" opacity="0.45" />

              <Line x1="120" y1="222" x2="120" y2="200" stroke="#64748B" strokeWidth="2" />
            </>
          ) : (
            <>
              <Polygon points="168,70 166,138 170,138" fill="#F8FAFC" />
              <Polygon points="372,80 369,138 375,138" fill="#F8FAFC" />

              <G>
                <Rect x="20" y="128" width="4" height="14" fill="#78350F" />
                <Circle cx="22" cy="120" r="13" fill="#166534" />
                <Circle cx="30" cy="127" r="8" fill="#15803D" />

                <Rect x="47" y="132" width="3" height="9" fill="#78350F" />
                <Polygon points="37,132 48.5,116 60,132" fill="#14532D" />
                <Polygon points="40,122 48.5,108 57,122" fill="#166534" />
                <Polygon points="43,112 48.5,100 54,112" fill="#15803D" />

                <Rect x="79" y="132" width="3.5" height="10" fill="#78350F" />
                <Circle cx="81" cy="124" r="11" fill="#15803D" />
                <Circle cx="74" cy="129" r="7" fill="#166534" />
                <Circle cx="89" cy="128" r="8" fill="#22C55E" opacity="0.85" />

                <Rect x="111" y="130" width="3" height="10" fill="#78350F" />
                <Polygon points="102,130 112.5,114 123,130" fill="#14532D" />
                <Polygon points="105,120 112.5,107 120,120" fill="#166534" />
                <Polygon points="107,110 112.5,99 118,110" fill="#15803D" />

                <Rect x="136" y="127" width="4" height="14" fill="#78350F" />
                <Circle cx="138" cy="118" r="14" fill="#166534" />
                <Circle cx="130" cy="125" r="9" fill="#15803D" />
                <Circle cx="147" cy="123" r="10" fill="#22C55E" opacity="0.8" />

                <Rect x="193" y="132" width="3" height="10" fill="#78350F" />
                <Circle cx="194" cy="123" r="11" fill="#15803D" />
                <Circle cx="187" cy="128" r="7" fill="#166534" />

                <Rect x="347" y="128" width="4" height="13" fill="#78350F" />
                <Circle cx="349" cy="120" r="12" fill="#166534" />
                <Circle cx="356" cy="126" r="8" fill="#15803D" />

                <Rect x="375" y="126" width="4" height="14" fill="#78350F" />
                <Circle cx="377" cy="118" r="13" fill="#166534" />
                <Circle cx="385" cy="125" r="8" fill="#15803D" />
              </G>

              <Rect x="320" y="92" width="24" height="62" rx="4" fill="#CBD5E1" />
              <Path d="M320 96 Q332 78 344 96 Z" fill="#94A3B8" />
              <Line x1="320" y1="112" x2="344" y2="112" stroke="#94A3B8" />
              <Line x1="320" y1="128" x2="344" y2="128" stroke="#94A3B8" />

              <Polygon points="230,112 275,84 320,112" fill="#991B1B" />
              <Rect x="234" y="112" width="82" height="44" fill="#DC2626" />
              <Polygon points="226,114 275,80 324,114 320,116 275,86 230,116" fill="#7F1D1D" />
              <Rect x="260" y="126" width="30" height="30" fill="#FFFFFF" />
              <Rect x="263" y="129" width="24" height="27" fill="#B91C1C" />
              <Line x1="263" y1="129" x2="287" y2="156" stroke="#FFFFFF" strokeWidth="2.5" />
              <Line x1="287" y1="129" x2="263" y2="156" stroke="#FFFFFF" strokeWidth="2.5" />
              <Rect x="268" y="96" width="14" height="11" fill="#FFFFFF" />
              <Rect x="270" y="98" width="10" height="7" fill={mode === 'night' ? '#FDE047' : '#1E3A8A'} />

              <Path d="M400 206 L196 182 L170 280 L400 280 Z" fill="url(#soil)" />
              {[214, 230, 248, 266].map((fy, i) => (
                <Path
                  key={fy}
                  d={`M400 ${fy} Q300 ${fy - 10 - i} ${196 - i * 7} ${fy - 24 - i * 2}`}
                  stroke="#5C3D22"
                  strokeWidth={2 + i * 0.6}
                  fill="none"
                />
              ))}

              <Path d="M170 280 L196 182 Q100 172 0 180 L0 280 Z" fill="#5DBB4F" />

              <G>
                <Line x1="0" y1="168" x2="198" y2="168" stroke="#CA8A04" strokeWidth="2.4" />
                <Line x1="0" y1="167.2" x2="198" y2="167.2" stroke="#FEF08A" strokeWidth="0.8" opacity="0.6" />
                <Line x1="0" y1="174" x2="198" y2="174" stroke="#B45309" strokeWidth="2.4" />

                <Line x1="198" y1="168" x2="170" y2="280" stroke="#CA8A04" strokeWidth="2.4" />
                <Line x1="197.2" y1="167.2" x2="169.2" y2="279.2" stroke="#FEF08A" strokeWidth="0.8" opacity="0.6" />
                <Line x1="198" y1="174" x2="170" y2="286" stroke="#B45309" strokeWidth="2.4" />

                {[8, 32, 56, 80, 104, 128, 152, 175].map((px) => (
                  <G key={px}>
                    <Rect x={px - 2} y="162" width="4" height="17" rx="1" fill="#92400E" />
                    <Polygon points={`${px - 2},162 ${px},159 ${px + 2},162`} fill="#78350F" />
                    <Line x1={px - 1} y1="163" x2={px - 1} y2="178" stroke="#B45309" strokeWidth="0.8" opacity="0.8" />
                  </G>
                ))}

                {[
                  { x: 198, y: 168 },
                  { x: 191, y: 196 },
                  { x: 184, y: 224 },
                  { x: 177, y: 252 },
                  { x: 170, y: 280 },
                ].map((p, idx) => (
                  <G key={idx}>
                    <Rect x={p.x - 2} y={p.y - 7} width="4.5" height="18" rx="1" fill="#92400E" />
                    <Polygon points={`${p.x - 2},${p.y - 7} ${p.x + 0.25},${p.y - 10} ${p.x + 2.5},${p.y - 7}`} fill="#78350F" />
                    <Line x1={p.x - 1} y1={p.y - 6} x2={p.x - 1} y2={p.y + 10} stroke="#B45309" strokeWidth="0.8" opacity="0.8" />
                  </G>
                ))}
              </G>

              <G>
                {[
                  { x: 92, y: 216, h: 22 },
                  { x: 97, y: 211, h: 27 },
                  { x: 102, y: 215, h: 23 },
                  { x: 107, y: 220, h: 18 },
                ].map((reed, idx) => (
                  <G key={idx}>
                    <Line
                      x1={reed.x}
                      y1={reed.y + reed.h}
                      x2={reed.x}
                      y2={reed.y}
                      stroke="#15803D"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <Path
                      d={`M${reed.x} ${reed.y + reed.h - 4} Q${reed.x - 4} ${reed.y + 8} ${reed.x - 2} ${reed.y + 4}`}
                      stroke="#22C55E"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    <Rect
                      x={reed.x - 1.6}
                      y={reed.y + 2}
                      width="3.2"
                      height="8"
                      rx="1.6"
                      fill="#78350F"
                    />
                    <Line
                      x1={reed.x}
                      y1={reed.y + 2}
                      x2={reed.x}
                      y2={reed.y - 1}
                      stroke="#15803D"
                      strokeWidth="1"
                    />
                  </G>
                ))}
              </G>

              <Ellipse cx="56" cy="232" rx="50" ry="15" fill="url(#pond)" />
              <Ellipse cx="48" cy="228" rx="20" ry="3" fill="#E0F2FE" opacity="0.6" />

              <Line x1="205" y1="174" x2="204" y2="194" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
              <Line x1="223" y1="174" x2="224" y2="194" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
              <Line x1="205" y1="184" x2="223" y2="184" stroke="#64748B" strokeWidth="1.5" />
              <Path d="M214 174 Q218 202 212 230" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <Line x1="212" y1="230" x2="400" y2="230" stroke="#1E293B" strokeWidth="2.4" />
            </>
          )}
        </FullLayer>

        {isHome ? (
          <>
            <FullLayer style={{ opacity: across(wetness, 0, 0.55) }}>
              <Path d="M0 206 L196 186 L222 280 L0 280 Z" fill="#2B1A0E" />
              <Path d="M222 280 L196 186 Q300 176 400 184 L400 280 Z" fill="#1F5F2A" opacity="0.5" />
            </FullLayer>
            <Sprite
              x={224}
              y={184}
              w={200}
              h={72}
              style={{ opacity: wetness, transform: [{ scale: across(wetness, 0.8, 1.12) }] }}
            >
              <Ellipse cx="100" cy="36" rx="98" ry="33" fill="#38BDF8" opacity="0.6" />
            </Sprite>
            <Sprite x={40} y={244} w={60} h={12} style={{ opacity: wetness, transform: [{ scaleX: across(wetness, 0.3, 1) }] }}>
              <Ellipse cx="30" cy="6" rx="28" ry="5" fill="#7DD3FC" opacity="0.75" />
            </Sprite>
            <Sprite x={100} y={260} w={54} h={10} style={{ opacity: wetness, transform: [{ scaleX: across(wetness, 0.3, 1) }] }}>
              <Ellipse cx="27" cy="5" rx="25" ry="4" fill="#7DD3FC" opacity="0.7" />
            </Sprite>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: `${(278 / VB_W) * 100}%`,
                top: `${(116 / VB_H) * 100}%`,
                width: `${(22 / VB_W) * 100}%`,
                height: `${(40 / VB_H) * 100}%`,
                borderRadius: 5,
                overflow: 'hidden',
                backgroundColor: '#E2E8F0',
                borderWidth: 1.5,
                borderColor: '#94A3B8',
              }}
            >
              <Animated.View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: '#38BDF8',
                  transform: [
                    {
                      translateY: across(
                        wetness,
                        ((size.h * 40) / VB_H) * 0.55,
                        ((size.h * 40) / VB_H) * 0.06
                      ),
                    },
                  ],
                }}
              />
            </View>

            <Sprite x={68} y={48} w={40} h={40} style={{ transform: [{ rotate: rot(turbine) }] }}>
              <Blades />
            </Sprite>
            <Sprite x={112} y={72} w={28} h={28} style={{ transform: [{ rotate: rot(turbine, -360) }] }}>
              <G transform="scale(0.7)">
                <Blades />
              </G>
            </Sprite>
            <Sprite x={334} y={60} w={36} h={36} style={{ transform: [{ rotate: rot(turbine) }] }}>
              <G transform="scale(0.9)">
                <Blades />
              </G>
            </Sprite>

            <Sprite
              x={270}
              y={202}
              w={108}
              h={36}
              style={{ opacity: across(ripple, 0.8, 0), transform: [{ scale: across(ripple, 0.4, 1.3) }] }}
            >
              <Ellipse cx="54" cy="18" rx="50" ry="14" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
            </Sprite>
          </>
        ) : (
          <>
            <FullLayer style={{ opacity: across(wetness, 0, 0.55) }}>
              <Path d="M400 206 L196 182 L170 280 L400 280 Z" fill="#2B1A0E" />
              <Path d="M170 280 L196 182 Q100 172 0 180 L0 280 Z" fill="#1F5F2A" opacity="0.5" />
            </FullLayer>
            <Sprite
              x={4}
              y={216}
              w={104}
              h={32}
              style={{ opacity: wetness, transform: [{ scale: across(wetness, 0.8, 1.12) }] }}
            >
              <Ellipse cx="48" cy="16" rx="46" ry="14" fill="#38BDF8" opacity="0.6" />
            </Sprite>
            <Sprite x={300} y={250} w={60} h={12} style={{ opacity: wetness, transform: [{ scaleX: across(wetness, 0.3, 1) }] }}>
              <Ellipse cx="30" cy="6" rx="28" ry="5" fill="#7DD3FC" opacity="0.75" />
            </Sprite>
            <Sprite x={110} y={256} w={54} h={10} style={{ opacity: wetness, transform: [{ scaleX: across(wetness, 0.3, 1) }] }}>
              <Ellipse cx="27" cy="5" rx="25" ry="4" fill="#7DD3FC" opacity="0.7" />
            </Sprite>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: `${(203 / VB_W) * 100}%`,
                top: `${(134 / VB_H) * 100}%`,
                width: `${(22 / VB_W) * 100}%`,
                height: `${(40 / VB_H) * 100}%`,
                borderRadius: 5,
                overflow: 'hidden',
                backgroundColor: '#E2E8F0',
                borderWidth: 1.5,
                borderColor: '#94A3B8',
              }}
            >
              <Animated.View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: '#38BDF8',
                  transform: [
                    {
                      translateY: across(
                        wetness,
                        ((size.h * 40) / VB_H) * 0.55,
                        ((size.h * 40) / VB_H) * 0.06
                      ),
                    },
                  ],
                }}
              />
            </View>

            <Sprite x={148} y={50} w={40} h={40} style={{ transform: [{ rotate: rot(turbine) }] }}>
              <Blades />
            </Sprite>
            <Sprite x={354} y={62} w={36} h={36} style={{ transform: [{ rotate: rot(turbine) }] }}>
              <G transform="scale(0.9)">
                <Blades />
              </G>
            </Sprite>

            <Sprite
              x={30}
              y={224}
              w={52}
              h={16}
              style={{ opacity: across(ripple, 0.8, 0), transform: [{ scale: across(ripple, 0.4, 1.3) }] }}
            >
              <Ellipse cx="26" cy="8" rx="24" ry="6" stroke="#FFFFFF" strokeWidth="1.4" fill="none" />
            </Sprite>
          </>
        )}

        {(isHome
          ? [
              { x: 236, y: 146, walk: 18, graze: cowGraze, dark: true },
              { x: 292, y: 152, walk: -14, graze: cowGraze2, dark: false },
            ]
          : [
              { x: 20, y: 176, walk: 14, graze: cowGraze, dark: true },
              { x: 96, y: 182, walk: -12, graze: cowGraze2, dark: false },
            ]
        ).map((c, i) => (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: `${(c.x / VB_W) * 100}%`,
              top: `${(c.y / VB_H) * 100}%`,
              width: `${(34 / VB_W) * 100}%`,
              height: `${(24 / VB_H) * 100}%`,
              transform: [{ translateX: across(cowWalk, 0, c.walk) }],
            }}
          >
            <Svg width="100%" height="100%" viewBox="0 0 34 24">
              <Line x1="5" y1="15" x2="5" y2="23" stroke="#1E293B" strokeWidth="2" />
              <Line x1="10" y1="15" x2="10" y2="23" stroke="#1E293B" strokeWidth="2" />
              <Line x1="19" y1="15" x2="19" y2="23" stroke="#1E293B" strokeWidth="2" />
              <Line x1="24" y1="15" x2="24" y2="23" stroke="#1E293B" strokeWidth="2" />
              <Rect x="2" y="5" width="25" height="12" rx="5" fill="#FFFFFF" />
              <Ellipse cx="9" cy="9" rx="4" ry="3" fill={c.dark ? '#1E293B' : '#92400E'} />
              <Ellipse cx="19" cy="12" rx="3" ry="2.4" fill={c.dark ? '#1E293B' : '#92400E'} />
              <Path d="M2 8 Q-1 12 1 15" stroke="#1E293B" strokeWidth="1.2" fill="none" />
            </Svg>
            <Animated.View
              style={{
                position: 'absolute',
                right: '-4%',
                top: '10%',
                width: '34%',
                height: '60%',
                transform: [{ rotate: swing(c.graze, 14) }, { translateY: across(c.graze, -1, 3) }],
              }}
            >
              <Svg width="100%" height="100%" viewBox="0 0 12 14">
                <Rect x="1" y="3" width="10" height="9" rx="3" fill="#FFFFFF" />
                <Rect x="2" y="9" width="8" height="4" rx="2" fill="#FBCFE8" />
                <Circle cx="4" cy="6" r="1" fill="#1E293B" />
                <Circle cx="8" cy="6" r="1" fill="#1E293B" />
                <Path d="M2 3 L0 0 M10 3 L12 0" stroke="#E5E7EB" strokeWidth="1.4" />
              </Svg>
            </Animated.View>
          </Animated.View>
        ))}

        {[
          [18, 196, 0],
          [58, 192, 1],
          [96, 188, 0],
          [140, 184, 1],
          [30, 214, 1],
          [76, 208, 0],
          [124, 204, 1],
          [168, 198, 0],
          [46, 236, 0],
          [100, 228, 1],
          [150, 222, 0],
        ].map(([cx, cy, alt], i) => (
          <Sprite
            key={i}
            x={isHome ? cx : 380 - cx}
            y={cy - 14}
            w={20}
            h={30}
            style={{ transform: [{ rotate: swing(alt ? swayAlt : sway, swayAmp) }] }}
          >
            <Crop ripe={i % 3 === 0} />
          </Sprite>
        ))}

        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: sprinklerOn }]}>
          {isHome ? (
            <Sprite
              x={84}
              y={168}
              w={72}
              h={36}
              style={{ opacity: across(spray, 0.35, 1), transform: [{ scaleX: across(spray, 0.85, 1.1) }] }}
            >
              <G stroke="#93C5FD" strokeWidth="1.6" strokeDasharray="2 3" fill="none" strokeLinecap="round">
                <Path d="M36 34 Q20 6 4 30" />
                <Path d="M36 34 Q52 6 68 30" />
                <Path d="M36 34 Q28 0 14 22" />
                <Path d="M36 34 Q44 0 58 22" />
              </G>
              <Circle cx="36" cy="34" r="2.4" fill="#475569" />
            </Sprite>
          ) : (
            [236, 316].map((sx, i) => (
              <Sprite
                key={i}
                x={sx}
                y={210}
                w={64}
                h={34}
                style={{ opacity: across(spray, 0.4, 1), transform: [{ scaleX: across(spray, 0.85, 1.1) }] }}
              >
                <G stroke="#BAE6FD" strokeWidth="1.6" strokeDasharray="2 3" fill="none" strokeLinecap="round">
                  <Path d="M32 32 Q18 6 4 28" />
                  <Path d="M32 32 Q46 6 60 28" />
                  <Path d="M32 32 Q24 0 12 20" />
                  <Path d="M32 32 Q40 0 52 20" />
                </G>
                <Circle cx="32" cy="32" r="2.2" fill="#475569" />
              </Sprite>
            ))
          )}
        </Animated.View>

        {isHome && (
          <>
            <Sprite
              x={318}
              y={168}
              w={72}
              h={112}
              style={{ transform: [{ translateY: across(farmerBreath, 0, -2) }] }}
            >
              <Path d="M14 40 Q36 30 60 40 L66 112 L8 112 Z" fill="#EA580C" />
              <Path d="M26 40 L36 60 L46 40" fill="#FDBA74" />
              <Circle cx="36" cy="26" r="12" fill="#F2B98A" />
              <Circle cx="32" cy="25" r="1.3" fill="#1E293B" />
              <Circle cx="40" cy="25" r="1.3" fill="#1E293B" />
              <Path d="M32 31 Q36 34 40 31" stroke="#7C2D12" strokeWidth="1.2" fill="none" />
              <Ellipse cx="36" cy="16" rx="30" ry="6" fill="#D97706" />
              <Path d="M20 16 Q36 -2 52 16 Z" fill="#F59E0B" />
              <Rect x="22" y="14" width="28" height="3" fill="#92400E" />
              <G transform="rotate(-10 18 74)">
                <Rect x="4" y="58" width="26" height="34" rx="4" fill="#0F172A" />
                <Rect x="7" y="61" width="20" height="28" rx="2" fill="#38BDF8" />
              </G>
            </Sprite>
            <Sprite x={322} y={226} w={24} h={30} style={{ opacity: across(tabletGlow, 0.15, 0.55) }}>
              <Rect x="2" y="2" width="20" height="26" rx="3" fill="#E0F2FE" transform="rotate(-10 12 15)" />
            </Sprite>
          </>
        )}


        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { opacity: windVis, transform: [{ translateX: across(windStreak, -size.w * 0.5, size.w * 0.5) }] },
          ]}
        >
          <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
            <G stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.85">
              <Path d="M40 70 Q90 62 140 70 Q160 74 150 82" />
              <Path d="M200 50 L300 50" />
              <Path d="M120 110 Q170 102 230 110" />
              <Path d="M260 95 L350 95 Q366 95 360 106" />
              <Path d="M30 150 L120 150" />
            </G>
          </Svg>
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: '#0F172A', opacity: shade }]}
        />
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: rainVis, overflow: 'hidden' }]}>
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: -size.h,
              height: size.h * 2,
              transform: [{ translateY: across(rainA, 0, size.h) }],
            }}
          >
            <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H * 2}`} preserveAspectRatio="none">
              {renderRain(0, 0.9)}
            </Svg>
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: -size.h,
              height: size.h * 2,
              transform: [{ translateY: across(rainB, 0, size.h) }],
            }}
          >
            <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H * 2}`} preserveAspectRatio="none">
              {renderRain(137, 0.55)}
            </Svg>
          </Animated.View>
        </Animated.View>

        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: rainVis }]}>
          {[
            [30, 250, 0],
            [80, 236, 1],
            [140, 226, 0],
            [180, 252, 1],
            [262, 212, 0],
            [312, 202, 1],
            [372, 216, 0],
            [236, 246, 1],
          ].map(([sx, sy, alt], i) => {
            const v = alt ? splashB : splashA;
            return (
              <Sprite
                key={i}
                x={sx}
                y={sy}
                w={16}
                h={8}
                style={{
                  opacity: v.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] }),
                  transform: [{ scale: across(v, 0.3, 1.5) }],
                }}
              >
                <Ellipse cx="8" cy="4" rx="7" ry="3" stroke="#E0F2FE" strokeWidth="1.3" fill="none" />
              </Sprite>
            );
          })}
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF', opacity: flash }]}
        />

        {!isHome && (
          <View style={styles.weatherOverlay} pointerEvents="box-none">
            <View style={styles.tempGroup} pointerEvents="none">
              <View style={styles.tempRow}>
                <Text style={[styles.bigTemp, mode === 'night' && styles.bigTempLight]}>
                  {temp}
                </Text>
                <Text style={[styles.tempUnit, mode === 'night' && styles.tempUnitLight]}>
                  °C
                </Text>
              </View>
              <Text style={[styles.conditionText, mode === 'night' && styles.conditionTextLight]}>
                {language === 'en' ? meta.labelEn : meta.labelPt}
              </Text>
            </View>

            <View style={[styles.modeCapsule, mode === 'night' && styles.modeCapsuleDark]}>
              {(['sunny', 'cloudy', 'windy', 'rain', 'rainbow'] as WeatherMode[]).map((m) => {
                const active = mode === m;
                return (
                  <TouchableOpacity
                    key={m}
                    style={[styles.capsuleBtn, active && styles.capsuleBtnActive]}
                    onPress={() => selectMode(m)}
                    activeOpacity={0.7}
                    accessibilityLabel={`Clima: ${MODE_LABEL[m].pt}`}
                  >
                    {m === 'rainbow' ? (
                      <Svg width={18} height={18} viewBox="0 0 24 24">
                        <Path
                          d="M4 18 A8 8 0 0 1 20 18"
                          stroke={active ? '#FFFFFF' : '#64748B'}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <Path
                          d="M7 18 A5 5 0 0 1 17 18"
                          stroke={active ? '#FFFFFF' : '#64748B'}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </Svg>
                    ) : (
                      <MaterialCommunityIcons
                        name={
                          m === 'sunny'
                            ? 'white-balance-sunny'
                            : m === 'cloudy'
                            ? 'weather-cloudy'
                            : m === 'windy'
                            ? 'weather-windy'
                            : 'weather-pouring'
                        }
                        size={active ? 18 : 17}
                        color={active ? '#FFFFFF' : '#64748B'}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {isHome && (
          <View style={[styles.tempBadge, isDark && styles.tempBadgeDark]}>
            <MaterialCommunityIcons name={meta.icon} size={14} color={isDark ? '#F1F5F9' : '#0F172A'} />
            <Text style={[styles.tempBadgeText, isDark && styles.tempBadgeTextDark]}>
              {temp}°C · {language === 'en' ? meta.labelEn : meta.labelPt}
            </Text>
          </View>
        )}
      </View>

      {isHome && (onHealthCardPress || onWeatherCardPress) && (
        <View style={styles.cardsRow}>
          {onHealthCardPress && (
            <TouchableOpacity
              style={[styles.card, isDark && styles.cardDark]}
              onPress={onHealthCardPress}
              activeOpacity={0.88}
            >
              <View style={styles.gauge}>
                <Svg width="48" height="48" viewBox="0 0 48 48">
                  <Circle cx="24" cy="24" r="19" stroke={isDark ? '#263C31' : '#E2E8F0'} strokeWidth="4.5" fill="none" />
                  <Circle
                    cx="24"
                    cy="24"
                    r="19"
                    stroke="#10B981"
                    strokeWidth="4.5"
                    fill="none"
                    strokeDasharray="119.4"
                    strokeDashoffset={119.4 * (1 - farmHealthPercentage / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 24 24)"
                  />
                </Svg>
                <Text style={[styles.gaugeText, isDark && styles.gaugeTextDark]}>{farmHealthPercentage}%</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardLabel, isDark && styles.cardLabelDark]}>{t('farmHealth')}</Text>
                <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>{t('healthy')}</Text>
                <View style={styles.okRow}>
                  <View style={styles.okDot} />
                  <Text style={styles.okText}>{t('allGood')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {onWeatherCardPress && (
            <TouchableOpacity
              style={[styles.card, isDark && styles.cardDark]}
              onPress={onWeatherCardPress}
              activeOpacity={0.88}
            >
              <View style={[styles.weatherIcon, isDark && styles.weatherIconDark]}>
                <MaterialCommunityIcons
                  name={meta.icon}
                  size={26}
                  color={mode === 'night' ? '#A78BFA' : mode === 'sunny' || mode === 'windy' ? '#F59E0B' : '#0284C7'}
                />
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.weatherTemp, isDark && styles.weatherTempDark]}>{temp}°C</Text>
                <Text style={[styles.weatherLabel, isDark && styles.weatherLabelDark]}>
                  {language === 'en' ? meta.labelEn : meta.labelPt}
                </Text>
                <Text style={[styles.weatherMeta, isDark && styles.weatherMetaDark]}>
                  💧 {humidity !== undefined ? `${humidity}%` : meta.hum} · 🌧️ {rainProbability !== undefined ? `${rainProbability}%` : meta.rain}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

