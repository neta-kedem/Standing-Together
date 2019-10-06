const fetch = require('node-fetch');
searchMember = async function (email){
    const url = 'https://us14.api.mailchimp.com/3.0/search-members?query=' + email;
    const promise = fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': process.env.MAILCHIMP_KEY
        },
        credentials: 'same-origin'
    }).then(res => res.json())
        .then(results => {
            if (!results || !results.exact_matches || !results.exact_matches.members)
                return {error: "search error"};
            return results.exact_matches.members.map(m=>{
                return {
                    list_id: m.list_id,
                    status: m.status,
                    profile: m.merge_fields,
                    stats: m.stats,
                    timestamp_opt: m.timestamp_opt,
                    last_changed: m.last_changed
                };
            });
        });
    return promise;
};

module.exports = {
    searchMember
};