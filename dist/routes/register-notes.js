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

// src/routes/register-notes.ts
var register_notes_exports = {};
__export(register_notes_exports, {
  RegisterNoteRoute: () => RegisterNoteRoute
});
module.exports = __toCommonJS(register_notes_exports);

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
var import_zod = require("zod");
function RegisterNoteRoute(app) {
  return __async(this, null, function* () {
    app.post("/notes/register", {
      preHandler: [authorizeMiddleware],
      schema: {
        body: import_zod.z.object({
          title: import_zod.z.string(),
          content: import_zod.z.string(),
          isPrivate: import_zod.z.boolean()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegisterNoteRoute
});
