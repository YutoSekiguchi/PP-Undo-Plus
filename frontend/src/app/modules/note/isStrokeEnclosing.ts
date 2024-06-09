interface Point {
  x: number;
  y: number;
  z: number;
}

export function getBoundingBox(points: Point[]) {
  let minX = points[0].x,
    maxX = points[0].x;
  let minY = points[0].y,
    maxY = points[0].y;
  points.forEach((point) => {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  });
  return { minX, maxX, minY, maxY };
}

export function calculateCenter(boundingBox: {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}) {
  const centerX = (boundingBox.minX + boundingBox.maxX) / 2;
  const centerY = (boundingBox.minY + boundingBox.maxY) / 2;
  return { centerX, centerY };
}

export function passesThroughCenter(
  points: Point[],
  centerX: number,
  centerY: number,
  threshold: number
) {
  return points.some(
    (point) =>
      Math.abs(point.x - centerX) < threshold &&
      Math.abs(point.y - centerY) < threshold
  );
}

export function calculateDensity(
  points: Point[],
  boundingBox: { minX: number; maxX: number; minY: number; maxY: number },
  gridSize: number
) {
  const width = boundingBox.maxX - boundingBox.minX;
  const height = boundingBox.maxY - boundingBox.minY;
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);

  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));

  points.forEach((point) => {
    const col = Math.floor((point.x - boundingBox.minX) / gridSize);
    const row = Math.floor((point.y - boundingBox.minY) / gridSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[row][col]++;
    }
  });

  return grid;
}

export function isSignificantDensity(
  densityGrid: number[][],
  densityThreshold: number,
  areaThreshold: number
) {
  let significantCells = 0;
  densityGrid.forEach((row) => {
    row.forEach((cell) => {
      if (cell > densityThreshold) significantCells++;
    });
  });
  return significantCells >= areaThreshold;
}

export function linesIntersect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
) {
  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denominator === 0) {
    return false;
  }
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}

export function countIntersections(points: Point[]) {
  let intersections = 0;
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 2; j < points.length - 1; j++) {
      if (
        linesIntersect(
          points[i].x,
          points[i].y,
          points[i + 1].x,
          points[i + 1].y,
          points[j].x,
          points[j].y,
          points[j + 1].x,
          points[j + 1].y
        )
      ) {
        intersections++;
      }
    }
  }
  return intersections;
}

export function isEnclosing(data: Point[], gridSize: number, densityThreshold: number, areaThreshold: number, intersectionThreshold: number, centerThreshold: number) {
  const boundingBox = getBoundingBox(data);
  const center = calculateCenter(boundingBox);
  const passesCenter = passesThroughCenter(data, center.centerX, center.centerY, centerThreshold);
  
  const densityGrid = calculateDensity(data, boundingBox, gridSize);
  const significantDensity = isSignificantDensity(densityGrid, densityThreshold, areaThreshold);
  
  const intersectionCount = countIntersections(data);
  
  return !passesCenter && significantDensity && intersectionCount >= intersectionThreshold;
}