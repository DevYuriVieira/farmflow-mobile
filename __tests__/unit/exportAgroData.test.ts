import {
  exportToGeoJson,
  exportToKml,
  exportToCsv,
} from '../../src/services/export/exportAgroData.service';
import { Farm } from '../../src/types/farm.types';
import { Plantation } from '../../src/types/plantation.types';

describe('Precision Agriculture Export Service (GeoJSON, KML & CSV)', () => {
  const mockFarms: Farm[] = [
    {
      id: 'farm-01',
      name: 'Fazenda Santa Maria',
      location: 'Ribeirão Preto, SP',
      totalAreaHectares: 850,
      coordinates: { latitude: -21.1767, longitude: -47.8208 },
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ];

  const mockPlantations: Plantation[] = [
    {
      id: 'plt-01',
      farmId: 'farm-01',
      name: 'Talhão 01 - Soja RR',
      cropType: 'SOY',
      areaHectares: 250,
      status: 'GROWING',
      plantedAt: '2026-09-15',
      expectedHarvestAt: '2027-02-10',
      createdAt: '2026-09-15T00:00:00.000Z',
      updatedAt: '2026-09-15T00:00:00.000Z',
    },
    {
      id: 'plt-02',
      farmId: 'farm-01',
      name: 'Talhão 02 - Milho Safrinha',
      cropType: 'CORN',
      areaHectares: 300,
      status: 'SOWING',
      plantedAt: '2026-10-01',
      expectedHarvestAt: '2027-03-20',
      createdAt: '2026-10-01T00:00:00.000Z',
      updatedAt: '2026-10-01T00:00:00.000Z',
    },
  ];

  test('generates valid GeoJSON FeatureCollection with polygon boundaries', () => {
    const rawJson = exportToGeoJson(mockFarms, mockPlantations);
    const parsed = JSON.parse(rawJson);

    expect(parsed.type).toBe('FeatureCollection');
    expect(parsed.features.length).toBe(3); // 1 farm boundary + 2 field boundaries

    const farmFeature = parsed.features[0];
    expect(farmFeature.properties.name).toBe('Fazenda Santa Maria');
    expect(farmFeature.geometry.type).toBe('Polygon');
    expect(farmFeature.geometry.coordinates[0].length).toBe(5);

    const plantationFeature = parsed.features[1];
    expect(plantationFeature.properties.cropType).toBe('SOY');
    expect(plantationFeature.properties.areaHectares).toBe(250);
  });

  test('generates valid KML with Placemark XML nodes for tractor GPS guidance', () => {
    const kml = exportToKml(mockFarms, mockPlantations);

    expect(kml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(kml).toContain('<kml xmlns="http://www.opengis.net/kml/2.2">');
    expect(kml).toContain('<name>Fazenda Santa Maria (Farm Boundary)</name>');
    expect(kml).toContain('<name>Talhão 01 - Soja RR [SOY]</name>');
    expect(kml).toContain('<Polygon>');
    expect(kml).toContain('<coordinates>');
  });

  test('generates structured CSV with headers and escaped values', () => {
    const csv = exportToCsv(mockFarms, mockPlantations);
    const lines = csv.split('\n');

    expect(lines.length).toBe(3); // 1 header + 2 plantation rows
    expect(lines[0]).toBe(
      'Farm_ID,Farm_Name,Location,Field_ID,Field_Name,Crop_Type,Area_Hectares,Status,Planted_At,Expected_Harvest_At'
    );
    expect(lines[1]).toContain('Fazenda Santa Maria');
    expect(lines[1]).toContain('"Ribeirão Preto, SP"'); // Quoted because of the comma
    expect(lines[1]).toContain('SOY,250,GROWING');
  });
});
