import { StyleSheet, Platform } from 'react-native';
import { radii } from '../../theme';

export const styles = StyleSheet.create({
  dockWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99,
  },
  dockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xxl,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '92%',
    maxWidth: 440,
    borderWidth: 1,
    borderColor: '#E8ECE2',
    ...Platform.select({
      ios: {
        shadowColor: '#0F291E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
      default: {
        shadowColor: '#0F291E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
    }),
  },
  dockContainerDark: {
    backgroundColor: '#13211B',
    borderColor: '#23382E',
  },
  dockButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#E8F5E9',
  },
  iconWrapActiveDark: {
    backgroundColor: '#1E382B',
  },
  dockLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  dockLabelDark: {
    color: '#687E72',
  },
  dockLabelActive: {
    color: '#1B4D3E',
    fontWeight: '800',
  },
  dockLabelActiveDark: {
    color: '#4ADE80',
    fontWeight: '800',
  },
});
