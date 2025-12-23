import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { List } from "../../types/kanban";
import { useKanban } from "../../context/KanbanContext";
import { KanbanTask } from "./KanbanTask";
import { Button, Input, TextArea } from "../ui";

interface KanbanListProps {
  list: List;
  searchQuery?: string;
}

export function KanbanList({ list, searchQuery = "" }: KanbanListProps) {
  const { dispatch } = useKanban();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [listName, setListName] = useState(list.name);

  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: {
      type: "list",
      list,
    },
  });

  const handleAddTask = () => {
    const trimmedTaskName = taskName.trim();
    if (trimmedTaskName) {
      dispatch({
        type: "ADD_TASK",
        payload: {
          listId: list.id,
          name: trimmedTaskName,
          description: taskDescription.trim(),
        },
      });
      setTaskName("");
      setTaskDescription("");
      setIsAddingTask(false);
    }
  };

  const handleDeleteList = () => {
    if (confirm(`Delete "${list.name}" and all its tasks?`)) {
      dispatch({
        type: "DELETE_LIST",
        payload: { listId: list.id },
      });
    }
  };

  const handleRenameList = () => {
    const trimmedListName = listName.trim();
    if (trimmedListName) {
      dispatch({
        type: "RENAME_LIST",
        payload: { listId: list.id, name: trimmedListName },
      });
      setIsEditingName(false);
    }
  };

  const handleCancelRename = () => {
    setListName(list.name);
    setIsEditingName(false);
  };

  const handleSortList = () => {
    dispatch({
      type: "SORT_LIST",
      payload: { listId: list.id },
    });
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 min-w-[320px] max-w-[320px] flex flex-col h-full">
      {/* List Header */}
      <div className="mb-4">
        {isEditingName ? (
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="List name"
              autoFocus
              fullWidth
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameList();
                if (e.key === "Escape") handleCancelRename();
              }}
            />
          </div>
        ) : (
          <div className="mb-2">
            <div className="flex justify-between items-center mb-2">
              <h3
                className="text-lg font-bold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsEditingName(true)}
              >
                {list.name}
              </h3>
              <button
                onClick={handleDeleteList}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
                title="Delete list"
              >
                ✕
              </button>
            </div>
            {!searchQuery && list.tasks.length > 0 && (
              <button
                onClick={handleSortList}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                title="Sort alphabetically"
              >
                <span>⬍⬍</span>
                Sort A-Z
              </button>
            )}
          </div>
        )}
        {isEditingName && (
          <div className="flex gap-2">
            <Button onClick={handleRenameList} variant="primary">
              Save
            </Button>
            <Button onClick={handleCancelRename} variant="secondary">
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Tasks */}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-3 mb-4 overflow-y-auto min-h-[200px] rounded-md transition-colors ${
          isOver ? "bg-blue-50 dark:bg-blue-900/20" : ""
        }`}
      >
        {list.tasks.map((task) => (
          <div key={task.id} className="animate-[slideIn_0.3s_ease-out]">
            <KanbanTask task={task} listId={list.id} />
          </div>
        ))}
      </div>

      {/* Add Task Form */}
      {isAddingTask ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 animate-[fadeIn_0.2s_ease-out]">
          <Input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Task name"
            autoFocus
            fullWidth
            className="mb-2"
          />
          <TextArea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Task description (optional)"
            rows={3}
            fullWidth
            className="mb-3"
          />
          <div className="flex gap-2">
            <Button onClick={handleAddTask} variant="primary" size="md">
              Add Task
            </Button>
            <Button
              onClick={() => {
                setIsAddingTask(false);
                setTaskName("");
                setTaskDescription("");
              }}
              variant="secondary"
              size="md"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsAddingTask(true)}
          variant="ghost"
          className="w-full"
        >
          + Add Task
        </Button>
      )}
    </div>
  );
}
