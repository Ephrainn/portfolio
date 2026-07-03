# PHP Mail Configuration Guide for XAMPP

## Option 1: Using PHPMailer with Gmail SMTP (RECOMMENDED)

This is the most reliable method and works well with Gmail.

### Step 1: Download PHPMailer

1. Go to: https://github.com/PHPMailer/PHPMailer/releases
2. Download the latest release (ZIP file)
3. Extract the ZIP file
4. Copy the `PHPMailer` folder to your project directory:
   ```
   My-Portfolio/
   ├── PHPMailer/
   │   ├── src/
   │   │   ├── PHPMailer.php
   │   │   ├── SMTP.php
   │   │   └── Exception.php
   │   └── ...
   ├── send_email.php
   └── ...
   ```

### Step 2: Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** (left sidebar)
3. Enable **2-Step Verification** if not already enabled
4. Scroll down to **App passwords**
5. Click **App passwords**
6. Select **Mail** and **Other (Custom name)**
7. Enter "Portfolio Contact Form" as the name
8. Click **Generate**
9. Copy the 16-character password (you'll need this for the PHP file)

### Step 3: Update send_email.php

The file has been updated to use PHPMailer. You just need to:
1. Make sure the PHPMailer folder is in your project
2. Update your Gmail credentials in `send_email.php` (lines 54-55)

---

## Option 2: Configure PHP mail() Function (Basic - Less Reliable)

### For XAMPP on Windows:

1. Open `php.ini` file:
   - Location: `C:\xampp\php\php.ini`
   - Or click "Config" → "php.ini" in XAMPP Control Panel

2. Find the `[mail function]` section and configure:

```ini
[mail function]
SMTP = smtp.gmail.com
smtp_port = 587
sendmail_from = your-email@gmail.com
sendmail_path = "\"C:\xampp\sendmail\sendmail.exe\" -t"
```

3. Configure sendmail.ini:
   - Location: `C:\xampp\sendmail\sendmail.ini`
   - Update with your Gmail credentials:

```ini
[sendmail]
smtp_server=smtp.gmail.com
smtp_port=587
error_logfile=error.log
debug_logfile=debug.log
auth_username=your-email@gmail.com
auth_password=your-app-password
force_sender=your-email@gmail.com
```

4. Restart Apache in XAMPP Control Panel

**Note:** This method is less reliable and may not work with all email providers due to security restrictions.

---

## Testing

After setup, test the contact form:
1. Fill out the form on your website
2. Submit it
3. Check your email inbox (and spam folder)
4. You should receive the message

---

## Troubleshooting

### If emails don't send:

1. **Check PHP error logs:**
   - Location: `C:\xampp\php\logs\php_error_log`
   - Or enable error display in `send_email.php` (uncomment lines 3-4)

2. **Verify Gmail App Password:**
   - Make sure you're using the App Password, not your regular Gmail password
   - App Passwords are 16 characters with spaces (remove spaces when using)

3. **Check file paths:**
   - Make sure PHPMailer folder is in the correct location
   - Verify the path in `send_email.php` matches your folder structure

4. **Test SMTP connection:**
   - You can test the SMTP connection separately using a PHP script

---

## Security Note

Never commit your email credentials to version control (Git). Consider using environment variables or a config file that's excluded from Git.

