import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Structure } from 'src/app/models/structure';
import { AlertService } from 'src/app/services/alert.service';
import { SqlliteManagerService } from 'src/app/services/sqllite-manager.service';

@Component({
  selector: 'app-form-structures',
  templateUrl: './form-structures.component.html',
  styleUrls: ['./form-structures.component.scss'],
  standalone: false
})
export class FormStructuresComponent implements OnInit {

  @Input() structure: Structure;

  @Output() closeForm: EventEmitter<boolean>;

  public update: boolean;
  public preparationTimeMinutes: number = 0;
  public preparationTimeSeconds: number = 0;
  public trainingTimeMinutes: number = 0;
  public trainingTimeSeconds: number = 0;
  public restTimeMinutes: number = 0;
  public restTimeSeconds: number = 0;
  public restBetweenSeriesMinutes: number = 0;
  public restBetweenSeriesSeconds: number = 0;
  public rounds: number = 1;
  public series: number = 1;
  minuteSecondsOptions: number[] = Array.from({ length: 60 }, (_, i) => i);
  roundsSeriesOptions: number[] = Array.from({ length: 99 }, (_, i) => i + 1);
  selectedMinutes: number = 0;
  selectedSeconds: number = 0;




  constructor(
    private sqliteService: SqlliteManagerService,
    private translateService: TranslateService,
    private alertService: AlertService,
  ) {
    this.closeForm = new EventEmitter<boolean>();
  }

  ngOnInit() {
    if (!this.structure) {
      this.update = false;
      this.structure = new Structure();
    } else {
      this.update = true;
      this.formatTime();
    }
  }

  onPickerChange(event: any, controlName: string) {
    this[controlName] = event.detail.value;
  }


  closeFormEmit() {
    this.closeForm.emit(true);
  }

  createUpdateStructure() {
    if (this.update) {
      this.updateStructure();
    } else {
      this.createStructure();
    }
  }

  createStructure() {
    this.getTotalSeconds();
    this.sqliteService.createStructure(this.structure).then(() => {
      this.alertService.alertMessage(
        this.translateService.instant('label.success'),
        this.translateService.instant('label.success.message.add.structure')
      );
      this.closeFormEmit();
    }).catch(error => {
      this.alertService.alertMessage(
        this.translateService.instant('label.error'),
        this.translateService.instant('label.error.message.add.structure')
      );
    });
  }

  updateStructure() {
    this.getTotalSeconds();
    this.sqliteService.updateStructure(this.structure).then(() => {
      this.alertService.alertMessage(
        this.translateService.instant('label.success'),
        this.translateService.instant('label.success.message.edit.structure')
      );
      this.closeFormEmit();
    }).catch(error => {
      this.alertService.alertMessage(
        this.translateService.instant('label.error'),
        this.translateService.instant('label.error.message.edit.structure')
      );
    });

  }

  getTotalSeconds() {
    this.structure.PreparationTime = this.preparationTimeMinutes * 60 + this.preparationTimeSeconds;
    this.structure.TrainingTime = this.trainingTimeMinutes * 60 + this.trainingTimeSeconds;
    this.structure.RestTime = this.restTimeMinutes * 60 + this.restTimeSeconds;
    this.structure.RestBetweenSeries = this.restBetweenSeriesMinutes * 60 + this.restBetweenSeriesSeconds;
  }

  convertSecondsToMinutesAndSeconds(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds };
  }

  formatTime() {
    const preparationTimeConverted = this.convertSecondsToMinutesAndSeconds(this.structure.PreparationTime);
    this.preparationTimeMinutes = preparationTimeConverted.minutes;
    this.preparationTimeSeconds = preparationTimeConverted.seconds;

    const trainingTimeConverted = this.convertSecondsToMinutesAndSeconds(this.structure.TrainingTime);
    this.trainingTimeMinutes = trainingTimeConverted.minutes;
    this.trainingTimeSeconds = trainingTimeConverted.seconds;

    const restTimeConverted = this.convertSecondsToMinutesAndSeconds(this.structure.RestTime);
    this.restTimeMinutes = restTimeConverted.minutes;
    this.restTimeSeconds = restTimeConverted.seconds;

    const restBetweenSeriesConverted = this.convertSecondsToMinutesAndSeconds(this.structure.RestBetweenSeries);
    this.restBetweenSeriesMinutes = restBetweenSeriesConverted.minutes;
    this.restBetweenSeriesSeconds = restBetweenSeriesConverted.seconds;

    this.rounds = this.structure.Rounds;
    this.series = this.structure.Series;
  }


}
