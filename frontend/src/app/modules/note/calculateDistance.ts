type Point = { x: number, y: number, z: number };


const calculateDistance = (baseX1: number, baseY1: number, points1: Point[], baseX2: number, baseY2: number, points2: Point[]): number => {
  let minDistance = Infinity;

  for (let point1 of points1) {
    const absolutePoint1 = { x: baseX1 + point1.x, y: baseY1 + point1.y };
    for (let point2 of points2) {
      const absolutePoint2 = { x: baseX2 + point2.x, y: baseY2 + point2.y };
      const distance = Math.sqrt((absolutePoint1.x - absolutePoint2.x) ** 2 + (absolutePoint1.y - absolutePoint2.y) ** 2);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }
  }

  return minDistance;
}


export default calculateDistance;