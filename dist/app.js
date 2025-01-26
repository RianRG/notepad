"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = require("fastify");
var import_cookie = __toESM(require("@fastify/cookie"));
var import_jwt = __toESM(require("@fastify/jwt"));
var import_cors = __toESM(require("@fastify/cors"));
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");

// src/repositories/prisma/prisma-service.ts
var import_client = require("@prisma/client");
var PrismaService = class extends import_client.PrismaClient {
  constructor() {
    super();
  }
};

// src/services/register-student.ts
var RegisterStudentService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(_0) {
    return __async(this, arguments, function* ({ username, email, password, sessionId }) {
      const studentWithSameEmail = yield this.prisma.student.findUnique({
        where: {
          email
        }
      });
      const studentWithSameUsername = yield this.prisma.student.findUnique({
        where: {
          username
        }
      });
      if (studentWithSameEmail || studentWithSameUsername)
        throw new Error("Student already exists!");
      return yield this.prisma.student.create({
        data: {
          username,
          email,
          password,
          sessionId
        }
      });
    });
  }
};

// src/routes/register-student.ts
var import_bcrypt = require("bcrypt");
var import_zod = require("zod");
function RegisterStudentRoute(app2) {
  return __async(this, null, function* () {
    app2.post("/students/register", {
      schema: {
        body: import_zod.z.object({
          username: import_zod.z.string(),
          email: import_zod.z.string().email(),
          password: import_zod.z.string().min(6)
        }),
        response: {
          201: import_zod.z.object({
            id: import_zod.z.string()
          })
        }
      }
    }, (req, res) => __async(this, null, function* () {
      const { username, email, password } = req.body;
      const hashedPassword = yield (0, import_bcrypt.hash)(password, 4);
      const prismaRepository = new PrismaService();
      const registerStudentService = new RegisterStudentService(prismaRepository);
      const sessionId = app2.jwt.sign({ user: username });
      res.setCookie("sessionId", sessionId, {
        path: "/",
        httpOnly: true,
        signed: true,
        maxAge: 1e3 * 3600 * 24 * 7
        // 7 days
      });
      const cookie2 = app2.signCookie(sessionId);
      const student = yield registerStudentService.execute({ username, email, password: hashedPassword, sessionId: cookie2 });
      return res.status(201).send({ id: student.id });
    }));
  });
}

// src/middlewares/authorize-middleware.ts
var authorizeMiddleware = (req, res, done) => {
  if (!req.cookies.sessionId)
    return res.status(401).send({ msg: "Unauthorized!" });
  const unsignedCookie = req.unsignCookie(req.cookies.sessionId);
  if (!unsignedCookie.value)
    return res.status(401).send({ msg: "Unauthorized!" });
  if (!req.jwt.verify(unsignedCookie.value))
    return res.status(401).send({ msg: "Unauthorized!" });
  req.auth = {
    sessionId: req.cookies.sessionId
  };
  done();
};

// src/services/get-student-by-sessionId.ts
var GetStudentBySessionIdService = class {
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
      if (!student) throw new Error();
      return student;
    });
  }
};

// src/services/register-notes.ts
var RegisterNotesService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(_0) {
    return __async(this, arguments, function* ({ title, content, isPrivate, studentId }) {
      return yield this.prisma.note.create({
        data: {
          title,
          content,
          isPrivate,
          studentId
        }
      });
    });
  }
};

// src/routes/register-notes.ts
var import_zod2 = require("zod");
function RegisterNoteRoute(app2) {
  return __async(this, null, function* () {
    app2.post("/notes/register", {
      preHandler: [authorizeMiddleware],
      schema: {
        body: import_zod2.z.object({
          title: import_zod2.z.string(),
          content: import_zod2.z.string(),
          isPrivate: import_zod2.z.boolean()
        })
        // response: {
        //     201: z.object({
        //         notes: z.object({
        //         })
        //     })
        // }
      }
    }, (req, res) => __async(this, null, function* () {
      const { sessionId } = req.auth;
      const { title, content, isPrivate } = req.body;
      const prismaRepository = new PrismaService();
      const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);
      const registerNotesService = new RegisterNotesService(prismaRepository);
      const student = yield getStudentBySessionIdService.execute(sessionId);
      if (!student) throw new Error();
      const notes = yield registerNotesService.execute({ title, content, isPrivate, studentId: student.id });
      return res.status(201).send({ notes });
    }));
  });
}

