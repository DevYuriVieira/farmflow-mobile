import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  backButton: {
    padding: 4,
    justifyContent: 'center',
  },
  topBarText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  captureBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 8,
  },
  captureBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  captureBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  captureBtnSecondaryText: {
    fontWeight: '600',
    fontSize: 14,
  },
  imagePreviewContainer: {
    position: 'relative',
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sampleLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  sampleScroll: {
    flexDirection: 'row',
  },
  samplePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  samplePillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  diagnosisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleColumn: {
    flex: 1,
    paddingRight: 8,
  },
  pestName: {
    fontSize: 18,
    fontWeight: '700',
  },
  scientificName: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 2,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  subHeading: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  symptomText: {
    fontSize: 12,
    flex: 1,
  },
  prescriptionBox: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginVertical: 12,
  },
  rxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  rxTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  rxIngredient: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  rxDosage: {
    fontSize: 12,
    marginBottom: 4,
  },
  rxNotes: {
    fontSize: 11,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
