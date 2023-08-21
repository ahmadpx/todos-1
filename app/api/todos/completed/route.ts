import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(_request: Request) {
  await prisma.todo.deleteMany({
    where: {
      completed: true,
    },
  });
  return NextResponse.json({ status: "ok" });
}
