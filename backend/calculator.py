import random
from typing import List, Dict, Any
from .models import LeagueData, Team, PlayoffOdds

def calculate_odds(league_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Calculates playoff odds using Monte Carlo simulation.
    """
    teams_data = league_data["teams"]
    schedule = league_data["schedule"]
    playoff_spots = league_data["playoff_spots"]
    
    # Convert to dictionary for easier access
    teams_map = {t["id"]: t for t in teams_data}
    
    SIMULATIONS = 1000
    results = {t["id"]: 0 for t in teams_data}
    
    for _ in range(SIMULATIONS):
        # Deep copy teams to simulate this run
        sim_teams = {
            tid: {
                "id": t["id"],
                "wins": t["wins"],
                "losses": t["losses"],
                "ties": t["ties"],
                "points_for": t["points_for"]
            } for tid, t in teams_map.items()
        }
        
        # Simulate remaining games
        for game in schedule:
            if not game.get("completed", False):
                # Simple 50/50 coin flip for now
                # Could be improved with power rankings based on PF
                # Let's use Points For as a weight
                t1 = teams_map.get(game["team1_id"])
                t2 = teams_map.get(game["team2_id"])
                
                if t1 and t2:
                    # Simple probability based on PF
                    # Add a small epsilon to avoid division by zero
                    total_pf = t1["points_for"] + t2["points_for"] + 1.0
                    t1_prob = (t1["points_for"] + 0.5) / total_pf
                    
                    winner_id = game["team1_id"] if random.random() < t1_prob else game["team2_id"]
                else:
                    winner_id = game["team1_id"] if random.random() > 0.5 else game["team2_id"]

                loser_id = game["team2_id"] if winner_id == game["team1_id"] else game["team1_id"]
                
                sim_teams[winner_id]["wins"] += 1
                sim_teams[loser_id]["losses"] += 1
        
        # Rank teams
        # Sort by Wins (desc), then Points For (desc)
        sorted_teams = sorted(
            sim_teams.values(),
            key=lambda x: (x["wins"], x["points_for"]),
            reverse=True
        )
        
        # Count playoff appearances
        for i in range(playoff_spots):
            if i < len(sorted_teams):
                results[sorted_teams[i]["id"]] += 1
                
    # Format results
    odds_results = []
    for team in teams_data:
        prob = (results[team["id"]] / SIMULATIONS) * 100
        
        scenarios = []
        if prob == 100.0:
            scenarios.append("Clinched playoffs")
        elif prob == 0.0:
            scenarios.append("Eliminated")
        elif prob >= 90.0:
            scenarios.append("Very likely to make it")
        elif prob <= 10.0:
            scenarios.append("Needs a miracle")
        else:
            scenarios.append("In the hunt")
            
        odds_results.append({
            "team_id": team["id"],
            "team_name": team["name"],
            "playoff_probability": round(prob, 1),
            "clinched_playoffs": prob == 100.0,
            "eliminated": prob == 0.0,
            "scenarios": scenarios
        })
        
    return sorted(odds_results, key=lambda x: x["playoff_probability"], reverse=True)

def analyze_team_scenarios(league_data: LeagueData, focus_team_id: str) -> Dict[str, Any]:
    """
    Analyzes specific scenarios for a team to make the playoffs.
    Returns a list of necessary and helpful conditions.
    """
    SIMULATIONS = 2000 # Higher count for better scenario accuracy
    teams_data = league_data.teams
    schedule = league_data.schedule
    playoff_spots = league_data.playoff_spots
    
    teams_map = {t.id: t.dict() for t in teams_data}
    
    successful_sims = [] # List of (game_results, final_standings)
    
    for i in range(SIMULATIONS):
        sim_teams = {t_id: t_data.copy() for t_id, t_data in teams_map.items()}
        game_results = {} # Key: "week-team1-team2", Value: winner_id
        
        # Simulate remaining games
        # Simulate remaining games
        for game in schedule:
            if not game.completed:
                t1 = teams_map.get(game.team1_id)
                t2 = teams_map.get(game.team2_id)
                
                winner_id = None
                if t1 and t2:
                    total_pf = t1["points_for"] + t2["points_for"] + 1.0
                    t1_prob = (t1["points_for"] + 0.5) / total_pf
                    winner_id = game.team1_id if random.random() < t1_prob else game.team2_id
                else:
                    winner_id = game.team1_id if random.random() > 0.5 else game.team2_id

                loser_id = game.team2_id if winner_id == game.team1_id else game.team1_id
                
                sim_teams[winner_id]["wins"] += 1
                sim_teams[loser_id]["losses"] += 1
                
                game_key = f"{game.week}-{game.team1_id}-{game.team2_id}"
                game_results[game_key] = winner_id
        
        # Rank teams
        sorted_teams = sorted(
            sim_teams.values(),
            key=lambda x: (x["wins"], x["points_for"]),
            reverse=True
        )
        
        # Check if focus team made playoffs
        made_playoffs = False
        for i in range(playoff_spots):
            if i < len(sorted_teams) and sorted_teams[i]["id"] == focus_team_id:
                made_playoffs = True
                break
        
        if made_playoffs:
            successful_sims.append(game_results)
            
    # Analyze successful simulations
    total_success = len(successful_sims)
    if total_success == 0:
        return {
            "team_id": focus_team_id,
            "probability": 0.0,
            "message": "No scenarios found in 2000 simulations. Extremely unlikely.",
            "conditions": []
        }
        
    # Count outcome frequencies in successful sims
    # Key: game_key, Value: {winner_id: count}
    outcome_counts = {}
    
    for results in successful_sims:
        for game_key, winner_id in results.items():
            if game_key not in outcome_counts:
                outcome_counts[game_key] = {}
            outcome_counts[game_key][winner_id] = outcome_counts[game_key].get(winner_id, 0) + 1
            
    conditions = []
    
    # Identify critical games
    for game_key, counts in outcome_counts.items():
        week, t1_id, t2_id = game_key.split('-')
        
        # Determine the "needed" winner
        # If one winner appears in > 70% of successful sims, it's a condition
        for winner_id, count in counts.items():
            frequency = count / total_success
            if frequency >= 0.70:
                opponent_id = t2_id if winner_id == t1_id else t1_id
                
                winner_name = teams_map[winner_id]["name"]
                opponent_name = teams_map[opponent_id]["name"]
                
                is_own_game = (winner_id == focus_team_id or opponent_id == focus_team_id)
                
                condition_type = "MUST" if frequency >= 0.99 else "SHOULD"
                
                desc = ""
                if winner_id == focus_team_id:
                    desc = f"Win vs {opponent_name} (Week {week})"
                elif opponent_id == focus_team_id:
                    desc = f"Avoid loss vs {winner_name} (Week {week})" # Should not happen if we check winner_id
                else:
                    desc = f"Need {winner_name} to beat {opponent_name} (Week {week})"
                
                conditions.append({
                    "game_key": game_key,
                    "week": int(week),
                    "description": desc,
                    "frequency": frequency,
                    "is_own_game": is_own_game,
                    "needed_winner_id": winner_id
                })
                
    # Sort conditions: Own games first, then by frequency (desc), then by week
    conditions.sort(key=lambda x: (not x["is_own_game"], -x["frequency"], x["week"]))
    
    return {
        "team_id": focus_team_id,
        "probability": (total_success / SIMULATIONS) * 100,
        "message": f"Found {total_success} paths to playoffs in {SIMULATIONS} simulations.",
        "conditions": conditions
    }