// src/services/delete-note.ts
var DeleteNoteService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(noteId) {
    return __async(this, null, function* () {
      const note = yield this.prisma.note.findUnique({
        where: {
          id: noteId
        }
      });
      if (!note)
        throw new Error("Note not found!");
      yield this.prisma.note.delete({
        where: {
          id: noteId
        }
      });
    });
  }
};

// src/routes/delete-note.ts
var import_zod3 = require("zod");
function DeleteNoteRoute(app2) {
  return __async(this, null, function* () {
    app2.delete(
      "/notes/:noteId",
      {
        preHandler: [authorizeMiddleware],
        schema: {
          params: import_zod3.z.object({
            noteId: import_zod3.z.string()
          })
        }
      },
      (req, res) => __async(this, null, function* () {
        const { sessionId } = req.auth;
        const { noteId } = req.params;
        const prismaRepository = new PrismaService();
        const deleteNoteService = new DeleteNoteService(prismaRepository);
        const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);
        const student = yield getStudentBySessionIdService.execute(sessionId);
        if (!student)
          return res.status(400).send({ msg: "Student not found!" });
        yield deleteNoteService.execute(noteId);
        return res.status(200).send({ msg: "Note deleted succesfully!" });
      })
    );
  });
}

// src/services/get-notes.ts
var GetNotesService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(studentId) {
    return __async(this, null, function* () {
      const notes = yield this.prisma.note.findMany({
        where: {
          studentId
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      const parsedNotes = notes.map((note) => {
        const _a = note, { studentId: studentId2 } = _a, restOfAll = __objRest(_a, ["studentId"]);
        return restOfAll;
      });
      return parsedNotes;
    });
  }
};

// src/routes/get-notes.ts
function GetNotesRoute(app2) {
  return __async(this, null, function* () {
    app2.get(
      "/notes",
      {
        schema: {
          // response: {
          //   200: z.array(z.object({
          //     title: z.string(),
          //     content: z.string(),
          //     isPrivate: z.boolean(),
          //     createdAt: z.date(),
          //   }))
          // }
        },
        preHandler: [authorizeMiddleware]
      },
      (req, res) => __async(this, null, function* () {
        const prismaRepository = new PrismaService();
        const { sessionId } = req.auth;
        const getNotesService = new GetNotesService(prismaRepository);
        const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);
        const student = yield getStudentBySessionIdService.execute(sessionId);
        const notes = yield getNotesService.execute(student.id);
        return res.status(200).send(notes);
      })
    );
  });
}

// src/services/add-friend.ts
var AddFriendService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(requesterName, receiverName) {
    return __async(this, null, function* () {
      if (requesterName === receiverName)
        throw new Error("You cannot add yourself!");
      const requester = yield this.prisma.student.findUnique({
        where: {
          username: requesterName
        },
        include: {
          friendRequestsReceived: true,
          friendRequestsSent: true
        }
      });
      if (!requester)
        throw new Error("Student not found!");
      const receiver = yield this.prisma.student.findUnique({
        where: {
          username: receiverName
        },
        include: {
          friendRequestsReceived: true,
          friendRequestsSent: true
        }
      });
      if (!receiver)
        throw new Error("Student not found!");
      const isAlreadyFriend = yield this.prisma.friendRequest.findFirst({
        where: {
          OR: [
            {
              senderId: requester.id,
              receiverId: receiver.id,
              status: "ACCEPTED"
            },
            {
              senderId: receiver.id,
              receiverId: requester.id,
              status: "ACCEPTED"
            }
          ]
        }
      });
      if (isAlreadyFriend)
        throw new Error(`You and ${receiverName} are already friends!`);
      const isAlreadySent = receiver.friendRequestsReceived.filter((request) => {
        return request.senderId === requester.id;
      });
      if (isAlreadySent.length > 0)
        throw new Error(`You have already sent a request to ${receiverName}`);
      const isAlreadyReceived = receiver.friendRequestsSent.filter((request) => {
        return request.receiverId === requester.id;
      });
      if (isAlreadyReceived.length > 0) {
        if (isAlreadyReceived[0].status !== "REJECTED") {
          yield this.prisma.friendRequest.update({
            where: {
              id: isAlreadyReceived[0].id
            },
            data: {
              status: "ACCEPTED"
            }
          });
        } else {
          throw new Error(`Unfortunately, this friendship is BLOCKED :(`);
        }
        return 2;
      }
      yield this.prisma.friendRequest.create({
        data: {
          receiverId: receiver.id,
          senderId: requester.id,
          status: "PENDING"
        }
      });
      return 3;
    });
  }
};

