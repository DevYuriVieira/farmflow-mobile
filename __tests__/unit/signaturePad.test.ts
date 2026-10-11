import { pointsToSvgPath, Point } from '../../src/utils/signature';

describe('SignaturePad Vector Generation & Digital Signing Module', () => {
  test('pointsToSvgPath returns empty string for empty points array', () => {
    expect(pointsToSvgPath([])).toBe('');
  });

  test('pointsToSvgPath correctly formats initial move command (M x y)', () => {
    const singlePoint: Point[] = [{ x: 12.34, y: 56.78 }];
    const path = pointsToSvgPath(singlePoint);
    expect(path).toBe('M 12.3 56.8');
  });

  test('pointsToSvgPath handles continuous draw gestures with line commands (L x y)', () => {
    const points: Point[] = [
      { x: 10, y: 15 },
      { x: 25.5, y: 30.2 },
      { x: 40.1, y: 60.9 },
    ];

    const d = pointsToSvgPath(points);
    expect(d).toBe('M 10.0 15.0 L 25.5 30.2 L 40.1 60.9');
    expect(d.startsWith('M 10.0 15.0')).toBe(true);
    expect(d.includes('L 25.5 30.2')).toBe(true);
  });
});
