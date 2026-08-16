const sql = require('mssql');
const { poolPromise } = require('../config/database');

const getAll = async () => {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT
            edh.BusinessEntityID AS employeeId,
            CONCAT(p.FirstName, ' ', p.LastName) AS employeeName,
            edh.DepartmentID AS departmentId,
            d.Name AS departmentName,
            edh.ShiftID AS shiftId,
            edh.StartDate AS startDate,
            edh.EndDate AS endDate
        FROM HumanResources.EmployeeDepartmentHistory AS edh

        INNER JOIN Person.Person AS p
            ON edh.BusinessEntityID = p.BusinessEntityID

        INNER JOIN HumanResources.Department AS d
            ON edh.DepartmentID = d.DepartmentID

        ORDER BY edh.BusinessEntityID, edh.StartDate;
    `);

    return result.recordset;
};


const getByEmployeeId = async (employeeId) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input('employeeId', employeeId)
        .query(`
            SELECT
                edh.BusinessEntityID AS employeeId,
                CONCAT(p.FirstName, ' ', p.LastName) AS employeeName,
                edh.DepartmentID AS departmentId,
                d.Name AS departmentName,
                edh.ShiftID AS shiftId,
                edh.StartDate AS startDate,
                edh.EndDate AS endDate
            FROM HumanResources.EmployeeDepartmentHistory AS edh

            INNER JOIN Person.Person AS p
                ON edh.BusinessEntityID = p.BusinessEntityID

            INNER JOIN HumanResources.Department AS d
                ON edh.DepartmentID = d.DepartmentID

            WHERE edh.BusinessEntityID = @employeeId

            ORDER BY edh.StartDate DESC;
        `);

    return result.recordset;
};


const create = async (data) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input('employeeId', data.employeeId)
        .input('departmentId', data.departmentId)
        .input('shiftId', data.shiftId)
        .input('startDate', data.startDate)
        .query(`
            INSERT INTO HumanResources.EmployeeDepartmentHistory
            (
                BusinessEntityID,
                DepartmentID,
                ShiftID,
                StartDate
            )
            VALUES
            (
                @employeeId,
                @departmentId,
                @shiftId,
                @startDate
            );

            SELECT
                edh.BusinessEntityID AS employeeId,
                CONCAT(p.FirstName, ' ', p.LastName) AS employeeName,
                edh.DepartmentID AS departmentId,
                d.Name AS departmentName,
                edh.ShiftID AS shiftId,
                edh.StartDate AS startDate,
                edh.EndDate AS endDate
            FROM HumanResources.EmployeeDepartmentHistory AS edh

            INNER JOIN Person.Person AS p
                ON edh.BusinessEntityID = p.BusinessEntityID

            INNER JOIN HumanResources.Department AS d
                ON edh.DepartmentID = d.DepartmentID

            WHERE edh.BusinessEntityID = @employeeId
            AND edh.StartDate = @startDate
            AND edh.DepartmentID = @departmentId
            AND edh.ShiftID = @shiftId;
        `);

    return result.recordset[0];
};


const closeCurrentAssignment = async (employeeId, endDate) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input('employeeId', employeeId)
        .input('endDate', endDate)
        .query(`
            UPDATE HumanResources.EmployeeDepartmentHistory
            SET
                EndDate = @endDate,
                ModifiedDate = GETDATE()
            WHERE BusinessEntityID = @employeeId
            AND EndDate IS NULL;

            SELECT
                edh.BusinessEntityID AS employeeId,
                CONCAT(p.FirstName, ' ', p.LastName) AS employeeName,
                edh.DepartmentID AS departmentId,
                d.Name AS departmentName,
                edh.ShiftID AS shiftId,
                edh.StartDate AS startDate,
                edh.EndDate AS endDate
            FROM HumanResources.EmployeeDepartmentHistory AS edh

            INNER JOIN Person.Person AS p
                ON edh.BusinessEntityID = p.BusinessEntityID

            INNER JOIN HumanResources.Department AS d
                ON edh.DepartmentID = d.DepartmentID

            WHERE edh.BusinessEntityID = @employeeId
            AND edh.EndDate = @endDate;
        `);

    return result.recordset[0];
};



const changeDepartment = async (employeeId, data) => {
    const pool = await poolPromise;

    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        // 1. Cerrar departamento actual
        await transaction
            .request()
            .input('employeeId', employeeId)
            .input('endDate', data.startDate)
            .query(`
                UPDATE HumanResources.EmployeeDepartmentHistory
                SET
                    EndDate = @endDate,
                    ModifiedDate = GETDATE()
                WHERE BusinessEntityID = @employeeId
                  AND EndDate IS NULL;
            `);

        // 2. Crear nueva asignación
        const result = await transaction
            .request()
            .input('employeeId', employeeId)
            .input('departmentId', data.departmentId)
            .input('shiftId', data.shiftId)
            .input('startDate', data.startDate)
            .query(`
                INSERT INTO HumanResources.EmployeeDepartmentHistory
                (
                    BusinessEntityID,
                    DepartmentID,
                    ShiftID,
                    StartDate
                )
                VALUES
                (
                    @employeeId,
                    @departmentId,
                    @shiftId,
                    @startDate
                );

                SELECT
                    edh.BusinessEntityID AS employeeId,
                    CONCAT(p.FirstName, ' ', p.LastName) AS employeeName,
                    edh.DepartmentID AS departmentId,
                    d.Name AS departmentName,
                    edh.ShiftID AS shiftId,
                    edh.StartDate AS startDate,
                    edh.EndDate AS endDate
                FROM HumanResources.EmployeeDepartmentHistory AS edh

                INNER JOIN Person.Person AS p
                    ON edh.BusinessEntityID = p.BusinessEntityID

                INNER JOIN HumanResources.Department AS d
                    ON edh.DepartmentID = d.DepartmentID

                WHERE edh.BusinessEntityID = @employeeId
                AND edh.StartDate = @startDate
                AND edh.EndDate IS NULL;
            `);

        await transaction.commit();

        return result.recordset[0];

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    getAll,
    getByEmployeeId,
    create,
    closeCurrentAssignment,
    changeDepartment
};