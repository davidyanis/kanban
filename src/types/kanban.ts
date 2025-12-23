export interface Task {
  id: string;
  name: string;
  description: string;
}

export interface List {
  id: string;
  name: string;
  tasks: Task[];
}

export interface KanbanState {
  lists: List[];
}

export type KanbanAction =
  | { type: "ADD_LIST"; payload: { name: string } }
  | { type: "DELETE_LIST"; payload: { listId: string } }
  | { type: "RENAME_LIST"; payload: { listId: string; name: string } }
  | {
      type: "ADD_TASK";
      payload: { listId: string; name: string; description: string };
    }
  | { type: "DELETE_TASK"; payload: { listId: string; taskId: string } }
  | {
      type: "UPDATE_TASK";
      payload: {
        listId: string;
        taskId: string;
        name: string;
        description: string;
      };
    }
  | {
      type: "MOVE_TASK";
      payload: {
        taskId: string;
        sourceListId: string;
        targetListId: string;
      };
    }
  | { type: "SORT_LIST"; payload: { listId: string } }
  | { type: "LOAD_STATE"; payload: KanbanState };
