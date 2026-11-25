// ===== 2. COMBOBOX =====
// A text box with a list of suggestions underneath.
// Focus always stays in the text box. aria-activedescendant points at the
// highlighted option, so screen readers read it out as you press the arrows.

const countries = [
  'Australia', 'Brazil', 'Canada', 'China', 'Denmark', 'Egypt', 'France', 'Germany',
  'Ghana', 'India', 'Ireland', 'Italy', 'Japan', 'Kenya', 'Mexico', 'Netherlands',
  'New Zealand', 'Nigeria', 'Norway', 'Poland', 'Portugal', 'Singapore', 'South Africa',
  'Spain', 'Sweden', 'United Arab Emirates', 'United Kingdom', 'United States',
];

const countryInput = document.getElementById('country-input');
const countryList = document.getElementById('country-list');
const countryResult = document.getElementById('country-result');

let highlighted = -1; // number of the highlighted option (-1 means none)

// Fill the list with the countries that match what was typed
function updateList() {
  const typed = countryInput.value.toLowerCase();
  countryList.innerHTML = '';
  highlighted = -1;
  countryInput.removeAttribute('aria-activedescendant');

  for (let i = 0; i < countries.length; i++) {
    if (countries[i].toLowerCase().includes(typed)) {
      const option = document.createElement('li');
      option.textContent = countries[i];
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.addEventListener('click', function () {
        chooseCountry(option);
      });
      countryList.appendChild(option);
    }
  }

  // Give each option an id, so aria-activedescendant can point at it
  const options = countryList.children;
  for (let i = 0; i < options.length; i++) {
    options[i].id = 'country-' + i;
  }

  if (options.length > 0) {
    openList();
  } else {
    closeList();
  }
}

function openList() {
  countryList.hidden = false;
  countryInput.setAttribute('aria-expanded', 'true');
}

function closeList() {
  countryList.hidden = true;
  countryInput.setAttribute('aria-expanded', 'false');
  countryInput.removeAttribute('aria-activedescendant');
  highlighted = -1;
}

function highlight(number) {
  const options = countryList.children;

  // Un-highlight the old option
  if (highlighted >= 0) {
    options[highlighted].setAttribute('aria-selected', 'false');
  }

  highlighted = number;
  options[number].setAttribute('aria-selected', 'true');
  countryInput.setAttribute('aria-activedescendant', options[number].id);
  options[number].scrollIntoView({ block: 'nearest' });
}

function chooseCountry(option) {
  countryInput.value = option.textContent;
  countryResult.textContent = 'You chose: ' + option.textContent;
  closeList();
  countryInput.focus();
}

countryInput.addEventListener('input', updateList);

countryInput.addEventListener('keydown', function (event) {
  const options = countryList.children;
  const last = options.length - 1;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (countryList.hidden) {
      updateList();
    }
    if (highlighted < last) {
      highlight(highlighted + 1);
    } else if (last >= 0) {
      highlight(0); // at the bottom: go back to the top
    }
  }

  if (event.key === 'ArrowUp' && !countryList.hidden) {
    event.preventDefault();
    if (highlighted > 0) {
      highlight(highlighted - 1);
    } else {
      highlight(last); // at the top: go to the bottom
    }
  }

  if (event.key === 'Enter' && highlighted >= 0) {
    chooseCountry(options[highlighted]);
  }

  if (event.key === 'Escape') {
    if (countryList.hidden) {
      countryInput.value = ''; // second Escape clears the box
    } else {
      closeList();             // first Escape closes the list
    }
  }
});

// Close the list when you click somewhere else (wait a moment so option clicks still work)
countryInput.addEventListener('blur', function () {
  setTimeout(closeList, 200);
});
