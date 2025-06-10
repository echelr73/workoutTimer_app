import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  public showStudents = false;

  constructor(
    private translateService: TranslateService,
  ) {}

  viewStudents(){
    this.showStudents = !this.showStudents;
  }

}
