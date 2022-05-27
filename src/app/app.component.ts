import { Component } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { selectBoard } from './selectors/kanban.selector';
import { AppState } from './app.state';
import { addTask, moveTask, editTask, reorderTask } from './actions/kanban.actions';
import {MatDialog} from '@angular/material/dialog';
import { AddTaskComponent } from './add-task/add-task.component';
import { KanbanTask } from './models/kanban.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  columns$: any;

  constructor(private store: Store<AppState>, public dialog: MatDialog) { 
    // Get data from store
    this.columns$ = store.select(selectBoard);
  }

  /* Add task function */
  addTask(){
    // Open material dialog
    let dialogRef = this.dialog.open(AddTaskComponent, {
      width: '600px',
    });
    
    dialogRef.afterClosed().subscribe(result => {
      // DIalog has been closed
      if(result){
        // Use timestamp as ID because we have no real ID (no db usage)
        const taskId: number = Date.now();

        // Set taskdata obj and dispatch it
        const taskData = { 
          id:taskId,
          title: result.title,
          taskType: result.taskType,
          status: result.status,
          order: 0
        };
        this.store.dispatch(addTask(taskData));
      }
    });
  }

  /* Edit task function */
  editTask(task: KanbanTask){
    // Open material dialog
    let dialogRef = this.dialog.open(AddTaskComponent, {
      width: '600px',
      data: task
    });
    
    dialogRef.afterClosed().subscribe(result => {
      // Dialog has been closed
      if(result){
        // Set taskdata obj and dispatch it
        const taskData = { 
          id: task.id,
          title: result.title,
          taskType: result.taskType,
          status: result.status,
          order: 0
        };
        this.store.dispatch(editTask(taskData));
      }
    });
  }

  /* Drop event from angular material d&d */
  drop(event: CdkDragDrop<any>) {
    // Get id of previous list
    const previousListId = event.previousContainer.id;
    // Get id of current list
    const currentListId = event.container.id;

    if (event.previousContainer === event.container) {
      // Item has been reordered. Dispatch reorderTask
      this.store.dispatch(reorderTask({listId: currentListId, currentIndex: event.currentIndex, task: event.item.data}));
    } else {
      // Item has been dragged to another column. Dispatch moveTask
      this.store.dispatch(moveTask({previousListId, currentListId, currentIndex: event.currentIndex, task: event.item.data}));
    }
  }
}
