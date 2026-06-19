-- Supabase Database Schema

-- Create the ai_brand_recommendations table
CREATE TABLE IF NOT EXISTS public.ai_brand_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    query_prompt TEXT NOT NULL,
    brand_recommended TEXT NOT NULL,
    rank_position INTEGER NOT NULL,
    model_used TEXT NOT NULL
);

-- Add an index on the brand_recommended for faster aggregation
CREATE INDEX IF NOT EXISTS idx_brand_recommended ON public.ai_brand_recommendations(brand_recommended);

-- Add an index on timestamp for sorting recent queries efficiently
CREATE INDEX IF NOT EXISTS idx_timestamp ON public.ai_brand_recommendations(timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ai_brand_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous reads and inserts (for PoC purposes)
CREATE POLICY "Allow anonymous select" ON public.ai_brand_recommendations FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON public.ai_brand_recommendations FOR INSERT WITH CHECK (true);
