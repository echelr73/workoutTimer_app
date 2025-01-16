import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { ListStructuresComponent } from './components/list-structures/list-structures.component';
import { ListDataComponent } from 'src/app/shared/list-data/list-data.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    TranslateModule.forChild(),
    ListDataComponent,
  ],
  declarations: [
    Tab2Page,
    ListStructuresComponent
  ]
})
export class Tab2PageModule { }
