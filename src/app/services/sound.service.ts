import { Injectable } from '@angular/core';
import { SqlliteManagerService } from './sqllite-manager.service';
import { BehaviorSubject } from 'rxjs';
import { Configuration } from '../models/configuration';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  private audio: HTMLAudioElement | null = null;
  private soundConfig: Configuration;
  private soundMap = {
    beep: 'assets/sounds/beep.mpeg',
    beepSuccess: 'assets/sounds/beep-success.mpeg',
    beepWarning: 'assets/sounds/beep-warning.mpeg',
    buzzer: 'assets/sounds/buzzer.mpeg',
    buzzerIncorrect: 'assets/sounds/incorrect-buzzer.mpeg',
    bell: 'assets/sounds/bell.mpeg',
    bellRing: 'assets/sounds/bell-ring.mpeg',
    bellChurch: 'assets/sounds/church-bell.mpeg',
    whistleCalling: 'assets/sounds/calling-whistle.mpeg',
    whistleReferee: 'assets/sounds/referee-whistle.mpeg',
    microwaveTimer: 'assets/sounds/microwave-timer.mpeg',
  };

  private voiceMap: { [key: string]: string } = {};
  private language: string = 'en';

  constructor(private sqliteManager: SqlliteManagerService) {
    this.soundConfig = new Configuration();
    this.initializeVoiceMap();
    this.loadConfiguration();
    this.listenToConfigurationChanges();
  }

  private async initializeVoiceMap() {
    const lang = await Device.getLanguageCode();
    this.language = lang.value.slice(0, 2);

    this.voiceMap = {
      Preparation: `assets/sounds/voice/${this.language}/preparation.mpeg`,
      Training: `assets/sounds/voice/${this.language}/training.mpeg`,
      Rest: `assets/sounds/voice/${this.language}/rest.mpeg`,
      RestBetweenSeries: `assets/sounds/voice/${this.language}/restBetweenSeries.mpeg`,
      number3: `assets/sounds/voice/${this.language}/3.mpeg`,
      number2: `assets/sounds/voice/${this.language}/2.mpeg`,
      number1: `assets/sounds/voice/${this.language}/1.mpeg`,
    };
  }

  private async loadConfiguration() {
    try {
      const configurations = await this.sqliteManager.getConfiguration();
      if (configurations.length > 0) {
        const config = configurations[0];
        this.soundConfig = config;
      }
    } catch (error) {
      console.error('Error loading sound configuration:', error);
    }
  }

  private listenToConfigurationChanges() {
    this.sqliteManager.getConfigurationObservable().subscribe((config) => {
      if (config) {
        this.soundConfig = config;
      }
    });
  }

  setSound(soundName: string) {
    if (this.soundMap[soundName]) {
      this.soundConfig.BeepSoundSelected = soundName;
    } else {
      console.warn(`Sound "${soundName}" not found. Falling back to default.`);
    }
  }

  setVolume(volume: number) {
    this.soundConfig.SoundVolume = Math.max(1, Math.min(volume, 10));
  }

  async playSound() {
    try {

      if (!this.soundConfig.BeepSounds) {
        return;
      }
      const soundPath = this.soundMap[this.soundConfig.BeepSoundSelected];
      this.audio = new Audio(soundPath);

      this.audio.volume = this.soundConfig.SoundVolume / 10;

      await this.audio.play();

      this.audio.onended = () => {
        this.audio = null;
      };
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  async playSoundVoice(phase: string) {
    try {

      if (!this.soundConfig.VoiceNotification) {
        return;
      }
      const soundPath =  this.voiceMap[phase];
      this.audio = new Audio(soundPath);

      this.audio.volume = this.soundConfig.SoundVolume / 10;

      await this.audio.play();

      this.audio.onended = () => {
        this.audio = null;
      };
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }
}
