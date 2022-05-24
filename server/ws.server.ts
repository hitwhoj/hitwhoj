import { PrivateMessageWithUser, WebSocketMessage } from "~/utils/ws.types";
import { Server as HttpServer } from "http";
import { PrismaClient } from "@prisma/client";
import { Server as WebSocketServer, WebSocket } from "ws";

const db = new PrismaClient();
db.$connect();

class WsServer {
  #server: WebSocketServer;
  #rooms: Map<string, Set<WebSocket>> = new Map();

  constructor(server: HttpServer) {
    this.#server = new WebSocketServer({ server });
    this.#server.on("connection", (socket) => {
      const rooms: Set<string> = new Set();

      socket.on("message", (data) => {
        const message = JSON.parse(data.toString());
        console.log(`[ws] received message: ${JSON.stringify(message)}`);

        // 订阅消息
        if (typeof message.subscribe === "string") {
          const room = message.subscribe as string;

          if (!rooms.has(room)) {
            rooms.add(room);
            if (!this.#rooms.has(room)) {
              this.#rooms.set(room, new Set());
            }
            this.#rooms.get(room)!.add(socket);
          }
        }

        // 取消订阅
        else if (typeof message.unsubscribe === "string") {
          const room = message.unsubscribe as string;

          if (rooms.has(room)) {
            rooms.delete(room);
            this.#rooms.get(room)!.delete(socket);
          }
        }
      });

      socket.on("close", () => {
        console.log("[ws] socket closed");

        for (const room of rooms) {
          this.#rooms.get(room)!.delete(socket);
        }
      });
    });
  }

  /** 推送消息到指定的房间 */
  #sendMessage(room: string, message: WebSocketMessage) {
    if (this.#rooms.has(room)) {
      const sockets = this.#rooms.get(room)!;
      for (const socket of sockets) {
        socket.send(JSON.stringify(message));
      }
    }
  }

  /** 推送私聊消息 */
  sendPrivateMessage(message: PrivateMessageWithUser) {
    this.#sendMessage(`/user/${message.to.id}`, {
      type: "PrivateMessage",
      message,
    });
  }
}

export { WsServer };
