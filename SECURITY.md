# Security Guidelines

## API Key Protection

### ⚠️ IMPORTANT: Never Commit API Keys

Your Golf Course API key is sensitive information that should never be exposed in your code repository.

### Current Security Measures

✅ **API Key Stored in Environment Variables**
- Located in `.env` file (not committed to git)
- Accessed via `import.meta.env.VITE_GOLF_API_KEY`
- Graceful fallback when API key is missing

✅ **Git Protection**
- `.env` added to `.gitignore`
- `.env.example` provided as template
- No API keys in source code

### Setup Instructions

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your API key to `.env`:**
   ```
   VITE_GOLF_API_KEY=your_actual_api_key_here
   ```

3. **Never commit the `.env` file:**
   ```bash
   git add .env.example  # ✅ This is safe
   git add .env          # ❌ Never do this!
   ```

### If You Accidentally Expose Your API Key

1. **Immediately regenerate** your API key at golfcourseapi.com
2. **Update** your local `.env` file with the new key
3. **Check git history** and remove any commits containing the old key
4. **Consider** the old key compromised and monitor usage

### Deployment Security

When deploying to production:
- Set environment variables in your hosting platform
- Never include `.env` files in deployment packages
- Use platform-specific secret management (Vercel, Netlify, etc.)

### Additional Security Tips

- **Rotate API keys** periodically
- **Monitor API usage** for unexpected activity
- **Use HTTPS only** for all API requests
- **Implement rate limiting** on your application side