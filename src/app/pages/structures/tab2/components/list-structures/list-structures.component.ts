import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Structure } from 'src/app/models/structure';
import { AlertService } from 'src/app/services/alert.service';
import { SqlliteManagerService } from 'src/app/services/sqllite-manager.service';

@Component({
  selector: 'app-list-structures',
  templateUrl: './list-structures.component.html',
  styleUrls: ['./list-structures.component.scss'],
  standalone: false
})
export class ListStructuresComponent implements OnInit {

  public structures: Structure[];
  public structureSelected: Structure;
  public showForm: boolean;

  constructor(
    private sqliteService: SqlliteManagerService,
    private translateService: TranslateService,
    private alertService: AlertService,
  ) {
    this.showForm = false;
    this.structures = [];
    this.structureSelected = null;
  }

  ngOnInit() {
    this.getStructures();
  }

  onShowForm() {
    this.showForm = true;
    this.structureSelected = null;
  }

  onCloseForm() {
    this.showForm = false;
    this.getStructures();
  }

  getStructures() {
    this.sqliteService.getStructures().then((data) => {
      this.structures = data;
    });
  }

  convertToMinutesAndSeconds(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  updateStructure(item: Structure) {
    this.structureSelected = item;
    this.showForm = true;
  }

  async deleteStructureConfirm(item: Structure) {
    const self = this;
    this.alertService.alertConfirm(
      this.translateService.instant('label.confirm'),
      this.translateService.instant('label.confirm.message.structure'),
      () => {
        self.deleteStructure(item);
      }
    );
  }

  deleteStructure(item: Structure) {
    this.sqliteService.deleteStructure(item.Id).then(() => {
      this.alertService.alertMessage(
        this.translateService.instant('label.success'),
        this.translateService.instant('label.success.message.remove.structure')
      );
      this.getStructures();
    }).catch(error => {
      this.alertService.alertMessage(
        this.translateService.instant('label.error'),
        this.translateService.instant('label.error.message.remove.structure')
      );
    });

  }


}
