#!/bin/sh
export MONGOLAB_URI=mongodb://localhost/db1
export NEW_RELIC_LICENSE_KEY=YOUR_LICENSENUMBER_GOES_HERE
service mongodb start
nodejs /src/web.js
