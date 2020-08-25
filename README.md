# node-ble-peripheral

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)
[![Node](https://img.shields.io/badge/node->=12-darkgreen.svg)](https://flutter.dev/)

`Copyright (c) 2020, Greg PFISTER`

A Node.js module for implementing BLE (Bluetooth Low Energy) peripherals.

## About

This is a translation of the [@abandonware/bleno](https://github.com/abandonware/bleno) fully implemented using Typescript.

## Install

Use NPM to install:

```
npm install --save @oskey-io/ble-periopheral
```

## Building

First get all dependencies:

```
npm ci
```

Now, build the library

```
npm run build
```

## Unit testing

Unit testing is done by running:

```
npm run test
```

## Getting started

## Example

An example running on a Raspberry PI (zero, 2, 3 and 4) can be found on ./exmaple folder. The instructions are in the (README)[https://github.com/oskey-org/node-ble-peripheral/blob/example/README.md]

## Issues

Please report issue using the following template:

## Contributions

Contributions are welcome, please refer to the attached [Contribution Guidlines](CONTRIBUTING.md) file if you wish to make one.

## Licensing

Please refer to the attached [license](LICENSE.md) file.

## Credits

This is very much inspired by [@abandonware/bleno](https://github.com/abandonware/bleno), a fork of [bleno](https://github.com/noble/bleno).

The two following additions were used while implementing it fully in typescript.

- Adding native mac os bindings from [this merge request](https://github.com/ptx2/bleno/tree/native-macos-bindings);
- Adding native mac os bindings from [this merge request](https://github.com/ptx2/bleno/tree/native-macos-bindings);
