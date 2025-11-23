
import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, HelpCircle, TrendingUp, Activity } from 'lucide-react';
import clsx from 'clsx';

const ScenarioModal = ({ isOpen, onClose, team, scenarios, loading }) => {
    console.log("ScenarioModal rendering, isOpen:", isOpen);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col relative"
            >
                {/* Background Glow */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-start relative z-10">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">{team?.team_name}</h2>
                        <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                            <Activity size={14} className="text-blue-400" />
                            <span>Playoff Path Analysis</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 relative z-10 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-full blur-md animate-pulse"></div>
                                </div>
                            </div>
                            <p className="text-slate-400 font-medium animate-pulse">Crunching the numbers...</p>
                        </div>
                    ) : !scenarios ? (
                        <div className="text-center py-20 text-slate-400">
                            <p>Could not load scenarios.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Summary Box */}
                            <div className={clsx(
                                "p-6 rounded-xl border backdrop-blur-md relative overflow-hidden",
                                scenarios.probability > 50
                                    ? "bg-emerald-500/10 border-emerald-500/20"
                                    : "bg-amber-500/10 border-amber-500/20"
                            )}>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Playoff Probability</span>
                                        <div className={clsx(
                                            "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold",
                                            scenarios.probability > 50 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                                        )}>
                                            <TrendingUp size={16} />
                                            {scenarios.probability.toFixed(1)}%
                                        </div>
                                    </div>
                                    <p className="text-lg text-white font-medium leading-relaxed">
                                        {scenarios.message}
                                    </p>
                                </div>
                            </div>

                            {/* Conditions List */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                                    Key Conditions
                                </h3>

                                {scenarios.conditions.length === 0 ? (
                                    <div className="p-8 text-center border border-dashed border-slate-700 rounded-xl bg-slate-900/50">
                                        <p className="text-slate-400 italic">
                                            No specific dependencies found. {scenarios.probability > 90 ? "Just keep winning!" : "It's a toss-up."}
                                        </p>
                                    </div>
                                ) : (
                                    <ul className="space-y-3">
                                        {scenarios.conditions.map((condition, idx) => (
                                            <li
                                                key={idx}
                                                className="group flex items-start gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                                            >
                                                <div className="mt-1 shrink-0">
                                                    {condition.frequency > 0.9 ? (
                                                        <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                                                            <AlertTriangle size={20} />
                                                        </div>
                                                    ) : condition.is_own_game ? (
                                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                                            <CheckCircle size={20} />
                                                        </div>
                                                    ) : (
                                                        <div className="p-2 bg-slate-700/30 rounded-lg text-slate-400">
                                                            <HelpCircle size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-base text-slate-200 font-medium leading-snug">
                                                        {condition.description}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-3">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                                                            Week {condition.week}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                                                                <div
                                                                    className={clsx(
                                                                        "h-full rounded-full",
                                                                        condition.frequency > 0.9 ? "bg-red-500" : "bg-blue-500"
                                                                    )}
                                                                    style={{ width: Math.round(condition.frequency * 100) + '%' }}
                                                                />
                                                            </div>
                                                            <span className={clsx(
                                                                "text-xs font-bold",
                                                                condition.frequency > 0.9 ? "text-red-400" : "text-slate-500"
                                                            )}>
                                                                {(condition.frequency * 100).toFixed(0)}% Impact
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ScenarioModal;
