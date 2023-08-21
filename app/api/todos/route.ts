import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const todo = await prisma.todo.create({
    data: {
      title: body.title,
      completed: false,
    },
  });

  return NextResponse.json(todo);
}

// /api/todos
export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(todos);
}
