interface BLEDescriptorOptions {
  uuid: string;
  value?: Buffer | string;
}

export class BLEDescriptor {
  private _uuid: string;
  private _value?: Buffer | string;

  constructor(options: BLEDescriptorOptions) {
    this._uuid = options.uuid;
    this._value = options.value;
  }

  toString() {
    return "";
  }
}
