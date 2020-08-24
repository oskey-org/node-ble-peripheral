import { BLEService } from "../blie_service.class";

export interface BLEBindingsInterface extends NodeJS.EventEmitter {
  disconnect(): void;

  setServices(services: ReadonlyArray<BLEService>): void;

  startAdvertising(name: string, serviceUuids?: ReadonlyArray<string>): void;

  startAdvertisingIBeacon(iBeaconData: Buffer): void;

  startAdvertisingWithEIRData(advertisementData: Buffer, callback?: (arg: Error | undefined | null) => void): void;
  startAdvertisingWithEIRData(advertisementData: Buffer, scanData: Buffer, callback?: (arg: Error | undefined | null) => void): void;

  stopAdvertising(callback?: () => void): void;

  updateRssi(callback?: (err: null, rssi: number) => void): void;
}
