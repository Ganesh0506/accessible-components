// ===== 5. DRAG-AND-DROP BOARD =====
// Mouse: drag a card into another column.
// Keyboard: Space picks a card up, arrow keys move it, Space drops it, Escape cancels.
// Every move is read out by screen readers through the "board-status" live area.

const columns = document.querySelectorAll('.card-list');
const boardStatus = document.getElementById('board-status');

let carriedCard = null;    // the card picked up with the keyboard
let startColumn = null;    // where it started, so Escape can put it back
let startNextCard = null;
let draggedCard = null;    // the card being dragged with the mouse

// Returns something like "position 2 of 3 in In progress"
function whereIs(card) {
  const column = card.parentElement;
  const columnName = column.previousElementSibling.textContent; // the <h3> above the list
  let position = 0;
  for (let i = 0; i < column.children.length; i++) {
    if (column.children[i] === card) {
      position = i + 1;
    }
  }
  return 'position ' + position + ' of ' + column.children.length + ' in ' + columnName;
}

// Which column number (0, 1 or 2) is this list?
function columnNumber(column) {
  for (let i = 0; i < columns.length; i++) {
    if (columns[i] === column) {
      return i;
    }
  }
}

// Add the keyboard and mouse controls to one card button
function setUpCard(button) {
  const card = button.parentElement; // the <li>

  button.addEventListener('keydown', function (event) {
    // Space or Enter: pick up, or drop
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (carriedCard === null) {
        carriedCard = card;
        startColumn = card.parentElement;
        startNextCard = card.nextElementSibling;
        button.setAttribute('aria-pressed', 'true');
        boardStatus.textContent = 'Picked up ' + button.textContent + ', ' + whereIs(card) +
          '. Use the arrow keys to move it, Space to drop it, Escape to cancel.';
      } else {
        button.removeAttribute('aria-pressed');
        boardStatus.textContent = 'Dropped ' + button.textContent + ', ' + whereIs(card) + '.';
        carriedCard = null;
      }
      return;
    }

    // The other keys only do something while a card is picked up
    if (carriedCard !== card) {
      return;
    }

    const column = card.parentElement;
    const number = columnNumber(column);

    if (event.key === 'Escape') {
      startColumn.insertBefore(card, startNextCard); // put it back
      button.removeAttribute('aria-pressed');
      carriedCard = null;
      boardStatus.textContent = 'Move cancelled. ' + button.textContent + ' is back at ' + whereIs(card) + '.';
    } else if (event.key === 'Tab') {
      button.removeAttribute('aria-pressed'); // leaving the card drops it
      carriedCard = null;
      return;
    } else if (event.key === 'ArrowUp' && card.previousElementSibling !== null) {
      column.insertBefore(card, card.previousElementSibling);
    } else if (event.key === 'ArrowDown' && card.nextElementSibling !== null) {
      column.insertBefore(card.nextElementSibling, card);
    } else if (event.key === 'ArrowLeft' && number > 0) {
      columns[number - 1].appendChild(card);
    } else if (event.key === 'ArrowRight' && number < columns.length - 1) {
      columns[number + 1].appendChild(card);
    } else {
      return;
    }

    event.preventDefault();
    button.focus(); // moving the card can lose focus, so put it back
    if (carriedCard !== null) {
      boardStatus.textContent = button.textContent + ', ' + whereIs(card) + '.';
    }
  });

  // Mouse: remember which card is being dragged
  button.addEventListener('dragstart', function () {
    draggedCard = card;
  });
}

// Set up every card that is already on the page
const cardButtons = document.querySelectorAll('.task');
for (let i = 0; i < cardButtons.length; i++) {
  setUpCard(cardButtons[i]);
}

// Let each column accept a dropped card
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];

  column.addEventListener('dragover', function (event) {
    event.preventDefault(); // needed to allow dropping
  });

  column.addEventListener('drop', function (event) {
    event.preventDefault();
    if (draggedCard !== null) {
      column.appendChild(draggedCard);
      boardStatus.textContent = 'Moved ' + draggedCard.textContent + ' to ' + whereIs(draggedCard) + '.';
      draggedCard = null;
    }
  });
}

// Used by the command palette to add a new card to "To do"
function addCard(text) {
  const card = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'task';
  button.draggable = true;
  button.setAttribute('aria-describedby', 'board-help');
  button.textContent = text;
  card.appendChild(button);
  columns[0].appendChild(card);
  setUpCard(button);
}
