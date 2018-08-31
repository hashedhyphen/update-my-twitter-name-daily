const Twitter = require('twitter');

const CLIENT = new Twitter({
  consumer_key: process.env.CONSUMER_KEY || '',
  consumer_secret: process.env.CONSUMER_SECRET || '',
  access_token_key: process.env.ACCESS_TOKEN_KEY || '',
  access_token_secret: process.env.ACCESS_TOKEN_SECRET || '',
});

const GOT_JOBLESS_AT = new Date(2018, 6, 19, 15); // JST 2018-07-20 0:00
const GOT_JOB_AT = new Date(2018, 7, 31, 15, 0, 0); // JST 2018-09-01 0:00
const MAX_DAYS_JOBLESS = (GOT_JOB_AT - GOT_JOBLESS_AT) / 1000 / 60 / 60 / 24;
const ENDPOINT_FOR_UPDATE_PROFILE = 'account/update_profile';

const calcNthDaySinceJobless = (now = new Date()) => {
  const nowInMsec = now.getTime();
  const gotJoblessAtInMsec = GOT_JOBLESS_AT.getTime();

  const nthDaySinceJobless =
    1 + Math.floor((nowInMsec - gotJoblessAtInMsec) / 1000 / 60 / 60 / 24);

  return nthDaySinceJobless;
};

const buildPostParams = ({ nthDay }) => {
  const name = nthDay <= MAX_DAYS_JOBLESS ? `Hash@無職${nthDay}日目` : 'Hash';
  return { name };
};

const postParams = ({ endpoint = ENDPOINT_FOR_UPDATE_PROFILE, params }) =>
  new Promise((resolve, reject) =>
    CLIENT.post(endpoint, params, (errors, profile, response) => {
      if (errors) reject(errors);
      else resolve({ profile, response });
    })
  );

exports.handler = async _event => {
  const nthDay = calcNthDaySinceJobless();
  const params = buildPostParams({ nthDay });
  return postParams({ params });
};
