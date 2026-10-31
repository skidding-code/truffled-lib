(() => {
  const bindings = [
    ['forward', 'Move forward', 'W'],
    ['backward', 'Move backward', 'S'],
    ['left', 'Move left', 'A'],
    ['right', 'Move right', 'D'],
    ['jump', 'Jump', 'Space'],
    ['sprint', 'Sprint', 'Left Ctrl'],
    ['sneak', 'Sneak', 'Left Shift'],
    ['inventory', 'Inventory', 'E'],
    ['drop', 'Drop', 'Q'],
    ['crafting', 'Crafting', 'C'],
    ['attack', 'Attack keyboard key', 'Enter'],
    ['use', 'Use keyboard key', 'F']
  ];
  const keys = new Map();
  for (let index = 0; index < 26; index++)
    keys.set(String.fromCharCode(65 + index), 4 + index);
  for (let index = 1; index <= 9; index++)
    keys.set(String(index), 29 + index);
  keys.set('0', 39);
  keys.set('Enter', 40);
  keys.set('Tab', 43);
  keys.set('Space', 44);
  keys.set('Right', 79);
  keys.set('Left', 80);
  keys.set('Down', 81);
  keys.set('Up', 82);
  keys.set('Left Ctrl', 224);
  keys.set('Left Shift', 225);
  keys.set('Right Ctrl', 228);
  keys.set('Right Shift', 229);
  const list = document.getElementById('controls-list');
  const selects = new Map();
  for (const [id, label, original] of bindings) {
    const row = document.createElement('p');
    const caption = document.createElement('label');
    caption.textContent = label + ' ';
    const select = document.createElement('select');
    select.name = id;
    for (const [name, code] of keys) {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = name;
      select.append(option);
    }
    const saved = localStorage.getItem('mclegacy.controls.' + id);
    select.value = saved || String(keys.get(original));
    caption.append(select);
    row.append(caption);
    list.append(row);
    selects.set(id, {select, original});
  }
  document.getElementById('controls-form').addEventListener('submit', event => {
    event.preventDefault();
    for (const [id, {select}] of selects)
      localStorage.setItem('mclegacy.controls.' + id, select.value);
    document.getElementById('controls-status').textContent =
      'Saved. Launch or reload the game to use these controls.';
  });
  document.getElementById('reset-controls').addEventListener('click', () => {
    for (const [id, {select, original}] of selects) {
      localStorage.removeItem('mclegacy.controls.' + id);
      select.value = String(keys.get(original));
    }
    document.getElementById('controls-status').textContent =
      'Defaults restored. Launch or reload the game to use them.';
  });
})();