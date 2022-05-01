const funFact = require('../model/funFact');

const data = {};
data.states = require('../model/states.json');

const getAllStates = async (req, res) => {
    //const states = await states.find();
    //if (!states) return res.status(204).json({ 'message': 'No states found.' });

    const mongoStates =  await funFact.find().exec();

    const contig = req.query.contig;
    
    let statesList = data.states;

    if(contig === "true") {
        statesList = data.states.filter(state => state.code != "HI" && state.code != "AK")
    }
    else if(contig === "false") {
        statesList = data.states.filter(state => state.code === "AK" || state.code === "HI")
    }

    statesList.forEach(state => {
        //1) attempt to find the state from the MongoDB states results
        //2) if the state is in the results, we will attach the 'funfacts' to the state object.

        const stateExists = mongoStates.find(State => State.stateCode === state.code)

        if(stateExists){
            state.funfacts = [...stateExists.funfacts];
        }
    })
    
    return res.json(statesList);
}

const getState = async (req, res) => {

    const stateAbbr = req.params.code.toUpperCase();

    const mongoStates =  await funFact.find().exec();

    const state = data.states.find(state => state.code === stateAbbr);

    const stateExists = mongoStates.find(State => State.stateCode === state.code)

    if(stateExists){
        state.funfacts = [...stateExists.funfacts];
    }

    return res.json(state);
}

const getStateFunfact = async (req, res) => {

    const stateAbbr = req.params.code.toUpperCase();
    const mongoStates =  await funFact.find().exec();

    const state = data.states.find(state => state.code === stateAbbr);

    const stateExists = mongoStates.find(State => State.stateCode === state.code);

    if (!stateExists) {
        return res.status(404).json({"message": `No Fun Facts found for ${state.state}`});
    }
    
    return res.json({"funfact":stateExists.funfacts[[Math.floor(Math.random()*stateExists.funfacts.length)]]});
}

const getStateCapital = async (req, res) => {

    const stateAbbr = req.params.code.toUpperCase();

    const state = data.states.find(state => state.code === stateAbbr);

    return res.json({"state":state.state, "capital":state.capital_city});
}

const getStateNickname = async (req, res) => {

    const stateAbbr = req.params.code.toUpperCase();

    const state = data.states.find(state => state.code === stateAbbr);

    return res.json({"state":state.state, "nickname":state.nickname});
}

