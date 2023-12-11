async function uploadSvg(svgData: string, filename: string) {
  const response = await fetch('/api/upload/svg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ svg: svgData, filename: filename }),
  });

  if (!response.ok) {
    throw new Error('SVG upload failed');
  }

  return await response.json();
}

export default uploadSvg;