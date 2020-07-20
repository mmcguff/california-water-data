const fs = require('fs');
const path = require('path');
const utils = require('../helpers/utils');


// Regardless of what is requested we will get both 1m and 1y csv for the location requested.  
// Filters of what the user wants will happen later.  
module.exports = async (req, res, next) => {
    const CSVFiles = await utils.jainLogicGetAllFilesFromS3();
    const location = req.params.location;
    let mCSV = [];
    let yCSV = [];
    let mKeyIndex;
    let yKeyIndex;
    let csvArrIndex;
    let csvHeaders;
    
    //take raw list of CSV from S3 and divide by 1m and 1y
    CSVFiles.forEach(file => {
        if(file.includes('1m')){
          mCSV.push(file);
        } else {
          yCSV.push(file);
        }
      });

    //based upon location get the 1m Key and 1y Key locations in s3 from the mCSV and yCSV arrays.
    switch (location) {
        case 'ag-park-east-smp':
            mKeyIndex = mCSV.findIndex(file => file.includes('Agri-Park_East_SMP_Data'));
            yKeyIndex = yCSV.findIndex(file => file.includes('Agri-Park_East_SMP_Data'));
            csvHeaders = [
                'date',
                'irrigation_zone',
                'soil_moisture_8',
                'soil_moisture_16',
                'soil_moisture_28',
                'soil_moisture_36',
                'soil_moisture_48',
                'soil_moisture_56',
                'pressure_switch_calc'
            ];
            break;
        case 'ag-park-east-pump':
            mKeyIndex = mCSV.findIndex(file => file.includes('Agri-Park_East_Pump_Data'));
            yKeyIndex = yCSV.findIndex(file => file.includes('Agri-Park_East_Pump_Data'));
            csvHeaders = [
                'date',
                'flow_total_1',
                'avg_flow_1'
            ];
            break;
        case 'ag-park-west-unified':
            mKeyIndex = mCSV.findIndex(file => file.includes('Agri-Park_West_Unified'));
            yKeyIndex = yCSV.findIndex(file => file.includes('Agri-Park_West_Unified'));
            csvHeaders = [
                'date',
                'soil_mositure_sum',
                'soil_moisture_8',
                'soil_moisture_16',
                'soil_moisture_28',
                'soil_moisture_36',
                'soil_moisture_48',
                'soil_moisture_56',
                'pressure_switch_calc'
            ];
            break;
        case 'balthazar-prunes-smp':
            mKeyIndex = mCSV.findIndex(file => file.includes('Balthazar_Prunes'));
            yKeyIndex = yCSV.findIndex(file => file.includes('Balthazar_Prunes'));
            csvHeaders = [
                'date',
                'irrigation_zone',
                'soil_moisture_8',
                'soil_moisture_16',
                'soil_moisture_28',
                'soil_moisture_36',
                'soil_moisture_48',
                'soil_moisture_56',
                'dwyer_pressure_sensor_0to100',
                'pressure_switch_calc'
            ];
            break;
        case 'balthazar-walnuts-smp':
            mKeyIndex = mCSV.findIndex(file => file.includes('Balthazar_Walnuts'));
            yKeyIndex = yCSV.findIndex(file => file.includes('Balthazar_Walnuts'));
            csvHeaders = [
                'date',
                'irrigation_zone',
                'soil_moisture_12',
                'soil_moisture_24',
                'soil_moisture_36',
                'soil_moisture_48',
                'soil_moisture_60',
                'pressure_switch_1_average',
                'pressure_switch_2_average',
                'jpt_pressure_sensor_0to100_psi',
                'pressure_switch_calc'
            ];
            break;
        case 'buttehouse-prunes-nw':
            mKeyIndex = mCSV.findIndex(file => file.includes('Buttehouse_Prunes'));
            yKeyIndex = yCSV.findIndex(file => file.includes('Buttehouse_Prunes'));
            csvHeaders = [
                'date',
                'irrigation_zone',
                'soil_moisture_12',
                'soil_moisture_16',
                'soil_moisture_20',
                'soil_moisture_36',
                'soil_moisture_48',
                'pressure_switch_port_b'
            ];
            break;
        case 'buttehouse-ws':
            mKeyIndex = mCSV.findIndex(file => file.includes('Buttehouse_WS'));
            yKeyIndex = yCSV.findIndex(file => file.includes('Buttehouse_WS'));
            csvHeaders = [
                'date',
                'irrigation_zone',
                'soil_moisture_8',
                'soil_moisture_16',
                'soil_moisture_28',
                'soil_moisture_36',
                'soil_moisture_48',
                'soil_moisture_56',
                'pressure_switch_1_averaged'
            ];
            break;
        case 'home-walnuts-ws':
            mKeyIndex = mCSV.findIndex(file => file.includes('Home_Walnuts_WS'));
            yKeyIndex = yCSV.findIndex(file => file.includes('Home_Walnuts_WS'));
            csvHeaders = [
                'date',
                'irrigation_zone',
                'soil_moisture_12',
                'soil_moisture_24',
                'soil_moisture_36',
                'soil_moisture_48',
                'soil_moisture_60',
                'pressure_switch_calc'
            ];
            break;
        case 'lynna-s-block-ws':
            mKeyIndex = mCSV.findIndex(file => file.includes('Lynn'));
            yKeyIndex = yCSV.findIndex(file => file.includes('Lynn'));
            csvHeaders = [
                'date',
                'pressure_on_or_off',
                'soil_moisture_8',
                'soil_moisture_16',
                'soil_moisture_24',
                'soil_moisture_32',
                'soil_moisture_40',
                'soil_moisture_44',
                'soil_moisture_48',
            ];
            break;
        case 'meridian-walnuts-ws':
            mKeyIndex = mCSV.findIndex(file => file.includes('Meridian'));
            yKeyIndex = yCSV.findIndex(file => file.includes('Meridian'));
            csvHeaders = [
                'date',
                'irrigation_zone',
                'soil_moisture_8',
                'soil_moisture_16',
                'soil_moisture_28',
                'soil_moisture_36',
                'soil_moisture_48',
                'soil_moisture_56',
                'dwyer_pressure_sensor_0to100',
                'pressure_switch_calc'
            ];
            break;
        case 'sanders-e':
            mKeyIndex = mCSV.findIndex(file => file.includes('Sanders_East_Data'));
            yKeyIndex = yCSV.findIndex(file => file.includes('Sanders_East_Data'));
            csvHeaders = [
                'date',
                'soil_moisture_12',
                'soil_moisture_24',
                'soil_moisture_36',
                'soil_moisture_48',
                'soil_moisture_60',
                'pressure_on_or_off'
            ];
            break;
        case 'sanders-m-ws':
            mKeyIndex = mCSV.findIndex(file => file.includes('Sanders_Middle'));
            yKeyIndex = yCSV.findIndex(file => file.includes('Sanders_Middle'));
            csvHeaders = [
                'date',
                'soil_moisture_12',
                'soil_moisture_24',
                'soil_moisture_36',
                'soil_moisture_48',
                'soil_moisture_60',
                'pressure_on_or_off'
            ];
            break;

        case 'south-sommers':
            mKeyIndex = mCSV.findIndex(file => file.includes('South_Sommers'));
            yKeyIndex = yCSV.findIndex(file => file.includes('South_Sommers'));
            csvHeaders = [
                'date',
                'irrigation_zone',
                'soil_moisture_8',
                'soil_moisture_16',
                'soil_moisture_28',
                'soil_moisture_36',
                'soil_moisture_48',
                'soil_moisture_56',
                'dwyer_pressure_sensor_0to100',
                'pressure_switch_calc'
            ];
            break;
        //duplicate pump issue?
        case 'sanders-pump':
            mKeyIndex = mCSV.findIndex(file => file.includes('Sanders_Pump'));
            yKeyIndex = yCSV.findIndex(file => file.includes('Sanders_Pump'));
            csvHeaders = [
                'date',
                'pressure_on_or_off_1',
                'pressure_on_or_off_2'
            ];
            break;
        //returns empty for now
        case 'ag-park-west-pump':
            mKeyIndex = mCSV.findIndex(file => file.includes('Agri-Park_West'));
            yKeyIndex = yCSV.findIndex(file => file.includes('Agri-Park_West'));
            csvHeaders = [
                'date',
                'flow_total_1',
                'avg_flow_1'
            ];
            break; //returned empty data
        default:
            return res.send('Invalid location sent');
    }

    //download 1m and 1y files
    await utils.jainLogicDownloadFileFromS3(mCSV[mKeyIndex], '1m.csv');
    await utils.jainLogicDownloadFileFromS3(yCSV[yKeyIndex], '1y.csv');
    res.locals.csvHeaders = csvHeaders;
    next();
}