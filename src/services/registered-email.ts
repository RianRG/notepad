import fs from 'node:fs'
import path from 'node:path';

// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_KEY)


// export class RegisteredEmailService{
//   async execute(email: string, username: string){
//     const info = resend.emails.send({
//       from: `Fotepad 😁 <${process.env.EMAIL_USER}>`,
//       to: `${email}`,
//       subject: `Hello, ${username}`,
//       text: "Account created succesfully!",
//       html: `
//       <html>
//         <head>
//           <meta charset="UTF-8">
//         </head>
//         <body>
//           <h1>Congratulations, your account was succesfully created!</h1>
//           <p>Now you can prove the max efficiency of your notes, welcome to Fotepad!</p>
//         </body>
//       </html>
//       `,
//     })
//     .then(msg => console.log(msg))
//     .catch(err => console.log(err));
//     console.log(info)
//     return info;
//   }
// }