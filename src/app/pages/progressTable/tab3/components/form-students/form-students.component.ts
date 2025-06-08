import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Student } from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { SqlliteManagerService } from 'src/app/services/sqllite-manager.service';

@Component({
  selector: 'app-form-students',
  templateUrl: './form-students.component.html',
  styleUrls: ['./form-students.component.scss'],
  standalone: false
})
export class FormStudentsComponent implements OnInit {

  @Input() student: Student;

  @ViewChild('name', { static: false, read: ElementRef }) name!: ElementRef;
  @Output() closeForm: EventEmitter<boolean>;

  public update: boolean;

  constructor(
    private sqliteService: SqlliteManagerService,
    private translateService: TranslateService,
    private alertService: AlertService,
  ) {
    this.closeForm = new EventEmitter<boolean>();
  }

  ngOnInit() {
    if (!this.student) {
      this.update = false;
      this.student = new Student();
    } else {
      this.update = true;
    }
  }

  closeFormEmit() {
    this.closeForm.emit(true);
  }

  createUpdateStudent(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.update) {
      this.updateStudent(form);
    } else {
      this.createStudent(form);
    }
  }

  createStudent(form: NgForm) {
    if (!this.student.Name || this.student.Name.trim() === '') {
      form.form.controls['name'].setErrors({ required: true });
      this.alertService.alertMessage(
        this.translateService.instant('label.error'),
        this.translateService.instant('label.error.message.form.invalid')
      );
      setTimeout(() => {
        if (this.name) {
          this.name.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          this.name.nativeElement.focus();
        }
      }, 200);
      return;
    }
    this.sqliteService.createStudent(this.student).then(() => {
      this.alertService.alertMessage(
        this.translateService.instant('label.success'),
        this.translateService.instant('label.success.message.add.student')
      );
      this.closeFormEmit();
    }).catch(error => {
      this.alertService.alertMessage(
        this.translateService.instant('label.error'),
        this.translateService.instant('label.error.message.add.student')
      );
    });
  }

  updateStudent(form: NgForm) {
    if (!this.student.Name || this.student.Name.trim() === '') {
      form.form.controls['name'].setErrors({ required: true });
      this.alertService.alertMessage(
        this.translateService.instant('label.error'),
        this.translateService.instant('label.error.message.form.invalid')
      );
      setTimeout(() => {
        if (this.name) {
          this.name.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          this.name.nativeElement.focus();
        }
      }, 200);
      return;
    }
    this.sqliteService.updateStudent(this.student).then(() => {
      this.alertService.alertMessage(
        this.translateService.instant('label.success'),
        this.translateService.instant('label.success.message.edit.student')
      );
      this.closeFormEmit();
    }).catch(error => {
      this.alertService.alertMessage(
        this.translateService.instant('label.error'),
        this.translateService.instant('label.error.message.edit.student')
      );
    });

  }

}
