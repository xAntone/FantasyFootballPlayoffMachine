# 🏈 Fantasy Football Playoff Calculator

A beautiful, modern web application that calculates playoff probabilities and analyzes playoff scenarios for NFL.com fantasy football leagues using Monte Carlo simulation.

![Fantasy Football Playoff Calculator](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- **Playoff Probability Calculator**: Monte Carlo simulation (10,000+ iterations) to calculate each team's playoff chances
- **Detailed Scenario Analysis**: Click any team to see their path to the playoffs with key matchup conditions
- **Modern UI**: Glassmorphic design with smooth animations and responsive layout
- **Team Logos**: Displays actual team logos from NFL.com
- **Interactive Charts**: Visual representation of playoff odds with clickable elements
- **Real-time Data**: Scrapes live data from NFL.com fantasy leagues

## 🚀 Live Demo

**Frontend**: [Your Vercel URL here]
**API**: [Your Render URL here]

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **BeautifulSoup4** - Web scraping
- **Pandas** - Data manipulation
- **Monte Carlo Simulation** - Probability calculations

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Axios** - HTTP client

## 📦 Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r backend/requirements.txt

# Run server
uvicorn backend.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to Render and Vercel (completely free!).

## 📖 How It Works

1. **Data Collection**: Scrapes team standings and remaining schedule from NFL.com
2. **Simulation**: Runs 10,000+ Monte Carlo simulations of remaining games
3. **Probability Calculation**: Calculates playoff odds based on simulation results
4. **Scenario Analysis**: Identifies key matchups that impact each team's playoff chances

## 🎯 Usage

1. Enter your NFL.com League ID (find it in your league URL)
2. View current standings with playoff probabilities
3. Click any team to see their detailed playoff scenarios
4. Share with your league mates!

## ⚠️ Disclaimer

This is a fan-made tool and is not affiliated with or endorsed by the NFL or NFL.com. Use at your own risk.

## 📝 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 💡 Future Enhancements

- Historical probability tracking
- Strength of schedule analysis
- Playoff bracket predictions
- Export scenarios as images
- Support for other fantasy platforms

## 🙏 Acknowledgments

Built with ❤️ for fantasy football enthusiasts everywhere.

---

**Enjoy the app!** If you find it useful, consider sharing it with your league! 🏆