// src/routes/add-friend.ts
var import_zod4 = require("zod");
function AddFriendRoute(app2) {
  return __async(this, null, function* () {
    app2.post("/add/:friendName", {
      preHandler: [authorizeMiddleware],
      schema: {
        params: import_zod4.z.object({
          friendName: import_zod4.z.string()
        }),
        response: {
          201: import_zod4.z.object({
            msg: import_zod4.z.string()
          })
        }
      }
    }, (req, res) => __async(this, null, function* () {
      const { friendName } = req.params;
      const { sessionId } = req.auth;
      const prismaRepository = new PrismaService();
      const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);
      const addFriend = new AddFriendService(prismaRepository);
      const student = yield getStudentBySessionIdService.execute(sessionId);
      yield addFriend.execute(student.username, friendName);
      return res.status(201).send({ msg: "Friend request sent!" });
    }));
  });
}

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
function GetFriendNotesRoute(app2) {
  return __async(this, null, function* () {
    app2.get("/friends/notes", {}, (req, res) => __async(this, null, function* () {
      const { sessionId } = req.auth;
      const prismaRepository = new PrismaService();
      const getFriendNotesService = new GetFriendNotesService(prismaRepository);
      const friendsNotes = yield getFriendNotesService.execute(sessionId);
      return res.status(200).send({ notes: friendsNotes });
    }));
  });
}

// src/services/get-student-by-email.ts
var GetStudentByEmailService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(email) {
    return __async(this, null, function* () {
      const student = yield this.prisma.student.findUnique({
        where: {
          email
        }
      });
      if (!student) throw new Error("Student not found!");
      return student;
    });
  }
};

// src/routes/login-student.ts
var import_zod5 = require("zod");
var import_bcrypt2 = require("bcrypt");

// src/services/update-sessionid.ts
var UpdateSessionIdService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(sessionId, id) {
    return __async(this, null, function* () {
      return yield this.prisma.student.update({
        where: {
          id
        },
        data: {
          sessionId
        }
      });
    });
  }
};

// src/routes/login-student.ts
function LoginStudentRoute(app2) {
  return __async(this, null, function* () {
    app2.post("/login", {
      schema: {
        body: import_zod5.z.object({
          email: import_zod5.z.string().email(),
          password: import_zod5.z.string().min(6)
        })
      }
    }, (req, res) => __async(this, null, function* () {
      const { email, password } = req.body;
      const prismaRepository = new PrismaService();
      const getStudentByEmailService = new GetStudentByEmailService(prismaRepository);
      const updateSessionIdService = new UpdateSessionIdService(prismaRepository);
      const student = yield getStudentByEmailService.execute(email);
      if (!(yield (0, import_bcrypt2.compare)(password, student.password))) {
        return res.status(401).send({ msg: "Email or password incorrect!" });
      }
      const sessionId = app2.jwt.sign({ user: student.username });
      res.setCookie("sessionId", sessionId, {
        path: "/",
        httpOnly: true,
        signed: true,
        maxAge: 1e3 * 3600 * 24 * 7
        // 7 days
      });
      const cookie2 = app2.signCookie(sessionId);
      const loggedStudent = yield updateSessionIdService.execute(cookie2, student.id);
      return res.status(201).send({ login: loggedStudent });
    }));
  });
}

// src/services/get-friends.ts
var GetFriendsService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(sessionId) {
    return __async(this, null, function* () {
      const student = yield this.prisma.student.findUnique({
        where: {
          sessionId
        },
        include: {
          friendRequestsReceived: true,
          friendRequestsSent: true
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
          receiver: true,
          sender: true
        }
      });
      if (!friendRequests) throw new Error("You don't have any friends!");
      const friends = friendRequests.reduce((acm, friendRequest, k) => {
        if (friendRequest.receiver.username !== student.username) {
          acm.push(friendRequest.receiver);
        } else {
          acm.push(friendRequest.sender);
        }
        return acm;
      }, []);
      return friends;
    });
  }
};

// src/routes/get-friends.ts
function GetFriendsRoute(app2) {
  return __async(this, null, function* () {
    app2.get("/friends", {
      preHandler: [authorizeMiddleware]
    }, (req, res) => __async(this, null, function* () {
      const { sessionId } = req.auth;
      const prismaRepository = new PrismaService();
      const getFriendsService = new GetFriendsService(prismaRepository);
      const friends = yield getFriendsService.execute(sessionId);
      return res.status(200).send({ friends });
    }));
  });
}

