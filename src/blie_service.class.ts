import { EventEmitter } from "events";

import { BLECharacteristic } from "./ble_characteristic.class";

import * as uuidUtil from "./utils/uuid_util";

interface BLEServiceOptions {
  uuid: string;
  characteristics?: ReadonlyArray<BLECharacteristic>;
}

export class BLEService extends EventEmitter {
  private _uuid: String;
  private _characteristics: ReadonlyArray<BLECharacteristic>;

  constructor(options: BLEServiceOptions) {
    super();

    this._uuid = uuidUtil.removeDashes(options.uuid);
    this._characteristics = options.characteristics || [];
  }

  toString() {
    return JSON.stringify({
      uuid: this._uuid,
      characteristics: this._characteristics,
    });
  }
}
