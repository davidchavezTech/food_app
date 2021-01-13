const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp)
};
helpers.isEqualToOne = (value, options)=>{
    let answer =  value == 1
    return options.fn({ answer })
};
helpers.isEqualToTwo = (value, options)=>{
    let answer =  value == 2
    return options.fn({ answer })
};
helpers.isEqualToThree = (value, options)=>{
    let answer =  value == 3
    return options.fn({ answer })
};
helpers.isEqualToFour = (value, options)=>{
    let answer =  value == 4
    return options.fn({ answer })
};




module.exports = helpers;