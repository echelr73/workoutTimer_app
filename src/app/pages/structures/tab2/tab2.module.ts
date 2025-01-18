import { IonicModule, IonItemSliding } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { ListStructuresComponent } from './components/list-structures/list-structures.component';
import { ListDataComponent } from 'src/app/shared/list-data/list-data.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormStructuresComponent } from './components/form-structures/form-structures.component';
import { CustomPickerComponent } from 'src/app/shared/custom-picker/custom-picker.component';
import { TrainingStructureComponent } from './components/training-structure/training-structure.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    TranslateModule.forChild(),
    ListDataComponent,
    CustomPickerComponent,
  ],
  declarations: [
    Tab2Page,
    ListStructuresComponent,
    FormStructuresComponent,
    TrainingStructureComponent,
  ]
})
export class Tab2PageModule { }
