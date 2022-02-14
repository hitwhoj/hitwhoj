import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.create({ data: { email: "i@sww.moe", name: "swwind" } });
}

seed();
