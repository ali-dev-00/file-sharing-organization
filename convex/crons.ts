import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "deleting files marked for deletion",
  { hours: 24 }, // every minute
  internal.files.deleteAllFiles
);

export default crons