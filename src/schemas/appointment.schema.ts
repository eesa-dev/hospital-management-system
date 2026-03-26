import { z } from "zod";

export const appointmentSchema = z.object({
  doctorId: z.string(),
  appointmentDate: z.string(),
});
