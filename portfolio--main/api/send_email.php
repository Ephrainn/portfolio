<?php
// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 0 to avoid breaking JSON, but log errors
ini_set('log_errors', 1);

// Start output buffering to catch any unexpected output
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
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

// Your email address (where you want to receive messages)
$to = 'asedaquarshie@gmail.com';

// Email subject
$subject = 'New Contact Form Message from ' . $name;

// Email body
$emailBody = "You have received a new message from your portfolio contact form.\n\n";
$emailBody .= "Name: " . $name . "\n";
$emailBody .= "Email: " . $email . "\n\n";
$emailBody .= "Message:\n" . $message . "\n";

// ============================================
// EMAIL CONFIGURATION - PHPMailer with Gmail SMTP
// ============================================

$usePHPMailer = true; // Set to true to use PHPMailer

if ($usePHPMailer) {
    // Check if PHPMailer exists (path from /api directory to root)
    $phpmailerPath = __DIR__ . '/../PHPMailer-7.0.1/src/PHPMailer.php';

    if (file_exists($phpmailerPath)) {
        require_once __DIR__ . '/../PHPMailer-7.0.1/src/Exception.php';
        require_once __DIR__ . '/../PHPMailer-7.0.1/src/PHPMailer.php';
        require_once __DIR__ . '/../PHPMailer-7.0.1/src/SMTP.php';

        $mail = new PHPMailer\PHPMailer\PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->SMTPDebug = 2; // Enable verbose debug output
            $mail->Debugoutput = function($str, $level) {
                error_log("PHPMailer: $str");
            };
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'asedaquarshie@gmail.com';
            $mail->Password = 'tqho efyo buta peze';
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;
            $mail->CharSet = 'UTF-8';

            // Recipients
            $mail->setFrom('asedaquarshie@gmail.com', 'Portfolio');
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
            exit;
        } catch (PHPMailer\PHPMailer\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'SMTP Error: ' . $mail->ErrorInfo,
                'exception' => $e->getMessage(),
                'phpmailer_path' => $phpmailerPath,
                'openssl' => extension_loaded('openssl') ? 'yes' : 'NO - missing!',
                'php_version' => phpversion()
            ]);
            exit;
        }
    } else {
        // PHPMailer not found
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'PHPMailer not found',
            'looked_at' => $phpmailerPath,
            'dir' => __DIR__
        ]);
        exit;
    }
} else {
    // Fallback to basic mail() function
    $headers = "From: " . $name . " <" . $email . ">\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Send email
    $mailSent = mail($to, $subject, $emailBody, $headers);

    if ($mailSent) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Sorry, there was an error sending your message. Please try again later or contact me directly at asedaquarshie@gmail.com'
        ]);
    }
}

?>