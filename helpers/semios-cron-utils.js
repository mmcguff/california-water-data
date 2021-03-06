const emoji = require('node-emoji');
const fetch = require('node-fetch');
const moment = require('moment'); 
moment().format(); 

const public = {};
const url = process.env.SEMIOS_GRAPHQL_ENDPOINT; 

const _getXToken = async (days) => {

    let xToken;
    
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            query: `mutation Login($data: loginInput!) {
          login(data: $data) {
            token
            __typename
          }
        }`,
            variables: {"data":{"email":process.env.SEMIOS_USERNAME,"password":process.env.SEMIOS_PASSWORD}}
          })
    };
    await fetch(url, options)
    .then(response => response.json())
    .then(payload => {
        xToken = payload.data.login.token;
    })

    return xToken;
}

public.getSoilMositure = async(numberOfDaysBack) => {
    console.log('...getting soil mositure')
    const xToken = await _getXToken();
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            "x-token": xToken
        },
        body: JSON.stringify({
            query: `query SoilMoistureDetails(
                $propertyId: ID!
                $geom: Geom!
                $dateFrom: DateTime!
                $dateTo: DateTime!
              ) {
                user {
                  properties(propertyId: $propertyId) {
                    soilMoistureStations(geom: $geom) {
                      settings {
                        fieldCapacity
                        permanentWiltingPoint
                        soilTextureId
                        isSentek
                        availableHeights
                        defaultHeights
                        managementAllowableDepletionDates {
                          id
                          startDate
                          soilMoisture
                          __typename
                        }
                        __typename
                      }
                      details(dateFrom: $dateFrom, dateTo: $dateTo) {
                        timestamp
                        rain
                        measurements {
                          moisture
                          temperature
                          height
                          isDefault
                          __typename
                        }
                        __typename
                      }
                      irrigationDetails(dateFrom: $dateFrom, dateTo: $dateTo) {
                        type
                        timeEnd
                        timeStart
                        status
                        minutes
                        __typename
                      }
                      __typename
                    }
                    __typename
                  }
                  __typename
                }
              }
              `,
            variables: {
                "propertyId": 50645,
                "geom": "0101000020E61000006049A8CFC4915EC013F3ACA415A54340",
                "dateFrom": moment().subtract(numberOfDaysBack, 'days'),
                "dateTo": moment(),
            }
          })
    };
    let data;
    await fetch(url, options)
    .then(response => response.json())
    .then(payload => {
      data = payload;  
    })

    return data;
}

public.getIrrigation = async(numberOfDaysBack) => {
    console.log('...getting irrigation')
    const xToken = await _getXToken();
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            "x-token": xToken
        },
        body: JSON.stringify({
            query: `query IrrigationActivityDetails(
                $propertyId: ID!
                $dateFrom: DateTime!
                $dateTo: DateTime!
              ) {
                user {
                  properties(propertyId: $propertyId) {
                    irrigationActivityStations {
                      name
                      geom
                      type
                      coordinates {
                        lat: latitude
                        lng: longitude
                        __typename
                      }
                      details(dateFrom: $dateFrom, dateTo: $dateTo) {
                        start: timeStart
                        end: timeEnd
                        status
                        minutes
                        __typename
                      }
                      __typename
                    }
                    __typename
                  }
                  __typename
                }
              }`,
            variables: {
                "propertyId": 50645,
                "dateFrom": moment().subtract(numberOfDaysBack, 'days'),
                "dateTo": moment(),
            }
          })
    };
    let data;
    await fetch(url, options)
    .then(response => response.json())
    .then(payload => {
      data = payload;  
    })
    return data;
}

module.exports = public;