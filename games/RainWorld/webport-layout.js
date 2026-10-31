(() => {
  const canvas = document.getElementById("unity-canvas");
  const container = document.getElementById("unity-container");
  const footer = document.getElementById("unity-footer");
  if (!canvas || !container) return;
  let naturalWidth = canvas.clientWidth;
  let naturalHeight = canvas.clientHeight;
  let appliedWidth = 0;
  let appliedHeight = 0;
  let wasFullscreen = false;
  let fullscreenRequest = null;

  if (container.requestFullscreen) {
    canvas.requestFullscreen = options => {
      if (document.fullscreenElement === container) return Promise.resolve();
      if (fullscreenRequest) return fullscreenRequest;
      fullscreenRequest = container.requestFullscreen(options)
        .catch(error => console.warn("Rain World fullscreen request declined:", error.message))
        .finally(() => { fullscreenRequest = null; });
      return fullscreenRequest;
    };
  }

  function fit() {
    const fullscreen = document.fullscreenElement === container;
    if (document.fullscreenElement && !fullscreen) return;
    if (!fullscreen && !wasFullscreen &&
        (Math.abs(canvas.clientWidth - appliedWidth) > 1 ||
         Math.abs(canvas.clientHeight - appliedHeight) > 1)) {
      naturalWidth = canvas.clientWidth;
      naturalHeight = canvas.clientHeight;
    }
    wasFullscreen = fullscreen;
    if (!naturalWidth || !naturalHeight) return;
    if (footer) footer.hidden = fullscreen;
    const footerHeight = fullscreen ? 0 : (footer?.offsetHeight || 0);
    const margin = fullscreen ? 0 : 16;
    const scale = Math.min(fullscreen ? Infinity : 1,
      (innerWidth - margin) / naturalWidth,
      (innerHeight - margin - footerHeight) / naturalHeight);
    appliedWidth = naturalWidth * scale;
    appliedHeight = naturalHeight * scale;
    canvas.style.width = appliedWidth + "px";
    canvas.style.height = appliedHeight + "px";
    container.style.width = fullscreen ? "100%" : appliedWidth + "px";
    container.style.height = fullscreen ? "100%" : (appliedHeight + footerHeight) + "px";
    container.style.left = fullscreen ? "0" : "50%";
    container.style.top = fullscreen ? "0" : "50%";
    container.style.display = fullscreen ? "flex" : "block";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.backgroundColor = fullscreen ? "black" : "";
    container.style.transformOrigin = "center center";
    container.style.transform = fullscreen ? "none" : "translate(-50%, -50%)";
  }

  new ResizeObserver(fit).observe(canvas);
  addEventListener("resize", fit);
  addEventListener("fullscreenchange", fit);
  fit();
})();
