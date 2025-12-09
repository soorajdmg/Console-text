# GitHub Pages Deployment Guide

This guide will help you deploy your Console-text landing page to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed on your machine
- Your code pushed to a GitHub repository

## Setup Complete ✓

The following configuration has already been done:

1. **gh-pages package installed** - Handles GitHub Pages deployment
2. **vite.config.js configured** - Base path set to `/Console-text/`
3. **Deploy scripts added to package.json**:
   - `predeploy`: Automatically builds the project before deployment
   - `deploy`: Deploys the built files to GitHub Pages

## Deployment Steps

### Step 1: Push Your Code to GitHub

If you haven't already created a GitHub repository:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - Console-text landing page"

# Create a new repository on GitHub (via GitHub website)
# Then connect your local repo to GitHub:
git remote add origin https://github.com/YOUR_USERNAME/Console-text.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to GitHub Pages

Run the deployment command:

```bash
npm run deploy
```

This command will:
1. Build your project (`npm run build`)
2. Create a `gh-pages` branch (if it doesn't exist)
3. Push the `dist` folder contents to the `gh-pages` branch

### Step 3: Enable GitHub Pages

1. Go to your GitHub repository
2. Click on **Settings**
3. Scroll down to **Pages** (in the left sidebar)
4. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

### Step 4: Access Your Site

After a few minutes, your site will be live at:

```
https://YOUR_USERNAME.github.io/Console-text/
```

## Updating Your Site

Whenever you make changes to your code:

```bash
# Make your changes
# Then commit them
git add .
git commit -m "Your commit message"
git push origin main

# Deploy the changes
npm run deploy
```

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a file named `CNAME` in the `public` folder with your domain name:
   ```
   yourdomain.com
   ```

2. Configure your domain's DNS settings:
   - Add a CNAME record pointing to `YOUR_USERNAME.github.io`

3. In GitHub Settings > Pages, enter your custom domain

4. Redeploy:
   ```bash
   npm run deploy
   ```

## Troubleshooting

### Issue: 404 Page Not Found

- Make sure the `base` path in `vite.config.js` matches your repository name
- Current setting: `base: '/Console-text/'`
- If your repo name is different, update this value

### Issue: Blank Page After Deployment

- Check the browser console for errors
- Verify that the `base` path is correct
- Clear browser cache and try again

### Issue: Changes Not Showing

- Wait a few minutes for GitHub Pages to rebuild
- Hard refresh your browser (Ctrl + Shift + R)
- Check that you ran `npm run deploy` after making changes

## Project Structure

```
Console-text/
├── dist/              # Built files (generated, not committed)
├── public/            # Static assets
├── src/               # Source code
├── vite.config.js     # Vite configuration (with base path)
├── package.json       # Deploy scripts configured
└── DEPLOYMENT.md      # This file
```

## Important Notes

- The `dist` folder is generated during build and should NOT be committed to your main branch
- The `gh-pages` branch is created automatically and contains only the built files
- Your source code stays on the `main` branch
- API keys from backend will work on GitHub Pages (CORS must be configured on backend)

## Backend API Considerations

Your frontend is configured to connect to:
```
https://api-production-298e.up.railway.app/v1
```

Make sure your Railway backend allows requests from your GitHub Pages domain:
- `https://YOUR_USERNAME.github.io`

Add this to your backend's CORS configuration if needed.

## Next Steps

After deployment:
1. Test all functionality on the live site
2. Verify API key signup flow works
3. Check mobile responsiveness
4. Share your live site URL!

---

**Live Site URL**: https://YOUR_USERNAME.github.io/Console-text/

Replace `YOUR_USERNAME` with your actual GitHub username.
