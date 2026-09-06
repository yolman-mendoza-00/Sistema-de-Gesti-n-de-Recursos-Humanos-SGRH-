const express = require('express');
const router = express.Router();

const {
    getJobCandidates,
    getJobCandidateById,
    createJobCandidate,
    updateJobCandidate,
    getJobCandidatesByJobTitle
} = require('../controllers/jobCandidate.controller');

router.get('/', getJobCandidates);
router.get('/:id', getJobCandidateById);
router.post('/', createJobCandidate);
router.patch('/:id', updateJobCandidate);
router.get('/jobTitle/:jobTitle', getJobCandidatesByJobTitle);

module.exports = router;