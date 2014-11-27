glitchit.Base64ImageGlitcher = $.Class.extend({
    to_base64: function (buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[ i ]);
        }
        return window.btoa(binary);
    },

    to_buffer: function (base64_value) {
        var binary_string = window.atob(base64_value);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++)        {
            var ascii = binary_string.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    },

    glitch: function (imageData, iteration) {
        iteration = iteration || 0;
        var indicator = 'base64,',
            parts = imageData.split(indicator),
            data = this.to_buffer(parts[1]),
            prefix = parts[0] + indicator;
            
        for (var i=0; i < data.length; i++) {
            if (i>(data.length/20) && i < (data.length/3)) {
                data[i] = data[i+50]
            }
            
        }

        var glitched = prefix + this.to_base64(data);

        if (iteration < (Math.random() * 10)) {
            return this.glitch(glitched, iteration + 1)
        }
        
        return glitched;
    }
});