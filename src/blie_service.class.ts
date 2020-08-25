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

import { OSKBLECharacteristic } from "./ble_characteristic.class";

import * as uuidUtil from "./utils/uuid_util";

/**
 * Defines parameters for creating a BLE service
 * @since v0.1.0+1
 */
export interface OSKBLEServiceOptions {
  readonly uuid: string;
  readonly characteristics?: ReadonlyArray<OSKBLECharacteristic>;
}

/**
 * Defines a BLE service
 * @since v0.1.0+1
 */
export declare interface OSKBLEService {
  /**
   * The service UUID
   * @since v0.1.0+1
   */
  readonly uuid: string;

  /**
   * The characteristics of the service
   * @since v0.1.0+1
   */
  readonly characteristics: ReadonlyArray<OSKBLECharacteristic>;

  /**
   * Output a readable representation of the object
   * @since v0.1.0+1
   */
  toString(): void;
}

/**
 * Defines a BLE service
 * @since v0.1.0+1
 */
export class OSKBLEService extends EventEmitter {
  readonly uuid: string;
  readonly characteristics: ReadonlyArray<OSKBLECharacteristic>;

  /**
   * Construct a BLE service
   * @param options The BLE service parameters
   * @since v0.1.0+1
   */
  constructor(options: OSKBLEServiceOptions) {
    super();

    // @ts-ignore 2540
    this.uuid = uuidUtil.removeDashes(options.uuid);

    // @ts-ignore 2540
    this.characteristics = options.characteristics || [];
  }

  toString() {
    return JSON.stringify({
      uuid: this.uuid,
      characteristics: this.characteristics,
    });
  }
}
