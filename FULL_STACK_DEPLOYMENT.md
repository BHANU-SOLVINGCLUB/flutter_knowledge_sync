# 🚀 Full-Stack Deployment Guide - Backend + Frontend Together

## ✅ **One Project, Two Applications**

Your Flutter Knowledge Sync now deploys both the **backend API** and **frontend dashboard** together in one Vercel project!

### **🎯 What You'll Get:**
- **Backend API**: `https://your-project.vercel.app/api/*`
- **Frontend Dashboard**: `https://your-project.vercel.app/`
- **Single Deployment**: Everything in one place!

---

## 🔧 **Configuration Updated:**

### **Vercel Configuration (`vercel.json`):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    },
    {
      "src": "frontend/package.json", 
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/build/$1"
    }
  ]
}
```

### **How It Works:**
- **`/api/*`** routes → Backend Python API
- **`/*`** routes → Frontend React Dashboard
- **Automatic builds** for both applications

---

## 🚀 **Deploy Everything Together:**

### **Step 1: Build Frontend Locally (Optional)**
```bash
# Install Node.js dependencies
cd frontend
npm install

# Build the React app
npm run build
```

### **Step 2: Deploy to Vercel**
```bash
# Commit all changes
git add .
git commit -m "Add full-stack deployment configuration"
git push origin main
```

### **Step 3: Vercel Auto-Deploy**
1. **Go to [vercel.com](https://vercel.com)**
2. **Your project will auto-deploy** from GitHub
3. **Wait for both builds** to complete:
   - ✅ Python API build
   - ✅ React frontend build

---

## 🎯 **After Deployment:**

### **Your URLs:**
- **Dashboard**: `https://your-project.vercel.app/`
- **API Health**: `https://your-project.vercel.app/api/health`
- **API Docs**: `https://your-project.vercel.app/api/flutter/docs`
- **API Search**: `https://your-project.vercel.app/api/flutter/search?q=widget`

### **Frontend Features:**
- 📊 **Dashboard Overview** - Stats and sync status
- 📄 **Documentation Browser** - Browse Flutter docs
- 📦 **Package Explorer** - View pub.dev packages
- 🐛 **Issue Tracker** - GitHub issues
- 🔍 **Universal Search** - Search everything
- 🔄 **Sync Management** - Trigger syncs

---

## 🧪 **Test Your Deployment:**

### **1. Test API Endpoints:**
```bash
# Health check
curl https://your-project.vercel.app/api/health

# Search
curl "https://your-project.vercel.app/api/flutter/search?q=widget"
```

### **2. Test Frontend Dashboard:**
- Open `https://your-project.vercel.app/` in your browser
- You should see the beautiful React dashboard
- Test all the features: docs, packages, issues, search

---

## 🔗 **Connect to Cursor:**

Once deployed, use these endpoints in Cursor:

```json
{
  "mcpServers": {
    "flutter-knowledge": {
      "baseUrl": "https://your-project.vercel.app",
      "endpoints": {
        "search": "/api/flutter/search",
        "docs": "/api/flutter/docs",
        "packages": "/api/flutter/packages",
        "issues": "/api/flutter/issues"
      }
    }
  }
}
```

---

## 📁 **Project Structure:**

```
flutter_knowledge_sync/
├── api/
│   └── index.py              # Backend API
├── frontend/
│   ├── src/                  # React components
│   ├── public/               # Static files
│   ├── package.json          # Frontend dependencies
│   └── build/                # Built React app
├── vercel.json               # Deployment config
└── ...                       # Other files
```

---

## 🎉 **Complete Solution:**

You now have a **complete full-stack Flutter Knowledge Sync**:

1. ✅ **Backend API** - Python FastAPI with Supabase
2. ✅ **Frontend Dashboard** - React with beautiful UI
3. ✅ **Single Deployment** - Everything in one Vercel project
4. ✅ **Cursor Integration** - Ready for MCP connection

---

## 🚀 **Deploy Now:**

```bash
git add .
git commit -m "Full-stack deployment ready"
git push origin main
```

**Your complete Flutter Knowledge Sync will be live with both API and dashboard! 🎉**

---

## 🆘 **Troubleshooting:**

- **Build fails**: Check Vercel logs for specific errors
- **Frontend not loading**: Ensure `frontend/build/` exists
- **API not working**: Check Python dependencies in `requirements-vercel.txt`
- **Environment variables**: Set in Vercel dashboard if needed

**Everything is configured for full-stack deployment! 🚀**
