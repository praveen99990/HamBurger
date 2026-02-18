<?php
$servername = "sql303.infinityfree.com";
$username   = "if0_39919641";
$password   = "2qDe6vjD3Yx"; 
$database   = "if0_39919641_accounts";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
} else {
    echo "✅ Connected successfully!";
}
?>
