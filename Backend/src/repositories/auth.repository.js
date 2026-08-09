const sql = require('mssql');

async function buscarBusinessEntityIdPorEmail(email) {
    const result = await sql.query`
        SELECT BusinessEntityID 
        FROM Person.EmailAddress 
        WHERE EmailAddress = ${email}
    `;
    return result.recordset[0] || null;
}

async function buscarHashPorBusinessEntityId(businessEntityId) {
    const result = await sql.query`
        SELECT PasswordHash 
        FROM Person.Password 
        WHERE BusinessEntityID = ${businessEntityId}
    `;
    return result.recordset[0] || null;
}

module.exports = {
    buscarBusinessEntityIdPorEmail,
    buscarHashPorBusinessEntityId,
};