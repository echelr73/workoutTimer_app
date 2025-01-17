import { Component, OnInit } from '@angular/core';
import { Configuration } from 'src/app/models/configuration';
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
    ) { 
      this.showForm = false;
      this.configuration = [];
    }
  
    ngOnInit() {
      this.sqliteService.getConfiguration().then((data) => {
        this.configuration = data;
      });
    }

    pinFormatter(value: number) {
      if(value == 0){
        return '0';
      }
      return `${value}0`;
    }

}