// src/services/unfriend-student.ts
var UnfriendService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(username, friendName) {
    return __async(this, null, function* () {
      if (username === friendName) throw new Error("You cannot unfriend yourself!");
      const friend = yield this.prisma.student.findUnique({
        where: {
          username: friendName
        }
      });
      const student = yield this.prisma.student.findUnique({
        where: {
          username
        }
      });
      if (!friend || !student)
        throw new Error("Student not found!");
      const friendship = yield this.prisma.friendRequest.findFirst({
        where: {
          OR: [
            {
              receiverId: friend.id,
              senderId: student.id
            },
            {
              receiverId: student.id,
              senderId: friend.id
            }
          ]
        }
      });
      if (!friendship) throw new Error(`You and ${friendName} are not friends!`);
      yield this.prisma.friendRequest.delete({
        where: {
          id: friendship.id
        }
      });
    });
  }
};

// src/routes/unfriend-student.ts
var import_zod6 = require("zod");
function UnfriendRoute(app2) {
  return __async(this, null, function* () {
    app2.delete("/unfriend/:friendName", {
      preHandler: [authorizeMiddleware],
      schema: {
        params: import_zod6.z.object({
          friendName: import_zod6.z.string()
        }),
        cookies: import_zod6.z.object({
          sessionId: import_zod6.z.string()
        })
      }
    }, (req, res) => __async(this, null, function* () {
      const { sessionId } = req.auth;
      const { friendName } = req.params;
      const prismaRepository = new PrismaService();
      const unfriendService = new UnfriendService(prismaRepository);
      const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);
      const student = yield getStudentBySessionIdService.execute(sessionId);
      yield unfriendService.execute(student.username, friendName);
      return res.status(200).send({ msg: "Student unfriended succesfully!" });
    }));
  });
}

// src/routes/block-friend.ts
var import_zod7 = require("zod");

// src/services/block-friend.ts
var BlockFriendService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(studentName, friendName) {
    return __async(this, null, function* () {
      if (studentName === friendName) throw new Error("You cannot block yourself!");
      const student = yield this.prisma.student.findUnique({
        where: {
          username: studentName
        }
      });
      const friend = yield this.prisma.student.findUnique({
        where: {
          username: friendName
        }
      });
      if (!student || !friend) throw new Error("Student not found!");
      const friendship = yield this.prisma.friendRequest.findFirst({
        where: {
          OR: [
            {
              receiverId: friend.id,
              senderId: student.id
            },
            {
              receiverId: student.id,
              senderId: friend.id
            }
          ]
        }
      });
      if (!friendship) throw new Error(`You and ${friendName} are not friends!`);
      return yield this.prisma.friendRequest.update({
        where: {
          id: friendship.id
        },
        data: {
          status: "REJECTED"
        }
      });
    });
  }
};

// src/routes/block-friend.ts
function BlockFriendRoute(app2) {
  return __async(this, null, function* () {
    app2.delete("/block/:friendName", {
      preHandler: [authorizeMiddleware],
      schema: {
        params: import_zod7.z.object({
          friendName: import_zod7.z.string()
        }),
        cookies: import_zod7.z.object({
          sessionId: import_zod7.z.string()
        })
      }
    }, (req, res) => __async(this, null, function* () {
      const { sessionId } = req.auth;
      const { friendName } = req.params;
      const prismaRepository = new PrismaService();
      const blockFriendService = new BlockFriendService(prismaRepository);
      const getStudentBySessionIdService = new GetStudentBySessionIdService(prismaRepository);
      const student = yield getStudentBySessionIdService.execute(sessionId);
      yield blockFriendService.execute(student.username, friendName);
      return res.status(200).send({ msg: "Student blocked succesfully!" });
    }));
  });
}

// src/routes/get-session.ts
function GetSessionRoute(app2) {
  return __async(this, null, function* () {
    app2.get("/session", {
      preHandler: [authorizeMiddleware]
    }, (req, res) => __async(this, null, function* () {
      const { sessionId } = req.auth;
      const prismaRepository = new PrismaService();
      const getStudentBySessionId = new GetStudentBySessionIdService(prismaRepository);
      const student = yield getStudentBySessionId.execute(sessionId);
      return res.status(200).send({ student });
    }));
  });
}

// src/routes/update-note.ts
var import_zod8 = require("zod");

// src/services/update-note.ts
var UpdateNoteService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(noteId, data) {
    return __async(this, null, function* () {
      return yield this.prisma.note.update({
        where: {
          id: noteId
        },
        data: {
          title: data.title,
          content: data.content,
          isPrivate: data.isPrivate
        }
      });
    });
  }
};

