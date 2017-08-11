/* Magic Mirror
 * Module: MMM-Art (of the Rijksmuseum, Amsterdam, Netherlands}
 *
 * By Mykle1
 *
 */
Module.register("MMM-Art", {

    // Module config defaults.
    defaults: {
		apiKey: "GOES IN CONFIG FILE",     // Your API key
        rotateInterval: 60 * 1000,         // New artwork rotation.
        useHeader: true,                  // true if you want a header
        header: "Rijksmuseum, Amsterdam, Netherlands",    // Any text you want
        maxWidth: "300px",
        animationSpeed: 3000,
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 60 * 60 * 1000, // 1 hour = 100 pieces per call

    },

    getStyles: function() {
        return ["MMM-Art.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

        // Set locale.
        this.url = "https://www.rijksmuseum.nl/api/en/collection?key=" + this.config.apiKey + "&imgonly&ps=100&format=json";
        this.Art = [];
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {
		
		var apiKey = this.config.apiKey;

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "You have good taste . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


        var ArtKeys = Object.keys(this.Art);
        if (ArtKeys.length > 0) {
            if (this.activeItem >= ArtKeys.length) {
                this.activeItem = 0;
            }
            var Art = this.Art[ArtKeys[this.activeItem]];


            var top = document.createElement("div");
            top.classList.add("list-row");
			
			// the artist
			var artist = document.createElement("div");
            artist.classList.add("small", "bright", "artist");
		//	console.log(Art); // for checking
            artist.innerHTML = "by " + Art.principalOrFirstMaker;
            wrapper.appendChild(artist);
			
			// the artwork
            var pic = document.createElement("div");
            var img = document.createElement("img");
			img.classList.add("photo");	
            img.src = Art.webImage.url;
            pic.appendChild(img);
            wrapper.appendChild(pic);

			// the title, artist, year
            var longTitle = document.createElement("div");
            longTitle.classList.add("xsmall", "bright", "title");
            longTitle.innerHTML = Art.longTitle;
            wrapper.appendChild(longTitle);

        }
        return wrapper;
    },


    processArt: function(data) {
        this.today = data.Today;
        this.Art = data;
    //  console.log(this.Art); checking my data
        this.loaded = true;
    },

    scheduleCarousel: function() {
        console.log("Carousel fucktion of Art!");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getArt();
        }, this.config.updateInterval);
        this.getArt(this.config.initialLoadDelay);
        var self = this;
    },

    getArt: function() {
        this.sendSocketNotification('GET_ART', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "ART_RESULT") {
            this.processArt(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});