/* Kanban List */
export interface KanbanList {
    id: string;
    title: string;
    tasks: KanbanTask[];
}

/* Kanban Board (array of the lists) */
export type KanbanBoard = ReadonlyArray<KanbanList>;

/* Kanban Task */
export interface KanbanTask {
    id: number;
    title: string;
    taskType: TaskType;
    status: TaskStatus,
    order?: number;
}
export enum TaskStatus {
    TODO = 'todo',
    IN_PROGRESS = 'inprogress',
    DONE = 'done'
}
export enum TaskType {
    FEATURE_REQUEST = 'featureRequest',
    BUG = 'bug',
}
