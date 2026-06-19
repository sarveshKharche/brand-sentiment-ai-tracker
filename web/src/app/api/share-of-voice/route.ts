import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // We want to count the occurrences of each brand in the top 3 spots.
    // In our simplified schema, every row is a recommendation. We can just group by brand_recommended.
    // Wait, since Supabase JS client doesn't support complex group by easily, we can fetch all or use RPC.
    // Since this is a PoC with low data volume, fetching all is fine. For scale, we'd use a Supabase RPC or view.
    
    // For now, let's just fetch everything and aggregate in code for simplicity, 
    // or use a Supabase RPC. Let's use a simple fetch and aggregate.
    
    const { data, error } = await supabase
      .from('ai_brand_recommendations')
      .select('brand_recommended');
      
    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const counts: Record<string, number> = {};
    let total = 0;
    
    // Aggregate data
    data?.forEach((row) => {
      const brand = row.brand_recommended;
      counts[brand] = (counts[brand] || 0) + 1;
      total++;
    });

    // Format for charting
    const chartData = Object.entries(counts)
      .map(([brand, count]) => ({
        name: brand,
        count: count,
        share: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count); // Sort descending

    return NextResponse.json(chartData);
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
