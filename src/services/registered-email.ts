import fs from 'node:fs'
import path from 'node:path';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailGun = new Mailgun(formData);
const mg = mailGun.client({username: 'api', key: process.env.MAILGUN_API_KEY!});

export class RegisteredEmailService{
  async execute(email: string, username: string){
    console.log(`${process.env.EMAIL_USER}, ${process.env.MAILGUN_API_KEY}`)
    const info = mg.messages.create('sandboxa47ce1f8cff04471b333c446f65f5242.mailgun.org',{
      from: `Fotepad 😁 <${process.env.EMAIL_USER}>`,
      to: `test@example.com`,
      subject: `Hello, ${username}`,
      text: "Account created succesfully!",
      html: '<h1> Hello </h1>',
    })
    .then(msg => console.log(msg))
    .catch(err => console.log(err));
    console.log(info)
    return info;
  }
}