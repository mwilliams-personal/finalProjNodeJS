const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

const stateChecker = require('../../middleware/stateChecker');

router.route('/')
    .get(statesController.getAllStates);

router.route('/:code/funfact')
    .get(stateChecker)
    .get(statesController.getStateFunfact)
    .post(stateChecker)
    .post(statesController.createNewFunFact)
    .patch(stateChecker)
    .patch(statesController.updateFunFact)
    .delete(stateChecker)
    .delete(statesController.deleteFunFact);

router.route('/:code/capital')
    .get(stateChecker)
    .get(statesController.getStateCapital);

router.route('/:code/nickname')
    .get(stateChecker)
    .get(statesController.getStateNickname);

router.route('/:code/population')
    .get(stateChecker)
    .get(statesController.getStatePopulation);

router.route('/:code/admission')
    .get(stateChecker)
    .get(statesController.getStateAdmissionDate);

router.route('/:code')
    .get(stateChecker)
    .get(statesController.getState);

module.exports = router;