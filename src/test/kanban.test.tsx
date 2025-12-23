import { describe, it, expect, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderKanbanBoard, createList, createTask } from "./utils";

describe("Kanban Board - User Behavior Tests", () => {
  describe("List Management", () => {
    it("should allow users to create a new list", async () => {
      const user = userEvent.setup();
      renderKanbanBoard();

      await createList(user, "To Do");

      expect(screen.getByText("To Do")).toBeInTheDocument();
    });

    it("should allow users to delete a list", async () => {
      const user = userEvent.setup();
      renderKanbanBoard();

      // Mock window.confirm for this test
      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

      await createList(user, "Delete Me");
      expect(screen.getByText("Delete Me")).toBeInTheDocument();

      const deleteButton = screen.getByTitle("Delete list");
      await user.click(deleteButton);

      expect(screen.queryByText("Delete Me")).not.toBeInTheDocument();
      confirmSpy.mockRestore();
    });
  });

  describe("Task Management", () => {
    it("should allow users to add a task to a list", async () => {
      const user = userEvent.setup();
      renderKanbanBoard();

      await createList(user, "My List");
      await createTask(user, "New Task", "Task details");

      expect(screen.getByText("New Task")).toBeInTheDocument();
      expect(screen.getByText("Task details")).toBeInTheDocument();
    });

    it("should allow users to delete a task", async () => {
      const user = userEvent.setup();
      renderKanbanBoard();

      // Mock window.confirm for this test
      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

      await createList(user, "My List");
      await createTask(user, "Delete This Task");

      expect(screen.getByText("Delete This Task")).toBeInTheDocument();

      // Use within() to scope the query to the specific task card
      const taskHeading = screen.getByRole("heading", {
        name: "Delete This Task",
      });
      const taskCard = taskHeading.closest("div");
      if (taskCard) {
        const deleteButton = within(taskCard).getByTestId("delete-task-button");
        await user.click(deleteButton);
      }

      expect(screen.queryByText("Delete This Task")).not.toBeInTheDocument();
      confirmSpy.mockRestore();
    });
  });

  describe("Sort Feature", () => {
    it("should sort tasks alphabetically when user clicks sort button", async () => {
      const user = userEvent.setup();
      renderKanbanBoard();

      await createList(user, "My List");

      // Add tasks in non-alphabetical order
      const taskNames = ["Zebra", "Apple", "Mango", "Banana"];
      for (const name of taskNames) {
        await createTask(user, name);
      }

      // Click sort button
      const sortButton = screen.getByRole("button", { name: /sort a-z/i });
      await user.click(sortButton);

      // Get all task names in order
      const taskElements = screen.getAllByRole("heading", { level: 4 });
      const actualOrder = taskElements.map((el) => el.textContent);

      // Verify alphabetical order
      expect(actualOrder).toEqual(["Apple", "Banana", "Mango", "Zebra"]);
    });

    it("should hide sort button when search is active", async () => {
      const user = userEvent.setup();
      renderKanbanBoard();

      await createList(user, "My List");
      await createTask(user, "Task 1");

      // Verify sort button exists
      expect(
        screen.getByRole("button", { name: /sort a-z/i })
      ).toBeInTheDocument();

      // Type in search
      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, "Task");

      // Verify sort button is hidden
      expect(
        screen.queryByRole("button", { name: /sort a-z/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Search Feature", () => {
    it("should filter tasks by name when user types in search box", async () => {
      const user = userEvent.setup();
      renderKanbanBoard();

      await createList(user, "My List");

      const tasks = ["Buy groceries", "Write report", "Buy tickets"];
      for (const task of tasks) {
        await createTask(user, task);
      }

      // All tasks should be visible
      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.getByText("Write report")).toBeInTheDocument();
      expect(screen.getByText("Buy tickets")).toBeInTheDocument();

      // Search for "buy"
      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, "buy");

      // Only "buy" tasks should be visible
      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.getByText("Buy tickets")).toBeInTheDocument();
      expect(screen.queryByText("Write report")).not.toBeInTheDocument();
    });

    it("should be case-insensitive", async () => {
      const user = userEvent.setup();
      renderKanbanBoard();

      await createList(user, "My List");
      await createTask(user, "IMPORTANT Task");

      // Search with lowercase
      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, "important");

      // Should still find the task
      expect(screen.getByText("IMPORTANT Task")).toBeInTheDocument();
    });

    it("should clear filter when search is cleared", async () => {
      const user = userEvent.setup();
      renderKanbanBoard();

      await createList(user, "My List");
      await createTask(user, "Task One");
      await createTask(user, "Task Two");

      // Search
      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, "One");

      expect(screen.getByText("Task One")).toBeInTheDocument();
      expect(screen.queryByText("Task Two")).not.toBeInTheDocument();

      // Clear search
      await user.clear(searchInput);

      // Both tasks should be visible again
      expect(screen.getByText("Task One")).toBeInTheDocument();
      expect(screen.getByText("Task Two")).toBeInTheDocument();
    });
  });

  describe("Integration Tests", () => {
    it("should maintain independent state across multiple lists", async () => {
      const user = userEvent.setup();
      renderKanbanBoard();

      // Create two lists
      await createList(user, "Backlog");
      await createList(user, "In Progress");

      // Add task to first list
      const addTaskButtons = screen.getAllByRole("button", {
        name: /add task/i,
      });
      await user.click(addTaskButtons[0]);
      await user.type(
        screen.getByPlaceholderText(/task name/i),
        "Task in Backlog"
      );
      await user.click(screen.getByRole("button", { name: /^add task$/i }));

      expect(screen.getByText("Task in Backlog")).toBeInTheDocument();
    });

    it("should handle edge case of empty task name gracefully", async () => {
      const user = userEvent.setup();
      renderKanbanBoard();

      await createList(user, "My List");

      // Try to add task with empty name
      await user.click(screen.getByRole("button", { name: /add task/i }));
      const submitButton = screen.getByRole("button", { name: /^add task$/i });
      await user.click(submitButton);

      // Form should still be visible (not submitted)
      expect(screen.getByPlaceholderText(/task name/i)).toBeInTheDocument();
    });
  });
});
