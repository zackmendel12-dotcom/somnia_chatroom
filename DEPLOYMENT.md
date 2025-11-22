# Deployment Guide

This guide explains how to deploy the Somnia On-Chain Chat application to production.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Recommended Platforms](#recommended-platforms)
- [Production Checklist](#production-checklist)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## Overview

The application consists of two parts that must be deployed separately:

1. **Backend (Express Server)**: Handles all Somnia Data Streams operations
2. **Frontend (Static Site)**: React application served as static files

## Prerequisites

- Node.js 16+ installed on deployment servers
- Server wallet with STT tokens for gas fees
- Domain names (optional but recommended):
  - Backend: `api.yourapp.com`
  - Frontend: `yourapp.com`
- SSL certificates (Let's Encrypt recommended)

## Environment Configuration

### Backend Environment Variables

Create a `.env` file on the backend server:

```bash
# Somnia Network
VITE_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
VITE_SOMNIA_CHAIN_ID=50312
VITE_SOMNIA_SCHEMA_ID=0x...  # Your schema ID
VITE_CHAT_SCHEMA=uint64 timestamp,bytes32 roomId,string content,string senderName,address sender

# Server Wallet (⚠️ KEEP SECRET!)
PRIVATE_KEY=your_production_private_key

# RainbowKit
VITE_RAINBOWKIT_PROJECT_ID=your_project_id

# Server Config
SERVER_PORT=4000
VITE_ORIGIN=https://yourapp.com  # Your frontend URL
VITE_API_BASE_URL=https://api.yourapp.com  # Your backend URL
```

### Frontend Environment Variables

For Vite builds, create `.env.production`:

```bash
VITE_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
VITE_SOMNIA_CHAIN_ID=50312
VITE_SOMNIA_SCHEMA_ID=0x...  # Same as backend
VITE_CHAT_SCHEMA=uint64 timestamp,bytes32 roomId,string content,string senderName,address sender
VITE_RAINBOWKIT_PROJECT_ID=your_project_id
VITE_API_BASE_URL=https://api.yourapp.com  # Your backend URL
```

**Important**: The `VITE_` variables are embedded in the frontend bundle at build time.

## Backend Deployment

### Option 1: VPS (Digital Ocean, Linode, AWS EC2)

1. **SSH into your server**:
   ```bash
   ssh user@your-server-ip
   ```

2. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd somnia_chatroom
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Create `.env` file** with production values

5. **Build the server**:
   ```bash
   npm run build:server
   ```

6. **Set up process manager** (PM2 recommended):
   ```bash
   npm install -g pm2
   pm2 start dist/server/index.js --name somnia-chat-api
   pm2 save
   pm2 startup
   ```

7. **Configure reverse proxy** (nginx):
   ```nginx
   server {
       listen 80;
       server_name api.yourapp.com;
       
       location / {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Set up SSL** (Let's Encrypt):
   ```bash
   sudo certbot --nginx -d api.yourapp.com
   ```

### Option 2: Platform-as-a-Service (Heroku, Render, Railway)

1. **Create a new app** on your platform

2. **Set environment variables** in the platform dashboard

3. **Add a `Procfile`** (for Heroku/Render):
   ```
   web: node dist/server/index.js
   ```

4. **Add build script** to `package.json` if needed:
   ```json
   {
     "scripts": {
       "heroku-postbuild": "npm run build:server"
     }
   }
   ```

5. **Deploy**:
   ```bash
   git push heroku main
   # or use platform's CLI/GitHub integration
   ```

### Option 3: Docker Container

1. **Create `Dockerfile`**:
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build:server
   
   EXPOSE 4000
   CMD ["node", "dist/server/index.js"]
   ```

2. **Build image**:
   ```bash
   docker build -t somnia-chat-api .
   ```

3. **Run container**:
   ```bash
   docker run -d \
     --name somnia-chat-api \
     -p 4000:4000 \
     --env-file .env \
     somnia-chat-api
   ```

## Frontend Deployment

### Option 1: Static Site Hosting (Vercel, Netlify, Cloudflare Pages)

1. **Build the frontend**:
   ```bash
   npm run build:client
   ```
   This creates optimized files in `dist/`

2. **Deploy to platform**:

   **Vercel**:
   ```bash
   npm install -g vercel
   vercel --prod
   ```

   **Netlify**:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

   **Cloudflare Pages**:
   - Connect your GitHub repo
   - Build command: `npm run build:client`
   - Publish directory: `dist`

3. **Set environment variables** in platform dashboard

### Option 2: S3 + CloudFront (AWS)

1. **Build the frontend**:
   ```bash
   npm run build:client
   ```

2. **Create S3 bucket**:
   ```bash
   aws s3 mb s3://yourapp-frontend
   aws s3 website s3://yourapp-frontend \
     --index-document index.html \
     --error-document index.html
   ```

3. **Upload files**:
   ```bash
   aws s3 sync dist/ s3://yourapp-frontend
   ```

4. **Create CloudFront distribution** pointing to S3 bucket

5. **Set up custom domain** and SSL certificate

### Option 3: Self-Hosted (nginx)

1. **Build the frontend**:
   ```bash
   npm run build:client
   ```

2. **Copy to web server**:
   ```bash
   scp -r dist/* user@your-server:/var/www/yourapp
   ```

3. **Configure nginx**:
   ```nginx
   server {
       listen 80;
       server_name yourapp.com;
       root /var/www/yourapp;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Set up SSL**:
   ```bash
   sudo certbot --nginx -d yourapp.com
   ```

## Recommended Platforms

### For Hackathon/Demo

- **Backend**: Railway or Render (easy setup, free tier)
- **Frontend**: Vercel or Netlify (instant deployments, free tier)

### For Production

- **Backend**: AWS ECS, Google Cloud Run, or DigitalOcean App Platform
- **Frontend**: Vercel, Cloudflare Pages, or AWS CloudFront + S3

## Production Checklist

### Security

- [ ] Private key stored in secure secrets manager (AWS Secrets Manager, Vault, etc.)
- [ ] CORS configured to only allow your frontend domain
- [ ] Rate limiting enabled on API endpoints
- [ ] Input validation on all endpoints
- [ ] HTTPS enabled for both frontend and backend
- [ ] CSP (Content Security Policy) headers configured
- [ ] Server wallet has limited funds (only what's needed)

### Performance

- [ ] CDN configured for frontend assets
- [ ] Gzip/Brotli compression enabled
- [ ] Database/caching layer for room metadata (Redis, PostgreSQL)
- [ ] Connection pooling for blockchain RPC
- [ ] API response caching where appropriate

### Monitoring

- [ ] Error tracking (Sentry, Rollbar)
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Log aggregation (Datadog, CloudWatch, Papertrail)
- [ ] Blockchain transaction monitoring
- [ ] Server wallet balance alerts

### Backup & Recovery

- [ ] Room data backed up regularly (if using file storage)
- [ ] Deployment rollback plan documented
- [ ] Private key backup in secure location
- [ ] Database snapshots (if using DB)

## Monitoring and Maintenance

### Health Checks

The backend provides a health endpoint:

```bash
curl https://api.yourapp.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "somniaInitialized": true
}
```

### Logs

**Backend logs to watch**:
- Somnia SDK initialization success/failure
- Schema registration attempts
- Message publishing errors
- RPC connection issues

**Frontend errors to track**:
- Failed API calls
- Wallet connection issues
- Message send failures

### Maintenance Tasks

**Daily**:
- Check server wallet STT balance
- Monitor error rates in logs

**Weekly**:
- Review transaction costs and optimize if needed
- Check for security updates in dependencies

**Monthly**:
- Rotate server private key
- Review and archive old chat room data
- Update dependencies (`npm audit fix`)

### Scaling Considerations

**When to scale**:
- Backend CPU/memory usage consistently > 70%
- API response times > 2 seconds
- More than 100 concurrent users

**How to scale**:
1. **Horizontal scaling**: Deploy multiple backend instances behind load balancer
2. **Database**: Move room storage from JSON file to PostgreSQL/MongoDB
3. **Caching**: Add Redis for frequent queries
4. **CDN**: Use CDN for frontend and API responses where possible

### Troubleshooting Common Issues

**Backend won't start**:
- Check PRIVATE_KEY is set correctly
- Verify RPC URL is accessible
- Ensure PORT is not in use

**Messages not appearing**:
- Check server wallet has STT tokens
- Verify schema ID matches between frontend and backend
- Check backend logs for transaction errors

**CORS errors**:
- Verify VITE_ORIGIN matches actual frontend URL
- Check CORS headers in nginx/proxy configuration

**High gas costs**:
- Check for duplicate schema registrations
- Optimize message content (compress text)
- Consider batching messages

## Support

For deployment issues:
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Review [ENV_SETUP.md](./ENV_SETUP.md) for environment variables
- Open an issue on GitHub with deployment logs

---

**Last Updated**: November 2025 for Somnia Data Streams Mini Hackathon
