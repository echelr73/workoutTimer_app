import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues, JsonSQLite } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Structure } from '../models/structure';
import { Configuration } from '../models/configuration';
import { Student } from '../models/student';
import { Progress } from '../models/progress';

@Injectable({
  providedIn: 'root'
})
export class SqlliteManagerService {

  public configurationSubject: BehaviorSubject<Configuration>;
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
    this.configurationSubject = new BehaviorSubject<Configuration>(null);
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
      await CapacitorSQLite.createConnection({ database: this.dbName, encrypted: false, mode: 'full' });
      await CapacitorSQLite.open({ database: this.dbName });
      this.dbReady.next(true);
    }
  }

  downloadDatabase() {
    this.http.get('assets/db/dbTraining.json').subscribe(async (jsonExport: JsonSQLite) => {
      const jsonString = JSON.stringify(jsonExport);
      const isValid = await CapacitorSQLite.isJsonValid({ jsonstring: jsonString });

      if (isValid.result) {
        this.dbName = jsonExport.database;
        await CapacitorSQLite.importFromJson({ jsonstring: jsonString });
        await CapacitorSQLite.createConnection({ database: this.dbName, encrypted: false, mode: 'full' });
        await CapacitorSQLite.open({ database: this.dbName });

        await Preferences.set({ key: this.DB_SETUP_KEY, value: '1' });
        await Preferences.set({ key: this.DB_NAME_KEY, value: this.dbName });
        this.dbReady.next(true);
      }

    });
  }

  async getDBName() {
    if (!this.dbName) {
      const dbName = await Preferences.get({ key: this.DB_NAME_KEY });
      this.dbName = dbName.value;
    }
    return this.dbName;
  }

  async getConfiguration() {
    let sql = 'SELECT * FROM configuration';

    const dbName = await this.getDBName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: []
    }).then((response: capSQLiteValues) => {

      let configurations: Configuration[] = [];
      for (let index = 0; index < response.values.length; index++) {
        const row = response.values[index];
        let configuration = row as Configuration;
        configurations.push(configuration);
        this.configurationSubject.next(configuration);
      }

      return Promise.resolve(configurations);
    }).catch(error => Promise.reject(error));
  }

  getConfigurationObservable() {
    return this.configurationSubject.asObservable();
  }

  async getStructures() {
    let sql = 'SELECT * FROM trainingStructure';

    const dbName = await this.getDBName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: []
    }).then((response: capSQLiteValues) => {
      let structures: Structure[] = [];
      for (let index = 0; index < response.values.length; index++) {
        const row = response.values[index];
        let structure = row as Structure;
        structures.push(structure);
      }
      return Promise.resolve(structures);
    }).catch(error => Promise.reject(error));

  }

  async createStructure(structure: Structure) {
    const dbName = await this.getDBName();
    let sql = 'INSERT INTO trainingStructure (name, preparationTime, trainingTime, restTime, rounds, series, restBetweenSeries) VALUES (?,?,?,?,?,?,?)';
    let values = [structure.Name, structure.PreparationTime, structure.TrainingTime, structure.RestTime, structure.Rounds, structure.Series, structure.RestBetweenSeries];

    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: values
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({
          database: dbName
        });
      }
      return changes;
    }).catch(error => Promise.reject(error));
  }

  async updateStructure(structure: Structure) {
    const dbName = await this.getDBName();
    let sql = 'UPDATE trainingStructure SET name=?, preparationTime=?, trainingTime=?, restTime=?, rounds=?, series=?, restBetweenSeries=? WHERE id=?';
    let values = [structure.Name, structure.PreparationTime, structure.TrainingTime, structure.RestTime, structure.Rounds, structure.Series, structure.RestBetweenSeries, structure.Id];

    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: values
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({
          database: dbName
        });
      }
      return changes;
    }).catch(error => Promise.reject(error));
  }

  async deleteStructure(id: number) {
    const dbName = await this.getDBName();
    let sql = 'DELETE FROM trainingStructure WHERE id=?';
    let values = [id];

    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: values
        }
      ]
    }).then(() => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({
          database: dbName
        });
      }
    }).catch(error => Promise.reject(error));
  }

  async updateConfiguration(configuration: Configuration) {
    const dbName = await this.getDBName();
    let sql = 'UPDATE configuration SET beepSounds=?, beepSoundSelected=?, SoundVolume=?, voiceNotification=?, DuckingEffect=? WHERE id=?';
    let values = [configuration.BeepSounds, configuration.BeepSoundSelected, configuration.SoundVolume, configuration.VoiceNotification, configuration.DuckingEffect, configuration.Id];
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: values
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({
          database: dbName
        });
      }
      this.configurationSubject.next({ ...configuration } as Configuration);
      return changes;
    }).catch(error => Promise.reject(error));
  }

  async getStructureForId(id: number) {
    const dbName = await this.getDBName();
    let sql = 'SELECT * FROM trainingStructure WHERE id=?';
    let values = id;

    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [values]
    }).then((response: capSQLiteValues) => {
      let structure: Structure = new Structure();
      structure = response.values[0] as Structure;
      return Promise.resolve(structure);
    }).catch(error => Promise.reject(error));

  }

  async getStudents() {
    let sql = 'SELECT * FROM student';

    const dbName = await this.getDBName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: []
    }).then((response: capSQLiteValues) => {
      let students: Student[] = [];
      for (let index = 0; index < response.values.length; index++) {
        const row = response.values[index];
        let student = row as Student;
        students.push(student);
      }
      return Promise.resolve(students);
    }).catch(error => Promise.reject(error));

  }

  async deleteStudent(id: number) {
    const dbName = await this.getDBName();
    let sql = 'DELETE FROM student WHERE id=?';
    let values = [id];

    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: values
        }
      ]
    }).then(() => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({
          database: dbName
        });
      }
    }).catch(error => Promise.reject(error));
  }

  async createStudent(student: Student) {
    const dbName = await this.getDBName();
    let sql = 'INSERT INTO student (name, height, weight, birthdate) VALUES (?,?,?,?)';
    let values = [student.Name, student.Height, student.Weight, student.Birthdate];

    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: values
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({
          database: dbName
        });
      }
      return changes;
    }).catch(error => Promise.reject(error));
  }

  async updateStudent(student: Student) {
    const dbName = await this.getDBName();
    let sql = 'UPDATE student SET name=?, height=?, weight=?, birthdate=? WHERE id=?';
    let values = [student.Name, student.Height, student.Weight, student.Birthdate, student.Id];

    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: values
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({
          database: dbName
        });
      }
      return changes;
    }).catch(error => Promise.reject(error));
  }

  async getProgressForStudentId(id: number) {
    const dbName = await this.getDBName();
    let sql = 'SELECT * FROM progress WHERE studentId=?';
    let values = id;

    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [values]
    }).then((response: capSQLiteValues) => {
      let progress: Progress[] = [];
      for (let index = 0; index < response.values.length; index++) {
        const row = response.values[index];
        let exercise = row as Progress;
        progress.push(exercise);
      }
      return Promise.resolve(progress);
    }).catch(error => Promise.reject(error));

  }

  async updateMultipleProgress(progressList: Progress[]) {
    const dbName = await this.getDBName();
    const set: { statement: string; values: any[] }[] = [];

    for (let progress of progressList) {
      const sql = 'UPDATE progress SET exerciseName=?, muscleGroup=?, measure=?, Date=? WHERE id=?';
      const values = [
        progress.ExerciseName,
        progress.MuscleGroup,
        progress.Measure,
        progress.Date,
        progress.Id
      ];

      set.push({ statement: sql, values });
    }

    try {
      const result = await CapacitorSQLite.executeSet({
        database: dbName,
        set
      });

      if (this.isWeb) {
        await CapacitorSQLite.saveToStore({ database: dbName });
      }

      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async insertMultipleProgress(progressList: Progress[]) {
    const dbName = await this.getDBName();
  
    const set = progressList.map(progress => ({
      statement: 'INSERT INTO progress (exerciseName, muscleGroup, measure, date, studentId) VALUES (?, ?, ?, ?, ?)',
      values: [progress.ExerciseName, progress.MuscleGroup, progress.Measure, progress.Date, progress.StudentId]
    }));
  
    return CapacitorSQLite.executeSet({ database: dbName, set }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(error => Promise.reject(error));
  }
}
