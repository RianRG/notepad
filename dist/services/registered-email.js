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

// src/services/registered-email.ts
var registered_email_exports = {};
__export(registered_email_exports, {
  RegisteredEmailService: () => RegisteredEmailService
});
module.exports = __toCommonJS(registered_email_exports);
var import_resend = require("resend");
var resend = new import_resend.Resend(process.env.RESEND_KEY);
var RegisteredEmailService = class {
  async execute(email, username) {
    const info = resend.emails.send({
      from: `Fotepad \u{1F601} <${process.env.EMAIL_USER}>`,
      to: `${email}`,
      subject: `Hello, ${username}`,
      text: "Account created succesfully!",
      html: `
      <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body>
          <h1>Congratulations, your account was succesfully created!</h1>
          <p>Now you can prove the max efficiency of your notes, welcome to Fotepad!</p>
        </body>
      </html>
      `
    }).then((msg) => console.log(msg)).catch((err) => console.log(err));
    console.log(info);
    return info;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegisteredEmailService
});
