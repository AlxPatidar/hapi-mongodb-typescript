export const cronOptions = {
  jobs: [{
    name: 'Workout Every minute',
    time: '*/60 * * * * *',
    timezone: 'America/Los_Angeles',
    request: {
      method: 'GET',
      url: '/todos'
    },
    onComplete: (res) => {
      console.log({ res }); // 'hello world'
    }
  }]
};

export interface Job {
  name: string;
  time: string;
  timezone: string;
  request: {
    method: string;
    url: string;
  };
  onComplete: any;
}

export interface ICronJob {
  jobs: Array<Job>;
}
