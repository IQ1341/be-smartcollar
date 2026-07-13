export const MOVEMENT_STATUS = {
  REST: 0,
  WALK: 1,
  RUN: 2,
};

// Range "diam" berdasarkan observasi nyata di lapangan -- device yang
// benar-benar diam tetap menghasilkan noise sensor di kisaran ini
// (asimetris karena sedikit gravitasi/kemiringan bocor ke sumbu X).
const ACCEL_REST_MIN = -0.5;
const ACCEL_REST_MAX = 0.2;

// Ambang batas RUN, dihitung dari besaran (magnitude) di luar range REST.
const ACCEL_RUN_THRESHOLD = 1.0;

export const calculateMovementStatus = (
  accelX
) => {

  const isResting =
    accelX >= ACCEL_REST_MIN &&
    accelX <= ACCEL_REST_MAX;

  if (isResting) {
    return MOVEMENT_STATUS.REST;
  }

  const magnitude = Math.abs(accelX);

  if (magnitude < ACCEL_RUN_THRESHOLD) {
    return MOVEMENT_STATUS.WALK;
  }

  return MOVEMENT_STATUS.RUN;

};