import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { nanoid } from "nanoid";
import type { KanbanState, KanbanAction, List, Task } from "../types/kanban";
import { loadStateFromDB, saveStateToDB } from "../utils/db";

const KanbanContext = createContext<
  | {
      state: KanbanState;
      dispatch: React.Dispatch<KanbanAction>;
    }
  | undefined
>(undefined);

const initialState: KanbanState = {
  lists: [],
};

function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
  switch (action.type) {
    case "ADD_LIST": {
      const newList: List = {
        id: nanoid(),
        name: action.payload.name,
        tasks: [],
      };
      return {
        ...state,
        lists: [...state.lists, newList],
      };
    }

    case "DELETE_LIST": {
      return {
        ...state,
        lists: state.lists.filter((list) => list.id !== action.payload.listId),
      };
    }

    case "RENAME_LIST": {
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload.listId
            ? { ...list, name: action.payload.name }
            : list
        ),
      };
    }

    case "ADD_TASK": {
      const newTask: Task = {
        id: nanoid(),
        name: action.payload.name,
        description: action.payload.description,
      };
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload.listId
            ? { ...list, tasks: [...list.tasks, newTask] }
            : list
        ),
      };
    }

    case "DELETE_TASK": {
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload.listId
            ? {
                ...list,
                tasks: list.tasks.filter(
                  (task) => task.id !== action.payload.taskId
                ),
              }
            : list
        ),
      };
    }

    case "UPDATE_TASK": {
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload.listId
            ? {
                ...list,
                tasks: list.tasks.map((task) =>
                  task.id === action.payload.taskId
                    ? {
                        ...task,
                        name: action.payload.name,
                        description: action.payload.description,
                      }
                    : task
                ),
              }
            : list
        ),
      };
    }

    case "MOVE_TASK": {
      const { taskId, sourceListId, targetListId } = action.payload;

      // Find the task in the source list
      const sourceList = state.lists.find((list) => list.id === sourceListId);
      const task = sourceList?.tasks.find((t) => t.id === taskId);

      if (!task || !sourceList) return state;

      // If moving within the same list, do nothing
      if (sourceListId === targetListId) return state;

      // Remove from source, add to target
      return {
        ...state,
        lists: state.lists.map((list) => {
          if (list.id === sourceListId) {
            return {
              ...list,
              tasks: list.tasks.filter((t) => t.id !== taskId),
            };
          }
          if (list.id === targetListId) {
            return {
              ...list,
              tasks: [...list.tasks, task],
            };
          }
          return list;
        }),
      };
    }

    case "SORT_LIST": {
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload.listId
            ? {
                ...list,
                tasks: [...list.tasks].sort((a, b) =>
                  a.name.localeCompare(b.name)
                ),
              }
            : list
        ),
      };
    }

    case "LOAD_STATE": {
      return action.payload;
    }

    default:
      return state;
  }
}

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(kanbanReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from IndexedDB on mount
  useEffect(() => {
    async function loadInitialState() {
      const savedState = await loadStateFromDB();
      if (savedState) {
        // Restore the saved state by dispatching updates
        // We need to load it into the reducer state
        dispatch({ type: "LOAD_STATE", payload: savedState });
      }
      setIsLoaded(true);
    }
    loadInitialState();
  }, []);

  // Save state to IndexedDB whenever it changes (but skip initial load)
  useEffect(() => {
    if (isLoaded) {
      saveStateToDB(state);
    }
  }, [state, isLoaded]);

  return (
    <KanbanContext.Provider value={{ state, dispatch }}>
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
}
