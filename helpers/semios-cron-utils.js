const emoji = require('node-emoji');
const fetch = require('node-fetch');
const moment = require('moment'); 
const { setWith } = require('lodash');
const { stat } = require('fs');
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

const _getStationGeom = (station) => {
  let geom;
  switch (station) {
    case 'block-1-north':
      geom = '0101000020E61000006049A8CFC4915EC013F3ACA415A54340';
      break;
    case 'block-1-south':
      geom = '0101000020E6100000E2DC7069C6915EC05C83088211A44340';
      break;
    case 'block-2-north':
      geom = '0101000020E61000000C7E761BAF915EC072DF6A9DB8A64340';
      break;
    case 'block-2-south':
      geom = '0101000020E61000004BB43FABA7915EC02FE9DE7998A54340';
      break;
    case 'block-3-north':
      geom = '0101000020E610000086D3388A62915EC08ADE4EC708A54340';
      break;
    case 'block-3-south':
      geom = '0101000020E6100000ACCA19E574915EC0FE7854A126A44340';
      break;
    case 'block-4-north':
      geom = '0101000020E610000058BCA2A53C915EC0EFA42A12B8A64340';
      break;
    case 'block-4-south':
      geom = '0101000020E61000004CDD3AA43D915EC0187F36CD96A54340';
      break;
    case 'block-5':
      geom = '0101000020E6100000BDB09014EC905EC0CFB9803C60A54340';
      break;
    case 'block-6':
      geom = '0101000020E6100000CF83BBB3F6905EC09265773705A54340';
      break;
    case 'block-7':
      geom = '0101000020E610000067B04E3A36915EC0884F954AD3A34340';
      break;
    case 'block-9':
      geom = '0101000020E6100000FBE362B172915EC0DC137F6F2EA34340';
      break;
    case 'block-12':
      geom = '0101000020E61000007542435ABE915EC0963FDF162CA34340';
      break;
    default:
      geom = '';
  }

  return geom;
};

public.getSoilMositure = async(numberOfDaysBack, station) => {
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
                "geom": _getStationGeom(station),
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