import nodemailer from 'nodemailer'
import fs from 'node:fs'
import path from 'node:path';

export class RegisteredEmailService{
  async execute(email: string, username: string){
    console.log(`${process.env.EMAIL_USER}, ${process.env.EMAIL_PASSWORD}`)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: `Fotepad 😁 <${process.env.EMAIL_USER}>`,
      to: `${email}`,
      subject: `Hello, ${username}`,
      text: "Account created succesfully!",
      html: fs.createReadStream(path.resolve(__dirname, '../template.html')),
    });
    console.log(info)
    return info;
  }
}