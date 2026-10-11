export interface Point {
  x: number;
  y: number;
}

export function pointsToSvgPath(points: Point[]): string {
  if (points.length === 0) return '';
  return points.reduce((acc, point, index) => {
    if (index === 0) {
      return `M ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
    }
    return `${acc} L ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }, '');
}
