import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  public showStructures = false;
  public structureId = 1;
  public isRunningTimer = false;


  constructor() {}

  viewStructures() {
    this.showStructures = !this.showStructures;
  }

  onItemSelected(id: number) {
    this.showStructures = false;
    this.structureId = id;
  }

  onRunningTimer(isRunning: boolean) { 
    this.isRunningTimer = isRunning;
  }

}
