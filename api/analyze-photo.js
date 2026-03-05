export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageDataUrl } = req.body;

    if (!imageDataUrl) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Claude API key not configured' });
    }

    const base64Data = imageDataUrl.split(',')[1];
    const mimeType = imageDataUrl.split(';')[0].split(':')[1];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Data
              }
            },
            {
              type: 'text',
              text: `You are helping someone create a Facebook Marketplace or Kijiji listing. Analyze this item photo and provide:

Title: (Simple, searchable name - what someone would search for. Max 6 words. Include key detail like size or capacity if relevant. Example: "Dining Table Seats 6" not "Contemporary Furniture")

Category: (Choose ONE: Furniture, Electronics, Clothing, Appliances, Other)

Condition: (Choose ONE based on visible wear: Like New, Good, Fair, Poor)

Size: (Estimate dimensions. For furniture: length x width (e.g., "6ft x 3ft"). For clothing: S/M/L/XL. For electronics: screen size. For other items: approximate measurements. If you can't tell, write "Unknown")

Description: (Write 2-3 casual sentences like a real person selling on Facebook Marketplace. Include:
- Why you might be selling (moving, upgrading, downsizing, kid outgrew it, etc.)
- Key benefit (seats X people, perfect for small spaces, great condition, etc.)
- Any relevant details (barely used, works perfectly, minor wear, etc.)
Keep it friendly, honest, and under 40 words. Sound like a neighbor, not a store.)

Format exactly like this:
Title: [item name]
Category: [category]
Condition: [condition]
Size: [size estimate]
Description: [description]`
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', errorText);
      return res.status(response.status).json({ error: `Claude API error: ${response.status}` });
    }

    const data = await response.json();
    const text = data.content[0].text;

    const lines = text.split('\n').filter(line => line.trim());
    const parsed = {
      title: '',
      category: 'Other',
      condition: 'Good',
      size: 'Unknown',
      description: ''
    };

    lines.forEach(line => {
      if (line.startsWith('Title:')) {
        parsed.title = line.replace('Title:', '').trim();
      } else if (line.startsWith('Category:')) {
        parsed.category = line.replace('Category:', '').trim();
      } else if (line.startsWith('Condition:')) {
        parsed.condition = line.replace('Condition:', '').trim();
      } else if (line.startsWith('Size:')) {
        parsed.size = line.replace('Size:', '').trim();
      } else if (line.startsWith('Description:')) {
        parsed.description = line.replace('Description:', '').trim();
      }
    });

    return res.json(parsed);
  } catch (error) {
    console.error('Error analyzing photo:', error);
    return res.status(500).json({ error: 'Failed to analyze photo' });
  }
}