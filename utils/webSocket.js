import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

/**
 * ✅ THAY ĐỔI: Tách WebSocket logic ra hook riêng
 * - Tái sử dụng cho nhiều component
 * - Dễ quản lý connection
 */
export const webSocket = (showId, onMessage) => {
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!showId || !onMessage) return;

    const socket = new SockJS("http://localhost:8080/cinezone/ws");
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
