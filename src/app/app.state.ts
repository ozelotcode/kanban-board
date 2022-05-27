import { KanbanBoard, KanbanList } from "./models/kanban.model";

export interface AppState {
    board: KanbanBoard[];
    list: KanbanList;
}