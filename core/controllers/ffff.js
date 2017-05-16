const sql = require('mssql');


const pool = sql.connect('mssql://sa:123@localhost/SN_DATABASE',function(err){
    console.log(err)
    const request = new sql.Request()
    request.stream = true // You can set streaming differently for each request
    request.query('select * from SN_TABLE') // or request.execute(procedure)

    request.on('recordset', function(columns ) {
        // Emitted once for each recordset in a query
        console.log('columns')
        console.log(columns)
    })

    request.on('row', function(row) {
        console.log('row')
        console.log(row)
        // Emitted for each row in a recordset
    })

    request.on('error', function(err ) {
        // May be emitted multiple times
    })

    request.on('done',function( result ) {
        console.log('DONE')
        console.log(result)
        // Always emitted as the last one
    })

})
