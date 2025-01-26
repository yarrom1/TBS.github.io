// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Railway автоматически задаёт process.env.PORT.
// Локально можно использовать 3000, если PORT не задан.
const PORT = process.env.PORT || 8080;

// Позволяем серверу парсить JSON-тело запросов
app.use(express.json());

// POST /api/save-result — записывает данные в 1.json
app.post("/api/save-result", (req, res) => {
  const newResult = req.body; 
  // Ожидается, что клиент пришлёт нечто вроде:
  // {
  //   "nickname": "TestUser",
  //   "result": 10,
  //   "time": "1/26/2025, 3:15:45 PM"
  // }

  const filePath = path.join(__dirname, "1.json");  // файл, куда пишем

  let existingData = [];
  // Проверяем, существует ли файл 1.json
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      existingData = JSON.parse(raw);
    } catch (err) {
      console.error("Ошибка при чтении/парсинге 1.json. Перезаписываем пустым массивом.");
      existingData = [];
    }
  }

  // Добавляем новый результат в массив
  existingData.push(newResult);

  // Сохраняем обновлённый массив в 1.json
  fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (err) => {
    if (err) {
      console.error("Ошибка записи в 1.json:", err);
      return res.status(500).json({ error: "Не удалось записать данные в файл" });
    }
    // Успешная запись
    return res.json({ message: "Результат успешно сохранён", data: newResult });
  });
});

// Простой GET — проверяем, что сервер работает
app.get("/", (req, res) => {
  res.send("Сервер работает! Попробуйте POST /api/save-result");
});

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
