import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { KanbanProvider } from "../context/KanbanContext";
import { KanbanBoard } from "../components/features/KanbanBoard";

// Helper to render with context
export function renderKanbanBoard() {
  return render(
    <KanbanProvider>
      <KanbanBoard />
    </KanbanProvider>
  );
}

// Helper to create a list
export async function createList(
  user: ReturnType<typeof userEvent.setup>,
  name: string
) {
  await user.click(screen.getByRole("button", { name: /add list/i }));
  await user.type(screen.getByPlaceholderText(/list name/i), name);
  await user.click(screen.getByRole("button", { name: /^add list$/i }));
}

// Helper to create a task
export async function createTask(
  user: ReturnType<typeof userEvent.setup>,
  name: string,
  description = ""
) {
  await user.click(screen.getByRole("button", { name: /add task/i }));
  await user.type(screen.getByPlaceholderText(/task name/i), name);
  if (description) {
    await user.type(
      screen.getByPlaceholderText(/task description/i),
      description
    );
  }
  await user.click(screen.getByRole("button", { name: /^add task$/i }));
}
