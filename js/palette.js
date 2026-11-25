// ===== 6. COMMAND PALETTE =====
// Ctrl + K opens a <dialog> with a search box and a list of commands.
// Arrow keys choose, Enter runs, Escape closes. Focus goes back to where it was.

const palette = document.getElementById('palette');
const paletteInput = document.getElementById('palette-input');
const commands = document.querySelectorAll('#palette-list li');
const paletteEmpty = document.getElementById('palette-empty');
const pageStatus = document.getElementById('page-status');

let shownCommands = [];     // the commands that match the search
let chosen = 0;             // number of the highlighted command
let focusAfterClose = null; // where focus goes when the palette closes
let newCards = 0;

function openPalette() {
  focusAfterClose = document.activeElement; // remember where we were
  paletteInput.value = '';
  searchCommands();
  palette.showModal();
}

// Show only the commands that contain the typed text
function searchCommands() {
  const typed = paletteInput.value.toLowerCase();
  shownCommands = [];

  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    command.setAttribute('aria-selected', 'false');
    if (command.textContent.toLowerCase().includes(typed)) {
      command.hidden = false;
      shownCommands.push(command);
    } else {
      command.hidden = true;
    }
  }

  paletteEmpty.hidden = shownCommands.length > 0;
  if (shownCommands.length > 0) {
    chosen = 0;
    choose(0);
  } else {
    paletteInput.removeAttribute('aria-activedescendant');
  }
}

// Highlight a command. aria-activedescendant tells screen readers which one.
function choose(number) {
  shownCommands[chosen].setAttribute('aria-selected', 'false');
  chosen = number;
  shownCommands[chosen].setAttribute('aria-selected', 'true');
  paletteInput.setAttribute('aria-activedescendant', shownCommands[chosen].id);
}

function runCommand(command) {
  if (command.dataset.goTo) {
    // "Go to ..." commands: focus that section's heading after closing
    focusAfterClose = document.getElementById(command.dataset.goTo);
  } else if (command.id === 'cmd-dark') {
    document.body.classList.toggle('dark');
    pageStatus.textContent = 'Dark mode switched';
  } else if (command.id === 'cmd-card') {
    newCards = newCards + 1;
    addCard('New card ' + newCards); // this function is in board.js
    pageStatus.textContent = 'New card ' + newCards + ' added to To do';
  }
  palette.close();
}

// The dialog fires "close" however it was closed (Escape, Enter or a click)
palette.addEventListener('close', function () {
  focusAfterClose.focus();
});

// Open with the button...
document.getElementById('open-palette').addEventListener('click', openPalette);

// ...or with Ctrl + K (Cmd + K on a Mac)
document.addEventListener('keydown', function (event) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault(); // stop the browser's own Ctrl + K
    if (!palette.open) {
      openPalette();
    }
  }
});

paletteInput.addEventListener('input', searchCommands);

paletteInput.addEventListener('keydown', function (event) {
  const last = shownCommands.length - 1;
  if (last < 0) {
    return; // nothing to choose
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (chosen < last) {
      choose(chosen + 1);
    } else {
      choose(0);
    }
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (chosen > 0) {
      choose(chosen - 1);
    } else {
      choose(last);
    }
  }

  if (event.key === 'Enter') {
    // Stop this Enter also "clicking" the button that gets focus after the palette closes
    event.preventDefault();
    runCommand(shownCommands[chosen]);
  }
});

// Clicking a command runs it
for (let i = 0; i < commands.length; i++) {
  commands[i].addEventListener('click', function () {
    runCommand(commands[i]);
  });
}

// Clicking the dark area around the palette closes it
palette.addEventListener('click', function (event) {
  if (event.target === palette) {
    palette.close();
  }
});
