import type { Socket } from "socket.io";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { Message, MessageType, PrismaClient } from "@prisma/client";

let db = new PrismaClient();
db.$connect();

export interface WsServerEvent {}

export interface WsClientEvent {
  auth_error: (msg: string) => void;
  private_message: (message: Message) => void;
  team_message: (message: Message) => void;
  contest_message: (message: Message) => void;
  system_message: (message: Message) => void;
}

class WsServer {
  private server: Server<WsServerEvent, WsClientEvent>;
  private socketMap: { [key: number]: Socket<WsServerEvent, WsClientEvent> } =
    {};
  constructor(server: HttpServer) {
    this.server = new Server(server, {
      path: "/ws",
    });
    this.server.on(
      "connection",
      async (socket: Socket<WsServerEvent, WsClientEvent>) => {
        // TODO: session auth to header cookie
        // const cookie = socket.handshake.headers.cookie;
        const session: string = socket.handshake.auth.session;
        const userSession = await db.userSession.findUnique({
          where: { session: session },
          select: { userId: true },
        });
        if (!userSession) {
          socket.emit("auth_error", "Invalid session");
          socket.disconnect();
          return;
        }

        console.log(`[ws] user ${userSession.userId} connected`);
        // 当用户连接时，将其加入到其id所形成的房间中
        this.socketMap[userSession.userId] = socket;
        socket.join(userSession.userId.toString());

        socket.on("disconnect", () => {
          delete this.socketMap[userSession.userId];
          console.log(`[ws] user ${userSession.userId}  disconnected`);
        });
      }
    );
    // this.server.listen(port);
    // console.log(`Ws server listening on port ${port}`);
    console.log(`Ws listening on url ${this.server.path()}`);
  }

  public addUserToRoom(userId: number, roomId: number): boolean {
    const socket = this.socketMap[userId];
    if (!socket) {
      return false;
    }
    socket.join(roomId.toString());
    return true;
  }

  public removeUserFromRoom(userId: number, roomId: number): boolean {
    const socket = this.socketMap[userId];
    if (!socket) {
      return false;
    }
    socket.leave(roomId.toString());
    return true;
  }

  public sendMessage(message: Message) {
    console.log(`[ws] send message: ${JSON.stringify(message)}`);
    switch (message.type) {
      case MessageType.Private:
        this.server.to(message.to.toString()).emit("private_message", message);
        break;
      case MessageType.Team:
        this.server.in(message.to.toString()).emit("team_message", message);
        break;
      case MessageType.Contest:
        this.server.in(message.to.toString()).emit("contest_message", message);
        break;
      case MessageType.System:
        this.server.in(message.to.toString()).emit("system_message", message);
        break;
      default:
        throw new Error(`Unknown message type: ${message.type}`);
    }
  }
}

export { WsServer };

// let ws: WsServer;

// declare global {
//   var __ws: WsServer | undefined;
// }

// export function initWs(server: HttpServer) {
//   console.log("init ws");
//   ws = new WsServer(server);
//   global.__ws = ws;
// }

// if (process.env.NODE_ENV === "production") {
//   ws = new WsServer();
// } else {
//   if (!global.__ws) {
//     global.__ws = new WsServer();
//   }
//   ws = global.__ws;
// }

// export { ws };
