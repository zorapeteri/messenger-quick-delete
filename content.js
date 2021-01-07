const icons = {
  unsend: 'https://www.flaticon.com/svg/static/icons/svg/3096/3096687.svg',
  remove: 'https://www.flaticon.com/svg/static/icons/svg/1828/1828778.svg',
};

const titles = {
  unsend: 'Unsend (for everyone)',
  remove: 'Remove (for you only)',
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isUnsent = (row) => {
  const text = row.querySelector(
    '[data-testid="outgoing_message"] > div > div:not([dir="auto"]',
  );
  if (text) return !text.children.length;
  return false;
};

const chooseOption = (index) =>
  document
    .querySelector('[role="dialog"]')
    .querySelectorAll('label')
    [index].click();

const deleteOutgoingRow = async (row, option) => {
  const messageActions = row
    .querySelector('[data-testid="messenger_delivery_status"]')
    .previousElementSibling.querySelector('[data-scope="messages_table"]')
    .children[0];
  messageActions.click();
  await delay(200);
  messageActions.children[2].querySelector('[aria-label]').click();
  await delay(200);
  const removeButton = document.querySelector(
    '[role="dialog"] [role="menu"][aria-orientation="horizontal"]',
  ).children[0];
  removeButton.click();
  await delay(200);
  chooseOption(option);
  await delay(200);
  document
    .querySelector('[role="dialog"]')
    .children[3].children[0].children[0].querySelector('[role="button"]')
    .click();
};

const deleteUnsentRow = async (row) => {
  const messageActions = row
    .querySelector('[data-testid="messenger_delivery_status"]')
    .previousElementSibling.querySelector('[data-scope="messages_table"]')
    .children[0];
  messageActions.click();
  await delay(200);
  row
    .querySelector('[role="menu"][aria-orientation="horizontal"]')
    .querySelector('[aria-label]')
    .click();
  await delay(200);
  const removeButton = document.querySelector(
    '[role="dialog"] [role="menu"][aria-orientation="horizontal"]',
  ).children[0];
  removeButton.click();
  await delay(200);
  document
    .querySelector('[role="dialog"]')
    .children[3].children[0].children[0].querySelector('[role="button"]')
    .click();
  resolve();
};

const createButton = (name, clickEvent) => {
  const button = document.createElement('button');
  button.className = 'messenger-delete-extension--button';
  button.innerHTML = `<img src="${icons[name]}" alt="${name}">`;
  button.title = titles[name];
  button.addEventListener('click', clickEvent);
  return button;
};

const addButtonsToOutgoingRow = (row) => {
  row.classList.add('messenger-delete-extension--row');
  row.children[0].children[0].appendChild(
    createButton('remove', () => deleteOutgoingRow(row, 1)),
  );
  row.children[0].children[0].appendChild(
    createButton('unsend', () => deleteOutgoingRow(row, 0)),
  );
};

const addButtonToUnsentRow = (row) => {
  row.classList.add('messenger-delete-extension--row');
  row.children[0].children[0].appendChild(
    createButton('remove', () => deleteUnsentRow(row)),
  );
};

const addStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .messenger-delete-extension--button {
      background-color: white;
      border: none;
      outline: none;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.1s linear;
      padding-right: 10px;
    }

    .messenger-delete-extension--button img {
      height: 1.3em;
      opacity: 0;
    }

    .messenger-delete-extension--button img[alt="remove"] {
      height: 1em;
    }

    .messenger-delete-extension--row:hover .messenger-delete-extension--button img {
      opacity: 0.5;
    }

    .messenger-delete-extension--row:hover .messenger-delete-extension--button img:hover {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
};

const addButtons = () => {
  document
    .querySelectorAll('[data-testid="mwchat_outgoing_row"]')
    .forEach((row) => {
      if (!row.querySelector('.messenger-delete-extension--button'))
        if (isUnsent(row)) {
          addButtonToUnsentRow(row);
        } else {
          addButtonsToOutgoingRow(row);
        }
    });
};

addStyles();
setInterval(addButtons, 1000);
