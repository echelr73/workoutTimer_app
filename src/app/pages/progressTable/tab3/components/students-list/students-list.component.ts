import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
  public students: any;

  constructor(
    private sqliteService: SqlliteManagerService,
    private translateService: TranslateService,
    private alertService: AlertService,
  ) {
    this.showForm = false;
  }

  ngOnInit() {
    //this.getStructures();
  }

  onShowForm() {
    this.showForm = true;
    //this.structureSelected = null;
  }

  onCloseForm() {
    this.showForm = false;
    //this.getStructures();
  }

  async deleteStructureConfirm(item: any) {
    const self = this;
    this.alertService.alertConfirm(
      this.translateService.instant('label.confirm'),
      this.translateService.instant('label.confirm.message.structure'),
      () => {
        self.deleteStructure(item);
      }
    );
  }

  deleteStructure(item: any) {
    this.sqliteService.deleteStructure(item.Id).then(() => {
      this.alertService.alertMessage(
        this.translateService.instant('label.success'),
        this.translateService.instant('label.success.message.remove.structure')
      );
      //this.getStructures();
    }).catch(error => {
      this.alertService.alertMessage(
        this.translateService.instant('label.error'),
        this.translateService.instant('label.error.message.remove.structure')
      );
    });

  }

  
  selectItem(id: number) {
    //this.itemSelected.emit(id);
  }

}
