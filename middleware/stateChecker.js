const stateList = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", 
                   "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", 
                   "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

const stateChecker = (req, res, next) => {

    const stateAbbr = req.params.code;

    if(stateList.indexOf(stateAbbr) == -1){
        console.log(stateAbbr);
        return res.status(400).json({"message":"Invalid state abbreviation parameter"});
    }
    else{
        next();
    }
}

module.exports = stateChecker;
