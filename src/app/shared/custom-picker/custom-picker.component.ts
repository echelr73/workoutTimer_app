import { Component, CUSTOM_ELEMENTS_SCHEMA, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-picker',
  template: `
    <ion-picker (ionChange)="onPickerChange($event)">
      <ion-picker-column [value]="this.value">
        <ion-picker-column-option *ngFor="let option of options" [value]="option">{{ formatOption(option) }}</ion-picker-column-option>
        <div slot="suffix">{{ getSuffix() }}</div>      
      </ion-picker-column>
    </ion-picker>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomPickerComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomPickerComponent implements ControlValueAccessor {
  @Input() options: number[] = [];
  @Input() name: string;
  value: number;

  onChange = (value: number) => {};
  onTouched = () => {};

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }

  onPickerChange(event: any) {
    const selectedValue = event.detail.value;
    this.value = selectedValue;
    this.onChange(this.value);
  }

  getSuffix(): string {
    if (this.name.endsWith('Minutes')) {
      return 'Min';
    } else if (this.name.endsWith('Seconds')) {
      return 'Seg';
    } else {
      return '';
    }
  }

  formatOption(option: number): string {
    if (this.name === 'rounds' || this.name === 'series') {
      return option.toString();
    } else {
      return option.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    }
  }
}