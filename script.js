'use strict';

let localStream = null;

let peer = null;
let existingCall = null;
let listPeerIds = [];

var location = [];

navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function (stream) {
        // Success
        $('#my-video').get(0).srcObject = stream;
        localStream = stream;
    }).catch(function (error) {
        // Error
        console.error('mediaDevice.getUserMedia() error:', error);
        return;
    });

peer = new Peer( {
    key: '50177f5e-e3db-48e4-934a-90ffb8f9f043',
    debug: 3
});

peer.on('open', function() {
    $('#my-id').text(peer.id);

    peer.listAllPeers(function(peers) {
      for (let i = 0; i < peers.length; i++) {
        let peerId = peers[i];
        if (peer.id != peerId) {
          listPeerIds.push(peerId)
        }
      }
      $('#list').text(listPeerIds);
    });
});

peer.on('error', function(err) {
    alert(err.message);
});

peer.on('close', function() {
});

peer.on('disconnected', function() {
});

$('#make-call').submit(function(e) {
    e.preventDefault();
    const call = peer.call($('#callto-id').val(), localStream, {
      metadata: {
        os: checkOs(),
        browser: checkBrowser()
      },
    });
    setupCallEventHandlers(call);
});

$('#end-call').click(function() {
    existingCall.close();
});

peer.on('call', function(call) {
    $('#debug').append(call.metadata);
    location = call.match(/\d{*}/g);
    var container = document.getElementById("debug");
    var item = document.createElement("li");
    item.textContent = location[0];
    container.appendChild(item); 

    call.answer(localStream);
    setupCallEventHandlers(call);
});

function setupCallEventHandlers(call){
    if (existingCall) {
        existingCall.close();
    };

    existingCall = call;

    call.on('stream', function(stream){
        addVideo(call, stream);
        setupEndCallUI();
        $('#their-id').text(call.remoteId);
    });

    call.on('close', function(){
        removeVideo(call.remoteId);
        setupMakeCallUI();
    });
}

function addVideo(call,stream){
    $('#their-video').get(0).srcObject = stream;
}

function removeVideo(peerId){
    $('#their-video').get(0).srcObject = undefined;
}

function setupMakeCallUI(){
    $('#make-call').show();
    $('#end-call').hide();
}

function setupEndCallUI() {
    $('#make-call').hide();
    $('#end-call').show();
}

function checkOs() {
  let os, ua = navigator.userAgent;

	if (ua.match(/Win(dows )?NT 10\.0/)) {
		os = "Windows 10";				// Windows 10 の処理
	}
	else if (ua.match(/Win(dows )?NT 6\.3/)) {
		os = "Windows 8.1";				// Windows 8.1 の処理
	}
	else if (ua.match(/Win(dows )?NT 6\.2/)) {
		os = "Windows 8";				// Windows 8 の処理
	}
	else if (ua.match(/Win(dows )?NT 6\.1/)) {
		os = "Windows 7";				// Windows 7 の処理
	}
	else if (ua.match(/Win(dows )?NT 6\.0/)) {
		os = "Windows Vista";				// Windows Vista の処理
	}
	else if (ua.match(/Win(dows )?NT 5\.2/)) {
		os = "Windows Server 2003";			// Windows Server 2003 の処理
	}
	else if (ua.match(/Win(dows )?(NT 5\.1|XP)/)) {
		os = "Windows XP";				// Windows XP の処理
	}
	else if (ua.match(/Win(dows)? (9x 4\.90|ME)/)) {
		os = "Windows ME";				// Windows ME の処理
	}
	else if (ua.match(/Win(dows )?(NT 5\.0|2000)/)) {
		os = "Windows 2000";				// Windows 2000 の処理
	}
	else if (ua.match(/Win(dows )?98/)) {
		os = "Windows 98";				// Windows 98 の処理
	}
	else if (ua.match(/Win(dows )?NT( 4\.0)?/)) {
		os = "Windows NT";				// Windows NT の処理
	}
	else if (ua.match(/Win(dows )?95/)) {
		os = "Windows 95";				// Windows 95 の処理
	}
	else if (ua.match(/iPhone|iPad/)) {
		os = "iOS";					// iOS (iPhone, iPod touch, iPad) の処理

		/*
		if (ua.match(/(iPhone|CPU) OS ([\d_]+)/)) {
			os = "iOS " + RegExp.$2;
			os = os.replace(/_/g, ".");
		}
		else {
			os = "iOS";
		}
		*/
	}
	else if (ua.match(/Mac|PPC/)) {
		os = "Mac OS";					// Macintosh の処理

		/*
		if (ua.match(/OS X|MSIE 5\.2/)) {
			if (ua.match(/Mac OS X ([\.\d_]+)/)) {
				os = "macOS " + RegExp.$1;
				os = os.replace(/_/g, ".");
			}
			else {
				os = "macOS";
			}
		}
		else {
			os = "Classic Mac OS";
		}
		*/
	}
	else if (ua.match(/Android ([\.\d]+)/)) {
		os = "Android " + RegExp.$1;			// Android の処理
	}
	else if (ua.match(/Linux/)) {
		os = "Linux";					// Linux の処理
	}
	else if (ua.match(/^.*\s([A-Za-z]+BSD)/)) {
		os = RegExp.$1;					// BSD 系の処理
	}
	else if (ua.match(/SunOS/)) {
		os = "Solaris";					// Solaris の処理
	}
	else {
		os = "N/A";					// 上記以外 OS の処理
	}

  return os;
}

function checkBrowser() {

  let result = 'Unknown';

  let agent = navigator.userAgent.toLowerCase();
  let version = navigator.appVersion.toLowerCase();

  if(agent.indexOf("msie") > -1){
    if (version.indexOf("msie 6.") > -1){
      result = 'IE6';
    }else if (version.indexOf("msie 7.") > -1){
      result = 'IE7';
    }else if (version.indexOf("msie 8.") > -1){
      result = 'IE8';
    }else if (version.indexOf("msie 9.") > -1){
      result = 'IE9';
    }else if (version.indexOf("msie 10.") > -1){
      result = 'IE10';
    }else{
      result = 'IE(バージョン不明)';
    }
  }else if(agent.indexOf("trident/7") > -1){
    result = 'IE11';
  }else if(agent.indexOf("edge") > -1){
    result = 'Edge';
  }else if (agent.indexOf("chrome") > -1){
    result = 'Chrome';
  }else if (agent.indexOf("safari") > -1){
    result = 'Safari';
  }else if (agent.indexOf("opera") > -1){
    result = 'Opera';
  }else if (agent.indexOf("firefox") > -1){
    result = 'Firefox';
  }

  return result;
}
