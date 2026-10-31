(() => {
  const relayUrl = `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/relay/`;
  window.YOMI_RELAY_URL = relayUrl;
  const NativeWebSocket = window.WebSocket;
  const debug = new URL(window.location.href).searchParams.has("relayDebug");
  function trace(direction, data) {
    if (!debug || typeof data !== "string") return;
    try {
      const message = JSON.parse(data);
      if (["welcome", "create_match", "match_created", "player_join_game", "room_join_confirm", "room_join_deny"].includes(message.type)) {
        console.info("YOMI relay", direction, JSON.stringify(message));
      }
    } catch {}
  }

  window.WebSocket = class extends NativeWebSocket {
    constructor(url, protocols) {
      const target = new URL(url, window.location.href);
      const isRelay =
        target.pathname === "/relay" ||
        target.pathname.startsWith("/relay/") ||
        (["localhost", "127.0.0.1", "[::1]"].includes(target.hostname) &&
          target.port === "52450");
      super(isRelay ? relayUrl : url, protocols);
      if (!isRelay) return;
      this.addEventListener("message", event => trace("receive", event.data));
      const send = this.send;
      this.send = function (data) { trace("send", data); return send.call(this, data); };

      let heartbeat;
      const stopHeartbeat = () => window.clearInterval(heartbeat);
      this.addEventListener("open", () => {
        heartbeat = window.setInterval(() => {
          if (this.readyState !== NativeWebSocket.OPEN) return stopHeartbeat();
          this.send('{"type":"fetch_player_count"}');
        }, 20000);
      }, { once: true });
      this.addEventListener("close", stopHeartbeat, { once: true });
      this.addEventListener("error", stopHeartbeat, { once: true });
    }
  };
})();
