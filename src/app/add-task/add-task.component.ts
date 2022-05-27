import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { KanbanTask, TaskStatus, TaskType } from '../models/kanban.model';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  taskForm = this.formBuilder.group({
    id: null,
    title: '',
    taskType: TaskType.FEATURE_REQUEST,
    status: TaskStatus.TODO
  });
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: KanbanTask,
  ) {
    if(data){
      // We have data, so we are editing a task. Set the values for the form
      this.isEditing = true;
      this.taskForm.controls['id'].setValue(data.id);
      this.taskForm.controls['title'].setValue(data.title);
      this.taskForm.controls['taskType'].setValue(data.taskType);
      this.taskForm.controls['status'].setValue(data.status);
    }
  }

  /* Save task function. Only triggers the close event */
  saveTask() {
    this.dialogRef.close(this.taskForm.value);
  }
  

}
