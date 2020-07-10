

module.exports = async(req, res, next) => {

    //validate location
    const location = req.params.location;
    switch(location){
        case 'canal':
        case 'poundstone':
            break;
        default: 
            return res.send(`${location} is an invalid :location sent for /saturas/:location/:type.  "canal" and "poundstone" are the only valid options right now.`);
    }

    //validate type
    const type = req.params.type;
    switch(type){
        case 'plot':
        case 'transmitor':
        case 'sensor':
            break;
        default: 
            return res.send(`${type} is an invalid :type sent for /saturas/:location/:type.  "plot","transmitor", and "sensor" are the only valid options right now.`);
    }

    //set values
    req.res.locals.location = location;
    req.res.locals.type = type;

    next();
}