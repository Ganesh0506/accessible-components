// ===== 1. DATA TABLE =====
// Type to filter the rows. Press a heading button to sort.
// aria-sort tells screen readers which column is sorted, and in which direction.

const people = [
  { name: 'Amara Okafor', team: 'Design', city: 'London', tickets: 42 },
  { name: 'Ben Hartley', team: 'Payments', city: 'Leeds', tickets: 17 },
  { name: 'Chloe Nguyen', team: 'Platform', city: 'Bristol', tickets: 88 },
  { name: 'Dev Patel', team: 'Growth', city: 'London', tickets: 63 },
  { name: 'Elena Rossi', team: 'Design', city: 'Edinburgh', tickets: 29 },
  { name: 'Farah Haddad', team: 'Platform', city: 'Manchester', tickets: 71 },
  { name: 'George Whitfield', team: 'Payments', city: 'London', tickets: 5 },
  { name: 'Hana Suzuki', team: 'Growth', city: 'Leeds', tickets: 54 },
  { name: 'Isaac Mensah', team: 'Platform', city: 'Edinburgh', tickets: 96 },
  { name: 'Julia Novak', team: 'Design', city: 'Bristol', tickets: 38 },
];

const tableBody = document.getElementById('table-body');
const filterInput = document.getElementById('table-filter');
const tableStatus = document.getElementById('table-status');

let sortColumn = '';            // 'name', 'team', 'city' or 'tickets'
let sortDirection = 'ascending';

// Draw the rows that match the filter
function showRows() {
  const search = filterInput.value.toLowerCase();
  tableBody.innerHTML = '';
  let count = 0;

  for (let i = 0; i < people.length; i++) {
    const person = people[i];
    const text = (person.name + ' ' + person.team + ' ' + person.city).toLowerCase();

    if (text.includes(search)) {
      const row = document.createElement('tr');
      row.innerHTML = '<td></td><td></td><td></td><td></td>';
      row.cells[0].textContent = person.name;
      row.cells[1].textContent = person.team;
      row.cells[2].textContent = person.city;
      row.cells[3].textContent = person.tickets;
      tableBody.appendChild(row);
      count = count + 1;
    }
  }

  if (count === 0) {
    tableBody.innerHTML = '<tr><td colspan="4">No rows match your filter.</td></tr>';
  }
  return count;
}

// Sort the people list, then redraw the table
function sortBy(column, label) {
  // Pressing the same heading again flips the direction
  if (sortColumn === column && sortDirection === 'ascending') {
    sortDirection = 'descending';
  } else {
    sortDirection = 'ascending';
  }
  sortColumn = column;

  people.sort(function (a, b) {
    let result;
    if (column === 'tickets') {
      result = a.tickets - b.tickets;           // numbers
    } else {
      result = a[column].localeCompare(b[column]); // words, A to Z
    }
    if (sortDirection === 'descending') {
      result = -result;
    }
    return result;
  });

  // Only the sorted column gets aria-sort
  document.getElementById('name-heading').removeAttribute('aria-sort');
  document.getElementById('team-heading').removeAttribute('aria-sort');
  document.getElementById('city-heading').removeAttribute('aria-sort');
  document.getElementById('tickets-heading').removeAttribute('aria-sort');
  document.getElementById(column + '-heading').setAttribute('aria-sort', sortDirection);

  showRows();
  tableStatus.textContent = 'Sorted by ' + label + ', ' + sortDirection;
}

document.getElementById('sort-name').addEventListener('click', function () {
  sortBy('name', 'Name');
});
document.getElementById('sort-team').addEventListener('click', function () {
  sortBy('team', 'Team');
});
document.getElementById('sort-city').addEventListener('click', function () {
  sortBy('city', 'City');
});
document.getElementById('sort-tickets').addEventListener('click', function () {
  sortBy('tickets', 'Tickets closed');
});

filterInput.addEventListener('input', function () {
  const count = showRows();
  tableStatus.textContent = count + ' rows found';
});

showRows();
