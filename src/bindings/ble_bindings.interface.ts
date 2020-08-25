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

import { OSKBLEService } from "../blie_service.class";
import { OSKBLEState } from "../types/ble_state.types";

/**
 * Defines a BLE bindings
 * @since v0.1.0+1
 */
export interface OSKBLEBindings {
  /**
   * Initialise the bindings
   */
  init(): void;

  /**
   * Listen on state change events
   * @param event "stateChange"
   * @param callback The callback to handle the new state
   * @since v0.1.0+1
   */
  on(event: "stateChange", callback: (state: OSKBLEState) => void): void;

  /**
   * Listen on platform events
   * @param event "platform"
   * @param callback The callback to handle the platform
   * @since v0.1.0+1
   */
  on(event: "platform", callback: (platform: NodeJS.Platform) => void): void;

  /**
   * Listen on address change events
   * @param event "addressChange"
   * @param callback The callback to handle the new address
   * @since v0.1.0+1
   */
  on(event: "addressChange", callback: (address: string) => void): void;

  /**
   * Listen on accepted client events
   * @param event "accept"
   * @param callback The callback to handle the accepted client (the client address is passed)
   * @since v0.1.0+1
   */
  on(event: "accept", callback: (address: string) => void): void;

  /**
   * List on disconnected client event
   * @param event "disconnect"
   * @param callback The callback to handle client disconnection (the client address is passed)
   * @since v0.1.0+1
   */
  on(event: "disconnect", callback: (clientAddress: string) => void): void;

  /**
   * Listen on advertising start event
   * @param event "advertisingStart"
   * @param callback The callback to handle the advertising start event (an error is passed in case of problem)
   * @since v0.1.0+1
   */
  on(event: "advertisingStart", callback: (error?: Error) => void): void;

  /**
   * Listen on advertising stop event
   * @param event "advertisingStop"
   * @param callback The callback to handle the advertising stop event
   * @since v0.1.0+1
   */
  on(event: "advertisingStop", callback: () => void): void;

  /**
   * Listen on services set event
   * @param event "servicesSet"
   * @param callback The callback to handle services set events (an error is passed in case of problem)
   * @since v0.1.0+1
   */
  on(event: "servicesSet", callback: (error?: Error) => void): void;

  /**
   * Listen on MTU changed event
   * @param event "mtuChange"
   * @param callback The callback to handle new MTU value (the new MTU is passed)
   */
  on(event: "mtuChange", callback: (mtu: number) => void): void;

  /**
   * Listen on RSSI update event
   * @param event "rssiUpdate"
   * @param callback The callback to handle new RSSI value (the new RSSI is passed)
   * @since v0.1.0+1
   */
  on(event: "rssiUpdate", callback: (rssi: number) => void): void;

  /**
   * Disconnect
   * @since v0.1.0+1
   */
  disconnect(): void;

  /**
   * Set the services
   * @param services The services to be set
   * @since v0.1.0+1
   */
  setServices(services: ReadonlyArray<OSKBLEService>): void;

  /**
   * Start advertising the service
   * @param name The BLE device name
   * @param serviceUuids The services UUID
   * @since v0.1.0+1
   */
  startAdvertising(name: string, serviceUuids?: ReadonlyArray<string>): void;

  /**
   * Start advertising an iBeacon
   * @param iBeaconData The iBeacon data
   * @since v0.1.0+1
   */
  startAdvertisingIBeacon(iBeaconData: Buffer): void;

  /**
   * Start advertising with EIR data
   * @param advertisementData The advertisement data
   * @param scanData The scan data
   * @since v0.1.0+1
   */
  startAdvertisingWithEIRData(advertisementData: Buffer, scanData?: Buffer): void;

  /**
   * Stop advertising
   * @since v0.1.0+1
   */
  stopAdvertising(): void;

  /**
   * Update the RSSI
   * @param rssi The new RSSI value
   * @since v0.1.0+1
   */
  updateRssi(rssi: number): void;
}
