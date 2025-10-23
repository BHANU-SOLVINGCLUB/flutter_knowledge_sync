# 🚀 Vercel Deployment Guide

## Step-by-Step Instructions

### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**
```bash
vercel login
```

### **Step 3: Initialize Project**
```bash
vercel init
```

### **Step 4: Set Environment Variables**
```bash
vercel env add SUPABASE_URL
# Enter: https://lthfkjiggwawxdjzzqee.supabase.co

vercel env add SUPABASE_KEY
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0aGZramlnZ3dhd3hkanp6cWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzU1MzcsImV4cCI6MjA3NjgxMTUzN30.EOd-1rd0O9PPChSAyzDltMsoN3d1qF1dPzOTJlnyd5E

vercel env add GEMINI_API_KEY
# Enter: AIzaSyBrIL4wjKOD11AZFlP_Rz3QwwjvVqTzvio

vercel env add GITHUB_TOKEN
# Enter: (optional - leave empty for now)

vercel env add SYNC_INTERVAL_MINUTES
# Enter: 360
```

### **Step 5: Deploy**
```bash
vercel --prod
```

### **Step 6: Test Deployment**
Your app will be available at: `https://your-project-name.vercel.app`

### **Step 7: Connect to Cursor**
Use the Vercel URL in Cursor MCP configuration.

---

## Alternative: GitHub Integration

1. Push your code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

---

## Troubleshooting

- **Build Errors**: Check `requirements-vercel.txt`
- **Environment Variables**: Ensure all are set in Vercel dashboard
- **API Routes**: Verify `vercel.json` configuration
