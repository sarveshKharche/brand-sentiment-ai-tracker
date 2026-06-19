"use client";

import { useEffect, useState } from 'react';
import { Loader2, Search, Cpu } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function QueryLogTable() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/recent-queries')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
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

  if (logs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400">
        No recent queries found.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Live Query Feed</h3>
          <p className="text-sm text-zinc-400">Real-time AI recommendations based on simulated user search.</p>
        </div>
        <div className="bg-zinc-800/50 p-2 rounded-lg border border-zinc-700/50">
          <Cpu className="w-5 h-5 text-zinc-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-800/50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">Query Prompt</th>
              <th className="px-6 py-4 font-medium">Top 3 Recommended</th>
              <th className="px-6 py-4 font-medium text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {logs.map((log, i) => (
              <tr key={i} className="hover:bg-zinc-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <Search className="w-4 h-4 mt-0.5 text-zinc-500 flex-shrink-0" />
                    <span className="font-medium text-zinc-200">{log.query}</span>
                  </div>
                  <div className="mt-1 ml-7 text-xs text-zinc-500 font-mono">
                    Model: {log.model}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {log.brands.map((brand: string, idx: number) => (
                      <span 
                        key={idx} 
                        className={`px-2 py-1 rounded-md text-xs font-medium border ${
                          idx === 0 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                          idx === 1 ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                          'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        #{idx + 1} {brand}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap text-zinc-500 text-xs">
                  {log.timestamp ? formatDistanceToNow(new Date(log.timestamp), { addSuffix: true }) : 'Just now'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
