import * as KeybordNav from './keyboard-nav.js';

// track tab preview timers
let previewTimer = null;

function searchResults(e) {
  const tabListItems = document.querySelectorAll('.tab-list-item');
  const searchLen = e.target.value.length;
  const searchTxt = e.target.value.toLowerCase();

  for (const tab of tabListItems) {
    if (searchLen == 0) {
      tab.classList.remove('search-not-match');
      continue;
    }

    const title = tab.querySelector('.tab-title').textContent;
    if (title.toLocaleLowerCase().includes(searchTxt)) {
      tab.classList.remove('search-not-match');
    } else {
      tab.classList.add('search-not-match');
    }
  }
}

function search() {
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', searchResults);
}

function handleFaviconFailure(e) {
  const img = e.target;
  img.onerror = null;
  img.src = 'icons/favicon-error.svg';
}

function handleClose(e) {
  e.stopPropagation();
  const li = e.target.closest('.tab-list-item');
  const preview = document.querySelector('#preview');
  const tId = Number(li.dataset.tabId);
  browser.tabs.remove(tId);
  preview.src = '';
  li.remove();
}

function handleSwitch(e) {
  const li = e.target.closest('.tab-list-item');
  const tIdx = Number(li.dataset.tabIndex);
  const wId = Number(li.dataset.windowId);
  browser.tabs.highlight({
    windowId: wId,
    tabs: tIdx,
    populate: false,
  });
  browser.windows.update(wId, { focused: true });
  window.close();
}

async function populateTabsList() {
  let tabs = await browser.tabs.query({ windowType: 'normal' });
  const tabList = document.querySelector('#tab-list');
  const tabListItemTemplate = document.querySelector('#tab-list-item');
  const preview = document.querySelector('#preview');

  // clear tablist
  tabList.innerHTML = '';

  // populate tab list
  for (const tab of tabs) {
    const clone = document.importNode(tabListItemTemplate.content, true);
    let li = clone.querySelector('li');
    let tabTitle = clone.querySelector('.tab-title');
    let tabUrl = clone.querySelector('.tab-url');
    let tabCloseBtn = clone.querySelector('.close-btn');
    let tabFavicon = clone.querySelector('.tab-favicon');

    li.dataset.tabId = tab.id;
    li.dataset.tabIndex = tab.index;
    li.dataset.windowId = tab.windowId;

    tabTitle.textContent = tab.title;
    tabUrl.textContent = tab.url;

    tabCloseBtn.dataset.tabId = tab.id;
    tabCloseBtn.dataset.windowId = tab.windowId;

    tabFavicon.src = tab.favIconUrl;

    li.addEventListener('click', handleSwitch);
    tabCloseBtn.addEventListener('click', handleClose);
    tabFavicon.addEventListener('error', handleFaviconFailure);

    // handle previews
    ['mouseenter', 'focus'].forEach((e) => {
      li.addEventListener(e, () => {
        previewTimer = setTimeout(async () => {
          let tabPreview = await browser.tabs.captureTab(tab.id);
          preview.src = tabPreview;
          preview.classList.remove('hidden');
        }, 100);
      });
    });

    tabList.append(clone);
  }
}

populateTabsList();
KeybordNav.init();
search();
