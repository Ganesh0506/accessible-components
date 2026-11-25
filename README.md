# Accessible Components

Six components made with plain HTML, CSS and JavaScript. No frameworks and no libraries.

1. Data table
2. Combobox (search box with suggestions)
3. Multi-step form
4. File upload
5. Drag-and-drop board
6. Command palette

Every one of them works with just a keyboard and with a screen reader.

## How to run it

Double-click `index.html`. That's it.

## Publishing

This is its own repository. With GitHub Pages it is served at `https://<username>.github.io/accessible-components/`. The "Komal Ganesh" link at the top goes to `/`, the portfolio, when the portfolio is the `<username>.github.io` repository on the same account.

## Files

```
index.html      all the HTML for the page
style.css       all the styles
js/
  table.js      1. data table
  combobox.js   2. combobox
  form.js       3. multi-step form
  upload.js     4. file upload
  board.js      5. drag-and-drop board
  palette.js    6. command palette
```

## Keyboard controls

| Component | Keys |
|---|---|
| Data table | Type in the box to filter. Press Enter or Space on a column heading to sort by it, and again to reverse the order |
| Combobox | Type to filter. Up/Down arrows choose and Enter selects. Escape closes the list, and a second Escape clears the box |
| Multi-step form | Press Continue to go to the next step. If something is wrong, focus jumps to the first field with a problem, and its error message is read out |
| File upload | Enter on "Choose files" opens the file picker. Each file has its own "Remove" button |
| Board | Space picks up a card. Arrow keys move it. Space drops it. Escape cancels |
| Command palette | Ctrl+K opens it. Type to search, use the arrows to choose, Enter runs the command, Escape closes |

## The accessibility ideas used

- **`aria-live` areas:** screen readers read out messages like "Sorted by Name, ascending".
- **`aria-sort` (data table):** tells screen readers which column is sorted, and in which direction.
- **`aria-activedescendant` (combobox and palette):** focus stays in the text box while screen readers read the highlighted option.
- **`aria-invalid` and `aria-describedby` (form):** a field with a mistake is marked as invalid, and its error message is read out with it.
- **Focus management:** after every action, focus goes somewhere sensible (the new step's heading, the next file, the card you're moving, or back to where you were when the palette closes).
- **`<dialog>` with `showModal()`:** gives a real pop-up that blocks the page behind it.
