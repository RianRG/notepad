import fs from 'node:fs'
import path from 'node:path';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY)


export class RegisteredEmailService{
  async execute(email: string, username: string){
    const info = resend.emails.send({
      from: `Fotepad 😁 <${process.env.EMAIL_USER}>`,
      to: `${email}`,
      subject: `Hello, ${username}`,
      text: "Account created succesfully!",
      html: fs.readFileSync(path.resolve(__dirname, '../template.html')).toString(),
    })
    .then(msg => console.log(msg))
    .catch(err => console.log(err));
    console.log(info)
    return info;
  }
}