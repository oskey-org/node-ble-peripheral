/**
 * node-ble-peripheral
 *
 * A Node.js module for implementing BLE (Bluetooth Low Energy) peripherals.
 *
 * @author Greg PFISTER <greg@oskey.io>
 * @license MIT (See LICENSE.md file)
 * @copyright (c) 2020, Greg PFISTER.
 * @since v0.1.0+1
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { EventEmitter } from "events";

import { OSKBLEProperty } from "./types/ble_property.type";
import { OSKBLEDescriptor } from "./ble_descriptor.class";

import * as uuidUtil from "./utils/uuid_util";

/**
 * Defines a BLE characteristic
 * @since v0.1.0+1
 */
export interface OSKBLECharacteristicOptions {
  /**
   * The characteristic UUID
   * @since v0.1.0+1
   */
  readonly uuid: string;

  /**
   * The properties (read, write, writeWithoutResponse, indicate and or notify)
   * @since v0.1.0+1
   */
  readonly properties?: ReadonlyArray<OSKBLEProperty>;

  /**
   *
   * @since v0.1.0+1
   */
  readonly secure?: ReadonlyArray<OSKBLEProperty>;

  /**
   * The value
   * @since v0.1.0+1
   */
  readonly value?: Buffer;

  /**
   * The descriptors assigned to the characteristic, if any
   * @since v0.1.0+1
   */
  readonly descriptors?: ReadonlyArray<OSKBLEDescriptor>;

  /**
   * A callback to handle "indicate" events
   * @since v0.1.0+1
   */
  readonly onIndicateCallback?: () => void;

  /**
   * A callback to handle "notification" events
   * @since v0.1.0+1
   */
  readonly onNotifyCallback?: () => void;

  /**
   * A callback to handle "read request" events
   * @since v0.1.0+1
   */
  readonly onReadRequestCallback?: (offset: number, callback: (result: number, data?: Buffer) => void) => void;

  /**
   * A callback to handle "subscribe" events
   * @since v0.1.0+1
   */
  readonly onSubscribeCallback?: (maxValueSize: number, updateValueCallback: (data: Buffer) => void) => void;

  /**
   * A callback to handle "unsubscribe" events
   * @since v0.1.0+1
   */
  readonly onUnsubscribeCallback?: () => void;

  /**
   * A callback to handle "write request" events
   * @since v0.1.0+1
   */
  readonly onWriteRequestCallback?: (data: Buffer, offset: number, withoutResponse: boolean, callback: (result: number) => void) => void;
}

/**
 * Defines a BLE characteristic
 * @since v0.1.0+1
 */
export declare interface OSKBLECharacteristic {
  /**
   * The characteristic UUID
   * @since v0.1.0+1
   */
  readonly uuid: string;

  /**
   * The properties (read, write, writeWithoutResponse, indicate and or notify)
   * @since v0.1.0+1
   */
  readonly properties: ReadonlyArray<OSKBLEProperty>;

  /**
   *
   * @since v0.1.0+1
   */
  readonly secure: ReadonlyArray<OSKBLEProperty>;

  /**
   * The value
   * @since v0.1.0+1
   */
  readonly value?: Buffer;

  /**
   * The descriptors assigned to the characteristic, if any
   * @since v0.1.0+1
   */
  readonly descriptors: ReadonlyArray<OSKBLEDescriptor>;

  /**
   * A return code for attribute not long error
   * @since v0.1.0+1
   */
  readonly RESULT_ATTR_NOT_LONG: number;

  /**
   * A return code for invalid attribute lenght error
   * @since v0.1.0+1
   */
  readonly RESULT_INVALID_ATTRIBUTE_LENGTH: number;

  /**
   * A return code for invalid offset error
   * @since v0.1.0+1
   */
  readonly RESULT_INVALID_OFFSET: number;

  /**
   * A return code for success
   * @since v0.1.0+1
   */
  readonly RESULT_SUCCESS: number;

  // /**
  //  * A return code for an unlikely error situation ()
  //  * @since v0.1.0+1
  //  */
  // readonly RESULT_UNLIKELY_ERROR: number;
}

