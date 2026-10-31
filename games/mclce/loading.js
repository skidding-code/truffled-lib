'use strict';

const gameLoadBar = document.createElement('div');
Object.assign(gameLoadBar.style, {
  position: 'fixed',
  left: '0',
  bottom: '0',
  width: '1%',
  height: '4px',
  background: '#fff',
  zIndex: '9999',
  pointerEvents: 'none'
});
document.body.append(gameLoadBar);

window.updateGameLoadBar = function (status) {
  const percentage = /\((\d+)%\)/.exec(status || '');
  if (percentage) gameLoadBar.style.width = Math.min(100, Number(percentage[1])) + '%';
};

window.finishGameLoadBar = function () {
  gameLoadBar.remove();
};
