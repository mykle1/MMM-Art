/* Magic Mirror
 * Module: MMM-Art
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getArt: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).artObjects; // Parsing an array
			//	console.log(response.statusCode + result);
                    this.sendSocketNotification('ART_RESULT', result);
		
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_ART') {
            this.getArt(payload);
        }
    }
});
