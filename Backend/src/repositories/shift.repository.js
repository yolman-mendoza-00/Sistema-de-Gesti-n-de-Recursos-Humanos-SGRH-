const { poolPromise } = require('../config/database');

const getAll = async () => {
    const pool = await poolPromise;

    const result = await pool.request().query(`
        SELECT
            ShiftID AS shiftId,
            Name AS name,
            StartTime AS startTime,
            EndTime AS endTime,
            ModifiedDate AS modifiedDate
        FROM HumanResources.Shift
        ORDER BY ShiftID;
    `);

    return result.recordset;
};

const update = async (id, data) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input('id', id)
        .input('startTime', data.startTime)
        .input('endTime', data.endTime)
        .query(`
            UPDATE HumanResources.Shift
            SET
                StartTime = @startTime,
                EndTime = @endTime,
                ModifiedDate = GETDATE()
            WHERE ShiftID = @id;

            SELECT
                ShiftID AS shiftId,
                Name AS name,
                StartTime AS startTime,
                EndTime AS endTime,
                ModifiedDate AS modifiedDate
            FROM HumanResources.Shift
            WHERE ShiftID = @id;
        `);

    return result.recordset[0];
};

const getEmployeesByShift = async (shiftId) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input('shiftId', shiftId)
        .query(`
            SELECT
                e.BusinessEntityID AS employeeId,
                CONCAT(p.FirstName, ' ', p.LastName) AS employeeName,
                e.NationalIDNumber,
                e.JobTitle,
                d.DepartmentID AS departmentId,
                d.Name AS departmentName,
                s.ShiftID AS shiftId,
                s.Name AS shiftName,
                s.StartTime AS startTime,
                s.EndTime AS endTime,
                edh.StartDate AS startDate
            FROM HumanResources.EmployeeDepartmentHistory AS edh

            INNER JOIN HumanResources.Employee AS e
                ON edh.BusinessEntityID = e.BusinessEntityID

            INNER JOIN Person.Person AS p
                ON e.BusinessEntityID = p.BusinessEntityID

            INNER JOIN HumanResources.Department AS d
                ON edh.DepartmentID = d.DepartmentID

            INNER JOIN HumanResources.Shift AS s
                ON edh.ShiftID = s.ShiftID

            WHERE edh.ShiftID = @shiftId
              AND edh.EndDate IS NULL
              AND e.CurrentFlag = 1

            ORDER BY e.BusinessEntityID;
        `);

    return result.recordset;
};

const create = async (data) => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input('name', data.name)
        .input('startTime', data.startTime)
        .input('endTime', data.endTime)
        .query(`
            INSERT INTO HumanResources.Shift
            (
                Name,
                StartTime,
                EndTime,
                ModifiedDate
            )
            VALUES
            (
                @name,
                @startTime,
                @endTime,
                GETDATE()
            );

            SELECT
                ShiftID AS shiftId,
                Name AS name,
                StartTime AS startTime,
                EndTime AS endTime,
                ModifiedDate AS modifiedDate
            FROM HumanResources.Shift
            WHERE ShiftID = SCOPE_IDENTITY();
        `);

    return result.recordset[0];
};

module.exports = {
    getAll,
    update,
    getEmployeesByShift,
    create
};