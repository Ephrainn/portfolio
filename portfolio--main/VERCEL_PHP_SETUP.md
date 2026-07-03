# Vercel PHP Setup Guide

This project is now configured to work with Vercel's PHP runtime using the `vercel-php` runtime.

## Configuration

The project has been set up with:

1. **`vercel.json`** - Configures Vercel to use PHP runtime for files in the `/api` directory
2. **`api/send_email.php`** - Serverless PHP function for handling contact form submissions
3. **Updated `script.js`** - Now calls `/api/send_email.php` endpoint

## Files Structure

```
Portfolio/
├── api/
│   └── send_email.php      # PHP serverless function
├── PHPMailer-7.0.1/        # PHPMailer library (required)
├── vercel.json             # Vercel configuration
├── script.js               # Updated to call /api/send_email.php
└── send_email.php          # Original file (kept for local XAMPP development)
```

## Deployment Steps

1. **Commit and Push to Git:**
   ```bash
   git add .
   git commit -m "Configure PHP for Vercel deployment"
   git push
   ```

2. **Deploy to Vercel:**
   - If using Vercel CLI:
     ```bash
     vercel
     ```
   - Or connect your Git repository to Vercel Dashboard for automatic deployments

3. **Verify Deployment:**
   - The PHP function will be available at: `https://your-domain.vercel.app/api/send_email.php`
   - Test the contact form on your deployed site

## How It Works

- When a form is submitted, JavaScript sends a POST request to `/api/send_email.php`
- Vercel recognizes PHP files in the `/api` directory and runs them using the `vercel-php` runtime
- The PHP function uses PHPMailer to send emails via Gmail SMTP
- Response is sent back as JSON to the frontend

## Local Development

For local development with XAMPP, you can still use the original `send_email.php` file in the root directory. Just update `script.js` temporarily to call `send_email.php` instead of `/api/send_email.php`.

Or run both side by side - use `/api/send_email.php` for Vercel deployment and `send_email.php` for local XAMPP testing.

## Troubleshooting

If emails don't send after deployment:

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Check the logs for `api/send_email.php` to see any errors

2. **Verify PHPMailer Path:**
   - Make sure `PHPMailer-7.0.1` folder is in the project root
   - The path in `api/send_email.php` should be `../PHPMailer-7.0.1/src/PHPMailer.php`

3. **Test the API Endpoint Directly:**
   - Use Postman or curl to test the endpoint:
     ```bash
     curl -X POST https://your-domain.vercel.app/api/send_email.php \
       -H "Content-Type: application/x-www-form-urlencoded" \
       -d "name=Test&email=test@example.com&message=Test message"
     ```

## Resources

- [Vercel PHP Runtime Documentation](https://php.vercel.app/)
- [Vercel PHP GitHub Repository](https://github.com/vercel-community/php)
- Video Tutorial: [How to Deploy PHP on Vercel](https://youtu.be/Txy-0kuXnQ8)

