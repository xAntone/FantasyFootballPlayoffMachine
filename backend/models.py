from pydantic import BaseModel
from typing import List, Optional

class Team(BaseModel):
    id: str
    name: str
    owner: str
    wins: int
    losses: int
    ties: int
    points_for: float
    points_against: float
    streak: Optional[str] = None
    logo_url: Optional[str] = None

class Matchup(BaseModel):
    week: int
    team1_id: str
    team2_id: str
    team1_score: Optional[float] = None
    team2_score: Optional[float] = None
    completed: bool

class LeagueData(BaseModel):
    league_id: str
    name: str
    teams: List[Team]
    schedule: List[Matchup]
    current_week: int
    total_weeks: int
    playoff_spots: int

class PlayoffOdds(BaseModel):
    team_id: str
    team_name: str
    playoff_probability: float
    clinched_playoffs: bool
    eliminated: bool
    scenarios: List[str]  # Description of key scenarios
