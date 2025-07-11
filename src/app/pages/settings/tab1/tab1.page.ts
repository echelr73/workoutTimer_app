import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
import { SqlliteManagerService } from 'src/app/services/sqllite-manager.service';
import { ListSettingsComponent } from './components/list-settings/list-settings.component';
import { IonRouterOutlet, NavController } from '@ionic/angular';
import { Configuration } from 'src/app/models/configuration';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  @ViewChild(ListSettingsComponent) listSettings!: ListSettingsComponent;

  private initialConfiguration: Configuration;
  public hasUnsavedChanges: boolean = false;


  constructor(
    private sqliteService: SqlliteManagerService,
    private translateService: TranslateService,
    private alertService: AlertService,
    private navController: NavController,
  ) { }

  loadConfiguration() {
    this.sqliteService.getConfiguration().then(config => {
      this.initialConfiguration = this.normalizeConfig(config[0]);
    });
  }

  ionViewWillEnter() {
    this.listSettings.loadConfiguration();
    this.loadConfiguration();
  }

  ionViewWillLeave(event: Event) {
    this.onSettingsChange();
    if (this.hasUnsavedChanges) {
      this.alertService.alertConfirm(
        this.translateService.instant('label.settings'),
        this.translateService.instant('label.settings.unsaved'),
        () => {
          this.navController.back();
          this.hasUnsavedChanges = false;
        }
      );
    }
  }

  onSettingsChange() {
    this.checkForUnsavedChanges();
  }

  private checkForUnsavedChanges() {
    const currentConfig = this.normalizeConfig(this.listSettings.getConfiguration());
    this.hasUnsavedChanges = JSON.stringify(this.initialConfiguration) !== JSON.stringify(currentConfig);
  }

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
    this.sqliteService.updateConfiguration(this.listSettings.getConfiguration()).then((data) => {
      this.alertService.alertMessage(
        this.translateService.instant('label.success'),
        this.translateService.instant('label.success.message.edit.configuration')
      );
      this.hasUnsavedChanges = false;
      this.loadConfiguration();
    }).catch(error => {
      this.alertService.alertMessage(
        this.translateService.instant('label.error'),
        this.translateService.instant('label.error.message.edit.configuration')
      );
    });
  }

  private normalizeConfig(config: Configuration): Configuration {
    const normalizedConfig: any = {};

    for (const key in config) {
      if (key === 'Id' || key === 'SoundVolume') {
        normalizedConfig[key] = config[key];
      } else if (config[key] === 0 || config[key] === 1) {
        normalizedConfig[key] = !!config[key];
      } else if (typeof config[key] === 'boolean') {
        normalizedConfig[key] = config[key];
      } else {
        normalizedConfig[key] = config[key];
      }
    }

    return normalizedConfig as Configuration;
  }


}
