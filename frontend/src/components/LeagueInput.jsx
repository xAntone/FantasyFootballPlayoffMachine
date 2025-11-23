import React, { useState } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';

const LeagueInput = ({ onSubmit, loading }) => {
    const [leagueId, setLeagueId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (leagueId.trim()) {
            onSubmit(leagueId.trim());
        }
    };

    return (
        <div className="w-full max-w-xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <form onSubmit={handleSubmit} className="relative flex items-center bg-[#0f172a] border border-white/10 rounded-2xl p-2 shadow-2xl">
                <div className="pl-4 text-slate-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    value={leagueId}
                    onChange={(e) => setLeagueId(e.target.value)}
                    placeholder="Enter NFL.com League ID..."
                    className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-lg py-3 px-4 w-full"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !leagueId.trim()}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px]"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                </button>
            </form>

            {/* Helper Text */}
            <div className="absolute -bottom-8 left-0 w-full text-center">
                <button
                    type="button"
                    onClick={() => setLeagueId('7495009')}
                    className="text-xs text-slate-500 hover:text-blue-400 transition-colors"
                >
                    Try demo league: <span className="font-mono">7495009</span>
                </button>
            </div>
        </div>
    );
};

export default LeagueInput;
