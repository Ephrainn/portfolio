# Quick Start: Configure Email in 3 Steps

## Recommended Method: PHPMailer with Gmail

### Step 1: Download PHPMailer
1. Go to: https://github.com/PHPMailer/PHPMailer/releases/latest
2. Download the ZIP file
3. Extract it
4. Copy the `PHPMailer` folder to your project:
   ```
   My-Portfolio/
   ├── PHPMailer/
   │   └── src/
   │       ├── PHPMailer.php
   │       ├── SMTP.php
   │       └── Exception.php
   └── send_email.php
   ```

### Step 2: Get Gmail App Password
1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Click **App passwords**
4. Select **Mail** → **Other (Custom name)**
5. Name it "Portfolio Contact Form"
6. Click **Generate**
7. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 3: Update send_email.php

Open `send_email.php` and make these 2 changes:

**Change 1: Enable PHPMailer (Line 72)**
- Find this line: `$usePHPMailer = false; // Set to true to use PHPMailer`
- Change it to: `$usePHPMailer = true; // Set to true to use PHPMailer`

**Change 2: Add Your Gmail App Password (Line 91)**
- Find this line: `$mail->Password   = 'YOUR_APP_PASSWORD_HERE'; // Your Gmail App Password (16 characters)`
- Replace `'YOUR_APP_PASSWORD_HERE'` with your actual 16-character App Password (remove any spaces)

**Example of what it should look like:**
```php
// Line 72 - Change from:
$usePHPMailer = false; // Set to true to use PHPMailer

// To:
$usePHPMailer = true; // Set to true to use PHPMailer

// Line 91 - Change from:
$mail->Password   = 'YOUR_APP_PASSWORD_HERE'; // Your Gmail App Password (16 characters)

// To (using your actual password, no spaces):
$mail->Password   = 'abcdefghijklmnop'; // Your Gmail App Password (16 characters)
```

**That's it!** Just those 2 changes.

### Done! 
Test your contact form - it should now send emails to asedaquarshie@gmail.com

---

## Alternative: Basic PHP mail() (Less Reliable)

If you prefer not to use PHPMailer, see `PHPMailer_Setup_Guide.md` for instructions on configuring XAMPP's mail() function.

