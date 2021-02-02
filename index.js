require('dotenv').config() // Подключаем модуль который загружает переменные среды из .env файла
const googleTTS = require('google-tts-api') // Подключаем модуль для работы с гугл переводчиком
const { VK } = new require('vk-io') // Подключаем модуль для работы с VK API
const vk = new VK({
    token: process.env.GROUP_TOKEN,
    pollingGroupId: process.env.GROUP_ID,
    apiMode: 'parallel',
  }) // Авторизируемся с помощью токена группы

vk.updates.startPolling() // Начинаем слушать события в сообществе

vk.updates.on('message', async (message) => { // Если событие с тегом message выполняем наш код
    if (!message.text | message.text.length > 200) return message.send('Введите текст до 200 символов') // Проверяем есть ли в сообщении текст и его длину
    const url = await googleTTS.getAudioUrl(message.text, {
        lang: 'ru',
        slow: false,
        host: 'https://translate.google.com',
      }); // Отправляем в гугл переводчик наш текст и ожидаем ответ в виде ссылки на аудио файл 

      message.sendAudioMessage({
        value: url + '.mp3',
        filename: 'song.mp3',
        contentType: 'audio/mp3',
      }) // Отправляем текущему пользователю аудио фацл в виде голосового сообщения
});