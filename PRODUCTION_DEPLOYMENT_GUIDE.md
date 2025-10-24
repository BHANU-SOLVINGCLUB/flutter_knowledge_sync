# Production Deployment Guide

This guide provides comprehensive instructions for deploying the Flutter Knowledge Sync application to production.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

1. **Fork/Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd flutter_knowledge_sync
   ```

2. **Set up environment variables in Vercel**
   - Go to your Vercel dashboard
   - Create a new project
   - Add the following environment variables:
     ```
     ENVIRONMENT=production
     SUPABASE_URL=your_supabase_url
     SUPABASE_KEY=your_supabase_anon_key
     GITHUB_TOKEN=your_github_token (optional)
     OPENAI_API_KEY=your_openai_key (optional)
     ALLOWED_ORIGINS=https://your-domain.vercel.app
     ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Railway

1. **Connect your repository to Railway**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on push**

### Option 3: Render

1. **Create a new Web Service**
2. **Connect your GitHub repository**
3. **Configure environment variables**
4. **Deploy**

## 🗄️ Database Setup

### Supabase Setup

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up database tables**
   - Go to SQL Editor in Supabase dashboard
   - Run the contents of `sql/init_tables.sql`

3. **Configure Row Level Security (RLS)**
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE flutter_docs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE pub_packages ENABLE ROW LEVEL SECURITY;
   ALTER TABLE github_issues ENABLE ROW LEVEL SECURITY;
   
   -- Create policies for public read access
   CREATE POLICY "Allow public read access" ON flutter_docs FOR SELECT USING (true);
   CREATE POLICY "Allow public read access" ON pub_packages FOR SELECT USING (true);
   CREATE POLICY "Allow public read access" ON github_issues FOR SELECT USING (true);
   ```

## 🔧 Environment Configuration

### Required Variables

```env
ENVIRONMENT=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
```

### Optional Variables

```env
# GitHub integration
GITHUB_TOKEN=your_github_token

# OpenAI integration
OPENAI_API_KEY=your_openai_key

# CORS configuration
ALLOWED_ORIGINS=https://your-domain.com,https://another-domain.com

# Rate limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# Logging
LOG_LEVEL=INFO
```

## 🚀 Frontend Configuration

### Environment Variables

```env
REACT_APP_API_URL=https://your-api-domain.com
```

### Build Optimization

The frontend is automatically optimized for production with:
- Code splitting
- Tree shaking
- Minification
- Gzip compression
- Static asset caching

## 🔒 Security Considerations

### API Security

1. **Rate Limiting**: Implemented with 100 requests per minute per IP
2. **CORS**: Configured for specific origins
3. **Input Validation**: All inputs are sanitized and validated
4. **Error Handling**: No sensitive information exposed in errors

### Database Security

1. **Row Level Security**: Enabled on all tables
2. **Public Read Access**: Only read operations allowed for public
3. **No Write Access**: Public users cannot modify data

### Frontend Security

1. **Content Security Policy**: Configured in production
2. **HTTPS Only**: All production deployments use HTTPS
3. **No Sensitive Data**: No API keys or secrets in frontend code

## 📊 Monitoring and Logging

### Health Checks

- **API Health**: `GET /health`
- **Database Connection**: Automatically checked
- **Service Status**: Real-time monitoring

### Logging

- **Request Logging**: All API requests logged
- **Error Logging**: Comprehensive error tracking
- **Performance Metrics**: Response time tracking

## 🔄 Data Synchronization

### Automatic Sync

The application includes a background sync service that:
- Fetches Flutter documentation
- Updates package information
- Syncs GitHub issues
- Runs every 6 hours by default

### Manual Sync

Users can trigger manual sync through the dashboard.

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check Supabase URL and key
   - Verify database tables exist
   - Check RLS policies

2. **CORS Errors**
   - Verify ALLOWED_ORIGINS configuration
   - Check frontend API URL

3. **Rate Limiting**
   - Check rate limit configuration
   - Monitor API usage

4. **Build Failures**
   - Check environment variables
   - Verify dependencies
   - Check build logs

### Debug Mode

Set `ENVIRONMENT=development` to enable:
- Detailed error messages
- API documentation
- Debug logging

## 📈 Performance Optimization

### Backend

- **Caching**: Implemented for frequently accessed data
- **Pagination**: All endpoints support pagination
- **Rate Limiting**: Prevents abuse
- **Connection Pooling**: Efficient database connections

### Frontend

- **Code Splitting**: Automatic code splitting
- **Lazy Loading**: Components loaded on demand
- **Caching**: Browser caching for static assets
- **Compression**: Gzip compression enabled

## 🔄 Updates and Maintenance

### Regular Updates

1. **Dependencies**: Keep dependencies updated
2. **Security Patches**: Apply security updates promptly
3. **Data Sync**: Monitor sync status
4. **Performance**: Monitor performance metrics

### Backup Strategy

- **Database**: Supabase provides automatic backups
- **Code**: Version control with Git
- **Configuration**: Environment variables documented

## 📞 Support

For issues and support:
1. Check the troubleshooting section
2. Review application logs
3. Check health endpoints
4. Contact the development team

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database tables created
- [ ] RLS policies set up
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Health checks working
- [ ] Data sync running
- [ ] Monitoring set up
- [ ] SSL certificate valid
- [ ] Performance optimized
- [ ] Error handling tested
- [ ] Security review completed

---

**Happy Deploying! 🚀**
