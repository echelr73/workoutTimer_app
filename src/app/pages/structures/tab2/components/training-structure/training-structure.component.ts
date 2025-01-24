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

  public currentRound: number;
  public currentSeries: number;
  public currentPhase: string;
  public isRunning: boolean;
  public isPaused: boolean;

  private intervalId: any;

  constructor(
    private sqliteService: SqlliteManagerService,
    private translateService: TranslateService,
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

  resetStructure() {
    this.currentPhase = 'Preparation';
    this.isRunning = false;
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
      (this.structureSelected.Rounds - 1); // Entrenamiento y descanso en todas menos la última ronda

    const trainingTimeLastRound = this.structureSelected.TrainingTime; // Entrenamiento de la última ronda

    const totalSeriesTime =
      (trainingAndRestTimePerRound + trainingTimeLastRound) * this.structureSelected.Series; // Tiempo total por serie

    const restBetweenSeriesTime =
      this.structureSelected.RestBetweenSeries * (this.structureSelected.Series - 1); // Excluye el descanso después de la última serie

    // Total = Preparación + Tiempo total de las series + Tiempos entre series
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
    this.intervalId = setInterval(() => {
      // Código existente para manejar la cuenta regresiva
      preparationTime--;
      if (preparationTime < 0)
        this.showTime(0, this.currentPhase);
      else
        this.showTime(preparationTime, this.currentPhase);
      if (preparationTime < 0) {
        clearInterval(this.intervalId);
        this.startTrainingTimer();
      }
    }, 1000);
  }

  startTrainingTimer() {
    this.currentPhase = 'Training';
    let trainingTime = this.structureSelected.TrainingTime;
    this.intervalId = setInterval(() => {
      // Código existente para manejar la cuenta regresiva
      trainingTime--;
      if (trainingTime < 0)
        this.showTime(this.structureSelected.TrainingTime, this.currentPhase);
      else
        this.showTime(trainingTime, this.currentPhase);
      if (trainingTime < 0 && this.currentRound < this.structureSelected.Rounds) {
        clearInterval(this.intervalId);
        this.startRestTimer();
      } else if (trainingTime < 0 && this.currentRound === this.structureSelected.Rounds && this.currentSeries != this.structureSelected.Series) {
        clearInterval(this.intervalId);
        this.startRestBetweenSeriesTimer();
      } else if (trainingTime < 0 && this.currentRound === this.structureSelected.Rounds && this.currentSeries === this.structureSelected.Series) {
        clearInterval(this.intervalId);
        this.currentSeries = 0;
        this.currentRound = 0;
        this.currentPhase = '';
        this.resetStructure();
      }
    }, 1000);
  }

  startRestTimer() {
    this.currentPhase = 'Rest';
    let restTime = this.structureSelected.RestTime;
    this.intervalId = setInterval(() => {
      // Código existente para manejar la cuenta regresiva
      restTime--;
      if (restTime < 0)
        this.showTime(this.structureSelected.RestTime, this.currentPhase);
      else
        this.showTime(restTime, this.currentPhase);
      if (restTime < 0 && this.currentRound < this.structureSelected.Rounds) {
        clearInterval(this.intervalId);
        this.currentRound++;
        this.startTrainingTimer();
      } else if (restTime < 0 && this.currentRound === this.structureSelected.Rounds) {
        clearInterval(this.intervalId);
        this.startRestBetweenSeriesTimer();
      }
    }, 1000);
  }

  startRestBetweenSeriesTimer() {
    this.currentPhase = 'RestBetweenSeries';
    let restBetweenSeriesTime = this.structureSelected.RestBetweenSeries;
    this.intervalId = setInterval(() => {
      // Código existente para manejar la cuenta regresiva
      restBetweenSeriesTime--;
      if (restBetweenSeriesTime < 0)
        this.showTime(this.structureSelected.RestBetweenSeries, this.currentPhase);
      else
        this.showTime(restBetweenSeriesTime, this.currentPhase);
      if (restBetweenSeriesTime < 0 && this.currentSeries < this.structureSelected.Series) {
        clearInterval(this.intervalId);
        this.currentSeries++;
        this.currentRound = 1;
        this.startTrainingTimer();
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
