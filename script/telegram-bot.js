// telegram-bot.js
class TelegramBot {
    constructor() {
        this.botToken = 'TOKEN';
        this.chatId = 'chat_id';
        this.apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    }

    async sendMessage(formData) {
        try {
            const message = this.formatMessage(formData);

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            const result = await response.json();

            if (result.ok) {
                return { success: true, message: 'Сообщение отправлено!' };
            } else {
                throw new Error(result.description || 'Ошибка отправки');
            }
        } catch (error) {
            console.error('Ошибка отправки в Telegram:', error);
            return {
                success: false,
                message: 'Ошибка отправки сообщения. Попробуйте позже.'
            };
        }
    }

    formatMessage(data) {
        return `
<b>📩 Новая заявка с сайта</b>

<b>👤 Имя:</b> ${data.name}
<b>📞 Телефон:</b> ${data.phone}
<b>📧 Email:</b> ${data.email}
<b>💬 Сообщение:</b> ${data.message}

<b>⏰ Время:</b> ${new Date().toLocaleString('ru-RU')}
        `.trim();
    }
}

// Создаем экземпляр бота
const telegramBot = new TelegramBot();