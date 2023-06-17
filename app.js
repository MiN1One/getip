const express = require('express');
const geoip = require('geoip-country');
var Address6 = require('ip-address').Address6;

const app = express();

app.use(require('cors')());
app.use(require('request-ip').mw());
app.use(express.json());

app.get('/', (req, res, _next) => {
  let ipv6 = req.clientIp;
  let ipv4 = req.clientIp;

  const country = geoip.lookup(ipv4)?.country;

  if (ipv4.includes(':')) {
    const address = new Address6(ipv4);
    ipv4 =  address.inspectTeredo().client4;
  } else {
    var address = Address6.fromAddress4(ipv4);
    address.correctForm();
    ipv6 = address.to4in6();
  }

  res.status(200).json({
    ipv4,
    ipv6,
    country,
  });
});

module.exports = app;