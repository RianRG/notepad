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

// src/routes/delete-note.ts
var delete_note_exports = {};
__export(delete_note_exports, {
  DeleteNoteRoute: () => DeleteNoteRoute
});
module.exports = __toCommonJS(delete_note_exports);

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

// src/routes/delete-note.ts
var import_zod = require("zod");
function DeleteNoteRoute(app) {
  return __async(this, null, function* () {
    app.delete(
      "/notes/:noteId",
      {
        preHandler: [authorizeMiddleware],
        schema: {
          params: import_zod.z.object({
            noteId: import_zod.z.string()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeleteNoteRoute
});