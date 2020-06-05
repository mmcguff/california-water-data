const fs = require('fs');
const path = require('path');


// Regardless of what is requested we will get both 1m and 1y csv for the location requested.  
// Filters of what the user wants will happen later.  
module.exports = async (req, res, next) => {
    const CSVFiles = fs.readdirSync(path.join(__dirname, '../jainLogicData'));
    const location = req.params.location;
    let csvArrIndex;
    let csvHeaders;
    switch (location) {
        case 'test':
            csvArrIndex = CSVFiles.findIndex(file => file.includes('test'));
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
        case 'ag-park-east-smp':
            csvArrIndex = CSVFiles.findIndex(file => file.includes('Agri-Park_East_SMP_Data'));
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
            csvArrIndex = CSVFiles.findIndex(file => file.includes('Agri-Park_East_Pump_Data'));
            csvHeaders = [
                'date',
                'flow_total_1',
                'avg_flow_1'
            ];
            break;
        case 'ag-park-west-unified':
            csvArrIndex = CSVFiles.findIndex(file => file.includes('Agri-Park_West_Unified'));
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
            csvArrIndex = CSVFiles.findIndex(file => file.includes('Balthazar_Prunes'));
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
            csvArrIndex = CSVFiles.findIndex(file => file.includes('Balthazar_Walnuts'));
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
            csvArrIndex = CSVFiles.findIndex(file => file.includes('Buttehouse_Prunes'));
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
            csvArrIndex = CSVFiles.findIndex(file => file.includes('Buttehouse_WS'));
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
            csvArrIndex = CSVFiles.findIndex(file => file.includes('Home_Walnuts_WS'));
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
            csvArrIndex = CSVFiles.findIndex(file => file.includes('Lynn'));
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
            csvArrIndex = CSVFiles.findIndex(file => file.includes('Meridian'));
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
            csvArrIndex = CSVFiles.findIndex(file => file.includes('Sanders_East_Data'));
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
            csvArrIndex = CSVFiles.findIndex(file => file.includes('Sanders_Middle'));
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
            csvArrIndex = CSVFiles.findIndex(file => file.includes('South_Sommers'));
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
            csvArrIndex = CSVFiles.findIndex(file => file.includes('Sanders_Pump'));
            csvHeaders = [
                'date',
                'pressure_on_or_off_1',
                'pressure_on_or_off_2'
            ];
            break;
        //returns empty for now
        case 'ag-park-west-pump':
            csvArrIndex = CSVFiles.findIndex(file => file.includes('Agri-Park_West'));
            csvHeaders = [
                'date',
                'flow_total_1',
                'avg_flow_1'
            ];
            break; //returned empty data
        default:
            return res.send('Invalid location sent');
    }
    res.locals.targetCSV = CSVFiles[csvArrIndex];
    res.locals.csvHeaders = csvHeaders;
    next();
}