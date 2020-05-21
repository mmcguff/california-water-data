const fs = require('fs');
const path = require('path');

module.exports = async (req, res, next) => {
    const CSVFiles = fs.readdirSync(path.join(__dirname, '../jainLogicData'));
    const location = req.params.location;
    let csvArrIndex;
    switch (location) {
        case 'ag-park-east-pump': csvArrIndex = CSVFiles.findIndex(file => file.includes('Agri-Park_East_Pump_Data')); break;
        case 'ag-park-east-smp': csvArrIndex = CSVFiles.findIndex(file => file.includes('Agri-Park_East_SMP_Data')); break;
        //case 'ag-park-west-pump': csvArrIndex = CSVFiles.findIndex(file => file.includes('Agri-Park_West')); break; //returned empty data
        case 'ag-park-west-unified': csvArrIndex = CSVFiles.findIndex(file => file.includes('Agri-Park_West_Unified')); break;
        case 'balthazar-prunes-smp': csvArrIndex = CSVFiles.findIndex(file => file.includes('Balthazar_Prunes')); break;
        case 'balthazar-walnuts-smp': csvArrIndex = CSVFiles.findIndex(file => file.includes('Balthazar_Walnuts')); break;
        case 'buttehouse-prunes-nw': csvArrIndex = CSVFiles.findIndex(file => file.includes('Buttehouse_Prunes')); break;
        case 'buttehouse-ws': csvArrIndex = CSVFiles.findIndex(file => file.includes('Buttehouse_WS')); break;
        case 'home-walnuts-ws': csvArrIndex = CSVFiles.findIndex(file => file.includes('Home_Walnuts_WS')); break;
        case 'lynna-s-block-ws': csvArrIndex = CSVFiles.findIndex(file => file.includes('Lynn')); break;
        case 'meridian-walnuts-ws': csvArrIndex = CSVFiles.findIndex(file => file.includes('Meridian')); break;
        case 'sanders-e': csvArrIndex = CSVFiles.findIndex(file => file.includes('Sanders_East_Data')); break;
        case 'sanders-m-ws': csvArrIndex = CSVFiles.findIndex(file => file.includes('Sanders_Middle')); break;
        //case 'sanders-pump': csvArrIndex = CSVFiles.findIndex(file => file.includes('Sanders_Pump')); break; //duplication data issue
        case 'south-sommers': csvArrIndex = CSVFiles.findIndex(file => file.includes('South_Sommers')); break;
        case 'test': csvArrIndex = CSVFiles.findIndex(file => file.includes('test')); break;
        default:
            return res.send('Invalid location sent');
    }
    res.locals.targetCSV = CSVFiles[csvArrIndex];
    next();
}