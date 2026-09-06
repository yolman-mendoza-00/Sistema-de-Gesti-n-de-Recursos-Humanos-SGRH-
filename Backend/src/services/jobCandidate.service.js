const jobCandidateRepository = require('../repositories/jobCandidate.repository');

const getJobCandidates = async () => {
    return await jobCandidateRepository.getAll();
};

const getJobCandidateById = async (id) => {
    const candidate = await jobCandidateRepository.getById(id);

    if (!candidate) {
        throw new Error('Candidato no encontrado');
    }

    return candidate;
};

const createJobCandidate = async (data) => {
    if (!data.resume) {
        throw new Error('El resume del candidato es obligatorio');
    }

    return await jobCandidateRepository.create(data);
};

const updateJobCandidate = async (id, data) => {
    const candidate = await jobCandidateRepository.getById(id);

    if (!candidate) {
        throw new Error('Candidato no encontrado');
    }

    if (!data.resume) {
        throw new Error('El resume del candidato es obligatorio');
    }

    return await jobCandidateRepository.update(id, data);
};
const getJobCandidatesByJobTitle = async (jobTitle) => {
    if (!jobTitle) {
        throw new Error('El puesto es obligatorio');
    }

    return await jobCandidateRepository.getByJobTitle(jobTitle);
};

module.exports = {
    getJobCandidates,
    getJobCandidateById,
    createJobCandidate,
    updateJobCandidate,
    getJobCandidatesByJobTitle
};