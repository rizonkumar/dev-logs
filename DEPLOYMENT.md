# Vercel Deployment Guide

This guide will help you deploy both the frontend and backend of your Dev Logs application to Vercel.

## Prerequisites

1. A Vercel account (https://vercel.com)
2. GitHub repository with your code
3. MongoDB database (MongoDB Atlas recommended for production)

## Backend Environment Variables

Set these environment variables in your Vercel backend project:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
PORT=3000
GITHUB_TOKEN=your_github_token (if using GitHub API)
```

## Frontend Environment Variables

Set these environment variables in your Vercel frontend project:

```
VITE_API_URL=https://your-backend-deployment-url.vercel.app/api
```

## Deployment Options

### Option 1: Separate Deployments (Recommended)

Deploy frontend and backend as separate Vercel projects:

#### Deploy Backend:

1. Push your code to GitHub
2. Go to Vercel dashboard
3. Click "New Project"
4. Import your repository
5. Set root directory to `backend`
6. Add environment variables mentioned above
7. Deploy

#### Deploy Frontend:

1. In Vercel dashboard, click "New Project" again
2. Import the same repository
3. Set root directory to `frontend`
4. Add the `VITE_API_URL` environment variable with your backend URL
5. Deploy

### Option 2: Monorepo Deployment

Deploy both from the root directory using the provided `vercel.json` configuration:

1. Push your code to GitHub
2. Go to Vercel dashboard
3. Click "New Project"
4. Import your repository
5. Keep root directory as default (root)
6. Add all environment variables
7. Deploy

## Post-Deployment Steps

1. **Update API URL**: After backend deployment, update the `VITE_API_URL` in your frontend environment variables
2. **Test Endpoints**: Verify all API endpoints work correctly
3. **Database Connection**: Ensure MongoDB connection is working
4. **CORS Configuration**: Make sure CORS is configured for your frontend domain

## Common Issues and Solutions

### 1. API Not Found (404)

- Check that API routes start with `/api/`
- Verify `vercel.json` routing configuration

### 2. Database Connection Issues

- Ensure MongoDB URI is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Verify environment variables are set correctly

### 3. CORS Errors

- Add your Vercel frontend domain to CORS configuration
- Check CORS middleware in `backend/server.js`

### 4. Build Failures

- Check all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check for any build-time environment variables

## Environment Files

Create these files for local development:

### `frontend/.env.local`

```
VITE_API_URL=http://localhost:5001/api
```

### `backend/.env`

```
NODE_ENV=development
MONGODB_URI=your_local_mongodb_uri
PORT=5001
GITHUB_TOKEN=your_github_token
```

## Monitoring

- Use Vercel dashboard to monitor deployments
- Check function logs for debugging
- Set up monitoring for your database

## Support

If you encounter issues:

1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints manually
4. Check network requests in browser dev tools
