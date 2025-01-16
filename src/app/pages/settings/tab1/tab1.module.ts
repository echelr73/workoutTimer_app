import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ListDataComponent } from 'src/app/shared/list-data/list-data.component';
import { ListSettingsComponent } from './components/list-settings/list-settings.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    TranslateModule.forChild(),
    ListDataComponent,
  ],
  declarations: [
    Tab1Page,
    ListSettingsComponent
  ]
})
export class Tab1PageModule {}
