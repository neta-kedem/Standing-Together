const getCSV = function(data, fields) {// Name of the downloaded file - e.g. "Download.csv"
    const header = fields.join(", ") + "\n";
    const body = data.map((row)=>{
        return fields.map((f)=>{
            return row[f]
        }).join(", ");
    }).join("\n");
    return header + body;
};
module.exports = {
    getCSV
};