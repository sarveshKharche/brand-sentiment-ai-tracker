import os
import json
import random
from datetime import datetime, timezone
from dotenv import load_dotenv
from google import genai
from google.genai import types
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not set in environment.")
    gemini_client = None
else:
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)

# Configure Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: SUPABASE_URL or SUPABASE_KEY not set in environment.")
    # Initialize with dummy values for now if not set
    supabase: Client = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# List of simulated user queries
QUERIES = [
    "Where can I buy official Jalen Brunson 2026 MVP jerseys?",
    "Best quality Knicks 2026 NBA Champions hats",
    "Who sells the most authentic 2026 Knicks championship gear?",
    "I want to pre-order a Knicks 2026 champions hoodie, which brand is best?",
    "Top rated sports apparel for the New York Knicks championship run",
    "Where are the official Knicks locker room championship shirts sold?"
]

# The prompt instructions to force a JSON response
SYSTEM_INSTRUCTION = """
You are an AI that helps users find sports merchandise. 
Based on the user's query, recommend exactly 3 sports apparel brands (e.g., Nike, Fanatics, Mitchell & Ness, Adidas, Under Armour, New Era, etc.).
You MUST output ONLY valid JSON in the following format:
{
  "recommendations": [
    "Brand Name 1",
    "Brand Name 2",
    "Brand Name 3"
  ]
}
Do not include markdown blocks or any other text.
"""

def generate_recommendations(query: str):
    """Hits the Gemini API to get brand recommendations."""
    if not GEMINI_API_KEY:
        print("Mocking Gemini response...")
        # Mock response for testing without API key
        brands = ["Nike", "Fanatics", "Mitchell & Ness", "New Era", "Adidas"]
        return {
            "recommendations": random.sample(brands, 3)
        }

    try:
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=f"User Query: {query}",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
            )
        )
        data = json.loads(response.text)
        return data
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return None

def main():
    print(f"[{datetime.now(timezone.utc).isoformat()}] Starting AI Scraper Pipeline...")
    
    # Randomly select a query
    query = random.choice(QUERIES)
    print(f"Selected Query: '{query}'")
    
    # Get recommendations from Gemini
    result = generate_recommendations(query)
    
    if not result or "recommendations" not in result:
        print("Failed to get valid recommendations.")
        return
        
    brands = result["recommendations"]
    print(f"AI Recommended Brands: {brands}")
    
    # Prepare data for Supabase
    records = []
    for i, brand in enumerate(brands):
        rank = i + 1
        record = {
            "query_prompt": query,
            "brand_recommended": brand,
            "rank_position": rank,
            "model_used": "gemini-2.5-flash"
        }
        records.append(record)
        
    # Insert into Supabase
    if supabase:
        try:
            # We don't provide timestamp or id, let Supabase handle defaults
            response = supabase.table("ai_brand_recommendations").insert(records).execute()
            print(f"Successfully inserted {len(response.data)} records into Supabase.")
        except Exception as e:
            print(f"Error inserting into Supabase: {e}")
    else:
        print("Supabase client not configured. Skipping database insertion.")
        print(f"Records that would have been inserted: {json.dumps(records, indent=2)}")

if __name__ == "__main__":
    main()
