(function () {
    'use strict';
    angular.module('mytodoApp.service').service('ubicacionServices', ubicacionServices);
    ubicacionServices.$inject = ['$q'];

    function ubicacionServices($q) {
        var servicioUbicacion = this;

        var deferred = $q.defer();
        function obtenerIP() {
            var ip_dups = {};
            var RTCPeerConnection = window.RTCPeerConnection
                || window.mozRTCPeerConnection
                || window.webkitRTCPeerConnection;
            var useWebKit = !!window.webkitRTCPeerConnection;

            if (!RTCPeerConnection) {
                var win = iframe.contentWindow;
                RTCPeerConnection = win.RTCPeerConnection
                    || win.mozRTCPeerConnection
                    || win.webkitRTCPeerConnection;
                useWebKit = !!win.webkitRTCPeerConnection;
            }

            var mediaConstraints = {
                optional: [{ RtpDataChannels: true }]
            };
            var servers = undefined;

            if (useWebKit)
                servers = { iceServers: [{ urls: "stun:stun.services.mozilla.com" }] };

            var pc = new RTCPeerConnection(servers, mediaConstraints);

            function handleCandidate(candidate) {
                var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                var ip_addrs = ip_regex.exec(candidate);
                if (ip_addrs && typeof ip_addrs[0] !== 'undefined') {
                    var ip_addr = ip_regex.exec(candidate)[1];

                    ip_dups[ip_addr] = true;
                }
            }

            pc.onicecandidate = function (ice) {
                if (ice.candidate)
                    handleCandidate(ice.candidate.candidate);
            };

            pc.createDataChannel("");

            pc.createOffer(function (result) {

                pc.setLocalDescription(result, function () { }, function () { });

            }, function () { });

            setTimeout(function () {
                var ip_regex = /raddr ([0-9]{1,3}(\.[0-9]{1,3}){3}) rport/;
                var ips = ip_regex.exec(pc.localDescription.sdp);
                if (ips && ips.length > 2) {
                    deferred.resolve(ips[1]);
                } else {
                    deferred.reject();
                }

            }, 1000);
            return deferred.promise;
        }

        return {
            resolve: function () {
                return obtenerIP();
            }
        };
    }
})();