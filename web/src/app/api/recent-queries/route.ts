import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch the 10 most recent recommendations
    const { data, error } = await supabase
      .from('ai_brand_recommendations')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(30); // Grab 30 rows since one query usually yields 3 records (top 3 brands)
      
    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Group by query_prompt and timestamp (roughly) to present logically
    // To keep it simple for the frontend, we can just return the raw rows and let the frontend group them,
    // or group them here. Let's group them by the exact timestamp and query.
    
    const groupedQueries: Record<string, any> = {};
    
    data?.forEach((row) => {
      // Create a unique key for the query event
      const key = `${row.query_prompt}_${row.timestamp}`;
      if (!groupedQueries[key]) {
        groupedQueries[key] = {
          timestamp: row.timestamp,
          query: row.query_prompt,
          model: row.model_used,
          brands: []
        };
      }
      // Insert in correct rank order
      groupedQueries[key].brands[row.rank_position - 1] = row.brand_recommended;
    });

    const formattedData = Object.values(groupedQueries)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10); // Keep only the latest 10 unique queries

    return NextResponse.json(formattedData);
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
