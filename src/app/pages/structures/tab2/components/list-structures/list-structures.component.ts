import { Component, OnInit } from '@angular/core';
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
  public showForm: boolean;

  constructor(
    private sqliteService: SqlliteManagerService,
  ) {
    this.showForm = false;
    this.structures = [];
  }

  ngOnInit() {
    this.sqliteService.getStructures(1).then((data) => {
      this.structures = data;
    });
  }

  onShowForm() {
    this.showForm = true;
  }

  convertToMinutesAndSeconds(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }


}
