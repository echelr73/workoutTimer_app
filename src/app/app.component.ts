import { Component } from '@angular/core';
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SqlliteManagerService } from './services/sqllite-manager.service';
import { AlertService } from './services/alert.service';
import { App as CapacitorApp } from '@capacitor/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  public isWeb: boolean;
  public load: boolean;

  constructor(
    private translate: TranslateService,
    private platform: Platform,
    private router: Router,
    private sqliteService: SqlliteManagerService,
    private alertServie: AlertService
  ) {

    this.translate.setDefaultLang('es');
    this.isWeb = false;
    this.load = false;
    this.initApp();
  }

  initApp() {
    this.platform.ready().then(async () => {
      const lang = await Device.getLanguageCode();
      const info = await Device.getInfo();

      this.isWeb = info.platform == 'web';

      if (lang.value) {
        this.translate.use(lang.value.slice(0, 2));
      }

      this.sqliteService.init();
      this.sqliteService.dbReady.subscribe(isReady => {
        this.load = isReady;
        if (this.load) {
          this.alertServie.alertMessage(
            this.translate.instant('Bienvenido'),
            this.translate.instant('Que tengas buen entrenamiento')
          );
        }
      });
      CapacitorApp.addListener('backButton', () => {
        const currentUrl = this.router.url;
        // Verificamos si estamos en el tab 2
        if (currentUrl.includes('/tabs/tab2')) {
          const confirmExit = confirm('¿Querés salir de la app?');
          if (confirmExit) {
            CapacitorApp.exitApp();
          }
        }
      });
    });
  }
}
