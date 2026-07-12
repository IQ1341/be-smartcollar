import {
  calculateTemperatureStatus,
} from "../calculators/temperature.calculator.js";

import {
  calculateMovementStatus,
} from "../calculators/movement.calculator.js";

export const buildMonitoring = (
  collar,
  sensor,
  device,
  timestamp
) => {

  const date = new Date(timestamp);

  return {

    /*
    |--------------------------------------------------------------------------
    | Owner
    |--------------------------------------------------------------------------
    */

    ownerId: collar.ownerId,

    /*
    |--------------------------------------------------------------------------
    | Cow
    |--------------------------------------------------------------------------
    */

    cowId: collar.currentCowId,
    cowCode: collar.currentCowCode,
    cowName: collar.currentCowName,

    assignmentId:
      collar.currentAssignmentId,

    /*
    |--------------------------------------------------------------------------
    | Collar
    |--------------------------------------------------------------------------
    */

    collarId: collar.id,

    serialNumber:
      collar.serialNumber,

    deviceName:
      collar.deviceName,

    /*
    |--------------------------------------------------------------------------
    | Device
    |--------------------------------------------------------------------------
    */

    signal:
      device.signal,

    firmwareVersion:
      device.firmwareVersion ?? null,

    hardwareVersion:
      device.hardwareVersion ?? null,

    uptime:
      device.uptime ?? null,

    /*
    |--------------------------------------------------------------------------
    | Sensor
    |--------------------------------------------------------------------------
    */

    temperature:
      sensor.temperature,

    temperatureStatus:
      calculateTemperatureStatus(
        sensor.temperature
      ),

    gps: {

      latitude:
        sensor.gps.latitude,

      longitude:
        sensor.gps.longitude,

      linkMaps:
        sensor.gps.linkMaps,

    },

    movement: {

      accelX:
        sensor.movement.accelX,

      status:
        calculateMovementStatus(
          sensor.movement.accelX
        ),

    },

    /*
    |--------------------------------------------------------------------------
    | Time
    |--------------------------------------------------------------------------
    */

    year:
      date.getFullYear(),

    month:
      String(
        date.getMonth() + 1
      ).padStart(2, "0"),

    day:
      String(
        date.getDate()
      ).padStart(2, "0"),

    hour:
      String(
        date.getHours()
      ).padStart(2, "0"),

    minute:
      String(
        date.getMinutes()
      ).padStart(2, "0"),

    second:
      String(
        date.getSeconds()
      ).padStart(2, "0"),

    timestamp,

  };

};