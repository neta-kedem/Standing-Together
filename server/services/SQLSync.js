const mysql = require('mysql');
const Circle = require('../models/circleModel');
const City = require('../models/cityModel');
const Activist = require('../models/activistModel');
const ContactScan = require('../models/contactScanModel');
const EventCategory = require('../models/eventCategoryModel');
const Event = require('../models/eventModel');

const schemas = [
    {tableName: "circle", model: Circle, lastUpdate: "metadata.lastUpdate"},
    {tableName: "city", model: City, lastUpdate: "metadata.lastUpdate"},
    {tableName: "activist", model: Activist, lastUpdate: "metadata.lastUpdate"},
    {tableName: "contact_scan", model: ContactScan, lastUpdate: "metadata.lastUpdate"},
    {tableName: "event_category", model: EventCategory, lastUpdate: "metadata.lastUpdate"},
    {tableName: "event", model: Event, lastUpdate: "metadata.lastUpdate"},

];
const SYNC_LAST_HOURS = 240;
const QUERY_INSERT_LIMIT = 100;
const connectionConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
};

const fetchUpdated = function(syncAll = false){
    let updated = [];
    const now = new Date();
    const updateCutoff = new Date(now.getTime() - SYNC_LAST_HOURS * 3600000);
    const toSyncQuery = syncAll ? {} : {"metadata.lastUpdate": {$gt: updateCutoff}};
    for(let i = 0; i < schemas.length; i++){
        let schema = schemas[i];
        const query = schema.model.find(toSyncQuery);
        updated.push(query.exec());
    }
    return Promise.all(updated);
};
const generateSQLQuery = function(updated, emptyFirst){
    let queries = [];
    for(let i = 0; i < schemas.length; i++){
        //the current schema for which an update query is generated
        let schema = schemas[i];
        //empty tables if attempting a full sync
        if(emptyFirst)
            queries.push("DELETE FROM " + schema.tableName + ";");

        //if the collection matching the schema contains recently updated rows
        if(!updated[i] || !updated[i].length)
            continue;
        //accumulate the VALUES part of the insert query
        let values = [];
        let query = "";
        for(let j = 0; j < updated[i].length; j++)
        {
            //avoid including too many inserts in a single query
            if(j % QUERY_INSERT_LIMIT === 0){
                //close of last query (don't close if this is the very first iteration, and the query string is empty
                if(query.length){
                    query +=  values.join(", ") + "ON DUPLICATE KEY UPDATE data = VALUES(data);";
                    queries.push(query);
                    query = "";
                }
                values = [];
                query += "INSERT INTO "+schema.tableName+" (id, data) VALUES ";
            }
            values.push("('" + updated[i][j]._id + "', ''" + mysql.escape(JSON.stringify(updated[i][j])) + "'')");
        }
        query +=  values.join(", ") + "ON DUPLICATE KEY UPDATE data = VALUES(data);";
        queries.push(query);
    }
    return queries;
};

const updateMysql = function(queries){
    const con = mysql.createConnection(connectionConfig);
    con.connect((err) => {
        if(err){
            console.log(err);
            return;
        }
        for(let i = 0; i < queries.length; i++){
            con.query(queries[i], (err)=> {
                console.log(err);
                console.log("done");
            });
        }
        con.end();
    });
};

const sync = function(){
    return fetchUpdated().then((results)=>{
        updateMysql(generateSQLQuery(results));
        return true;
    })
};
const syncAll = function(){
    return fetchUpdated(true).then((results)=>{
        updateMysql(generateSQLQuery(results, true));
        return true;
    })
};

module.exports = {
    sync,
    syncAll
};