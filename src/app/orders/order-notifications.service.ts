import { Service } from '@angular/core';
import { telegramConfig } from '../core/telegram.config';
import { OrderLine } from '../models/order.model';

@Service()
export class OrderNotificationsService {
  async notifyNewOrder(orderNumber: string, lines: readonly OrderLine[], total: number) {
    const itemsText = lines.map((line) => `${line.name} — ${line.quantity} шт.`).join('\n');
    const text = `🆕 Нове замовлення ${orderNumber}\n\n${itemsText}\n\nРазом: ${formatMoney(total)}`;

    try {
      await fetch(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: telegramConfig.chatId, text }),
      });
    } catch {
      // Notification failure must never block order placement.
    }
  }
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}
