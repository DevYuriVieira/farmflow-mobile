import { Farm } from '../../types/farm.types';
import { Plantation } from '../../types/plantation.types';

export interface GeoJsonFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'Point';
    coordinates: number[][][] | number[];
  };
  properties: {
    id: string;
    type: 'farm' | 'plantation';
    name: string;
    farmName?: string;
    cropType?: string;
    areaHectares: number;
    status?: string;
    plantedAt?: string;
    expectedHarvestAt?: string;
  };
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

export function exportToGeoJson(farms: Farm[], plantations: Plantation[]): string {
  const features: GeoJsonFeature[] = [];

  farms.forEach((farm) => {
    const lat = farm.coordinates.latitude;
    const lon = farm.coordinates.longitude;
    const delta = Math.sqrt(farm.totalAreaHectares / 10000) * 0.009;

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [Number((lon - delta).toFixed(6)), Number((lat - delta).toFixed(6))],
            [Number((lon + delta).toFixed(6)), Number((lat - delta).toFixed(6))],
            [Number((lon + delta).toFixed(6)), Number((lat + delta).toFixed(6))],
            [Number((lon - delta).toFixed(6)), Number((lat + delta).toFixed(6))],
            [Number((lon - delta).toFixed(6)), Number((lat - delta).toFixed(6))],
          ],
        ],
      },
      properties: {
        id: farm.id,
        type: 'farm',
        name: farm.name,
        areaHectares: farm.totalAreaHectares,
      },
    });

    const farmPlantations = plantations.filter((p) => p.farmId === farm.id);
    farmPlantations.forEach((p, idx) => {
      const pDelta = Math.sqrt(p.areaHectares / 10000) * 0.007;
      const offsetLat = lat + (idx + 1) * 0.002;
      const offsetLon = lon + (idx + 1) * 0.002;

      features.push({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [Number((offsetLon - pDelta).toFixed(6)), Number((offsetLat - pDelta).toFixed(6))],
              [Number((offsetLon + pDelta).toFixed(6)), Number((offsetLat - pDelta).toFixed(6))],
              [Number((offsetLon + pDelta).toFixed(6)), Number((offsetLat + pDelta).toFixed(6))],
              [Number((offsetLon - pDelta).toFixed(6)), Number((offsetLat + pDelta).toFixed(6))],
              [Number((offsetLon - pDelta).toFixed(6)), Number((offsetLat - pDelta).toFixed(6))],
            ],
          ],
        },
        properties: {
          id: p.id,
          type: 'plantation',
          name: p.name,
          farmName: farm.name,
          cropType: p.cropType,
          areaHectares: p.areaHectares,
          status: p.status,
          plantedAt: p.plantedAt,
          expectedHarvestAt: p.expectedHarvestAt,
        },
      });
    });
  });

  const collection: GeoJsonFeatureCollection = {
    type: 'FeatureCollection',
    features,
  };

  return JSON.stringify(collection, null, 2);
}

export function exportToKml(farms: Farm[], plantations: Plantation[]): string {
  let placemarksXml = '';

  farms.forEach((farm) => {
    const lat = farm.coordinates.latitude;
    const lon = farm.coordinates.longitude;
    const delta = Math.sqrt(farm.totalAreaHectares / 10000) * 0.009;

    placemarksXml += `
    <Placemark>
      <name>${escapeXml(farm.name)} (Farm Boundary)</name>
      <description>Total Area: ${farm.totalAreaHectares} ha | Location: ${escapeXml(farm.location)}</description>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              ${lon - delta},${lat - delta},0
              ${lon + delta},${lat - delta},0
              ${lon + delta},${lat + delta},0
              ${lon - delta},${lat + delta},0
              ${lon - delta},${lat - delta},0
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>`;

    const farmPlantations = plantations.filter((p) => p.farmId === farm.id);
    farmPlantations.forEach((p, idx) => {
      const pDelta = Math.sqrt(p.areaHectares / 10000) * 0.007;
      const offsetLat = lat + (idx + 1) * 0.002;
      const offsetLon = lon + (idx + 1) * 0.002;

      placemarksXml += `
    <Placemark>
      <name>${escapeXml(p.name)} [${p.cropType}]</name>
      <description>Farm: ${escapeXml(farm.name)} | Area: ${p.areaHectares} ha | Status: ${p.status}</description>
      <ExtendedData>
        <Data name="cropType"><value>${p.cropType}</value></Data>
        <Data name="areaHectares"><value>${p.areaHectares}</value></Data>
        <Data name="status"><value>${p.status}</value></Data>
      </ExtendedData>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              ${offsetLon - pDelta},${offsetLat - pDelta},0
              ${offsetLon + pDelta},${offsetLat - pDelta},0
              ${offsetLon + pDelta},${offsetLat + pDelta},0
              ${offsetLon - pDelta},${offsetLat + pDelta},0
              ${offsetLon - pDelta},${offsetLat - pDelta},0
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>`;
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>FarmFlow Precision Agriculture Export</name>
    ${placemarksXml}
  </Document>
</kml>`.trim();
}

export function exportToCsv(farms: Farm[], plantations: Plantation[]): string {
  const headers = [
    'Farm_ID',
    'Farm_Name',
    'Location',
    'Field_ID',
    'Field_Name',
    'Crop_Type',
    'Area_Hectares',
    'Status',
    'Planted_At',
    'Expected_Harvest_At',
  ];

  const rows: string[] = [headers.join(',')];
  const farmMap = new Map<string, Farm>(farms.map((f) => [f.id, f]));

  plantations.forEach((p) => {
    const farm = farmMap.get(p.farmId);
    const row = [
      escapeCsv(farm?.id || ''),
      escapeCsv(farm?.name || ''),
      escapeCsv(farm?.location || ''),
      escapeCsv(p.id),
      escapeCsv(p.name),
      escapeCsv(p.cropType),
      p.areaHectares.toString(),
      escapeCsv(p.status),
      escapeCsv(p.plantedAt),
      escapeCsv(p.expectedHarvestAt),
    ];
    rows.push(row.join(','));
  });

  return rows.join('\n');
}

export async function triggerAgroFileDownload(
  filename: string,
  content: string,
  mimeType: string
): Promise<boolean> {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  }

  try {
    const Sharing = await import('expo-sharing');
    if (await Sharing.isAvailableAsync()) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeCsv(cell: string): string {
  if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
}
