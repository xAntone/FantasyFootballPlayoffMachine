import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Calculator, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const OddsChart = ({ odds, onTeamClick, loadingTeamId }) => {
    console.log("OddsChart rendered, onTeamClick:", !!onTeamClick);
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
        >
            {/* Chart Container */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={odds} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis
                                type="category"
                                dataKey="team_name"
                                width={100}
                                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value, name, props) => {
                                    const scenarios = props.payload.scenarios;
                                    const scenarioText = scenarios && scenarios.length > 0 ? scenarios[0] : '';
                                    return [<div key="1"><span className="font-bold text-lg">{value}%</span><div className="text-xs text-slate-400 mt-1">{scenarioText}</div></div>, ''];
                                }}
                                labelStyle={{ display: 'none' }}
                            />
                            <Bar dataKey="playoff_probability" radius={[0, 4, 4, 0]} barSize={20} onClick={(data) => onTeamClick && onTeamClick(data)} cursor="pointer">
                                {odds.map((entry, index) => (
                                    <Cell
                                        key={`cell - ${index} `}
                                        fill={
                                            entry.playoff_probability === 100 ? '#10b981' : // Emerald 500
                                                entry.playoff_probability === 0 ? '#ef4444' :   // Red 500
                                                    entry.playoff_probability > 50 ? '#3b82f6' :    // Blue 500
                                                        '#64748b'                                       // Slate 500
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Playoff Picture List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
                    <Calculator size={18} className="text-blue-400" />
                    <h3 className="font-bold text-white">Detailed Playoff Picture</h3>
                </div>
                <div className="divide-y divide-white/5">
                    {odds.map((team) => (
                        <div
                            key={team.team_id}
                            onClick={() => {
                                console.log("Team clicked:", team.team_name);
                                if (onTeamClick) onTeamClick(team);
                            }}
                            className="flex items-center justify-between p-4 hover:bg-white/5 cursor-pointer transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={clsx(
                                    "w-1 h-8 rounded-full",
                                    team.playoff_probability === 100 ? "bg-emerald-500" :
                                        team.playoff_probability === 0 ? "bg-red-500" :
                                            team.playoff_probability > 50 ? "bg-blue-500" : "bg-slate-600"
                                )}></div>
                                <div>
                                    <div className="text-white font-medium group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                        {team.team_name}
                                        {loadingTeamId === team.team_id && (
                                            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {team.scenarios && team.scenarios[0]}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={clsx(
                                    "text-sm font-bold font-mono",
                                    team.playoff_probability === 100 ? "text-emerald-400" :
                                        team.playoff_probability === 0 ? "text-red-400" :
                                            team.playoff_probability > 50 ? "text-blue-400" : "text-slate-400"
                                )}>
                                    {team.playoff_probability}%
                                </span>
                                <ChevronRight size={16} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default OddsChart;
