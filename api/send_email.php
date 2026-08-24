<?php
/**
 * Contact form handler (Vercel serverless function).
 *
 * Required environment variables (Vercel Dashboard -> Settings -> Environment Variables):
 *   GMAIL_USER - the Gmail address that sends and receives the messages
 *   GMAIL_PASS - a Gmail App Password (never the account password)
 */

// Log errors server-side, never display them to visitors
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

ob_start();

// Do not leak server details in responses (e.g. "X-Powered-By: PHP/8.x.x")
header_remove('X-Powered-By');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: no-referrer');
// API responses must never be cached
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

// CORS: only our own origins may call this endpoint (no wildcards)
$allowedOrigins = [
    'https://myportfolio-eaq.vercel.app',
    'http://localhost:3000',
    'http://localhost:8000',
];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Handle both form-urlencoded and JSON input
$name = '';
$email = '';
$message = '';

if (isset($_POST['name'])) {
    // Form-urlencoded data
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
} else {
    // JSON data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if ($data) {
        $name = isset($data['name']) ? trim($data['name']) : '';
        $email = isset($data['email']) ? trim($data['email']) : '';
        $message = isset($data['message']) ? trim($data['message']) : '';
    }
}

// Validate input
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

if (empty($message)) {
    $errors[] = 'Message is required';
}

// If there are validation errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Sanitize input
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Recipient (messages are delivered to the configured Gmail account)
$to = getenv('GMAIL_USER') ?: 'asedaquarshie@gmail.com';

// Email subject
$subject = 'New Contact Form Message from ' . $name;

// Email body
$emailBody = "You have received a new message from your portfolio contact form.\n\n";
$emailBody .= "Name: " . $name . "\n";
$emailBody .= "Email: " . $email . "\n\n";
$emailBody .= "Message:\n" . $message . "\n";

// ============================================
// EMAIL CONFIGURATION - PHPMailer with Gmail SMTP
// Credentials come from environment variables, never from this file.
// ============================================

$gmailUser = getenv('GMAIL_USER') ?: '';
$gmailPass = getenv('GMAIL_PASS') ?: '';
$phpmailerPath = __DIR__ . '/../PHPMailer-7.0.1/src/PHPMailer.php';

if ($gmailUser === '' || $gmailPass === '') {
    error_log('send_email.php: GMAIL_USER / GMAIL_PASS environment variables are not set.');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'The email service is temporarily unavailable. Please try again later.'
    ]);
    exit;
}

if (!file_exists($phpmailerPath)) {
    error_log('send_email.php: PHPMailer library not found at expected path.');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'The email service is temporarily unavailable. Please try again later.'
    ]);
    exit;
}

require_once __DIR__ . '/../PHPMailer-7.0.1/src/Exception.php';
require_once $phpmailerPath;
require_once __DIR__ . '/../PHPMailer-7.0.1/src/SMTP.php';

$mail = new PHPMailer\PHPMailer\PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->SMTPDebug = 0; // No SMTP debug output in production
    $mail->Debugoutput = function ($str, $level) {
        error_log("PHPMailer: $str");
    };
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $gmailUser;
    $mail->Password = $gmailPass;
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';

    // Recipients
    $mail->setFrom($gmailUser, 'Portfolio');
    $mail->addAddress($to, 'Ephraim Aseda Quarshie');
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(false);
    $mail->Subject = $subject;
    $mail->Body = $emailBody;

    $mail->send();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully.'
    ]);
} catch (PHPMailer\PHPMailer\Exception $e) {
    // Log the real error server-side; never expose internals to the visitor
    error_log('send_email.php: mailer error - ' . $mail->ErrorInfo);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, your message could not be sent. Please try again later or email me directly.'
    ]);
}