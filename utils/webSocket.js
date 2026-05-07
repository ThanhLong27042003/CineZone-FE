import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export const webSocket = (showId, onMessage) => {
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!showId || !onMessage) return;

    const socket = new SockJS("https://cinezone-be.onrender.com/cinezone/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log("✅ WebSocket Connected:", frame);

      stompClient.subscribe(`/topic/show/${showId}`, (message) => {
        const seatUpdate = JSON.parse(message.body);
        console.log("📡 Seat update received:", seatUpdate);
        onMessage(seatUpdate);
      });

      stompClientRef.current = stompClient;
    });

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
        console.log("❌ WebSocket Disconnected");
      }
    };
  }, [showId]);

  return stompClientRef;
};
