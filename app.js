var VIDEO_CONTROL = document.getElementById('vidHLS');
var BITRATE_CONTROL = document.getElementById('ddlOptions');

var newHls = null;

$(document).ready(function () {
    $("#btnLoad").click(function () {

        if (newHls != null) {
            newHls.Desrtoy();
        }

        var url = $("#txtURL").val();
        var bitrate = $(BITRATE_CONTROL).val();

        newHls = new myHls(VIDEO_CONTROL, bitrate, url);
        newHls.Play();
    });

    $("#ddlOptions").change(function () {
        var bitrate = $(BITRATE_CONTROL).val();

        if (newHls != null) {
            newHls.ChangeLevel(bitrate);
        }
    });
});

var myHls = function (VideoControl, Bitrate, Url) {
    var _video = VideoControl;
    var _bitrate = Bitrate;
    var _url = Url;

    var _IsHLS = function () {
        var ext = (_url.substring(0, 1) === '.' ? '' : _url.split('.').slice(1).pop() || '');
        return (ext === 'm3u8');
    }

    var _obj = null;

    function _Play() {

        if (_IsHLS()) {
            if (typeof (Hls) === 'undefined') throw new Error('hls.js not loaded');
            _obj = new Hls();

            if (Hls.isSupported()) {
                _obj.loadSource(_url);
                _obj.attachMedia(_video);

                _obj.on(Hls.Events.MANIFEST_PARSED, function () {
                    _video.play();
                    _ChangeLevel(_bitrate);
                });
            }
        }
        else {
            if (typeof (Dash) === 'undefined') throw new Error('dash.js not loaded');
            var context = new Dash.di.DashContext();

            _obj = new MediaPlayer(context);
            _obj.startup();
            _obj.setAutoPlay(true);
            _obj.attachView(_video);
            _obj.attachSource(_url);
            //_obj.setAutoSwitchQuality(true);
            _ChangeLevel(_bitrate);
        }
    }

    function _ChangeLevel(level) {
        if (_IsHLS()) {
            _obj.loadLevel = level;
        }
        else {
            _obj.setAutoSwitchQuality(false);
            _obj.setQualityFor('video', parseInt(level));
        }
    }

    function _Desrtoy() {
        if (_IsHLS()) {
            _obj.destroy();
        }
        else {
            _obj.reset();
        }
    }

    return {
        Play: _Play,
        ChangeLevel: _ChangeLevel,
        Desrtoy: _Desrtoy
    }
}