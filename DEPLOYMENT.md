# Frontend Deployment Guide - Vercel

This guide will help you deploy the Requestr React frontend to Vercel.

## Prerequisites

1. Create a Vercel account: https://vercel.com
2. Have your code in a Git repository (GitHub, GitLab, Bitbucket)
3. Deploy your backend first and get the API URL

## Setup Steps

### 1. Connect Repository to Vercel

#### Option A: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your Git repository
4. Select the `frontend` folder as the root directory

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel
```

### 2. Configure Build Settings

Vercel will automatically detect this as a React app, but you can customize:

- **Framework Preset**: Create React App
- **Root Directory**: `frontend` (if deploying from monorepo)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `build` (default)
- **Install Command**: `npm install` (default)

### 3. Set Environment Variables

In your Vercel project settings, add:

- `REACT_APP_API_URL`: Your backend API URL
  - For Fly.io: `https://requestr-backend.fly.dev`
  - For Render: `https://your-service-name.onrender.com`
  - For local development: `http://localhost:8000`
- `CI`: Set to `false` to prevent treating warnings as errors

**Note**: The `vercel.json` file already includes `CI=false` in the environment variables to prevent build failures from ESLint warnings.

### 4. Deploy

Vercel will automatically deploy when you push to your connected Git branch.

## Configuration Details

### Automatic Deployments
- **Production**: Deploys from your main/master branch
- **Preview**: Deploys from pull requests and other branches
- **Development**: Local development with `vercel dev`

### Custom Domain
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

### Environment Variables by Branch
You can set different environment variables for different branches:
- Production: `REACT_APP_API_URL=https://your-production-api.com`
- Preview: `REACT_APP_API_URL=https://your-staging-api.com`
- Development: `REACT_APP_API_URL=http://localhost:8000`

## Vercel Configuration File

The `vercel.json` file in the frontend directory configures:
- Static file serving
- Single Page Application routing
- Environment variables

```json
{
  "name": "requestr-frontend",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://requestr-backend.fly.dev"
  }
}
```

## Features

### Performance
- Automatic optimization and compression
- Global CDN distribution
- Image optimization
- Automatic HTTPS

### Development
- Preview deployments for every push
- Real-time collaboration
- Built-in analytics
- Performance monitoring

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify `REACT_APP_API_URL` is set correctly
   - Check CORS configuration in your backend
   - Ensure backend is deployed and accessible

2. **Build Failures**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in `package.json`
   - Test build locally: `npm run build`

3. **Routing Issues**
   - Ensure `vercel.json` has the catch-all route for React Router
   - Check that all routes are properly configured in your React app

### Useful Commands

```bash
# Local development with Vercel
vercel dev

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List deployments
vercel ls
```

## Alternative: Manual Deployment

If you prefer not to connect Git:

1. Build your app locally:
   ```bash
   npm run build
   ```

2. Deploy the build folder:
   ```bash
   vercel --prod build/
   ```

## Monitoring

### Analytics
Enable Vercel Analytics in your project settings for:
- Page views and user sessions
- Performance metrics
- Geographic distribution

### Performance
Monitor your app's performance with:
- Core Web Vitals
- Load times
- Error tracking

## Custom Configuration

### Headers
Add custom headers in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Redirects
Add redirects in `vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}