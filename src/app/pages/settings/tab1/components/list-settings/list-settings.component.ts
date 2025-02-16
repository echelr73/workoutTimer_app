import { Component, OnInit } from '@angular/core';
import { Configuration } from 'src/app/models/configuration';
import { SoundService } from 'src/app/services/sound.service';
import { SqlliteManagerService } from 'src/app/services/sqllite-manager.service';

@Component({
  selector: 'app-list-settings',
  templateUrl: './list-settings.component.html',
  styleUrls: ['./list-settings.component.scss'],
  standalone: false
})
export class ListSettingsComponent  implements OnInit {

  public configuration: Configuration[];
    public showForm: boolean;
  
    constructor(
      private sqliteService: SqlliteManagerService,
      private soundService: SoundService,
    ) { 
      this.showForm = false;
      this.configuration = [];
    }
  
    ngOnInit() {
      Promise.all([
      this.sqliteService.getConfiguration()]).then((data) => {
        this.configuration = data[0];
      });
    }

    pinFormatter(value: number) {
      if(value == 0){
        return '0';
      }
      return `${value}0`;
    }

    getConfiguration() {
      return this.configuration[0];
    }

    testSound(event: any) {
      const selectedSound = event.detail.value;
      this.soundService.testSound(selectedSound);
    }

    testVolumen(event: any){
      const selectedVolume = event.detail.value;
      const selectedSound = this.configuration[0].BeepSoundSelected;
      this.soundService.testVolumen(selectedVolume, selectedSound);
    }

}
