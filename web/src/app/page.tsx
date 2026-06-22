import TrendChart from '@/components/TrendChart';
import QueryLogTable from '@/components/QueryLogTable';
import { Activity } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-zinc-100 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="mb-12 border-b border-zinc-800 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">AI Share of Voice Tracker</h1>
          </div>
          <p className="text-zinc-400 max-w-2xl text-lg">
            Decoding AI search visibility. This dashboard tracks how LLMs rank sports apparel brands for specific buyer-intent queries (e.g. "2026 Knicks Championship gear").
          </p>
        </header>

        {/* Top Section: Chart */}
        <div className="grid grid-cols-1 mb-8">
          <TrendChart />
        </div>

        {/* Bottom Section: Live Feed */}
        <div className="grid grid-cols-1">
          <QueryLogTable />
        </div>

      </div>
    </main>
  );
}
