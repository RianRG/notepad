"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/routes/get-friend-notes.ts
var get_friend_notes_exports = {};
__export(get_friend_notes_exports, {
  GetFriendNotesRoute: () => GetFriendNotesRoute
});
module.exports = __toCommonJS(get_friend_notes_exports);

// src/repositories/prisma/prisma-service.ts
var import_client = require("@prisma/client");
var PrismaService = class extends import_client.PrismaClient {
  constructor() {
    super();
  }
};

// src/services/get-friend-notes.ts
var GetFriendNotesService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(sessionId) {
    return __async(this, null, function* () {
      const student = yield this.prisma.student.findUnique({
        where: {
          sessionId
        }
      });
      if (!student) throw new Error("Student not found!");
      const friendRequests = yield this.prisma.friendRequest.findMany({
        where: {
          OR: [
            {
              receiverId: student.id,
              status: "ACCEPTED"
            },
            {
              senderId: student.id,
              status: "ACCEPTED"
            }
          ]
        },
        include: {
          receiver: {
            include: {
              notes: true
            }
          },
          sender: {
            include: {
              notes: true
            }
          }
        }
      });
      const friends = friendRequests.reduce((acm, friendRequest, k) => {
        if (friendRequest.sender.id !== student.id) {
          acm.push(friendRequest.sender);
        } else {
          acm.push(friendRequest.receiver);
        }
        return acm;
      }, []);
      const friendsNotes = [];
      friends.forEach((friend) => {
        if (friend.notes.length === 0) return;
        console.log(friend);
        friendsNotes.push({
          owner: friend.username,
          notes: friend.notes
        });
      });
      return friendsNotes;
    });
  }
};

// src/routes/get-friend-notes.ts
function GetFriendNotesRoute(app) {
  return __async(this, null, function* () {
    app.get("/friends/notes", {}, (req, res) => __async(this, null, function* () {
      const { sessionId } = req.auth;
      const prismaRepository = new PrismaService();
      const getFriendNotesService = new GetFriendNotesService(prismaRepository);
      const friendsNotes = yield getFriendNotesService.execute(sessionId);
      return res.status(200).send({ notes: friendsNotes });
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetFriendNotesRoute
});
