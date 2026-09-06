const { poolPromise } = require('../config/database');

const getAll = async () => {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT
            jc.JobCandidateID AS jobCandidateId,
            jc.BusinessEntityID AS businessEntityId,
            CONCAT(p.FirstName, ' ', p.LastName) AS employeeName,
            jc.Resume AS resume,
            jc.ModifiedDate AS modifiedDate
        FROM HumanResources.JobCandidate AS jc
        LEFT JOIN Person.Person AS p
            ON jc.BusinessEntityID = p.BusinessEntityID
        ORDER BY jc.JobCandidateID;
    `);

    return result.recordset;
};

const getById = async (id) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input('id', id)
        .query(`
            SELECT
                jc.JobCandidateID AS jobCandidateId,
                jc.BusinessEntityID AS businessEntityId,
                CONCAT(p.FirstName, ' ', p.LastName) AS employeeName,
                jc.Resume AS resume,
                jc.ModifiedDate AS modifiedDate
            FROM HumanResources.JobCandidate AS jc
            LEFT JOIN Person.Person AS p
                ON jc.BusinessEntityID = p.BusinessEntityID
            WHERE jc.JobCandidateID = @id;
        `);

    return result.recordset[0];
};

const create = async (data) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input('businessEntityId', data.businessEntityId || null)
        .input('resume', data.resume)
        .query(`
            INSERT INTO HumanResources.JobCandidate
            (
                BusinessEntityID,
                Resume,
                ModifiedDate
            )
            VALUES
            (
                @businessEntityId,
                @resume,
                GETDATE()
            );

            SELECT
                JobCandidateID AS jobCandidateId,
                BusinessEntityID AS businessEntityId,
                Resume AS resume,
                ModifiedDate AS modifiedDate
            FROM HumanResources.JobCandidate
            WHERE JobCandidateID = SCOPE_IDENTITY();
        `);

    return result.recordset[0];
};

const update = async (id, data) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input('id', id)
        .input('businessEntityId', data.businessEntityId || null)
        .input('resume', data.resume)
        .query(`
            UPDATE HumanResources.JobCandidate
            SET
                BusinessEntityID = @businessEntityId,
                Resume = @resume,
                ModifiedDate = GETDATE()
            WHERE JobCandidateID = @id;

            SELECT
                JobCandidateID AS jobCandidateId,
                BusinessEntityID AS businessEntityId,
                Resume AS resume,
                ModifiedDate AS modifiedDate
            FROM HumanResources.JobCandidate
            WHERE JobCandidateID = @id;
        `);

    return result.recordset[0];
};

const getByJobTitle = async (jobTitle) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input('jobTitle', `%${jobTitle}%`)
        .query(`
            SELECT
                jc.JobCandidateID AS jobCandidateId,
                jc.BusinessEntityID AS businessEntityId,
                CONCAT(p.FirstName, ' ', p.LastName) AS employeeName,
                jc.Resume AS resume,
                jc.ModifiedDate AS modifiedDate
            FROM HumanResources.JobCandidate AS jc

            LEFT JOIN Person.Person AS p
                ON jc.BusinessEntityID = p.BusinessEntityID

            WHERE CAST(jc.Resume AS NVARCHAR(MAX)) LIKE @jobTitle

            ORDER BY jc.JobCandidateID;
        `);

    return result.recordset;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    getByJobTitle
};