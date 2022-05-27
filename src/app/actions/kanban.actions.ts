import { createAction, props } from '@ngrx/store';
import { KanbanTask } from '../models/kanban.model';

export const addTask = createAction(
    '[KANBAN BOARD] Add task', 
    props<KanbanTask>()
);

export const editTask = createAction(
    '[KANBAN BOARD] Edit task', 
    props<KanbanTask>()
);

export const moveTask = createAction(
    '[KANBAN BOARD] Move task', 
    props<{ previousListId: string, currentListId: string, currentIndex: number, task: KanbanTask }>()
);

export const reorderTask = createAction(
    '[KANBAN BOARD] Reorder task', 
    props<{ listId: string, currentIndex: number, task: KanbanTask }>()
);