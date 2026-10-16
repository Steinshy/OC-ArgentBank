const axios = require('axios');

const signupApi = process.env.SIGNUP_URL || 'http://localhost:3001/api/v1/user/signup';
const MAX_ATTEMPTS = 30;
const RETRY_DELAY_MS = 1000;

const users = [
  {
    firstName: 'Tony',
    lastName: 'Stark',
    email: 'tony@stark.com',
    password: 'password123',
  },
  {
    firstName: 'Steve',
    lastName: 'Rogers',
    email: 'steve@rogers.com',
    password: 'password456',
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createUser = async (user) => {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await axios.post(signupApi, user);
      console.log(`Created ${user.email}`);
      return;
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`Skipped ${user.email} (already exists)`);
        return;
      }
      if (error.response || attempt === MAX_ATTEMPTS) throw error;
      await sleep(RETRY_DELAY_MS);
    }
  }
};

(async () => {
  for (const user of users) {
    await createUser(user);
  }
})().catch((error) => {
  console.error(`Population failed: ${error.response?.data?.message || error.message}`);
  process.exit(1);
});
