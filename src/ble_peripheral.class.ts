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

import * as os from "os";

import { EventEmitter } from "events";

import { OSKBLEService } from "./blie_service.class";
import { OSKBLEState } from "./types/ble_state.types";
import { OSKBLEBindings } from "./bindings/ble_bindings.interface";
import * as uuidUtil from "./utils/uuid_util";

/**
 * Defines a BLE peripheral
 * @since v0.1.0+1
 */
export declare interface OSKBLEPeripheral {
  /**
   * Listen for state changes
   * @param event "stateChange"
   * @param callback The callback for when the event is emitted. The new state is passed
   * @since v0.1.0+1
   */
  on(event: "stateChange", callback: (state: OSKBLEState) => void): this;

  /**
   *
   * @param event
   * @param callback
   * @since v0.1.0+1
   */
  on(event: "accept", callback: (address: string) => void): this;

  /**
   *
   * @param event
   * @param callback
   * @since v0.1.0+1
   */
  on(event: "disconnect", callback: (clientAddress: string) => void): this;

  /**
   *
   * @param event
   * @param callback
   * @since v0.1.0+1
   */
  on(event: "advertisingStart", callback: (err?: Error | null) => void): this;

  /**
   *
   * @param event
   * @param callback
   * @since v0.1.0+1
   */
  on(event: "advertisingStartError", callback: (err: Error) => void): this;

  /**
   *
   * @param event
   * @param callback
   * @since v0.1.0+1
   */
  on(event: "advertisingStop", callback: () => void): this;

  /**
   *
   * @param event
   * @param callback
   * @since v0.1.0+1
   */
  on(event: "servicesSet", callback: (err?: Error | null) => void): this;

  /**
   *
   * @param event
   * @param callback
   * @since v0.1.0+1
   */
  on(event: "servicesSetError", callback: (err: Error) => void): this;

  /**
   *
   * @param event
   * @param callback
   * @since v0.1.0+1
   */
  on(event: "mtuChange", callback: (mtu: number) => void): this;

  /**
   *
   * @param event
   * @param callback
   * @since v0.1.0+1
   */
  on(event: "rssiUpdate", callback: (rssi: number) => void): this;

  /**
   * Start advertising services
   * @param name The name of the device
   * @param serviceUuids The servuce UUIDs to advertise
   * @param callback A callback in  case of error
   * @since v0.1.0+1
   */
  startAdvertising(name: string, serviceUuids?: ReadonlyArray<string>): Promise<void>;

  /**
   * Start advertising as an iBeacon
   * @param uuid
   * @param major
   * @param minor
   * @param measuredPower
   * @since v0.1.0+1
   */
  startAdvertisingIBeacon(uuid: string, major: number, minor: number, measuredPower: number): Promise<void>;

  /**
   * Start advertising with EIR data
   * @param advertisementData
   * @param scanData
   * @since v0.1.0+1
   */
  startAdvertisingWithEIRData(advertisementData: Buffer, scanData?: Buffer): Promise<void>;

  /**
   * Stop advertising
   * @since v0.1.0+1
   */
  stopAdvertising(): Promise<void>;

  /**
   * Set the services on the BLE peripherals
   * @param services The list of services
   * @since v0.1.0+1
   */
  setServices(services: ReadonlyArray<OSKBLEService>): Promise<void>;

  /**
   * Disconnect the client
   * @since v0.1.0+1
   */
  disconnect(): Promise<void>;

  /**
   * Update the RSSI
   * @param rssi The new RSSI value
   * @since v0.1.0+1
   */
  updateRssi(rssi: number): Promise<void>;
}

/**
 * Defines a BLE peripheral
 * @since v0.1.0+1
 */
export class OSKBLEPeripheral extends EventEmitter {
  private _bindings?: OSKBLEBindings;
  private _initialized = false;
  private _platform: NodeJS.Platform;
  private _state: OSKBLEState = "unknown";
  private _address = "unknown";
  private _rssi = 0;
  private _mtu = 20;

  /**
   * Construct a BLE peripheral
   * @since v0.1.0+1
   */
  constructor() {
    super();

    // Bindings
    this._platform = os.platform();
    if (this._platform === "darwin") {
      const osRelease = parseFloat(os.release());
      // TODO handle mac bindings
    } else if (this._platform === "linux" || this._platform === "android" || this._platform === "win32" || this._platform === "freebsd") {
      // TODO: handle linux/android/win32/freebsd bindings
    } else {
      throw new Error("Unsupported platform");
    }

    if (this._bindings) {
      this._bindings.on("stateChange", this._onStateChange.bind(this));
      this._bindings.on("platform", this._onPlatform.bind(this));
      this._bindings.on("addressChange", this._onAddressChange.bind(this));
      this._bindings.on("advertisingStart", this._onAdvertisingStart.bind(this));
      this._bindings.on("advertisingStop", this._onAdvertisingStop.bind(this));
      this._bindings.on("servicesSet", this._onServicesSet.bind(this));
      this._bindings.on("accept", this._onAccept.bind(this));
      this._bindings.on("disconnect", this._onDisconnect.bind(this));
      this._bindings.on("mtuChange", this._onMtuChange.bind(this));
      this._bindings.on("rssiUpdate", this._onRssiUpdate.bind(this));

      this.on("stateChange", (event) => {
        if (!this._initialized) {
          this._bindings.init();
          this._initialized = true;
        }
      });
    } else throw new Error(`Could not start advertising, no bindings are set for platform ${os.platform()} on release ${os.release()}`);
  }

