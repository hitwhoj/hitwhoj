import type { Message, MessageType } from "@prisma/client";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type { WsServerEvent, WsClientEvent } from "server/ws.server";

export class WsClient {
  private session: string;
  private socket: Socket<WsClientEvent, WsServerEvent>;
  constructor(session: string) {
    this.session = session;
    this.socket = io({
      path: "/ws",
      reconnection: false,
      autoConnect: false,
      auth: {
        session: session,
      },
    });
    this.socket.on("connect", () => {
      console.log(`[ws] connected`);
    });
    this.socket.on("disconnect", () => {
      console.log(`[ws] disconnected`);
    });
    this.socket.on("auth_error", (msg: string) => {
      console.log(`[ws] auth_error: ${msg}`);
    });
    console.log(`[ws] connecting...`);
    this.socket.connect();
  }

  handleMessage(type: MessageType, callback: (message: Message) => void) {
    switch (type) {
      case "Private":
        this.socket.on("private_message", callback);
        break;
      case "Team":
        this.socket.on("team_message", callback);
        break;
      case "Contest":
        this.socket.on("contest_message", callback);
        break;
      case "System":
        this.socket.on("system_message", callback);
        break;
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  }

  unhandleMessage(type: MessageType, callback: (message: Message) => void) {
    switch (type) {
      case "Private":
        this.socket.removeListener("private_message", callback);
        break;
      case "Team":
        this.socket.removeListener("team_message", callback);
        break;
      case "Contest":
        this.socket.removeListener("contest_message", callback);
        break;
      case "System":
        this.socket.removeListener("system_message", callback);
        break;
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  }

  getSession() {
    return this.session;
  }

  close() {
    this.socket.close();
  }
}