// src/routes/update-note.ts
function UpdateNoteRoute(app2) {
  return __async(this, null, function* () {
    app2.put(
      "/notes/:noteId",
      {
        preHandler: [authorizeMiddleware],
        schema: {
          body: import_zod8.z.object({
            title: import_zod8.z.string(),
            content: import_zod8.z.string(),
            isPrivate: import_zod8.z.boolean()
          }),
          params: import_zod8.z.object({
            noteId: import_zod8.z.string()
          })
        }
      },
      (req, res) => __async(this, null, function* () {
        const { sessionId } = req.auth;
        const { noteId } = req.params;
        const { title, content, isPrivate } = req.body;
        const prismaRepository = new PrismaService();
        const updateNoteService = new UpdateNoteService(prismaRepository);
        const note = yield updateNoteService.execute(noteId, { title, content, isPrivate });
        return res.status(201).send({ note });
      })
    );
  });
}

// src/services/get-friend-requests.ts
var GetFriendRequestsService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(sessionId) {
    return __async(this, null, function* () {
      return yield this.prisma.friendRequest.findMany({
        where: {
          receiver: {
            sessionId
          },
          status: "PENDING"
        },
        include: {
          sender: {
            select: {
              username: true
            }
          }
        }
      });
    });
  }
};

// src/routes/get-friend-requests.ts
function GetFriendRequestsRoute(app2) {
  return __async(this, null, function* () {
    app2.get("/friendRequests", {
      preHandler: [authorizeMiddleware]
    }, (req, res) => __async(this, null, function* () {
      const { sessionId } = req.auth;
      const prismaRepository = new PrismaService();
      const getFriendRequestsService = new GetFriendRequestsService(prismaRepository);
      const friendRequests = yield getFriendRequestsService.execute(sessionId);
      return res.status(200).send({ friendRequests });
    }));
  });
}

// src/routes/get-student.ts
var import_zod9 = require("zod");

// src/services/get-student-by-username.ts
var GetStudentByUsernameService = class {
  constructor(prisma) {
    this.prisma = prisma;
  }
  execute(username) {
    return __async(this, null, function* () {
      const student = yield this.prisma.student.findUnique({
        where: {
          username
        },
        include: {
          notes: {
            where: {
              isPrivate: false
            }
          },
          _count: {
            select: {
              friendRequestsReceived: {
                where: {
                  status: "ACCEPTED"
                }
              },
              friendRequestsSent: {
                where: {
                  status: "ACCEPTED"
                }
              }
            }
          }
        }
      });
      if (!student)
        throw new Error("Student not found!");
      const studentWithFriends = {
        id: student.id,
        sessionId: student.sessionId,
        username: student.username,
        email: student.email,
        password: student.password,
        createdAt: student.createdAt,
        notes: student.notes,
        friends: student._count.friendRequestsReceived + student._count.friendRequestsSent
      };
      return studentWithFriends;
    });
  }
};

// src/routes/get-student.ts
function GetStudentRoute(app2) {
  return __async(this, null, function* () {
    app2.get(
      "/students/:username",
      {
        preHandler: [authorizeMiddleware],
        schema: {
          params: import_zod9.z.object({
            username: import_zod9.z.string()
          })
        }
      },
      (req, res) => __async(this, null, function* () {
        const { sessionId } = req.auth;
        const { username } = req.params;
        const prismaRepository = new PrismaService();
        const getStudentByUsernameService = new GetStudentByUsernameService(prismaRepository);
        const student = yield getStudentByUsernameService.execute(username);
        return res.status(200).send({ student });
      })
    );
  });
}

// src/app.ts
var app = (0, import_fastify.fastify)().withTypeProvider();
app.setValidatorCompiler(import_fastify_type_provider_zod.validatorCompiler);
app.setSerializerCompiler(import_fastify_type_provider_zod.serializerCompiler);
app.register(import_cookie.default, {
  secret: process.env.COOKIE_SECRET,
  hook: "onRequest"
});
app.register(import_jwt.default, {
  secret: process.env.COOKIE_SECRET
});
app.addHook("preHandler", (req, res, done) => {
  req.jwt = app.jwt;
  return done();
});
app.register(import_cors.default, {
  origin: "http://localhost:4200",
  credentials: true
});
app.register(RegisterStudentRoute);
app.register(RegisterNoteRoute);
app.register(DeleteNoteRoute);
app.register(GetNotesRoute);
app.register(AddFriendRoute);
app.register(UnfriendRoute);
app.register(GetFriendNotesRoute);
app.register(LoginStudentRoute);
app.register(GetFriendsRoute);
app.register(BlockFriendRoute);
app.register(GetSessionRoute);
app.register(UpdateNoteRoute);
app.register(GetFriendRequestsRoute);
app.register(GetStudentRoute);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});