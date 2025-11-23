import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "https://fantasy.nfl.com/league"

def get_headers() -> Dict[str, str]:
    """
    Returns headers to mimic a real browser to avoid being blocked.
    """
    return {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }

def scrape_league(league_id: str) -> Dict[str, Any]:
    """
    Scrapes league data from NFL.com.
    """
    if league_id == "mock":
        return get_mock_league_data(league_id)

    url = f"{BASE_URL}/{league_id}"
    logger.info(f"Fetching league data from {url}")
    
    try:
        response = requests.get(url, headers=get_headers(), timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        logger.error(f"Failed to fetch league page: {e}")
        raise Exception(f"Failed to fetch league page: {e}")

    soup = BeautifulSoup(response.content, "html.parser")
    
    # Check if league is private or invalid
    if "League Not Found" in soup.text or "Private League" in soup.text: # This is a guess at the error message
        # Let's look for specific indicators of private/invalid
        error_msg = soup.find("div", class_="error-message") # Hypothetical
        if error_msg:
             raise Exception(f"League access error: {error_msg.text.strip()}")
        # If we are redirected to login, that's a sign it's private
        if "signin" in response.url:
             raise Exception("League is private. This tool only works with public leagues.")

    league_name = soup.find("h1", class_="leagueName")
    league_name = league_name.text.strip() if league_name else f"League {league_id}"

    teams = parse_standings(soup)
    
    # We also need the schedule. 
    # Usually at /league/{league_id}/schedule
    # Determine current week (placeholder logic, ideally parse from page)
    # For now, let's assume we are in Week 12 (based on user context) or parse it
    current_week = 12 # Default
    
    # Try to find current week from the page
    # <li class="wl wl-12 first">Week 12</li>
    week_li = soup.find("li", class_="wl")
    if week_li:
        try:
            current_week = int(week_li.text.replace("Week ", "").strip())
        except:
            pass
            
    total_weeks = 14 # Standard fantasy regular season
    
    schedule = scrape_schedule(league_id, current_week, total_weeks)

    return {
        "league_id": league_id,
        "name": league_name,
        "teams": teams,
        "schedule": schedule,
        "current_week": current_week,
        "total_weeks": total_weeks,
        "playoff_spots": 6 # Placeholder
    }

def parse_standings(soup: BeautifulSoup) -> List[Dict[str, Any]]:
    """
    Parses the standings table from the league home page.
    """
    teams = []
    
    # Find all rows that look like team rows
    # We look for any row containing a 'teamRecord' cell
    rows = soup.find_all("tr")
    
    for row in rows:
        # Check if this is a team row
        record_cell = row.find("td", class_="teamRecord")
        if not record_cell:
            continue
            
        try:
            logger.info(f"Found team row: {row.prettify()[:100]}...")
            
            # Extract Team Name and ID
            team_link = row.find("a", class_="teamName")
            if not team_link:
                logger.warning("No team link found")
                continue
            
            team_name = team_link.text.strip()
            team_id = team_link['href'].split('/')[-1]
            logger.info(f"Parsing team: {team_name} (ID: {team_id})")
            
            # Extract Owner
            owner = "Unknown"
            owner_span = row.find("span", class_="userName") or row.find("li", class_="userName")
            if owner_span:
                owner = owner_span.text.strip()
            
            # Extract Team Logo
            # Look for team logo in the activity feed or standings
            # The logo is typically in an <a class="teamImg teamId-X"> containing an <img>
            logo_url = None
            
            # Try to find logo from the page (not in the row, but we can construct URL from team_id)
            # NFL.com uses a pattern like: https://fantasy.nfl.com/image/{hash}.jpg?&x=40&y=40
            # Since we can't easily get the hash from the standings row, we'll need to look elsewhere
            # For now, we'll try to find it in the broader page context
            
            # Alternative: Look for any img tag associated with this team
            # This might be in a different part of the page
            # We'll leave it as None for now and handle it differently
            
            # Actually, let's try a different approach - look for the teamImg link
            # We need to search the entire soup, not just the row
            # This is inefficient but will work
            pass  # We'll handle this after the loop

            # Extract Record
            wins, losses, ties = 0, 0, 0
            record_text = record_cell.text.strip()
            logger.info(f"Record text: {record_text}")
            # Format: "6-5-0"
            parts = record_text.split('-')
            if len(parts) >= 2:
                wins = int(parts[0])
                losses = int(parts[1])
                if len(parts) > 2:
                    ties = int(parts[2])
            
            # Extract Points
            # There are usually two 'teamPts' cells: PF and PA
            pts_cells = row.find_all("td", class_="teamPts")
            points_for = 0.0
            points_against = 0.0
            
            if len(pts_cells) >= 1:
                points_for = float(pts_cells[0].text.strip().replace(',', ''))
            
            if len(pts_cells) >= 2:
                points_against = float(pts_cells[1].text.strip().replace(',', ''))
            
            logger.info(f"Stats: {wins}-{losses}-{ties}, PF: {points_for}, PA: {points_against}")
            
            teams.append({
                "id": team_id,
                "name": team_name,
                "owner": owner,
                "wins": wins,
                "losses": losses,
                "ties": ties,
                "points_for": points_for,
                "points_against": points_against,
                "logo_url": logo_url
            })
            
        except Exception as e:
            logger.warning(f"Failed to parse row: {e}")
            continue
    
    # Now extract logos from the page
    # Look for <a class="teamImg teamId-X"> tags which contain the team logos
    for team in teams:
        team_id = team["id"]
        # Find the teamImg link for this team
        team_img_link = soup.find("a", class_=f"teamImg teamId-{team_id}")
        if team_img_link:
            img_tag = team_img_link.find("img")
            if img_tag and img_tag.get('src'):
                logo_url = img_tag['src']
                # Make sure it's a full URL
                if logo_url and not logo_url.startswith('http'):
                    logo_url = f"https://fantasy.nfl.com{logo_url}"
                team["logo_url"] = logo_url
                logger.info(f"Found logo for team {team['name']}: {logo_url}")
            
    return teams

def scrape_schedule(league_id: str, current_week: int, total_weeks: int = 14) -> List[Dict[str, Any]]:
    """
    Scrapes the schedule for remaining weeks.
    """
    schedule = []
    
    # We only need to scrape future weeks for the simulation
    # But for completeness, we could scrape all. 
    # For performance, let's just do current_week to total_weeks.
    
    for week in range(current_week, total_weeks + 1):
        url = f"{BASE_URL}/{league_id}?week={week}"
        logger.info(f"Fetching schedule for week {week} from {url}")
        
        try:
            response = requests.get(url, headers=get_headers(), timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, "html.parser")
            
            # Find the score strip or matchup list
            # It seems to be in a ul with class 'ss'
            matchup_list = soup.find("ul", class_="ss")
            if not matchup_list:
                logger.warning(f"No matchup list found for week {week}")
                continue
                
            matchups = matchup_list.find_all("li")
            for match in matchups:
                # Each li contains a link with title "Team A vs. Team B"
                link = match.find("a")
                if not link: continue
                
                title = link.get("title", "") # "Team A vs. Team B"
                if " vs. " not in title: continue
                
                # Extract team IDs from the inner divs
                # <div class="first"><em>Name</em> <span class="teamTotal teamId-11">...</span></div>
                first_div = link.find("div", class_="first")
                last_div = link.find("div", class_="last")
                
                if not first_div or not last_div: continue
                
                team1_span = first_div.find("span", class_="teamTotal")
                team2_span = last_div.find("span", class_="teamTotal")
                
                if not team1_span or not team2_span: continue
                
                # class="teamTotal teamId-11" -> extract 11
                team1_id = ""
                for cls in team1_span.get("class", []):
                    if cls.startswith("teamId-"):
                        team1_id = cls.split("-")[1]
                        break
                        
                team2_id = ""
                for cls in team2_span.get("class", []):
                    if cls.startswith("teamId-"):
                        team2_id = cls.split("-")[1]
                        break
                
                if team1_id and team2_id:
                    schedule.append({
                        "week": week,
                        "team1_id": team1_id,
                        "team2_id": team2_id,
                        "completed": False # Future games are not completed
                    })
                    
        except Exception as e:
            logger.error(f"Failed to scrape schedule for week {week}: {e}")
            continue
            
    return schedule

def get_mock_league_data(league_id: str) -> Dict[str, Any]:
    """
    Returns mock league data for testing and development.
    """
    teams = [
        {"id": "1", "name": "Team A", "owner": "Owner A", "wins": 8, "losses": 4, "ties": 0, "points_for": 1200.5, "points_against": 1100.0},
        {"id": "2", "name": "Team B", "owner": "Owner B", "wins": 7, "losses": 5, "ties": 0, "points_for": 1150.0, "points_against": 1120.0},
        {"id": "3", "name": "Team C", "owner": "Owner C", "wins": 7, "losses": 5, "ties": 0, "points_for": 1100.0, "points_against": 1050.0},
        {"id": "4", "name": "Team D", "owner": "Owner D", "wins": 6, "losses": 6, "ties": 0, "points_for": 1050.0, "points_against": 1100.0},
        {"id": "5", "name": "Team E", "owner": "Owner E", "wins": 5, "losses": 7, "ties": 0, "points_for": 1000.0, "points_against": 1150.0},
        {"id": "6", "name": "Team F", "owner": "Owner F", "wins": 3, "losses": 9, "ties": 0, "points_for": 900.0, "points_against": 1200.0},
    ]
    
    # Mock schedule for remaining weeks (e.g., Week 13 and 14)
    schedule = [
        {"week": 13, "team1_id": "1", "team2_id": "2", "completed": False},
        {"week": 13, "team1_id": "3", "team2_id": "4", "completed": False},
        {"week": 13, "team1_id": "5", "team2_id": "6", "completed": False},
        {"week": 14, "team1_id": "1", "team2_id": "3", "completed": False},
        {"week": 14, "team1_id": "2", "team2_id": "5", "completed": False},
        {"week": 14, "team1_id": "4", "team2_id": "6", "completed": False},
    ]

    return {
        "league_id": league_id,
        "name": "Mock League",
        "teams": teams,
        "schedule": schedule,
        "current_week": 13,
        "total_weeks": 14,
        "playoff_spots": 4
    }
