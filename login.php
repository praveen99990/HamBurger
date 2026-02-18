<?php
session_start();
include "db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email'] ?? '');
    $passwordInput = $_POST['password'] ?? '';

    $stmt = $conn->prepare("SELECT * FROM users WHERE Email=? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();

        if (password_verify($passwordInput, $row['Password'])) {
            // ✅ Save user info in session
            $_SESSION['user_id'] = $row['ID'];
            $_SESSION['user_name'] = $row['Name'];

            echo "success";
        } else {
            echo "Invalid password";
        }
    } else {
        echo "Invalid email";
    }
    $stmt->close();
}
?>
