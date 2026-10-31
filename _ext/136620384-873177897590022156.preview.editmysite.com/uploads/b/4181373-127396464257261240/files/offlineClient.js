"use strict";

(function() {
	
	class OfflineClient
	{
		constructor()
		{
			// Create a BroadcastChannel, if supported.
			this._broadcastChannel = (typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel("offline"));
			
			// Queue of messages received before a message callback is set.
			this._queuedMessages = [];
			
			// The message callback.
			this._onMessageCallback = null;
			
			// If BroadcastChannel is supported, listen for messages.
			if (this._broadcastChannel)
				this._broadcastChannel.onmessage = (e => this._OnBroadcastChannelMessage(e));
		}
		
		_OnBroadcastChannelMessage(e)
		{
			// Have a message callback set: just forward the call.
			if (this._onMessageCallback)
			{
				this._onMessageCallback(e);
				return;
			}
			
			// Otherwise the app hasn't loaded far enough to set a message callback.
			// Buffer the incoming messages to replay when the app sets a callback.
			this._queuedMessages.push(e);
		}
		
		SetMessageCallback(f)
		{
			this._onMessageCallback = f;
			
			// Replay any queued messages through the handler, then clear the queue.
			for (let e of this._queuedMessages)
				this._onMessageCallback(e);
			
			this._queuedMessages.length = 0;
		}
	};
	
	// Create the offline client ASAP so we receive and start queueing any messages the SW broadcasts.
	window.OfflineClientInfo = new OfflineClient();
	
}());
!function(){var e="#button{display:none}.imgb_vis{animation:imgb-animation 7s linear}@keyframes imgb-animation{10%{transform:translateX(0)}20%{transform:translateX(100px)}90%{transform:translateX(100px)}100%{transform:translateX(0)}}",t=document.createElement("style");t.type="text/css",t.appendChild(document.createTextNode(e)),document.head.appendChild(t);var n=document.createElement("div");n.id="button",n.className="imgb",n.style="position:fixed;top:10%;left:-100px;z-index:10",n.innerHTML='<a target="_blank" href="https://sites.google.com/view/classroom6x/" title="More Unblocked Games 6x"><img src="https://lh4.googleusercontent.com/lUEWrXMVEr4AdjKISyJahDRJ61bwfvHdpeYm86Djn5U8oCm9dI60NGXSBqad9HUvzTXgqlkosA_hWV-VuXPjzrkGvh3_kNSgYk8ySWzXnDpbBCBiooyBbU8oBy3YBZMDkW8RcRVmDuC0raoeqZBm8kBlqs6c5mdfkJeN2aE68lXS_lcOZ5_F7lIuM6qLVg" width="100" height="30" style="cursor:pointer;" alt="Unblocked Games on Classroom 6x"></a>',document.body.appendChild(n);var o=document.getElementById("button"),a=0,i=["block","none"],d=[7e3,16e4];!function e(){a^=1,o.style.display=i[a],setTimeout(e,d[a])}(),document.querySelector(".imgb").classList.add("imgb_vis")}();
