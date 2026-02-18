<?php
include "db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST['name'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($name) || empty($phone) || empty($email) || empty($password)) {
        echo "Error: Missing fields";
        exit;
    }

    // check duplicate email
    $check = $conn->prepare("SELECT * FROM users WHERE Email=?");
    $check->bind_param("s", $email);
    $check->execute();
    $res = $check->get_result();

    if ($res->num_rows > 0) {
        echo "Error: Email already exists";
    } else {
        // hash password before saving
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO users (Name, phone, Email, Password, Date) VALUES (?, ?, ?, ?, current_timestamp())");
        $stmt->bind_param("ssss", $name, $phone, $email, $hashedPassword);

        if ($stmt->execute()) {
            echo "success";
        } else {
            echo "Error: " . $stmt->error;
        }
        $stmt->close();
    }
} else {
    echo "Error: Not a POST request";
}
?>
