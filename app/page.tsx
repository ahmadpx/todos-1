"use client";

import { Todo } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "todomvc-app-css/index.css";

export default function Home() {
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const { data, refetch } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () => fetch("/api/todos").then((res) => res.json()),
  });
  const [todos, setTodos] = useState<Todo[]>([]);
  const completedTodos = todos.filter((todo) => todo.completed);
  const activeTodos = todos.filter((todo) => !todo.completed);

  useEffect(() => setTodos(data ?? []), [data]);

  useEffect(() => {
    if (!data) return;

    if (filter === "all") {
      setTodos(data);
    } else if (filter === "active") {
      setTodos(data.filter((todo) => !todo.completed));
    } else if (filter === "completed") {
      setTodos(data.filter((todo) => todo.completed));
    }
  }, [data, filter]);

  return (
    <>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            value={newTodo}
            className="new-todo"
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                setNewTodo("");
                setTodos([
                  {
                    id: Math.random().toString(),
                    title: newTodo,
                    completed: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                  ...todos,
                ]);
                await fetch("/api/todos", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    title: newTodo,
                    completed: false,
                  }),
                });
                refetch();
              }
            }}
          />
        </header>

        {/* Should be hidden if no todos available */}
        <section className="main" hidden={data?.length === 0}>
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {/* List items should get the class `editing` when editing and `completed` when marked as completed */}
            {todos.map((todo) => (
              <li className="todo" key={todo.id}>
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={async (e) => {
                      setTodos(
                        todos.map((t) =>
                          t.id === todo.id
                            ? {
                                ...t,
                                completed: e.target.checked,
                              }
                            : t
                        )
                      );
                      await fetch(`/api/todos/${todo.id}`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          title: todo.title,
                          completed: e.target.checked,
                        }),
                      });
                      refetch();
                    }}
                  />
                  <label>{todo.title}</label>
                  <button
                    className="destroy"
                    onClick={async () => {
                      setTodos(todos.filter((t) => t.id !== todo.id));
                      await fetch(`/api/todos/${todo.id}`, {
                        method: "DELETE",
                      });
                      refetch();
                    }}
                  ></button>
                </div>
                <input className="edit" value="Your todo" />
              </li>
            ))}
            {/* more todos here */}
          </ul>
        </section>

        {/* Should be hidden if no todos available */}
        <footer className="footer" hidden={data?.length === 0}>
          {/* This should be `0 items left` by default */}
          <span className="todo-count">
            <strong>{activeTodos.length}</strong> items left
          </span>
          {/* Remove this if you don't implement routing */}
          <ul className="filters">
            <li>
              <a
                className={filter === "all" ? "selected" : ""}
                href="#/"
                onClick={(e) => setFilter("all")}
              >
                All
              </a>
            </li>
            <li>
              <a
                href="#/active"
                className={filter === "active" ? "selected" : ""}
                onClick={(e) => setFilter("active")}
              >
                Active
              </a>
            </li>
            <li>
              <a
                href="#/completed"
                className={filter === "completed" ? "selected" : ""}
                onClick={(e) => setFilter("completed")}
              >
                Completed
              </a>
            </li>
          </ul>
          {/* Hidden if no completed items are left ↓ */}
          <button
            hidden={completedTodos.length === 0}
            className="clear-completed"
            onClick={async () => {
              setTodos(activeTodos);
              await fetch(`/api/todos/completed`, {
                method: "DELETE",
              });
              refetch();
            }}
          >
            Clear completed
          </button>
        </footer>
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Created by <a href="#">Ahmed Abdallah</a>
        </p>
        <p>
          Inspired by <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  );
}
