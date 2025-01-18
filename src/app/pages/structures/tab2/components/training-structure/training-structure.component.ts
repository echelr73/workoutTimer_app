import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Structure } from 'src/app/models/structure';
import { SqlliteManagerService } from 'src/app/services/sqllite-manager.service';

@Component({
  selector: 'app-training-structure',
  templateUrl: './training-structure.component.html',
  styleUrls: ['./training-structure.component.scss'],
  standalone: false,
})
export class TrainingStructureComponent implements OnInit {

  @Input() structureId: number;
  public structureSelected: Structure;
  public totalTime: number;
  public totalTimeMinutes: number;
  public totalTimeSeconds: number;

  public preparationTimeMinutes: number;
  public preparationTimeSeconds: number;
  public trainingTimeMinutes: number;
  public trainingTimeSeconds: number;
  public restTimeMinutes: number;
  public restTimeSeconds: number;
  public restBetweenSeriesMinutes: number;
  public restBetweenSeriesSeconds: number;

  constructor(
    private sqliteService: SqlliteManagerService,
    private translateService: TranslateService,
  ) {
    this.structureSelected = new Structure();
    this.totalTime = 0;
  }

  ngOnInit() {
    this.getTrainingStructure(this.structureId);

  }

  getTrainingStructure(id: number) {
    this.sqliteService.getStructureForId(id).then((data: any) => {
      this.structureSelected = data;
      this.calculateTotal();
      this.formatTotalTime(this.totalTime);
      this.formatTimeStructure();
    }).catch(error => {
      console.error(error);
    });
  }

  calculateTotal() {
    this.totalTime = this.structureSelected.PreparationTime + (
      (this.structureSelected.TrainingTime +
        this.structureSelected.RestTime) *
      this.structureSelected.Rounds +
      this.structureSelected.RestBetweenSeries
    ) * this.structureSelected.Series;
  }

  convertSecondsToMinutesAndSeconds(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds };
  }

  formatTotalTime(time: number) {
    const totalTimeConverted = this.convertSecondsToMinutesAndSeconds(time);
    this.totalTimeMinutes = totalTimeConverted.minutes;
    this.totalTimeSeconds = totalTimeConverted.seconds;
  }

  formatTimeStructure() {
    const preparationTimeConverted = this.convertSecondsToMinutesAndSeconds(this.structureSelected.PreparationTime);
    this.preparationTimeMinutes = preparationTimeConverted.minutes;
    this.preparationTimeSeconds = preparationTimeConverted.seconds;

    const trainingTimeConverted = this.convertSecondsToMinutesAndSeconds(this.structureSelected.TrainingTime);
    this.trainingTimeMinutes = trainingTimeConverted.minutes;
    this.trainingTimeSeconds = trainingTimeConverted.seconds;

    const restTimeConverted = this.convertSecondsToMinutesAndSeconds(this.structureSelected.RestTime);
    this.restTimeMinutes = restTimeConverted.minutes;
    this.restTimeSeconds = restTimeConverted.seconds;

    const restBetweenSeriesConverted = this.convertSecondsToMinutesAndSeconds(this.structureSelected.RestBetweenSeries);
    this.restBetweenSeriesMinutes = restBetweenSeriesConverted.minutes;
    this.restBetweenSeriesSeconds = restBetweenSeriesConverted.seconds;
  }

}
