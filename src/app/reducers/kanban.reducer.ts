import { createReducer, on } from '@ngrx/store';
import * as KanbanActions from '../actions/kanban.actions';
import { KanbanBoard, KanbanTask, TaskStatus } from '../models/kanban.model';

// Initial kanban columns. Could come from db but for this coding task/challenge not needed
const initialBoardState: KanbanBoard = [
    {
        id: 'todo',
        title: "ToDo",
        tasks: []
    },
    {
        id: 'inprogress',
        title: "In Progress",
        tasks: []
    },
    {
        id: 'done',
        title: "Done",
        tasks: []
    }
];

export const boardReducer = createReducer(
    initialBoardState,
    on(KanbanActions.addTask, (entries, card) => {
        // Create a clone of card object because its readonly and we need to assign the ID
        const cardClone: KanbanTask = {...card};
        // Create a clone of the list 
        const listClone: KanbanBoard = JSON.parse(JSON.stringify(entries));

        // Use timestamp as ID because we have no real ID (no db usage)
        cardClone.id = Date.now();

        // Find list index by status
        const listIndex = listClone.findIndex((t => t.id === card.status));

        // Push the new task to the list
        listClone[listIndex].tasks.push(cardClone);
        return listClone;
    }),
    on(KanbanActions.editTask, (entries, card) => {
        // Create a clone of card object because its readonly and we need to assign the ID
        const cardClone: KanbanTask = {...card};
        // Create a clone of the list 
        const listClone: KanbanBoard = JSON.parse(JSON.stringify(entries));

        // Find the task and list index
        let taskIndex = -1;
        const listIndex = listClone.findIndex((list => {
            taskIndex = list.tasks.findIndex((t => t.id === card.id));
            return taskIndex !== -1;
        }));

        if(taskIndex === -1){
            // Should throw error here, bc task was not found in the array
            return listClone;
        }

        // Check if the status has changed and put the task in the correct list
        if(listClone[listIndex].id !== cardClone.status){
            // Find the index of the corresponding list for the status
            const newListIndex = entries.findIndex((list => list.id == cardClone.status));
            // Move to the other array
            listClone[listIndex].tasks.splice(taskIndex, 1); // remove
            listClone[newListIndex].tasks.splice(taskIndex, 0, cardClone); // add
        }else{
            // Modify the task
            listClone[listIndex].tasks[taskIndex] = cardClone;
        }
        return listClone;
    }),
    on(KanbanActions.reorderTask, (entries, data) => {
        // Create a clone of the list 
        let listClone: KanbanBoard = JSON.parse(JSON.stringify(entries));
        
        // Find index of the list
        const currentListIndex = entries.findIndex((list => list.id === data.listId));
        let tasks = listClone[currentListIndex].tasks;
        // Find task in the list
        const taskIndex = tasks.findIndex((t => t.id === data.task.id));

        // Get and remove the task from the array
        const taskEl = tasks.splice(taskIndex, 1)[0];
        // Use splice to change the index of the task
        tasks.splice(data.currentIndex, 0, taskEl);

        // Remove immutable state of tasks (bc of ngrx) 
        tasks = tasks.map((x) => ({ ...x }));
        // Update the orders base on the indexes
        tasks.forEach((t, index) => {
            t.order = index;
        });

        return listClone;
    }),
    on(KanbanActions.moveTask, (entries, data) => {
        // Create a clone of the list 
        let listClone: KanbanBoard = JSON.parse(JSON.stringify(entries));
        
        // Find task in previous list to remove it
        const previousListIndex = entries.findIndex((list => list.id == data.previousListId));
        // Find task in current list
        const currentListIndex = entries.findIndex((list => list.id == data.currentListId));
        let tasks = listClone[currentListIndex].tasks;

        // Create a clone of card object because its readonly and we need to change the status
        const cardClone: KanbanTask = {...data.task};

        // Change the status property of the task (the list id equals the status)
        cardClone.status = <TaskStatus>listClone[currentListIndex].id;

        // Use splice to set the item in the correct index (order) of the array 
        tasks.splice(data.currentIndex, 0, cardClone);
        // Remove immutable state of tasks (bc of ngrx) 
        tasks = tasks.map((x) => ({ ...x }));
        // Update the orders base on the indexes
        tasks.forEach((t, index) => {
            t.order = index;
        });

        // Remove item from previous list
        const removeIndex = listClone[previousListIndex].tasks.findIndex((obj => obj.id == data.task.id));
        listClone[previousListIndex].tasks.splice(removeIndex, 1);
        return listClone;
    })
);