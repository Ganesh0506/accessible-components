// ===== 4. FILE UPLOAD =====
// Keyboard users press the "Choose files" button. Mouse users can also drag files in.
// Bad files are listed with a reason. Each good file gets its own "Remove" button.

const chooseButton = document.getElementById('choose-files');
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const uploadErrors = document.getElementById('upload-errors');
const fileList = document.getElementById('file-list');
const uploadStatus = document.getElementById('upload-status');

const fiveMegabytes = 5 * 1024 * 1024;

function addFiles(files) {
  uploadErrors.innerHTML = '';
  let message = '';

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const name = file.name.toLowerCase();
    const goodType = name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.pdf');

    if (!goodType) {
      showUploadError(file.name + ' was not added: it must be a PNG, JPG or PDF.');
      message = message + file.name + ' was not added. ';
    } else if (file.size > fiveMegabytes) {
      showUploadError(file.name + ' was not added: it is bigger than 5 MB.');
      message = message + file.name + ' was not added. ';
    } else {
      showFile(file.name);
      message = message + file.name + ' added. ';
    }
  }

  uploadStatus.textContent = message; // read out by screen readers
  fileInput.value = '';               // so the same file can be picked again
}

function showUploadError(text) {
  const item = document.createElement('li');
  item.textContent = text;
  uploadErrors.appendChild(item);
}

function showFile(fileName) {
  const item = document.createElement('li');
  item.textContent = fileName + ' ';

  // Everyone sees "Remove". Screen readers hear "Remove report.pdf".
  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.textContent = 'Remove';
  removeButton.setAttribute('aria-label', 'Remove ' + fileName);

  removeButton.addEventListener('click', function () {
    // Pick where focus goes next, so keyboard users are not lost
    let nextItem = item.nextElementSibling;
    if (nextItem === null) {
      nextItem = item.previousElementSibling;
    }

    item.remove();

    if (nextItem === null) {
      chooseButton.focus();
    } else {
      nextItem.querySelector('button').focus();
    }
    uploadStatus.textContent = fileName + ' removed.';
  });

  item.appendChild(removeButton);
  fileList.appendChild(item);
}

// The button opens the hidden file picker
chooseButton.addEventListener('click', function () {
  fileInput.click();
});

fileInput.addEventListener('change', function () {
  addFiles(fileInput.files);
});

// ----- Drag and drop -----
dropZone.addEventListener('dragover', function (event) {
  event.preventDefault(); // needed to allow dropping
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', function () {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', function (event) {
  event.preventDefault(); // stop the browser opening the file
  dropZone.classList.remove('drag-over');
  addFiles(event.dataTransfer.files);
});