  async startAdvertising(name: string, serviceUuids?: ReadonlyArray<string>) {
    if (this._state !== "poweredOn") {
      throw new Error("Could not start advertising, state is " + this._state + " (not poweredOn)");
    } else {
      var undashedServiceUuids = [];

      if (serviceUuids && serviceUuids.length) {
        for (var i = 0; i < serviceUuids.length; i++) {
          undashedServiceUuids[i] = uuidUtil.removeDashes(serviceUuids[i]);
        }
      }

      if (this._bindings) this._bindings.startAdvertising(name, undashedServiceUuids);
      else throw new Error(`Could not start advertising, no bindings are set for platform ${os.platform()} on release ${os.release()}`);
    }
  }

  async startAdvertisingIBeacon(uuid: string, major: number, minor: number, measuredPower: number) {
    if (this._state !== "poweredOn") {
      throw new Error("Could not start advertising, state is " + this._state + " (not poweredOn)");
    } else {
      var undashedUuid = uuidUtil.removeDashes(uuid);
      var uuidData = new Buffer(undashedUuid, "hex");
      var uuidDataLength = uuidData.length;
      var iBeaconData = new Buffer(uuidData.length + 5);

      for (var i = 0; i < uuidDataLength; i++) {
        iBeaconData[i] = uuidData[i];
      }

      iBeaconData.writeUInt16BE(major, uuidDataLength);
      iBeaconData.writeUInt16BE(minor, uuidDataLength + 2);
      iBeaconData.writeInt8(measuredPower, uuidDataLength + 4);

      console.log("iBeacon data = " + iBeaconData.toString("hex"));

      if (this._bindings) this._bindings.startAdvertisingIBeacon(iBeaconData);
      else throw new Error(`Could not start advertising, no bindings are set for platform ${os.platform()} on release ${os.release()}`);
    }
  }

  async startAdvertisingWithEIRData(advertisementData: Buffer, scanData?: Buffer) {
    if (this._state !== "poweredOn") {
      throw new Error("Could not advertising scanning, state is " + this._state + " (not poweredOn)");
    } else {
      if (this._bindings) this._bindings.startAdvertisingWithEIRData(advertisementData, scanData);
      else throw new Error(`Could not start advertising, no bindings are set for platform ${os.platform()} on release ${os.release()}`);
    }
  }

  async stopAdvertising() {
    if (this._bindings) this._bindings.stopAdvertising();
    else throw new Error(`Could not start advertising, no bindings are set for platform ${os.platform()} on release ${os.release()}`);
  }

  async setServices(services: ReadonlyArray<OSKBLEService>) {
    if (this._bindings) this._bindings.setServices(services);
    else throw new Error(`Could not start advertising, no bindings are set for platform ${os.platform()} on release ${os.release()}`);
  }

  async disconnect() {
    console.log("disconnect");

    if (this._bindings) this._bindings.disconnect();
    else throw new Error(`Could not start advertising, no bindings are set for platform ${os.platform()} on release ${os.release()}`);
  }

  async updateRssi(rssi: number) {
    console.log(`updateRssi ${rssi}`);

    if (this._bindings) this._bindings.updateRssi(rssi);
    else throw new Error(`Could not start advertising, no bindings are set for platform ${os.platform()} on release ${os.release()}`);
  }

  private _onPlatform(platform: NodeJS.Platform) {
    console.log(`platform ${platform}`);

    this._platform = platform;
  }

  private _onStateChange(state: OSKBLEState) {
    console.log(`stateChange ${state}`);

    this._state = state;

    // Use the callback or pass the event
    // if (this._onStateChange) this._onStateChange(state);
    // else
    this.emit("stateChange", state);
  }

  private _onAddressChange(address: string) {
    console.log(`addressChange ${address}`);

    this._address = address;
  }

  private _onAccept(clientAddress: string) {
    console.log(`accept ${clientAddress}`);

    this.emit("accept", clientAddress);
  }

  private _onMtuChange(mtu: number) {
    console.log("mtu " + mtu);

    this._mtu = mtu;

    this.emit("mtuChange", mtu);
  }

  private _onDisconnect(clientAddress: string) {
    console.log(`disconnect ${clientAddress}`);

    this.emit("disconnect", clientAddress);
  }

  private _onAdvertisingStart(error: Error) {
    console.log(`advertisingStart: ${error}`);

    if (error) {
      this.emit("advertisingStartError", error);
    }

    this.emit("advertisingStart", error);
  }

  private _onAdvertisingStop() {
    console.log("advertisingStop");

    this.emit("advertisingStop");
  }

  private _onServicesSet(error: Error) {
    console.log(`servicesSet ${error}`);

    // In case of error
    if (error) {
      this.emit("servicesSetError", error);
    }

    this.emit("servicesSet", error);
  }

  private _onRssiUpdate(rssi) {
    console.log(`rssiUpdate ${rssi}`);

    this._rssi = rssi;

    this.emit("rssiUpdate", rssi);
  }
}
