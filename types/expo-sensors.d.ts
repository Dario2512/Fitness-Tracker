declare module 'expo-sensors' {
    export class Pedometer {
      static isAvailableAsync(): Promise<boolean>;
      static watchStepCount(callback: (result: { steps: number }) => void): void;
      static getStepCountAsync(start: Date, end: Date): Promise<{ steps: number }>;
    }
  }