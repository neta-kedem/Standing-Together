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
    host: "localhost",
    user: "root",
    password: "",
    database: "StandingTogether"
};


const fetchUpdated = function(){
    let updated = [];
    const now = new Date();
    const updateCutoff = new Date(now.getTime() - SYNC_LAST_HOURS * 3600000);
    for(let i = 0; i < schemas.length; i++){
        let schema = schemas[i];
        const query = schema.model.find({"metadata.lastUpdate": {$gt: updateCutoff}});
        updated.push(query.exec());
    }
    return Promise.all(updated);
};
const generateSQLQuery = function(updated){
    let queries = [];
    for(let i = 0; i < schemas.length; i++){
        //if the collection matching the schema contains recently updated rows
        if(!updated[i] || !updated[i].length)
            continue;
        //the current schema for which an update query is generated
        let schema = schemas[i];
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
                }
                let values = [];
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
    console.log(queries);
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

module.exports = {
    sync
};