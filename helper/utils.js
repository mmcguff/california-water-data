const internals = {};
const _ = require('lodash');
let moment = require('moment');
moment().format();

internals.getTime = () => {
    const today = moment().utcOffset(-8).format('YYYY-MM-DD');
    const sixDaysAgo = moment().utcOffset(-8).subtract(6, 'days').format('YYYY-M-DD');
    return {today, sixDaysAgo};
}

internals.ranchSystemsTransform = sourcePayload => {
    
    const targetDateStringFormat = 'YYYY/MM/DD hh:mm:ss';
    const targetTimeStringFormat = 'h:mm a';
    const data = sourcePayload.data;

    let transformedPayload = [];

    const _4inProbeId = 227985;
    const _12inProbeId = 227986;
    const _24inProbeId = 227987;
    const _36inProbeId = 227988;
    const _48inProbeId = 227989;
    const _60inProbeId = 227990;
    const _pressueId = 227975;

    const _4inProbeIndexLocation = _.findIndex(data, ['id', _4inProbeId]);
    const _12inProbeIndexLocation = _.findIndex(data, ['id', _12inProbeId]);
    const _24inProbeIndexLocation = _.findIndex(data, ['id', _24inProbeId]);
    const _36inProbeIndexLocation = _.findIndex(data, ['id', _36inProbeId]);
    const _48inProbeIndexLocation = _.findIndex(data, ['id', _48inProbeId]);
    const _60inProbeIndexLocation = _.findIndex(data, ['id', _60inProbeId]);
    const _pressureLocation = _.findIndex(data, [ 'id',  _pressueId]);

    let pressure;

    for (let i = 0; i < data[_4inProbeIndexLocation].rmsdata.length; i++) {

        pressure = (i < 15199) ? data[_pressureLocation].rmsdata[i].y : 0;

        transformedPayload.push({
            "date": moment(new Date(data[_4inProbeIndexLocation].rmsdata[i].x)).format(targetDateStringFormat),
            "10_X_X_4_time": moment(new Date(data[_4inProbeIndexLocation].rmsdata[i].x)).format(targetTimeStringFormat),
            "4_in_soil_moisture": data[_4inProbeIndexLocation].rmsdata[i].y,
            "12_in_soil_moisture": data[_12inProbeIndexLocation].rmsdata[i].y,
            "24_in_soil_moisture": data[_24inProbeIndexLocation].rmsdata[i].y,
            "36_in_soil_moisture": data[_36inProbeIndexLocation].rmsdata[i].y,
            "48_in_soil_moisture": data[_48inProbeIndexLocation].rmsdata[i].y,
            "60_in_soil_moisture": data[_60inProbeIndexLocation].rmsdata[i].y,
            "Pressure_0-100psi": pressure
        })
    }
    return transformedPayload;
} 

module.exports = internals;