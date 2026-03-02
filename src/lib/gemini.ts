export interface ItemAnalysis {
  title: string;
  category: string;
  condition: string;
  size: string;
  description: string;
}

export async function analyzeItemPhoto(imageDataUrl: string): Promise<ItemAnalysis> {
  try {
    // Call your backend server instead of Claude API directly
    const response = await fetch('http://localhost:3001/api/analyze-photo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageDataUrl
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error:', errorData);
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('Analysis result:', data);

    return data;
  } catch (error) {
    console.error('Error analyzing photo:', error);
    throw new Error('Failed to analyze photo');
  }
}