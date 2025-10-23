# Flutter Knowledge Sync

A comprehensive Python service that aggregates Flutter documentation, packages, and GitHub issues into a searchable knowledge base. Perfect for AI-powered development tools like Cursor.

## 🚀 Features

- **Multi-source Data Collection**: Fetches from Flutter docs, pub.dev packages, and GitHub issues
- **Smart Summarization**: Optional OpenAI integration for concise content summaries
- **FastAPI REST API**: Full-featured API with search, filtering, and pagination
- **Background Sync**: Automated data synchronization with configurable intervals
- **Supabase Integration**: Robust database storage with upsert operations
- **Docker Ready**: Production-ready containerization with health checks
- **MCP Compatible**: Designed to work as a Model Context Protocol source for Cursor

## 📋 Prerequisites

- Python 3.11+
- Supabase account (free tier available)
- GitHub token (optional, for issues)
- OpenAI API key (optional, for summarization)

## 🛠️ Quick Setup

### 1. Clone and Install

```bash
git clone <your-repo>
cd flutter_knowledge_sync
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp env.example .env
```

Edit `.env` with your credentials:

```env
# Required: Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# Optional: GitHub (for issues)
GITHUB_TOKEN=your_github_token

# Optional: OpenAI (for summarization)
OPENAI_API_KEY=your_openai_key

# Optional: Sync interval (minutes)
SYNC_INTERVAL_MINUTES=360
```

### 3. Set Up Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. In your project dashboard, go to **SQL Editor**
3. Run the contents of `sql/init_tables.sql` to create the required tables

### 4. Run the Application

**Option A: Use the startup script (recommended)**
```bash
python start.py
```

**Option B: Manual setup**
```bash
# Start the API server
uvicorn api.server:app --reload --host 0.0.0.0 --port 8000

# In another terminal, start the scheduler
python main.py
```

### 5. Test Everything

```bash
python test_app.py
```

## 🐳 Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build manually
docker build -t flutter-knowledge-sync .
docker run -p 8000:8000 --env-file .env flutter-knowledge-sync
```

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Flutter Documentation
```bash
GET /api/flutter/docs?limit=50&search=widget
```

### Pub.dev Packages
```bash
GET /api/flutter/packages?limit=50&search=state
```

### GitHub Issues
```bash
GET /api/flutter/issues?limit=50&labels=bug,enhancement
```

### Universal Search
```bash
GET /api/flutter/search?q=state%20management&limit=20
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | ✅ | Your Supabase project URL |
| `SUPABASE_KEY` | ✅ | Your Supabase anon key |
| `GITHUB_TOKEN` | ❌ | GitHub token for fetching issues |
| `OPENAI_API_KEY` | ❌ | OpenAI key for summarization |
| `SYNC_INTERVAL_MINUTES` | ❌ | Sync interval (default: 360) |

### Database Schema

The app creates three main tables:

- **flutter_docs**: Documentation content with summaries
- **pub_packages**: Package metadata from pub.dev
- **github_issues**: Issues from flutter/flutter repository

## 🚀 Deployment

### Render (Recommended)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables in Render dashboard
4. Deploy!

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Deploy
fly launch
fly deploy
```

## 🔗 Cursor Integration

To use this as an MCP source in Cursor:

1. Deploy the service to a public URL
2. Configure Cursor to use your API endpoints
3. Use the search endpoint for intelligent Flutter knowledge retrieval

Example Cursor configuration:
```json
{
  "mcp": {
    "sources": [
      {
        "name": "flutter-knowledge",
        "url": "https://your-app.railway.app/api/flutter/search",
        "type": "rest"
      }
    ]
  }
}
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
python test_app.py
```

This tests:
- ✅ Module imports
- ✅ Data fetchers
- ✅ Database connection
- ✅ API endpoints
- ✅ Sync functionality
- ✅ Summarization

## 📁 Project Structure

```
flutter_knowledge_sync/
├── api/                    # FastAPI server
│   └── server.py          # Main API endpoints
├── fetch/                 # Data fetchers
│   ├── flutter_docs.py    # Flutter documentation
│   ├── pub_dev.py         # Pub.dev packages
│   └── github_issues.py   # GitHub issues
├── storage/               # Database layer
│   └── supabase_client.py # Supabase integration
├── utils/                 # Utilities
│   └── summarizer.py      # OpenAI summarization
├── sql/                   # Database schema
│   └── init_tables.sql    # Table definitions
├── main.py               # Scheduler entry point
├── start.py              # Startup helper script
├── test_app.py           # Test suite
├── docker-compose.yml    # Docker setup
└── Dockerfile            # Container definition
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- Check the [Issues](https://github.com/your-repo/issues) page
- Review the test output for troubleshooting
- Ensure all environment variables are properly set
- Verify Supabase connection and table creation

---

**Happy Flutter Development! 🎉**

