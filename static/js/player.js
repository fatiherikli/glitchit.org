!function () {

    window.glitcit = window.glitcit || {};

    glitcit.MusicPlayer = $.Class.extend({

        history: [],

        init: function (options) {
            $.extend(this, options);
        },

        loadVideo: function (response) {
            this.player.loadVideoById(response.youtube_id);
            this.player.playVideo();
        },

        render: function () {
            this.player = this.loadPlayer();
        },

        onPlayerReady: function (event) {
            event.target.playVideo();
        },

        onStateChange: function (event) {
            if (event.data === YT.PlayerState.ENDED){
                this.player.playVideo();
            }
        },

        loadPlayer: function () {
            return new YT.Player('player', {
              height: '100%',
              width: '100%',
              videoId: this.youtubeVideoId,
              events: {
                'onReady': this.onPlayerReady,
                'onStateChange': this.onStateChange.bind(this)
              },
              playerVars: {
                  controls: 0,
                  autohide: 0,
                  showinfo: 0,
                  iv_load_policy: 3
              }
            });
        }
    });

}(window.jQuery);