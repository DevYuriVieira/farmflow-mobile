import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: '#07150E',
    zIndex: 0,
  },
  cloudWrapper: {
    position: 'absolute',
  },
  mistLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  foregroundSwayContainer: {
    position: 'absolute',
    left: -15,
    right: -15,
    transformOrigin: 'bottom center',
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(7, 21, 14, 0.45)',
  },
});
