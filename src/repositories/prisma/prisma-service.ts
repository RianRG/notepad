import { PrismaClient } from "@prisma/client";

export class PrismaService extends PrismaClient{
    constructor(){
        super({
          datasources: {
            db: {
              url: process.env.NODE_ENV === "production" ? process.env.DATABASE_URL : "postgresql://admin:admin@localhost:5432/mypostgres?schema=public"
            }
          }
        });
    }
}