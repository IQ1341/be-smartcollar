export const MOVEMENT_STATUS = {
  REST: 0,
  WALK: 1,
  RUN: 2,
};

export const calculateMovementStatus = (
  accelX
) => {

  const value = Math.abs(accelX);

  if (value < 0.15) {
    return MOVEMENT_STATUS.REST;
  }

  if (value < 0.8) {
    return MOVEMENT_STATUS.WALK;
  }

  return MOVEMENT_STATUS.RUN;

};