export class OSKBLECharacteristic extends EventEmitter {
  readonly uuid: string;
  readonly properties: ReadonlyArray<OSKBLEProperty>;
  readonly secure: ReadonlyArray<OSKBLEProperty>;
  readonly value?: Buffer;
  readonly descriptors: ReadonlyArray<OSKBLEDescriptor>;

  private _onIndicateCallback?: () => void;
  private _onNotifyCallback?: () => void;
  private _onReadRequestCallback?: (offset: number, callback: (result: number, data?: Buffer) => void) => void;
  private _onSubscribeCallback?: (maxValueSize: number, updateValueCallback: (data: Buffer) => void) => void;
  private _onUnsubscribeCallback?: () => void;
  private _onWriteRequestCallback?: (data: Buffer, offset: number, withoutResponse: boolean, callback: (result: number) => void) => void;

  private _updateValueCallback?: (data: Buffer) => void;
  private _maxValueSize?: number;

  constructor(options: OSKBLECharacteristicOptions) {
    super();

    //@ts-ignore 2540
    this.uuid = uuidUtil.removeDashes(options.uuid);
    //@ts-ignore 2540
    this.properties = options.properties || [];
    //@ts-ignore 2540
    this.secure = options.secure || [];
    //@ts-ignore 2540
    this.value = options.value;
    //@ts-ignore 2540
    this.descriptors = options.descriptors || [];

    if (this.value && (this.properties.length !== 1 || this.properties[0] !== "read")) {
      throw new Error("Characteristics with value can be read only!");
    }

    if (options.onReadRequestCallback) {
      this._onReadRequestCallback = options.onReadRequestCallback;
    }

    if (options.onWriteRequestCallback) {
      this._onWriteRequestCallback = options.onWriteRequestCallback;
    }

    if (options.onSubscribeCallback) {
      this._onSubscribeCallback = options.onSubscribeCallback;
    }

    if (options.onUnsubscribeCallback) {
      this._onUnsubscribeCallback = options.onUnsubscribeCallback;
    }

    if (options.onNotifyCallback) {
      this._onNotifyCallback = options.onNotifyCallback;
    }

    if (options.onIndicateCallback) {
      this._onIndicateCallback = options.onIndicateCallback;
    }

    this.on("readRequest", this._onReadRequest.bind(this));
    this.on("writeRequest", this._onWriteRequest.bind(this));
    this.on("subscribe", this._onSubscribe.bind(this));
    this.on("unsubscribe", this._onUnsubscribe.bind(this));
    this.on("notify", this._onNotify.bind(this));
    this.on("indicate", this._onIndicate.bind(this));
  }

  toString() {
    return JSON.stringify({
      uuid: this.uuid,
      properties: this.properties,
      secure: this.secure,
      value: this.value,
      descriptors: this.descriptors,
    });
  }

  private _onIndicate() {
    if (this._onIndicateCallback) this._onIndicateCallback();
  }

  private _onNotify() {
    if (this._onNotifyCallback) this._onNotifyCallback();
  }

  private _onReadRequest(offset: number, callback: (result: number, data?: Buffer) => void) {
    if (this._onReadRequestCallback) this._onReadRequestCallback(offset, callback);
    else callback(this.RESULT_UNLIKELY_ERROR, null);
  }

  private _onSubscribe(maxValueSize: number, updateValueCallback: (data: Buffer) => void) {
    this._updateValueCallback = updateValueCallback;
    this._maxValueSize = maxValueSize;

    if (this._onSubscribeCallback) this._onSubscribeCallback(maxValueSize, updateValueCallback);
  }

  private _onUnsubscribe() {
    this._updateValueCallback = undefined;
    this._maxValueSize = undefined;

    if (this._onUnsubscribeCallback) this._onUnsubscribeCallback();
  }

  private _onWriteRequest(data: Buffer, offset: number, withoutResponse: boolean, callback: (result: number) => void) {
    if (this._onWriteRequestCallback) this._onWriteRequestCallback(data, offset, withoutResponse, callback);
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
