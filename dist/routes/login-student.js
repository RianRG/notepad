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

// src/routes/login-student.ts
var login_student_exports = {};
__export(login_student_exports, {
  LoginStudentRoute: () => LoginStudentRoute
});
module.exports = __toCommonJS(login_student_exports);

// src/repositories/prisma/prisma-service.ts
var import_client = require("@prisma/client");
var PrismaService = class extends import_client.PrismaClient {
  constructor() {
    super();
  }
};

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
var import_zod = require("zod");
var import_bcrypt = require("bcrypt");

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
function LoginStudentRoute(app) {
  return __async(this, null, function* () {
    app.post("/login", {
      schema: {
        body: import_zod.z.object({
          email: import_zod.z.string().email(),
          password: import_zod.z.string().min(6)
        })
      }
    }, (req, res) => __async(this, null, function* () {
      const { email, password } = req.body;
      const prismaRepository = new PrismaService();
      const getStudentByEmailService = new GetStudentByEmailService(prismaRepository);
      const updateSessionIdService = new UpdateSessionIdService(prismaRepository);
      const student = yield getStudentByEmailService.execute(email);
      if (!(yield (0, import_bcrypt.compare)(password, student.password))) {
        return res.status(401).send({ msg: "Email or password incorrect!" });
      }
      const sessionId = app.jwt.sign({ user: student.username });
      res.setCookie("sessionId", sessionId, {
        path: "/",
        httpOnly: true,
        signed: true,
        sameSite: "none",
        secure: true,
        maxAge: 1e3 * 3600 * 24 * 7
        // 7 days
      });
      const cookie = app.signCookie(sessionId);
      const loggedStudent = yield updateSessionIdService.execute(cookie, student.id);
      return res.status(201).send({ login: loggedStudent });
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LoginStudentRoute
});
