<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "eCanteen";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);
$customerName = $data['customerName'];
$tableNumber = $data['tableNumber'];
$products = $data['products'];

$sql = "INSERT INTO customers (customer_name) VALUES ('$customerName')";
$conn->query($sql);
$customerId = $conn->insert_id;

foreach ($products as $product) {
    $productId = $product['id'];
    $quantity = $product['quantity'];
    $conn->query("INSERT INTO orders (customer_id, product_id, quantity) VALUES ($customerId, $productId, $quantity)");
}

$response = ["message" => "Order placed successfully"];
echo json_encode($response);

$conn->close();
?>
