import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';

const StandingsTable = ({ teams }) => {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-16 text-center">Rank</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Team</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Record</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">PF</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center hidden sm:table-cell">Streak</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {teams.map((team, idx) => (
                            <tr
                                key={team.id}
                                className={clsx(
                                    "transition-colors hover:bg-white/5",
                                    idx < 6 ? "bg-blue-500/5" : "" // Highlight playoff spots subtly
                                )}
                            >
                                <td className="p-4 text-center">
                                    <span className={clsx(
                                        "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                                        idx === 0 ? "bg-yellow-500/20 text-yellow-400" :
                                            idx < 6 ? "bg-blue-500/20 text-blue-400" : "text-slate-500"
                                    )}>
                                        {idx + 1}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {team.logo_url ? (
                                            <img
                                                src={team.logo_url}
                                                alt={`${team.name} logo`}
                                                className="w-10 h-10 rounded-full object-cover bg-white/5 border border-white/10"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                {team.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="font-bold text-white text-sm">{team.name}</div>
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className="font-mono text-sm font-medium text-slate-200">
                                        {team.wins}-{team.losses}-{team.ties}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <span className="font-mono text-sm text-slate-400">{team.points_for.toFixed(1)}</span>
                                </td>
                                <td className="p-4 text-center hidden sm:table-cell">
                                    <div className="flex justify-center">
                                        {team.streak?.includes('W') ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                                                <TrendingUp size={12} /> {team.streak}
                                            </span>
                                        ) : team.streak?.includes('L') ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded-full">
                                                <TrendingDown size={12} /> {team.streak}
                                            </span>
                                        ) : (
                                            <span className="text-slate-600"><Minus size={12} /></span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StandingsTable;
