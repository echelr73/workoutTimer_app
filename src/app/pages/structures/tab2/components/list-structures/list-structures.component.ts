import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Structure } from 'src/app/models/structure';
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
    private alertController: AlertController,
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
    const alert = await this.alertController.create({
      header: 'Sin acceso a la base de datos',
      message: 'Esta app necesita acceso a la base de datos para funcionar',
      buttons: ['OK']
    });
    await alert.present();
    this.structureSelected = item;
  }


}
