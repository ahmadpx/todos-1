import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// /api/todos/[id]
export async function PUT(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  const body = await request.json();
  const todo = await prisma.todo.update({
    where: { id },
    data: {
      title: body.title,
      completed: body.completed,
    },
  });

  return NextResponse.json(todo);
}

export async function DELETE(
  _request: Request,
  { params: { id } }: { params: { id: string } }
) {
  await prisma.todo.delete({
    where: { id },
  });
  return NextResponse.json({ status: "OK" });
}
