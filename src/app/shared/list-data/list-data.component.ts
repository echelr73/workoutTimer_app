import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-data',
  templateUrl: './list-data.component.html',
  styleUrls: ['./list-data.component.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule, TranslateModule]
})
export class ListDataComponent {

  @Input({required: true}) data: any[];
  @Input() emptyText: string;
  @Input() addText: string;
  @Input() showAdd: boolean = true;

  @Output() addEvent: EventEmitter<boolean>;

  @ContentChild('templateData', {static: false}) templateData: TemplateRef<any>;

  constructor() {
    this.addEvent = new EventEmitter<boolean>();
   }

   addData(){
    this.addEvent.emit(true);
   }


}
