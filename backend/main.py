
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.scraper import scrape_league
from backend.calculator import calculate_odds, analyze_team_scenarios
from backend.models import LeagueData

app = FastAPI(title="NFL Fantasy Playoff Calculator")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, this should be restricted
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "healthy", "message": "NFL Fantasy Playoff Calculator API is running"}

@app.get("/api/league/{league_id}")
def get_league_info(league_id: str):
    """
    Fetches current league state (standings, teams, settings).
    """
    try:
        league_data = scrape_league(league_id)
        return league_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/league/{league_id}/odds")
async def get_playoff_odds(league_id: str):
    """
    Calculates playoff odds based on current standings and remaining schedule.
    """
    try:
        league_data = scrape_league(league_id)
        odds = calculate_odds(league_data)
        return odds
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/league/{league_id}/scenarios/{team_id}")
async def get_team_scenarios(league_id: str, team_id: str):
    """
    Analyzes specific scenarios for a team to make the playoffs.
    """
    try:
        data = scrape_league(league_id)
        league_data = LeagueData(**data)
        scenarios = analyze_team_scenarios(league_data, team_id)
        return scenarios
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
