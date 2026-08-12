const { poolPromise } = require('../config/database');

const getAll = async () => {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT
            e.BusinessEntityID AS id,
            CONCAT(p.FirstName, ' ', p.LastName) AS name,
            e.NationalIDNumber AS nationalId,
            e.OrganizationLevel AS organizationLevel,
            e.JobTitle AS jobTitle,
            e.BirthDate AS birthDate,
            e.HireDate AS hireDate,
            e.VacationHours AS vacationHours,
            e.SickLeaveHours AS sickLeaveHours
        FROM HumanResources.Employee AS e
        INNER JOIN Person.Person AS p
            ON e.BusinessEntityID = p.BusinessEntityID
        ORDER BY e.BusinessEntityID;
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
                e.BusinessEntityID AS id,
                CONCAT(p.FirstName, ' ', p.LastName) AS name,
                e.NationalIDNumber AS nationalId,
                e.OrganizationLevel AS organizationLevel,
                e.JobTitle AS jobTitle,
                e.BirthDate AS birthDate,
                e.HireDate AS hireDate,
                e.VacationHours AS vacationHours,
                e.SickLeaveHours AS sickLeaveHours
            FROM HumanResources.Employee AS e
            INNER JOIN Person.Person AS p
                ON e.BusinessEntityID = p.BusinessEntityID
            WHERE e.BusinessEntityID = @id;
        `);

    return result.recordset[0];
};

const update = async (id, data) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input('id', id)
        .input('jobTitle', data.jobTitle)
        .input('hireDate', data.hireDate)
        .input('vacationHours', data.vacationHours)
        .input('sickLeaveHours', data.sickLeaveHours)
        .query(`
            UPDATE HumanResources.Employee
            SET
                JobTitle = @jobTitle,
                HireDate = @hireDate,
                VacationHours = @vacationHours,
                SickLeaveHours = @sickLeaveHours,
                ModifiedDate = GETDATE()
            WHERE BusinessEntityID = @id;

            SELECT
                e.BusinessEntityID AS id,
                CONCAT(p.FirstName, ' ', p.LastName) AS name,
                e.NationalIDNumber AS nationalId,
                e.OrganizationLevel AS organizationLevel,
                e.JobTitle AS jobTitle,
                e.BirthDate AS birthDate,
                e.HireDate AS hireDate,
                e.VacationHours AS vacationHours,
                e.SickLeaveHours AS sickLeaveHours
            FROM HumanResources.Employee AS e
            INNER JOIN Person.Person AS p
                ON e.BusinessEntityID = p.BusinessEntityID
            WHERE e.BusinessEntityID = @id;
        `);

    return result.recordset[0];
};

module.exports = {
    getAll,
    getById,
    update
};