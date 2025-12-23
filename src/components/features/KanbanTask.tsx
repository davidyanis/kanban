import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Task as TaskType } from "../../types/kanban";
import { useKanban } from "../../context/KanbanContext";
import { Button, Input, TextArea } from "../ui";

interface KanbanTaskProps {
  task: TaskType;
  listId: string;
}

export function KanbanTask({ task, listId }: KanbanTaskProps) {
  const { dispatch } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        type: "task",
        task,
        listId,
      },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (trimmedName) {
      dispatch({
        type: "UPDATE_TASK",
        payload: {
          listId,
          taskId: task.id,
          name: trimmedName,
          description: description.trim(),
        },
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setName(task.name);
    setDescription(task.description);
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch({
      type: "DELETE_TASK",
      payload: { listId, taskId: task.id },
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Task name"
          autoFocus
          fullWidth
          className="mb-2"
        />
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
          fullWidth
          className="mb-3"
        />
        <div className="flex gap-2">
          <Button onClick={handleSave} variant="primary">
            Save
          </Button>
          <Button onClick={handleCancel} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {task.name}
      </h4>
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 whitespace-pre-wrap">
          {task.description}
        </p>
      )}
      <div className="flex gap-2">
        <Button onClick={() => setIsEditing(true)} variant="ghost">
          Edit
        </Button>
        <Button
          onClick={handleDelete}
          variant="danger"
          data-testid="delete-task-button"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
