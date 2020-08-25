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

/**
 * Define the BLE descriptor paramters
 * @since v0.1.0+1
 */
export interface OSKBLEDescriptorOptions {
  readonly uuid: string;
  readonly value?: Buffer | string;
}

/**
 * Define a BLE descriptor
 * @since v0.1.0+1
 */
export declare interface OSKBLEDescriptor {
  /**
   * The descriptor UUID
   * @since v0.1.0+1
   */
  readonly uuid: string;

  /**
   * The descriptor value
   * @since v0.1.0+1
   */
  readonly value?: Buffer | string;

  /**
   * Output a readable representation of a descriptor
   * @since v0.1.0+1
   */
  toString(): string;
}

/**
 * Define a BLE descriptor
 * @since v0.1.0+1
 */
export class OSKBLEDescriptor {
  readonly uuid: string;
  readonly value?: Buffer | string;

  /**
   * Construct a BLE descriptor
   * @param options
   * @since v0.1.0+1
   */
  constructor(options: OSKBLEDescriptorOptions) {
    //@ts-ignore 2540
    this.uuid = options.uuid;
    //@ts-ignore 2540
    this.value = options.value;
  }

  toString() {
    return JSON.stringify({ uuid: this.uuid, value: this.value });
  }
}
