import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Progress } from 'src/app/models/progress';
import { AlertService } from 'src/app/services/alert.service';
import { SqlliteManagerService } from 'src/app/services/sqllite-manager.service';

@Component({
  selector: 'app-student-progress',
  templateUrl: './student-progress.component.html',
  styleUrls: ['./student-progress.component.scss'],
  standalone: false
})
export class StudentProgressComponent implements OnInit {

  @Input() studentId: number;
  public progress: Progress[] = [];
  public originalProgress: string;
  @Output() closeForm: EventEmitter<boolean>;

  constructor(
    private sqliteService: SqlliteManagerService,
    private translateService: TranslateService,
    private alertService: AlertService,
  ) {
    this.closeForm = new EventEmitter<boolean>();
  }

  ngOnInit() {
    this.getProgressForStudent(this.studentId);
  }

  getProgressForStudent(id: number) {
    this.sqliteService.getProgressForStudentId(id).then((data: Progress[]) => {
      this.progress = data;
      this.originalProgress = JSON.parse(JSON.stringify(this.progress));
    }).catch(error => {
      console.error(error);
    });
  }

  async updateProgress(form: NgForm) {
    const itemsToUpdate = this.progress.filter(p => p.Id);
    const itemsToInsert = this.progress.filter(p => !p.Id);
  
    try {
      if (itemsToUpdate.length > 0) {
        await this.sqliteService.updateMultipleProgress(itemsToUpdate);
      }
  
      if (itemsToInsert.length > 0) {
        await this.sqliteService.insertMultipleProgress(itemsToInsert);
      }
  
      await this.alertService.alertMessage(
        this.translateService.instant('label.success'),
        this.translateService.instant('label.success.message.edit.progress')
      );
  
    } catch (error) {
      console.log(error);
      await this.alertService.alertMessage(
        this.translateService.instant('label.error'),
        this.translateService.instant('label.error.message.edit.progress')
      );
    }
  
    this.closeFormEmit();
  }

  wasModified(): boolean {
    return JSON.stringify(this.progress) !== JSON.stringify(this.originalProgress);
  }

  closeFormEmit() {
    this.closeForm.emit(true);
  }

  addProgress(){
    this.progress.push({
      Id: null,
      StudentId:this.studentId,
      ExerciseName: '',
      MuscleGroup: '',
      Measure: '',
      Date: ''
    });
  }

}
