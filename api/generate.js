// api/generate.js

export default async function handler(request, response) {
    // 1. Get query params from the frontend request
    const { model, text, ratio, style } = request.query;

    // 2. Get API Key from Vercel Environment Variables
    const API_KEY = process.env.PAXSENIX_API_KEY;

    if (!API_KEY) {
        return response.status(500).json({ ok: false, message: "Server API Key missing" });
    }

    // 3. Construct the External API URL
    const BASE_URL = "https://api.paxsenix.org/ai-image/";
    let externalUrl = `${BASE_URL}${model}?text=${encodeURIComponent(text)}`;
    
    if (model === 'midjourney' && ratio) externalUrl += `&ratio=${ratio}`;
    if (model === 'sdxl' && style) externalUrl += `&model=${style}`;

    try {
        // 4. Call the AI Provider
        const res = await fetch(externalUrl, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        const data = await res.json();

        // 5. Return result to Frontend
        return response.status(200).json(data);

    } catch (error) {
        return response.status(500).json({ ok: false, message: error.message });
    }
}
