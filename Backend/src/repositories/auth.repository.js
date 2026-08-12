const sql = require('mssql');

async function buscarUsuarioPorEmail(email) {
    const result = await sql.query`
        SELECT
            e.BusinessEntityID,
            e.JobTitle,
            p.FirstName,
            p.LastName,
            ea.EmailAddress,
            pw.PasswordHash
        FROM Person.EmailAddress AS ea
        INNER JOIN HumanResources.Employee AS e
            ON ea.BusinessEntityID = e.BusinessEntityID
        INNER JOIN Person.Person AS p
            ON e.BusinessEntityID = p.BusinessEntityID
        INNER JOIN Person.Password AS pw
            ON e.BusinessEntityID = pw.BusinessEntityID
        WHERE ea.EmailAddress = ${email}
    `;

    return result.recordset[0] || null;
}

module.exports = {
    buscarUsuarioPorEmail
};