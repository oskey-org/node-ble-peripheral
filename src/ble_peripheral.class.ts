import * as os from "os";

import { EventEmitter } from "events";

import { BLEService } from "./blie_service.class";
import { BLEBindingsInterface } from "./bindings/ble_bindings.interface";
import { BLEState } from "./ble_state.types";

import * as uuidUtil from "./utils/uuid_util";

export class BLEPeripheral extends EventEmitter {
  private _bindings?: BLEBindingsInterface;

  private _initialized = false;
  private _platform: NodeJS.Platform;
  private _state = "unknown";
  private _address = "unknown";
  private _rssi = 0;
  private _mtu = 20;

  /**
   * Class constructor
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
      this._bindings.on("mtuChange", this._onMtuChange.bind(this));
      this._bindings.on("disconnect", this._onDisconnect.bind(this));
      this._bindings.on("rssiUpdate", this._onRssiUpdate.bind(this));

      this.on(
        "stateChange",
        function (event) {
          if (!this._initialized) {
            this._bindings.init();
            this._initialized = true;
          }
        }.bind(this)
      );
    }
  }

  startAdvertising(name: string, serviceUuids?: ReadonlyArray<string>, callback?: (arg: Error | undefined | null) => void) {
    if (this._state !== "poweredOn") {
      var error = new Error("Could not start advertising, state is " + this._state + " (not poweredOn)");

      if (typeof callback === "function") {
        callback(error);
      } else {
        throw error;
      }
    } else {
      if (callback) {
        this.once("advertisingStart", callback);
      }

      var undashedServiceUuids = [];

      if (serviceUuids && serviceUuids.length) {
        for (var i = 0; i < serviceUuids.length; i++) {
          undashedServiceUuids[i] = uuidUtil.removeDashes(serviceUuids[i]);
        }
      }

      this._bindings.startAdvertising(name, undashedServiceUuids);
    }
  }

  startAdvertisingIBeacon(uuid: string, major: number, minor: number, measuredPower: number, callback?: (arg: Error | undefined | null) => void) {
    if (this._state !== "poweredOn") {
      var error = new Error("Could not start advertising, state is " + this._state + " (not poweredOn)");

      if (typeof callback === "function") {
        callback(error);
      } else {
        throw error;
      }
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

      if (callback) {
        this.once("advertisingStart", callback);
      }

      console.log("iBeacon data = " + iBeaconData.toString("hex"));

      this._bindings.startAdvertisingIBeacon(iBeaconData);
    }
  }

  startAdvertisingWithEIRData(advertisementData: Buffer, scanData?: Buffer, callback?: (arg: Error | undefined | null) => void) {
    if (typeof scanData === "function") {
      callback = scanData;
      scanData = undefined;
    }

    if (this._state !== "poweredOn") {
      var error = new Error("Could not advertising scanning, state is " + this._state + " (not poweredOn)");

      if (typeof callback === "function") {
        callback(error);
      } else {
        throw error;
      }
    } else {
      if (callback) {
        this.once("advertisingStart", callback);
      }

      this._bindings.startAdvertisingWithEIRData(advertisementData, scanData);
    }
  }

  stopAdvertising(callback?: () => void) {
    if (callback) {
      this.once("advertisingStop", callback);
    }
    this._bindings.stopAdvertising();
  }

  setServices(services: ReadonlyArray<BLEService>, callback?: (arg: Error | undefined | null) => void) {
    if (callback) {
      this.once("servicesSet", callback);
    }
    this._bindings.setServices(services);
  }

  disconnect() {
    console.log("disconnect");
    this._bindings.disconnect();
  }

  updateRssi(callback?: (err: null, rssi: number) => void) {
    if (callback) {
      this.once("rssiUpdate", function (rssi) {
        callback(null, rssi);
      });
    }

    this._bindings.updateRssi();
  }

  // on(event: "stateChange", cb: (state: BLEState) => void): this;
  // on(event: "platform", cb: (platform: NodeJS.Platform) => void): this;
  // on(event: "addressChange", cb: (address: string) => void): this;
  // on(event: "accept", cb: (address: string) => void): this;
  // on(event: "mtuChange", cb: (mtu: number) => void): this;
  // on(event: "disconnect", cb: (clientAddress: string) => void): this;
  // on(event: "advertisingStart", cb: (err?: Error | null) => void): this;
  // on(event: "advertisingStartError", cb: (err: Error) => void): this;
  // on(event: "advertisingStop", cb: () => void): this;
  // on(event: "servicesSet", cb: (err?: Error | null) => void): this;
  // on(event: "servicesSetError", cb: (err: Error) => void): this;
  // on(event: "rssiUpdate", cb: (rssi: number) => void): this;

  private _onPlatform(platform: NodeJS.Platform) {
    console.log(`platform ${platform}`);

    this._platform = platform;
  }

  private _onStateChange(state) {
    console.log(`stateChange ${state}`);

    this._state = state;

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
    console.log("servicesSet");

    if (error) {
      this.emit("servicesSetError", error);
    }

    this.emit("servicesSet", error);
  }

  private _onRssiUpdate(rssi) {
    this.emit("rssiUpdate", rssi);
  }
}
