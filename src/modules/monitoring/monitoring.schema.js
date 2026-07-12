import { z } from "zod";

export const createMonitoringSchema = z.object({

  serialNumber:
    z.string(),

  deviceSecret:
    z.string(),

  device: z.object({

    signal:
      z.number(),

    firmwareVersion:
      z.string().optional(),

    hardwareVersion:
      z.string().optional(),

    uptime:
      z.number().optional(),

  }),

  sensor: z.object({

    temperature:
      z.number(),

    gps: z.object({

      latitude:
        z.number(),

      longitude:
        z.number(),

      linkMaps:
        z.string(),

    }),

    movement: z.object({

      accelX:
        z.number(),

    }),

  }),

});