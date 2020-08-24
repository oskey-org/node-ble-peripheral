import { EventEmitter } from "events";

import { BLEProperty } from "./ble_property.type";
import { BLEDescriptor } from "./ble_descriptor.class";

import * as uuidUtil from "./utils/uuid_util";

interface BLECharacteristicOptions {
  uuid: string;
  properties?: ReadonlyArray<BLEProperty>;
  secure?: ReadonlyArray<BLEProperty>;
  value?: Buffer;
  descriptors?: ReadonlyArray<BLEDescriptor>;
  onIndicate?: () => void;
  onNotify?: () => void;
  onReadRequest?: (offset: number, callback: (result: number, data?: Buffer) => void) => void;
  onSubscribe?: (maxValueSize: number, updateValueCallback: (data: Buffer) => void) => void;
  onUnsubscribe?: () => void;
  onWriteRequest?: (data: Buffer, offset: number, withoutResponse: boolean, callback: (result: number) => void) => void;
}

export class BLECharacteristic extends EventEmitter {
  private _uuid: string;
  private _properties: ReadonlyArray<BLEProperty>;
  private _secure: ReadonlyArray<BLEProperty>;
  private _value?: Buffer;
  private _descriptors: ReadonlyArray<BLEDescriptor>;

  private _onIndicate?: () => void;
  private _onNotify?: () => void;
  private _onReadRequest?: (offset: number, callback: (result: number, data?: Buffer) => void) => void;
  private _onSubscribe?: (maxValueSize: number, updateValueCallback: (data: Buffer) => void) => void;
  private _onUnsubscribe?: () => void;
  private _onWriteRequest?: (data: Buffer, offset: number, withoutResponse: boolean, callback: (result: number) => void) => void;

  private _updateValueCallback?: (data: Buffer) => void;
  private _maxValueSize?: number;

  constructor(options: BLECharacteristicOptions) {
    super();

    this._uuid = uuidUtil.removeDashes(options.uuid);
    this._properties = options.properties || [];
    this._secure = options.secure || [];
    this._value = options.value;
    this._descriptors = options.descriptors || [];

    if (this._value && (this._properties.length !== 1 || this._properties[0] !== "read")) {
      throw new Error("Characteristics with value can be read only!");
    }

    if (options.onReadRequest) {
      this._onReadRequest = options.onReadRequest;
    }

    if (options.onWriteRequest) {
      this._onWriteRequest = options.onWriteRequest;
    }

    if (options.onSubscribe) {
      this._onSubscribe = options.onSubscribe;
    }

    if (options.onUnsubscribe) {
      this._onUnsubscribe = options.onUnsubscribe;
    }

    if (options.onNotify) {
      this._onNotify = options.onNotify;
    }

    if (options.onIndicate) {
      this._onIndicate = options.onIndicate;
    }

    this.on("readRequest", this.onReadRequest.bind(this));
    this.on("writeRequest", this.onWriteRequest.bind(this));
    this.on("subscribe", this.onSubscribe.bind(this));
    this.on("unsubscribe", this.onUnsubscribe.bind(this));
    this.on("notify", this.onNotify.bind(this));
    this.on("indicate", this.onIndicate.bind(this));
  }

  toString() {
    return JSON.stringify({
      uuid: this._uuid,
      properties: this._properties,
      secure: this._secure,
      value: this._value,
      descriptors: this._descriptors,
    });
  }

  onIndicate() {
    if (this._onIndicate) this._onIndicate();
  }

  onNotify() {
    if (this._onNotify) this._onNotify();
  }

  onReadRequest(offset: number, callback: (result: number, data?: Buffer) => void) {
    if (this._onReadRequest) this._onReadRequest(offset, callback);
    else callback(this.RESULT_UNLIKELY_ERROR, null);
  }

  onSubscribe(maxValueSize: number, updateValueCallback: (data: Buffer) => void) {
    this._updateValueCallback = updateValueCallback;
    this._maxValueSize = maxValueSize;

    if (this._onSubscribe) this._onSubscribe(maxValueSize, updateValueCallback);
  }

  onUnsubscribe() {
    this._updateValueCallback = undefined;
    this._maxValueSize = undefined;

    if (this._onUnsubscribe) this._onUnsubscribe();
  }

  onWriteRequest(data: Buffer, offset: number, withoutResponse: boolean, callback: (result: number) => void) {
    if (this._onWriteRequest) this._onWriteRequest(data, offset, withoutResponse, callback);
    else callback(this.RESULT_UNLIKELY_ERROR);
  }

  readonly RESULT_ATTR_NOT_LONG: number = 0x00;
  readonly RESULT_INVALID_ATTRIBUTE_LENGTH: number = 0x07;
  readonly RESULT_INVALID_OFFSET: number = 0x0b;
  readonly RESULT_SUCCESS: number = 0x0d;
  readonly RESULT_UNLIKELY_ERROR: number = 0x0e;

  static readonly RESULT_ATTR_NOT_LONG: number = 0x00;
  static readonly RESULT_INVALID_ATTRIBUTE_LENGTH: number = 0x07;
  static readonly RESULT_INVALID_OFFSET: number = 0x0b;
  static readonly RESULT_SUCCESS: number = 0x0d;
  static readonly RESULT_UNLIKELY_ERROR: number = 0x0e;
}
