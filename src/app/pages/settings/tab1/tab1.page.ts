import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
import { SqlliteManagerService } from 'src/app/services/sqllite-manager.service';
import { ListSettingsComponent } from './components/list-settings/list-settings.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  @ViewChild(ListSettingsComponent) listSettings!: ListSettingsComponent;

  constructor(
    private sqliteService: SqlliteManagerService,
    private translateService: TranslateService,
    private alertService: AlertService,
  ) {}

  onSave() {
    const self = this;
    this.alertService.alertConfirm(
      this.translateService.instant('label.confirm'),
      this.translateService.instant('label.confirm.message.configuration'),
      () => {
        self.updateConfiguration();
      }
    );
  }

  updateConfiguration() {
    this.sqliteService.updateConfiguration(this.listSettings.getConfiguration()).then(() => {
      this.alertService.alertMessage(
        this.translateService.instant('label.success'),
        this.translateService.instant('label.success.message.edit.configuration')
      );
    }).catch(error => {
      this.alertService.alertMessage(
        this.translateService.instant('label.error'),
        this.translateService.instant('label.error.message.edit.configuration')
      );
    });
  }

}
