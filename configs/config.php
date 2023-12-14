<?php

        $dbHost = "localhost";
		$dbName = "task-manager";
		$dbUser = "root";
		$dbPass = "";

$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
mysqli_set_charset($conn, "utf8mb4");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

