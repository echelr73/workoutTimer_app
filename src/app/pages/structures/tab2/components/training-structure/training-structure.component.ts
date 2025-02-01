import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Structure } from 'src/app/models/structure';
import { AlertService } from 'src/app/services/alert.service';
import { SoundService } from 'src/app/services/sound.service';
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

  public currentRound: number;
  public currentSeries: number;
  public currentPhase: string;
  public isRunning: boolean;
  public isPaused: boolean;

  private intervalId: any;

  constructor(
    private sqliteService: SqlliteManagerService,
    private translateService: TranslateService,
    private soundService: SoundService,
    private alertService: AlertService
  ) {
    this.structureSelected = new Structure();
    this.totalTime = 0;
    this.currentRound = 0;
    this.currentSeries = 0;
    this.currentPhase = 'Preparation';
    this.isRunning = false;
    this.isPaused = false;
  }

  ngOnInit() {
    this.getTrainingStructure(this.structureId);

  }

  resetStructureButton() {
    this.alertService.alertConfirm(
      this.translateService.instant('label.confirm'),
      this.translateService.instant('label.confirm.message.reset'),
      () => {
        this.resetStructure();
      }
    );
  }

  resetStructure() {
    clearInterval(this.intervalId);
    this.currentPhase = 'Preparation';
    this.isRunning = false;
    this.currentRound = 0;
    this.currentSeries = 0;
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
    const preparationTime = this.structureSelected.PreparationTime;

    const trainingAndRestTimePerRound =
      (this.structureSelected.TrainingTime + this.structureSelected.RestTime) *
      (this.structureSelected.Rounds - 1);

    const trainingTimeLastRound = this.structureSelected.TrainingTime;

    const totalSeriesTime =
      (trainingAndRestTimePerRound + trainingTimeLastRound) * this.structureSelected.Series;

    const restBetweenSeriesTime =
      this.structureSelected.RestBetweenSeries * (this.structureSelected.Series - 1);

    this.totalTime = preparationTime + totalSeriesTime + restBetweenSeriesTime;
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

  showTime(time: number, phase: string) {
    if (this.isRunning) {
      if (phase === 'Preparation') {
        const preparationTimeConverted = this.convertSecondsToMinutesAndSeconds(time);
        this.preparationTimeMinutes = preparationTimeConverted.minutes;
        this.preparationTimeSeconds = preparationTimeConverted.seconds;
      } else if (phase === 'Training') {
        const trainingTimeConverted = this.convertSecondsToMinutesAndSeconds(time);
        this.trainingTimeMinutes = trainingTimeConverted.minutes;
        this.trainingTimeSeconds = trainingTimeConverted.seconds;
      } else if (phase === 'Rest') {
        const restTimeConverted = this.convertSecondsToMinutesAndSeconds(time);
        this.restTimeMinutes = restTimeConverted.minutes;
        this.restTimeSeconds = restTimeConverted.seconds;
      } else if (phase === 'RestBetweenSeries') {
        const restBetweenSeriesConverted = this.convertSecondsToMinutesAndSeconds(time);
        this.restBetweenSeriesMinutes = restBetweenSeriesConverted.minutes;
        this.restBetweenSeriesSeconds = restBetweenSeriesConverted.seconds;
      }
    }
  }

  startTimers() {
    this.currentRound = 1;
    this.currentSeries = 1;
    this.startPreparationTimer();
  }

  startPreparationTimer() {
    this.currentPhase = 'Preparation';
    let preparationTime = this.structureSelected.PreparationTime;
    this.soundService.playSoundVoice(this.currentPhase);
    this.intervalId = setInterval(() => {
      if (preparationTime === 0) {
        clearInterval(this.intervalId);
        this.showTime(0, this.currentPhase);
        this.startTrainingTimer();
        return;
      }
      preparationTime--;
      this.totalTime--;
      this.formatTotalTime(this.totalTime);
      if (preparationTime <= 3 && preparationTime > 0) {
        this.soundService.playSoundVoice(`number${preparationTime}`);
      }
      this.showTime(preparationTime, this.currentPhase);
    }, 1000);
  }

  startTrainingTimer() {
    this.currentPhase = 'Training';
    this.soundService.playSoundVoice(this.currentPhase);
    let trainingTime = this.structureSelected.TrainingTime;
    this.soundService.playSound();
    this.intervalId = setInterval(() => {
      if (trainingTime === 0) {
        clearInterval(this.intervalId);
        this.showTime(0, this.currentPhase);

        if (this.currentRound < this.structureSelected.Rounds) {
          this.startRestTimer();
        } else if (this.currentSeries !== this.structureSelected.Series) {
          this.startRestBetweenSeriesTimer();
        } else {
          this.currentSeries = 0;
          this.currentRound = 0;
          this.currentPhase = '';
          this.resetStructure();
        }
        return;
      }

      trainingTime--;
      this.totalTime--;
      this.formatTotalTime(this.totalTime);
      if (trainingTime <= 3 && trainingTime > 0) {
        this.soundService.playSoundVoice(`number${trainingTime}`);
      }
      this.showTime(trainingTime, this.currentPhase);

    }, 1000);
  }

  startRestTimer() {
    this.currentPhase = 'Rest';
    this.soundService.playSoundVoice(this.currentPhase);
    let restTime = this.structureSelected.RestTime;
    this.soundService.playSound();
    this.intervalId = setInterval(() => {
      if (restTime > 0) {
        restTime--;
        this.totalTime--;
        this.formatTotalTime(this.totalTime);
        this.showTime(restTime, this.currentPhase);

        if (restTime <= 3) {
          this.soundService.playSoundVoice(`number${restTime}`);
        }
      }

      if (restTime === 0) {
        clearInterval(this.intervalId);
        this.showTime(0, this.currentPhase);

        if (this.currentRound < this.structureSelected.Rounds) {
          this.currentRound++;
          this.startTrainingTimer();
        } else {
          this.startRestBetweenSeriesTimer();
        }
      }
    }, 1000);
  }

  startRestBetweenSeriesTimer() {
    this.currentPhase = 'RestBetweenSeries';
    this.soundService.playSoundVoice(this.currentPhase);
    let restBetweenSeriesTime = this.structureSelected.RestBetweenSeries;
    this.soundService.playSound();
    this.intervalId = setInterval(() => {
      if (restBetweenSeriesTime > 0) {
        restBetweenSeriesTime--;
        this.totalTime--;
        this.formatTotalTime(this.totalTime);
        this.showTime(restBetweenSeriesTime, this.currentPhase);

        if (restBetweenSeriesTime <= 3) {
          this.soundService.playSoundVoice(`number${restBetweenSeriesTime}`);
        }
      }

      if (restBetweenSeriesTime === 0) {
        clearInterval(this.intervalId);
        this.showTime(0, this.currentPhase);

        if (this.currentSeries < this.structureSelected.Series) {
          this.currentSeries++;
          this.currentRound = 1;
          this.startTrainingTimer();
        }
      }
    }, 1000);
  }

  toggleTimer() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.startTimers();
    }
    else {
      this.isRunning = false;
    }
  }

}