const getStatePopulation = async (req, res) => {

    const stateAbbr = req.params.code.toUpperCase();

    const state = data.states.find(state => state.code === stateAbbr);

    return res.json({"state":state.state, "population":state.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")});
}

const getStateAdmissionDate = async (req, res) => {

    const stateAbbr = req.params.code.toUpperCase();

    const state = data.states.find(state => state.code === stateAbbr);

    return res.json({"state":state.state, "admitted":state.admission_date});
}

const createNewFunFact = async (req, res) => {
    /*  
    The request body should have a "funfacts" property with a value that is an array containing one or more fun facts about the state. 
        {
            "funfacts" : ["FACT 1", "FACT 2", "FACT 3"]
        }
    You will want to verify you have received this "funfacts" data. 
    You should also verify this data is provided as an array.
    You will need to find the requested state in your MongoDB collection. 
    If the state already has some fun facts, you should add the new fun facts to them without deleting the pre-existing fun facts. 
    If the state has no pre-existing fun facts, then create a new record in your MongoDB collection with the stateCode and funfacts array.
    */

    if(!req?.body?.funfacts) {
        return res.status(400).json({"message":"State fun facts value required"})
    }

    if(!Array.isArray(req.body.funfacts)) {
        return res.status(400).json({"message":"State fun facts value must be an array"})
    }

    const stateAbbr = req.params.code.toUpperCase();
    const mongoStates =  await funFact.find().exec();

    const data = req.body.funfacts; //array of funfacts provided

    const stateExists = mongoStates.find(State => State.stateCode === stateAbbr);

    if(stateExists){
        //post the new quotes in addition to the existing
        try{

            for(let num = 0; num < data.length; num++) {
                stateExists.funfacts.push(data[num]);
            }

            const result = await stateExists.save();

            res.status(201).json(result);

        } catch (err) {
            console.error(err);
        }
    }
    else {
        //post a new state and new quotes
        try{
            const result = await funFact.create({
                stateCode: stateAbbr,
                funfacts: data
            });

            res.status(201).json(result);
        } catch (err) {
            console.error(err);
        }
    }
}

const updateFunFact = async (req, res) => {
    /*
    We are not replacing the entire record. Therefore, we use PATCH instead of PUT.
    The request body should have a "funfact" property with a value that is a fun fact about the state and 
        there should also be an "index" property (starting at 1, not zero) that indicates the element of the 
        funfacts array to be updated in the funfacts array stored in the MongoDB collection. 
            {
                "funfact":"FACT UPDATE",
                "index":1
            }
    After checking to see if the index value exists, you will want to subtract 1 from the value to match up 
        with the zero index of the array in MongoDB. Why? Zero is equal to false. My suggestion may be easier 
        or you may do it a different way.
    Respond appropriately (see example project) if the index or funfact values are not received.
    You will need to find the specified state in your MongoDB collection. 
    If no fun facts are found or no fun fact is found at the specified element position, send an appropriate 
        response (see example project). 
    Otherwise, set the element at the specified position of the funfacts array to the new value. 
    Save the record and respond with the result received from the model.
    */

    if(!req?.body?.index) {
        return res.status(400).json({"message":"State fun fact index value required"})
    }

    if(!req?.body?.funfact) {
        return res.status(400).json({"message":"State fun fact value required"})
    }

    const stateAbbr = req.params.code.toUpperCase();
    const mongoStates =  await funFact.find().exec();

    const index = req.body.index;
    const factUpdate = req.body.funfact;

    const stateExists = mongoStates.find(State => State.stateCode === stateAbbr);

    const state = data.states.find(state => state.code === stateAbbr);

    if (!stateExists) {
        return res.status(404).json({"message": `No Fun Facts found for ${state.state}`});
    }

    if(index - 1 >= 0 && !stateExists.funfacts[index - 1]) {
        return res.status(404).json({"message": `No Fun Fact found at that index for ${state.state}`});
    }

    if(stateExists){
        try {
            //First filter the array
            stateExists.funfacts.splice(index-1, 1, factUpdate);

            const result = await stateExists.save();

            res.status(200).json(result);

        } catch (err) {
            console.error(err);
        }
    }

} 

const deleteFunFact = async (req, res) => {
    /*
    This request body should have an "index" property. Handle it as described above in the PATCH request suggestions. 
            {
                "index":1
            }
    Again, appropriate responses as noted in the PATCH request, too. 
    You may find filtering an element from an existing array to be the best approach here. You do not want to simply 
        delete an element and leave an undefined value in the array. 
    Afterwards, save the record and respond with the result received from the model.
    */

    if(!req?.body?.index) {
        return res.status(400).json({"message":"State fun fact index value required"})
    }

    const stateAbbr = req.params.code.toUpperCase();
    const mongoStates =  await funFact.find().exec();

    const index = req.body.index;

    const stateExists = mongoStates.find(State => State.stateCode === stateAbbr);

    const state = data.states.find(state => state.code === stateAbbr);

    if (!stateExists) {
        return res.status(404).json({"message": `No Fun Facts found for ${state.state}`});
    }

    if(index - 1 >= 0 && !stateExists.funfacts[index - 1]) {
        return res.status(404).json({"message": `No Fun Fact found at that index for ${state.state}`});
    }

    if(stateExists){
        try {
            //First filter the array
            stateExists.funfacts.splice(index-1, 1);

            const result = await stateExists.save();

            res.status(200).json(result);

        } catch (err) {
            console.error(err);
        }
    }

}

module.exports = {
    getAllStates,
    getState,
    getStateFunfact,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmissionDate,
    createNewFunFact,
    updateFunFact,
    deleteFunFact
}