import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Student } from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { SqlliteManagerService } from 'src/app/services/sqllite-manager.service';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss'],
  standalone: false
})
export class StudentsListComponent implements OnInit {

  public showForm: boolean;
  public showProgress: boolean;
  public students: Student[];
  public studentSelected: Student;
  public studentItemSelected: number;

  constructor(
    private sqliteService: SqlliteManagerService,
    private translateService: TranslateService,
    private alertService: AlertService,
  ) {
    this.showForm = false;
    this.showProgress = false;
    this.students = [];
    this.studentSelected = null;
    this.studentItemSelected = 0;
  }

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {
    Promise.all([
      this.sqliteService.getStudents()]).then(data => {
        this.students = data[0];
      })

  }

  onShowForm() {
    this.showForm = true;
    this.showProgress = false;
    this.studentSelected = null;
  }

  onCloseForm() {
    this.showForm = false;
    this.showProgress = false;
    this.getStudents();
  }

  async deleteStructureConfirm(item: Student) {
    const self = this;
    this.alertService.alertConfirm(
      this.translateService.instant('label.confirm'),
      this.translateService.instant('label.confirm.message.student'),
      () => {
        self.deleteStudent(item);
      }
    );
  }

  deleteStudent(item: Student) {
    this.sqliteService.deleteStudent(item.Id).then(() => {
      this.alertService.alertMessage(
        this.translateService.instant('label.success'),
        this.translateService.instant('label.success.message.remove.student')
      );
      this.getStudents();
    }).catch(error => {
      this.alertService.alertMessage(
        this.translateService.instant('label.error'),
        this.translateService.instant('label.error.message.remove.student')
      );
    });

  }


  selectItem(id: number) {
    this.showForm = false;
    this.showProgress = true;
    this.studentItemSelected = id;
  }

  updateStudent(item: Student) {
    this.studentSelected = item;
    this.showForm = true;
    this.showProgress = false;
  }

  calculateAge(birthDateStr: string): number {
    const [day, month, year] = birthDateStr.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Check if the birthday hasn't occurred yet this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

}
