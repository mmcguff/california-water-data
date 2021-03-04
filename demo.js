// const moment = require('moment'); 
// moment().format(); 

// const now = moment().unix();
// const then = moment().subtract(2, 'years').unix();

// console.log(now);
// console.log(then);

const data = {
    data: {
      login: {
        token: '+KImo8dzoRgKeIAuhT5QnGm9GE2GaVJO5zJTBym5DDK071VM6kNOsyB56Pj8aO6f',
        __typename: 'User'
      }
    }
  }


  console.log(data.data.login.token);