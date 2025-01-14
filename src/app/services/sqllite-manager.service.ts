import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorSQLite, JsonSQLite } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SqlliteManagerService {

  public dbReady: BehaviorSubject<boolean>;
  public isWeb: boolean;
  public dbName: string;
  private DB_SETUP_KEY = 'first_db_setup';
  private DB_NAME_KEY = 'db_name';

  constructor(
    private alertController: AlertController,
    private http: HttpClient,
  ) {
    this.dbReady = new BehaviorSubject<boolean>(false);
    this.isWeb = false;
    this.dbName = '';
  }

  async init() {

    const info = await Device.getInfo();
    const sqlite = CapacitorSQLite as any;

    if (info.platform == 'android') {
      try {
        await sqlite.requestPermissions();
      }
      catch (e) {
        const alert = await this.alertController.create({
          header: 'Sin acceso a la base de datos',
          message: 'Esta app necesita acceso a la base de datos para funcionar',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else if (info.platform == 'web') {
      this.isWeb = true;
      await sqlite.initWebStore();
    }

    this.setupDatabase();

  }

  async setupDatabase() {
    const dbSetupDone = await Preferences.get({ key: this.DB_SETUP_KEY });
    if (!dbSetupDone.value) {
      this.downloadDatabase();
    } else {
      this.dbName = await this.getDBName();
      await CapacitorSQLite.createConnection({database: this.dbName, encrypted: false, mode: 'full'});
      await CapacitorSQLite.open({database: this.dbName});
      this.dbReady.next(true);
    }
  }

  downloadDatabase(){
    this.http.get('assets/db/dbTraining.json').subscribe(async (jsonExport: JsonSQLite) => {
      const jsonString = JSON.stringify(jsonExport);
      const isValid= await CapacitorSQLite.isJsonValid({jsonstring: jsonString});

      if (isValid.result){
        this.dbName = jsonExport.database;
        await CapacitorSQLite.importFromJson({jsonstring: jsonString});
        await CapacitorSQLite.createConnection({database: this.dbName, encrypted: false, mode: 'full'});
        await CapacitorSQLite.open({database: this.dbName});

        await Preferences.set({key: this.DB_SETUP_KEY, value: '1'});
        await Preferences.set({key: this.DB_NAME_KEY, value: this.dbName});
        this.dbReady.next(true);
      }

    });
  }

  async getDBName(){
    if (!this.dbName){
      const dbName = await Preferences.get({key: this.DB_NAME_KEY});
      this.dbName = dbName.value;
    }
    return this.dbName;
  }
}
