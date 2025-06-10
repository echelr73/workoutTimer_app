import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { ListDataComponent } from 'src/app/shared/list-data/list-data.component';
import { FormStudentsComponent } from './components/form-students/form-students.component';
import { StudentProgressComponent } from './components/student-progress/student-progress.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab3PageRoutingModule,
    TranslateModule.forChild(),
    ListDataComponent,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  declarations: [
    Tab3Page,
    StudentsListComponent,
    FormStudentsComponent,
    StudentProgressComponent
  ]
})
export class Tab3PageModule {}
