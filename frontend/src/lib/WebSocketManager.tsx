import { useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { websocketClient } from "@/lib/websocketClient";

export const WebSocketManager = () => {
  const { isAuth } = useAuth();

  useEffect(() => {
    if (isAuth) {
      websocketClient.connect();
    } else {
      websocketClient.disconnect();
    }

    return () => websocketClient.disconnect();
  }, [isAuth]);

  return null;
};