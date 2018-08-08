module.exports = {
  isJsonString: function(str, res) {
  try {
    JSON.parse(str);
  } catch (e) {
    console.log(e);
    res.status(418, e).end();
  }
  return JSON.parse(str);
},

  nameToUrl: function(str) {
    return str.replace(/[^a-zA-Z ]/g, "").replace(/\W/g, '-')    
  }
}
