glitchit.Base64ImageGlitcher = $.Class.extend({
    glitch: function (imageData) {
        var indicator = 'base64,',
            parts = imageData.split(indicator),
            data = atob(parts[1]),
            prefix = parts[0] + indicator,
            glitchLevel = 33333333;
        for (var i=0; i < data.length; i++) {
            var randomNumber = parseInt(Math.random() * (data.length / glitchLevel));
            if (i % randomNumber == 0) {
                data = data.replaceAt(i, data.charAt(i+1));
            }
        }
        return prefix + btoa(data);
    }
});