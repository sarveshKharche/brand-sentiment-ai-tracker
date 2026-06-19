"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

export default function TrendChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/share-of-voice')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-zinc-900 rounded-xl border border-zinc-800">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400">
        No data available yet. Run the scraper!
      </div>
    );
  }

  // Use a nice gradient-like color palette for the bars
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-2xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">AI Share of Voice</h3>
        <p className="text-sm text-zinc-400">Brand appearance frequency in top 3 AI recommendations.</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a1a1aa', fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="share" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
