"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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

// src/routes/get-notes.ts
var get_notes_exports = {};
__export(get_notes_exports, {
  GetNotesRoute: () => GetNotesRoute
});
module.exports = __toCommonJS(get_notes_exports);

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

// src/repositories/prisma/prisma-service.ts
var import_client = require("@prisma/client");
var PrismaService = class extends import_client.PrismaClient {
  constructor() {
    super();
  }
};

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

// src/routes/get-notes.ts
function GetNotesRoute(app) {
  return __async(this, null, function* () {
    app.get(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetNotesRoute
});
