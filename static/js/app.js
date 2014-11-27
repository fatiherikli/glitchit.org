window.glitchit = window.glitchit || {};

glitchit.Application = $.Class.extend({

    GLITCH_PER_MS: 300,

    workspaceSelector: null,

    glitcher: null,
    filters: [],

    searchUrl: "https://api.flickr.com/services/feeds/" +
               "photos_public.gne?jsoncallback=?&format=json",

    init: function (options) {
        $.extend(this, options);
    },

    initializeCanvas: function (imageElement) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');
        canvas.width = imageElement.width();
        canvas.height = imageElement.height();
        context.drawImage(imageElement.get(0), 0, 0);
        return canvas;
    },

    preProcess: function (imageData) {
        return this.glitcher.glitch(imageData);
    },

    postProcess: function (canvas, filters) {
        filters.forEach(function (filter) {
            filter.run(canvas);
        });
    },

    glitch: function (data, filters) {

        var image = $("<img>"),
            workspace = $(this.workspaceSelector);

        // glitch selected image
        var glitchedImageData = this.preProcess(
            data
        );

        image.attr("src", glitchedImageData);

        // attach the element to calculate with and height
        // of selected image. this is the easiest way.
        workspace.append(image);

        // create a canvas to apply selected filters
        var canvas = this.initializeCanvas(image);

        // apply filters
        this.postProcess(canvas, filters);

        // done!
        workspace.html(canvas);

    },

    imageToData: function (img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL("image/jpeg");
},

    loadImage: function (imageUrl, success) {
        var canvas = $(this.workspaceSelector);

        var image = $("<img>", {
            crossorigin: "anonymous",
            src: imageUrl
       });

        canvas.append(image);

        image.on("load", function () {
            success(this.imageToData(image.get(0)));
        }.bind(this));

    },

    render: function () {
        this.findImage(function (imageUrl) {
                this.loadImage(imageUrl, function (data) {
                    setInterval(function () {
                        this.glitch(data, []);
                    }.bind(this), this.GLITCH_PER_MS)
                }.bind(this));
            }.bind(this), function () {
        });
    },

    findImage: function (success, error) {
        var url = this.searchUrl;
        $.getJSON(url, {
            tags: this.keyword
        }, function (response) {
            var randomIndex = Math.floor(Math.random() * response.items.length),
                image = response.items[randomIndex].media.m;
            success(image);
        });
    }

});
