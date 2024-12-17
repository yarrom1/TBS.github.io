<?php
// Настройки подключения к Google Cloud SQL через Public IP
$host = '34.147.87.184'; // Публичный IP вашего Cloud SQL инстанса
$dbname = 'tournament_db';
$username = 'your-sql-username'; // Имя пользователя MySQL
$password = 'your-sql-password'; // Пароль от MySQL

try {
    // Подключение к базе данных MySQL через Public IP
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Ошибка подключения к базе данных: " . $e->getMessage());
}

// Обработка формы регистрации
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = $_POST['username'];
    $pass = password_hash($_POST['password'], PASSWORD_BCRYPT);

    // Проверка на существующего пользователя
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->execute(['username' => $user]);
    if ($stmt->fetch()) {
        die("Пользователь с таким именем уже существует.");
    }

    // Вставка данных в таблицу
    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, password, created_at) VALUES (:username, :password, NOW())");
        $stmt->execute(['username' => $user, 'password' => $pass]);
        echo "Пользователь успешно зарегистрирован!";
    } catch (PDOException $e) {
        die("Ошибка регистрации: " . $e->getMessage());
    }
}
?>
