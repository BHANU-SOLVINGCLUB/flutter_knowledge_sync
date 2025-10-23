"""Optional summarization helpers using Google Gemini."""
import os, logging
import requests
import json

LOG = logging.getLogger(__name__)
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyBrIL4wjKOD11AZFlP_Rz3QwwjvVqTzvio')

def summarize_text(text: str, max_tokens: int = 200) -> str:
    if not GEMINI_API_KEY:
        LOG.debug('Gemini API key not configured; returning truncated text.')
        return text[:1000]
    
    try:
        # Truncate text if too long for API
        if len(text) > 30000:  # Gemini has token limits
            text = text[:30000] + "..."
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": f"Summarize the following Flutter/development content in developer-friendly bullet points (max {max_tokens} words):\n\n{text}"
                }]
            }],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": max_tokens * 2,  # Convert words to approximate tokens
                "topP": 0.8,
                "topK": 10
            }
        }
        
        headers = {
            'Content-Type': 'application/json',
        }
        
        response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=30)
        response.raise_for_status()
        
        result = response.json()
        if 'candidates' in result and len(result['candidates']) > 0:
            summary = result['candidates'][0]['content']['parts'][0]['text']
            return summary.strip()
        else:
            LOG.warning('Unexpected Gemini API response format')
            return text[:1000]
            
    except Exception as e:
        LOG.exception('Gemini summarization failed: %s', e)
        return text[:1000]
