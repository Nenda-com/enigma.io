const fetch = require("node-fetch");
const debug = require("debug")("end-user-service");

const getUsers = async ({ url, bearerToken, limit = undefined }) => {
  let records = [];
  let keepGoing = true;
  let page = 1;
  while (keepGoing) {
    let response = await fetch(`${url}?pageNumber=${page}` + (limit ? `&pageSize=${(limit < 100 ? limit : 100)}` : ''), {
      headers: { Authorization: `Basic ${bearerToken}` }
    });
    let json = await response.json();
    if (response.ok) {
      await records.push.apply(records, json.endUsers);
      page += 1;
      if (json.endUsers.length === 0 || (limit && records >= limit)) {
        keepGoing = false;
        return records;
      }
    } else {
      throw json.message;
    }
  }
};

const getUser = async ({ url, bearerToken }) => {
  const response = await fetch(url, {
    headers: { Authorization: `Basic ${bearerToken}` }
  });
  const user = await response.json();
  return user;
};

module.exports = {
  getUsers,
  getUser
};