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
        return res.status(404).json({"message": `No Fun Facts found for ${state.state}.`});
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

//ALL THE BELOW NEED TO BE REWRITTEN FOR STATES

/*const createNewEmployee = async (req, res) => {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'First and last names are required' });
    }

    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    const result = await employee.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}*/

module.exports = {
    getAllStates,
    getState,
    getStateFunfact,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmissionDate
}