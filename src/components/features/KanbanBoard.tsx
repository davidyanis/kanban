import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useKanban } from "../../context/KanbanContext";
import { KanbanList } from "./KanbanList";
import { Button, Input } from "../ui";
import type { Task } from "../../types/kanban";

export function KanbanBoard() {
  const { state, dispatch } = useKanban();
  const [isAddingList, setIsAddingList] = useState(false);
  const [listName, setListName] = useState("");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Configure drag-and-drop sensors with an 8px activation threshold.
  // This prevents accidental drags when users click buttons or select text.
  // Dragging only starts after the pointer moves 8 pixels from the initial click.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "task") {
      setActiveTask(active.data.current.task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Check if we're dropping a task over a list
    if (activeData?.type === "task" && overData?.type === "list") {
      const taskId = active.id as string;
      const sourceListId = activeData.listId;
      const targetListId = over.id as string;

      if (sourceListId !== targetListId) {
        dispatch({
          type: "MOVE_TASK",
          payload: {
            taskId,
            sourceListId,
            targetListId,
          },
        });
      }
    }
  };

  const handleAddList = () => {
    const trimmedListName = listName.trim();

    if (trimmedListName) {
      dispatch({
        type: "ADD_LIST",
        payload: { name: trimmedListName },
      });
      setListName("");
      setIsAddingList(false);
    }
  };

  const handleCancelAddList = () => {
    setListName("");
    setIsAddingList(false);
  };

  // Filter lists based on search query
  const filteredLists = state.lists.map((list) => ({
    ...list,
    tasks: list.tasks.filter((task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-12 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Kanban Board
            </h1>
            <div className="w-80">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                fullWidth
                className="text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 items-stretch">
            {/* Lists */}
            {filteredLists.map((list) => (
              <div key={list.id} className="animate-[slideIn_0.3s_ease-out] flex">
                <KanbanList list={list} searchQuery={searchQuery} />
              </div>
            ))}

            {/* Add List Button/Form */}
            {isAddingList ? (
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 min-w-[320px] max-w-[320px] animate-[fadeIn_0.2s_ease-out]">
                <Input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="List name"
                  autoFocus
                  fullWidth
                  className="mb-3"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddList();
                    if (e.key === "Escape") {
                      handleCancelAddList();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddList} variant="primary" size="md">
                    Add List
                  </Button>
                  <Button
                    onClick={() => {
                      handleCancelAddList();
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
                onClick={() => setIsAddingList(true)}
                variant="ghost"
                className="rounded-lg p-4 min-w-[320px] max-w-[320px]"
              >
                + Add List
              </Button>
            )}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700 opacity-90 cursor-grabbing">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {activeTask.name}
            </h4>
            {activeTask.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activeTask.description}
              </p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
