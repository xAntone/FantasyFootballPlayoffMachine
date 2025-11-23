import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trophy, AlertCircle } from 'lucide-react';
import LeagueInput from './components/LeagueInput';
import StandingsTable from './components/StandingsTable';
import OddsChart from './components/OddsChart';
import ScenarioModal from './components/ScenarioModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [leagueData, setLeagueData] = useState(null);
  const [odds, setOdds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Scenario Modal State
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [scenarios, setScenarios] = useState(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);

  const fetchLeagueData = async (leagueId) => {
    setLoading(true);
    setError(null);
    setLeagueData(null);
    setOdds(null);

    try {
      // 1. Fetch League Data
      const leagueRes = await axios.get(`${API_URL}/api/league/${leagueId}`);
      setLeagueData(leagueRes.data);

      // 2. Calculate Odds
      const oddsRes = await axios.get(`${API_URL}/api/league/${leagueId}/odds`);
      setOdds(oddsRes.data);

    } catch (err) {
      console.error(err);
      setError('Failed to fetch league data. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamClick = async (team) => {
    setSelectedTeam(team);
    setScenarioLoading(true);
    setScenarios(null);

    try {
      const res = await axios.get(`${API_URL}/api/league/${leagueData.league_id}/scenarios/${team.team_id}`);
      setScenarios(res.data);
    } catch (err) {
      console.error("Failed to fetch scenarios", err);
    } finally {
      setScenarioLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-violet-500/10 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-6 p-2 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-slate-300 tracking-wide uppercase">Fantasy Football Playoff Calculator</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 tracking-tight mb-6">
            Playoff Machine
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Advanced simulation engine to calculate playoff probabilities and analyze path-to-clinch scenarios for your NFL fantasy league.
          </p>
        </motion.div>

        {/* Input Section */}
        <div className="mb-16 flex justify-center">
          <LeagueInput onSubmit={fetchLeagueData} loading={loading} />
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-12 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 backdrop-blur-sm"
          >
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        {/* Results Section */}
        {leagueData && odds && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Header */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">League</div>
                <div className="text-white font-bold text-lg truncate">{leagueData.name}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Current Week</div>
                <div className="text-white font-bold text-lg">{leagueData.current_week} <span className="text-slate-500 text-sm font-normal">/ {leagueData.total_weeks}</span></div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Playoff Spots</div>
                <div className="text-white font-bold text-lg">{leagueData.playoff_spots}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Simulations</div>
                <div className="text-emerald-400 font-bold text-lg">1,000</div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Left Column: Standings (5 cols) */}
              <div className="xl:col-span-5 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Standings</h2>
                </div>
                <StandingsTable teams={leagueData.teams} />
              </div>

              {/* Right Column: Odds (7 cols) */}
              <div className="xl:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Playoff Probabilities</h2>
                </div>
                <OddsChart
                  odds={odds}
                  onTeamClick={handleTeamClick}
                  loadingTeamId={scenarioLoading ? selectedTeam?.team_id : null}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scenario Modal */}
      <ScenarioModal
        isOpen={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        team={selectedTeam}
        scenarios={scenarios}
        loading={scenarioLoading}
      />
    </div>
  );
}

export default App;
