"use client";
import { useEffect } from "react";
import { Client as PusherPushNotifications } from "@pusher/push-notifications-web";

export default function Notification() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service worker registered', registration);

          // Force update immediately (dev only)
          if (registration.update) registration.update();
        })
        .catch(console.error);
    }

    const beamsClient = new PusherPushNotifications({
      instanceId: process.env.NEXT_PUBLIC_PUSHER_INSTANCE_ID!,
    });

    beamsClient.start()
      .then(() => beamsClient.addDeviceInterest("managers"))
      .catch(console.error);
  }, []);

  return null;
}
