"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
exports.WsServer = void 0;
var socket_io_1 = require("socket.io");
var client_1 = require("@prisma/client");
var db = new client_1.PrismaClient();
db.$connect();
var WsServer = /** @class */ (function () {
  function WsServer(server) {
    var _this = this;
    this.socketMap = {};
    this.server = new socket_io_1.Server(server, {
      path: "/ws",
    });
    this.server.on("connection", function (socket) {
      return __awaiter(_this, void 0, void 0, function () {
        var session, userSession;
        var _this = this;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              session = socket.handshake.auth.session;
              return [
                4 /*yield*/,
                db.userSession.findUnique({
                  where: { session: session },
                  select: { userId: true },
                }),
              ];
            case 1:
              userSession = _a.sent();
              if (!userSession) {
                socket.emit("auth_error", "Invalid session");
                socket.disconnect();
                return [2 /*return*/];
              }
              console.log(
                "[ws] user ".concat(userSession.userId, " connected")
              );
              // 当用户连接时，将其加入到其id所形成的房间中
              this.socketMap[userSession.userId] = socket;
              socket.join(userSession.userId.toString());
              socket.on("disconnect", function () {
                delete _this.socketMap[userSession.userId];
                console.log(
                  "[ws] user ".concat(userSession.userId, "  disconnected")
                );
              });
              return [2 /*return*/];
          }
        });
      });
    });
    // this.server.listen(port);
    // console.log(`Ws server listening on port ${port}`);
    console.log("Ws listening on url ".concat(this.server.path()));
  }
  WsServer.prototype.addUserToRoom = function (userId, roomId) {
    var socket = this.socketMap[userId];
    if (!socket) {
      return false;
    }
    socket.join(roomId.toString());
    return true;
  };
  WsServer.prototype.removeUserFromRoom = function (userId, roomId) {
    var socket = this.socketMap[userId];
    if (!socket) {
      return false;
    }
    socket.leave(roomId.toString());
    return true;
  };
  WsServer.prototype.sendMessage = function (message) {
    console.log("[ws] send message: ".concat(JSON.stringify(message)));
    switch (message.type) {
      case client_1.MessageType.Private:
        this.server.to(message.to.toString()).emit("private_message", message);
        break;
      case client_1.MessageType.Team:
        this.server["in"](message.to.toString()).emit("team_message", message);
        break;
      case client_1.MessageType.Contest:
        this.server["in"](message.to.toString()).emit(
          "contest_message",
          message
        );
        break;
      case client_1.MessageType.System:
        this.server["in"](message.to.toString()).emit(
          "system_message",
          message
        );
        break;
      default:
        throw new Error("Unknown message type: ".concat(message.type));
    }
  };
  return WsServer;
})();
exports.WsServer = WsServer;
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
