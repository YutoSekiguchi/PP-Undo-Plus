async function uploadJson(jsonData: string, folder: string, filename: string) {
  const response = await fetch('/api/upload/json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ json: jsonData, folder: folder, filename: filename }),
  });

  if (!response.ok) {
    throw new Error('JSON upload failed');
  }

  return await response.json();
}