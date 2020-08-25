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
 * This file provides all the classes, interfaces and types definition to be
 * used outside.
 */
export { OSKBLEPeripheral } from "./ble_peripheral.class";
export { OSKBLEService, OSKBLEServiceOptions } from "./blie_service.class";
export { OSKBLECharacteristic, OSKBLECharacteristicOptions } from "./ble_characteristic.class";
export { OSKBLEDescriptor, OSKBLEDescriptorOptions } from "./ble_descriptor.class";
export { OSKBLEState } from "./types/ble_state.types";
export { OSKBLEProperty } from "./types/ble_property.type";
