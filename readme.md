# Fotepad

This is fotepad, an online notepad to register your goals, make a shopping list, list your favorite musics, and anything else you need. You can show your notes to your friends and let them see yours (Only if you want to)



https://github.com/user-attachments/assets/b06e086e-1ab8-44d0-b325-a2c55e96be00



## Description
(I'm going to talk about backend and frontend on this README.md file, the other repository (notepad-frontend) is just for deployment settings)


The system uses sessionId cookies for authorization, set by browser (we're using the classic JWT (Json Web Token) for this)
The system uses Redis for caching info, just to reduce the response time of your requisitions
We tried to put a sending email service (Resend, Nodemailer, Mailgun), but the deploy service we're using (Render) doesn't agree with smtp licenses, so it only works on development.
The system uses docker containers for database (We're using postgres on this case)

## Technical Details
In our fullstack project, we're using the followed technologies:

* Typescript (Programming language used on the entire project)
* Docker (To build our database containers)
* Docker-compose (For running the docker-compose.yml file with our containers)
* PrismaORM (ORM for database queries)
* Redis (Cache provider)
* Angular (Frontend framework)
* Resend, Mailgun, Nodemailer (Email providers)
* Fastify (Backend framework for nodejs)
* Zod (Library for types)
* Bcryopt (Encrypting users passwords)
* JWT (Create tokens for authorization and validate them)

## How to use
Install the requirements running this command on terminal (It's important to advice that you need to install NodeJS, PNPM, Docker and Docker-compose on your machine first):
```
pnpm install
```
Then, run the postgres container on docker-compose.yml running this command on terminal:
```
docker-compose up -d
```
After all, now you can run our amazing backend with this simple command:
```
pnpm run dev
```
* backend deploy: https://notepad-jnn2.onrender.com
* frontend deploy: https://notepad-frontend-i921.onrender.com/register



Thank you <3
