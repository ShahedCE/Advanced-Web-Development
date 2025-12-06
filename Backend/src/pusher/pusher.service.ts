import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';

@Injectable()
export class PusherService {
  private pusher: any;

  constructor() {
    this.pusher = new (Pusher as any)({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    });
  }

  // ✅ Implemented method for manager notifications
  async notifyManagerAdded(fullname: string) {
    return this.pusher.trigger('manager-channel', 'manager-added', {
      message: `New manager added: ${fullname}`,
    });
  }

  // Existing method
  async triggerOrderNotification(order: any) {
    return this.pusher.trigger('orders', 'order-placed', order);
  }
}
