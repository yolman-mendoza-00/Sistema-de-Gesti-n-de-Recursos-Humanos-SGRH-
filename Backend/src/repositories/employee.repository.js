const { poolPromise } = require('../config/database');

const getAll = async () => {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT
            BusinessEntityID,
            NationalIDNumber,
            LoginID,
            JobTitle,
            BirthDate,
            MaritalStatus,
            Gender,
            HireDate,
            SalariedFlag,
            VacationHours,
            SickLeaveHours,
            CurrentFlag
        FROM HumanResources.Employee
        ORDER BY BusinessEntityID
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
                BusinessEntityID,
                NationalIDNumber,
                LoginID,
                JobTitle,
                BirthDate,
                MaritalStatus,
                Gender,
                HireDate,
                SalariedFlag,
                VacationHours,
                SickLeaveHours,
                CurrentFlag
            FROM HumanResources.Employee
            WHERE BusinessEntityID = @id
        `);

    return result.recordset[0];
};

const update = async (id, data) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input('id', id)
        .input('jobTitle', data.jobTitle)
        .input('maritalStatus', data.maritalStatus)
        .input('gender', data.gender)
        .input('hireDate', data.hireDate)
        .input('salariedFlag', data.salariedFlag)
        .input('vacationHours', data.vacationHours)
        .input('sickLeaveHours', data.sickLeaveHours)
        .input('currentFlag', data.currentFlag)
        .query(`
            UPDATE HumanResources.Employee
            SET
                JobTitle = @jobTitle,
                MaritalStatus = @maritalStatus,
                Gender = @gender,
                HireDate = @hireDate,
                SalariedFlag = @salariedFlag,
                VacationHours = @vacationHours,
                SickLeaveHours = @sickLeaveHours,
                CurrentFlag = @currentFlag,
                ModifiedDate = GETDATE()
            WHERE BusinessEntityID = @id;

            SELECT
                BusinessEntityID,
                NationalIDNumber,
                LoginID,
                JobTitle,
                BirthDate,
                MaritalStatus,
                Gender,
                HireDate,
                SalariedFlag,
                VacationHours,
                SickLeaveHours,
                CurrentFlag,
                ModifiedDate
            FROM HumanResources.Employee
            WHERE BusinessEntityID = @id;
        `);

    return result.recordset[0];
};

module.exports = {
    getAll,
    getById,
    update
};