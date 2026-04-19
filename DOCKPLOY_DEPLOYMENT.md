# Dockploy Deployment Guide

## Overview
This Next.js application is ready for deployment on Dockploy. It uses file-based storage (JSON) rather than a database, which requires persistent volume configuration.

## Prerequisites
- Dockploy account and server configured
- Git repository with this code pushed
- SSH access to your Dockploy server

## Deployment Steps

### 1. **Push to Git Repository**
```bash
git add .
git commit -m "Add Docker configuration"
git push origin main
```

### 2. **Create Application on Dockploy**

1. Log in to Dockploy dashboard
2. Click **"New Application"**
3. Select **"Docker"** as deployment type
4. Choose your Git repository
5. Select the branch (usually `main`)

### 3. **Configure Docker Settings**

In Dockploy application settings:

**Build Configuration:**
- **Dockerfile path:** `./Dockerfile` (important: specify this to avoid Nixpacks auto-detection)
- **Build context:** `/` (root of repository)
- **Build method:** Docker (not Nixpacks)
- If prompted, disable Nixpacks auto-detection

**Port Configuration:**
- Container port: `3000`
- Expose port: `3000`
- Public port: `80` (HTTP) or `443` (HTTPS)

### 4. **Persistent Data Storage**

**Critical:** This app stores data in `.data/store.json`. You MUST configure persistent storage:

In Dockploy volumes settings:
- **Mount path:** `/app/.data`
- **Volume type:** Named volume or persistent storage
- **Size:** 1GB recommended

Alternatively, add to your `docker-compose.yml`:
```yaml
volumes:
  data:
    driver: local

services:
  app:
    volumes:
      - data:/app/.data
```

### 5. **Environment Variables** (Optional)

Add these in Dockploy environment settings if needed:
```
NODE_ENV=production
```

### 6. **Deploy**

1. Click **"Deploy"** button in Dockploy
2. Watch the build logs
3. Once deployed, access your app at the provided URL

## Post-Deployment

### Admin Access
- URL: `https://yourdomain.com/admin/login`
- Email: `admin@local`
- Password: `admin123` (change this after first login)

### Data Backup
Set up regular backups of `.data/store.json`:
```bash
docker exec <container-name> cat /app/.data/store.json > backup.json
```

Or configure Dockploy's backup feature for the persistent volume.

## Troubleshooting

### Nixpacks build fails with "mount src= ... not a directory" error
This happens when Dockploy uses Nixpacks auto-detection instead of your custom Dockerfile. **Fix:**
1. Stop the current deployment
2. Go to application settings → Build configuration
3. Set **Dockerfile path** to `./Dockerfile`
4. Disable Nixpacks if there's a toggle
5. Restart deployment

The custom Dockerfile in the repository is optimized and will work without these cache mount issues.

### "Invalid request" on login
- Ensure the persistent volume is mounted correctly
- Check that `.data/store.json` exists and is readable
- Verify the admin user was created during first boot

### Build fails
- Check that `pnpm-lock.yaml` is committed
- Ensure all dependencies are listed in `package.json`
- Review build logs in Dockploy dashboard

### App crashes after deployment
- Check container logs: `docker logs <container-name>`
- Verify volume mount path is `/app/.data`
- Ensure sufficient disk space on the server

## Local Testing with Docker

Test locally before deploying:

```bash
# Build the image
docker build -t node-studios .

# Run the container
docker run -p 3000:3000 -v data:/app/.data node-studios

# Or use docker-compose
docker-compose up
```

Access at `http://localhost:3000`

## Production Recommendations

1. **Enable HTTPS** - Use Dockploy's SSL/TLS configuration
2. **Set environment** - Ensure `NODE_ENV=production`
3. **Backup schedule** - Set up daily backups of `.data` volume
4. **Monitoring** - Enable Dockploy's health checks
5. **Update credentials** - Change default admin password after first login

## File Structure Reference

```
.data/store.json        ← Persistent data (all projects, users, messages)
public/uploads/         ← User-uploaded files
.next/                  ← Built application (generated)
```

## Additional Resources

- [Dockploy Documentation](https://dockploy.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
