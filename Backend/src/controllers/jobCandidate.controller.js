const jobCandidateService = require('../services/jobCandidate.service');

const getJobCandidates = async (req, res) => {
    try {
        const candidates = await jobCandidateService.getJobCandidates();

        res.status(200).json(candidates);

    } catch (error) {
        console.error('Error al obtener los candidatos:', error);

        res.status(500).json({
            message: 'Error al obtener los candidatos'
        });
    }
};

const getJobCandidateById = async (req, res) => {
    try {
        const { id } = req.params;

        const candidate =
            await jobCandidateService.getJobCandidateById(id);

        res.status(200).json(candidate);

    } catch (error) {
        console.error('Error al obtener el candidato:', error);

        if (error.message === 'Candidato no encontrado') {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al obtener el candidato'
        });
    }
};

const createJobCandidate = async (req, res) => {
    try {
        const { businessEntityId, resume } = req.body;

        const candidate = await jobCandidateService.createJobCandidate({
            businessEntityId,
            resume
        });

        res.status(201).json({
            message: 'Candidato registrado correctamente',
            candidate
        });

    } catch (error) {
        console.error('Error al registrar el candidato:', error);

        if (error.message === 'El resume del candidato es obligatorio') {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al registrar el candidato'
        });
    }
};

const updateJobCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const { businessEntityId, resume } = req.body;

        const candidate = await jobCandidateService.updateJobCandidate(
            id,
            {
                businessEntityId,
                resume
            }
        );

        res.status(200).json({
            message: 'Candidato actualizado correctamente',
            candidate
        });

    } catch (error) {
        console.error('Error al actualizar el candidato:', error);

        if (error.message === 'Candidato no encontrado') {
            return res.status(404).json({
                message: error.message
            });
        }

        if (error.message === 'El resume del candidato es obligatorio') {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al actualizar el candidato'
        });
    }
};
const getJobCandidatesByJobTitle = async (req, res) => {
    try {
        const { jobTitle } = req.params;

        const candidates =
            await jobCandidateService.getJobCandidatesByJobTitle(jobTitle);

        res.status(200).json(candidates);

    } catch (error) {
        console.error('Error al obtener candidatos por puesto:', error);

        if (error.message === 'El puesto es obligatorio') {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al obtener candidatos por puesto'
        });
    }
};
module.exports = {
    getJobCandidates,
    getJobCandidateById,
    createJobCandidate,
    updateJobCandidate,
    getJobCandidatesByJobTitle
};