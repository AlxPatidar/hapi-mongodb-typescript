import * as Hapi from "hapi";
import * as Hoek from "hoek";
import * as cron from "cron";

import { IPlugin, IPluginOptions } from "../interfaces";

const CronJob = cron.CronJob

let defaults = {}
const internals: any = {};

internals.trigger = (server, job) => {
  return async () => {
    const res = await server.inject(job.request);
    if (job.onComplete) {
      job.onComplete(res.result);
    }
  };
};

internals.onPostStart = (jobs) => {
  return () => {
    for (const key of Object.keys(jobs)) {
      jobs[key].start();
    }
  };
};

internals.onPreStop = (jobs) => {
  return () => {
    for (const key of Object.keys(jobs)) {
      jobs[key].stop();
    }
  };
};

const register = async (
  server: Hapi.Server,
  options: IPluginOptions
): Promise<void> => {
  try {
    defaults = Hoek.applyToDefaults(defaults, options)
    const jobs = {};
    if (!options.cronJobs || !options.cronJobs.jobs.length) {
      server.log('No cron jobs provided.');
    } else {
      options.cronJobs.jobs.forEach((job) => {
        Hoek.assert(!jobs[job.name], 'Job name has already been defined');
        Hoek.assert(job.name, 'Missing job name');
        Hoek.assert(job.time, 'Missing job time');
        Hoek.assert(job.timezone, 'Missing job time zone');
        Hoek.assert(job.request, 'Missing job request options');
        Hoek.assert(job.request.url, 'Missing job request url');
        Hoek.assert(typeof job.onComplete === 'function' || typeof job.onComplete === 'undefined', 'onComplete value must be a function');
        try {
          jobs[job.name] = new CronJob(job.time, internals.trigger(server, job), null, false, job.timezone);
        } catch (err) {
          if (err.message === 'Invalid timezone.') {
            Hoek.assert(!err, 'Invalid timezone. See https://momentjs.com/timezone for valid timezones');
          } else {
            Hoek.assert(!err, 'Time is not a cron expression');
          }
        }
      });
    }

    // server.expose('jobs', jobs);
    server.ext('onPostStart', internals.onPostStart(jobs));
    server.ext('onPreStop', internals.onPreStop(jobs));
  } catch (err) {
    console.log(`Error registering jwt plugin: ${err}`);
    throw err;
  }
};

export default (): IPlugin => {
  return {
    register,
    info: () => {
      return { name: "hapi-cron", version: "2.0.0" };
    }
  };
};
