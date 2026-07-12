export const TEMPERATURE_STATUS = {
  NORMAL: 0,
  WARNING: 1,
  DANGER: 2,
};

export const calculateTemperatureStatus = (
  temperature
) => {

  if (temperature <= 39.5) {
    return TEMPERATURE_STATUS.NORMAL;
  }

  if (temperature <= 40.5) {
    return TEMPERATURE_STATUS.WARNING;
  }

  return TEMPERATURE_STATUS.DANGER;

};