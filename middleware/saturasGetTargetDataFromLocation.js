

module.exports = async(req, res, next) => {

     
    //validate location
    const location = req.params.location;
    switch(location){
        case 'canal':
            console.log('canal location');
            break;
        case 'poundstone':
            console.log('poundstone location');
            break;
        default: 
            return res.send(`${location} is an invalid :location sent for /saturas/:location/:type.  "canal" and "poundstone" are the only valid options right now.`);
    }

    const type = req.params.type;
    switch(type){
        case 'plot':
            console.log('plot data');
            break;
        case 'transmitor':
            console.log('transmitor data');
            break;
        case 'sensor':
            console.log('sensor data');
            break;
        default: 
            return res.send(`${type} is an invalid :type sent for /saturas/:location/:type.  "plot","transmitor", and "sensor" are the only valid options right now.`);
    }


    next();
}