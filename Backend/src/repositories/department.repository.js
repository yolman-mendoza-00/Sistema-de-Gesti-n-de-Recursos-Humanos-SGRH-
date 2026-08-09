const { poolPromise } = require('../config/database');

const getAll = async () => {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT
            DepartmentID,
            Name,
            GroupName,
            ModifiedDate
        FROM HumanResources.Department
        ORDER BY DepartmentID
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
                DepartmentID,
                Name,
                GroupName,
                ModifiedDate
            FROM HumanResources.Department
            WHERE DepartmentID = @id
        `);

    return result.recordset[0];
};

const update = async (id, data) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input('id', id)
        .input('name', data.name)
        .input('groupName', data.groupName)
        .query(`
            UPDATE HumanResources.Department
            SET
                Name = @name,
                GroupName = @groupName,
                ModifiedDate = GETDATE()
            WHERE DepartmentID = @id;

            SELECT
                DepartmentID,
                Name,
                GroupName,
                ModifiedDate
            FROM HumanResources.Department
            WHERE DepartmentID = @id;
        `);

    return result.recordset[0];
};

module.exports = {
    getAll,
    getById,
    update
};