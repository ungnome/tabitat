import * as KeybordNav from './keyboard-nav.js';

// ----------------------------------------------------------------------------
//  Global Vars
// ----------------------------------------------------------------------------

const previewCache = [];

// ----------------------------------------------------------------------------
// Function
// ----------------------------------------------------------------------------
async function initTabList() {
  // get browser tabs and template
  let tabs = await browser.tabs.query({ windowType: 'normal' });
  const tabListElement = document.querySelector('#tab-list');
  const tabElementTemplate = document.querySelector('#tab-list-item');
  const previewElement = document.querySelector('#preview');

  // make sure tab list is empty before populating
  tabListElement.innerHTML = '';

  for (const tab of tabs) {
    // create tab template and its parts
    let template = document.importNode(tabElementTemplate.content, true);
    let templateListItem = template.querySelector('li');
    let templateTitle = template.querySelector('.tab-title');
    let templateUrl = template.querySelector('.tab-url');
    let templateCloseBtn = template.querySelector('.close-btn');
    let templateFavicon = template.querySelector('.tab-favicon');

    // set title, url, and favicon
    templateTitle.textContent = tab.title;
    templateUrl.textContent = tab.url;
    templateFavicon.src = tab.favIconUrl;

    // add data to list item element
    templateListItem.dataset.tabId = tab.id;
    templateListItem.dataset.tabIndex = tab.index;
    templateListItem.dataset.windowId = tab.windowId;
    templateListItem.dataset.previewId = `${tab.id}:${tab.windowId}`;

    // add event listeners to element parts
    templateListItem.addEventListener('click', handleSwitch);
    templateCloseBtn.addEventListener('click', handleClose);
    templateFavicon.addEventListener('error', handleFaviconFailure);
    ['mouseenter', 'focus'].forEach((type) => {
      templateListItem.addEventListener(type, async (e) => {
        const tid = Number(e.target.dataset.tabId);
        const cache = previewCache.find((p) => p.tabId === tid);
        previewElement.src = cache.preview;
        preview.classList.remove('hidden');
      });
    });

    tabListElement.append(template);
  }
}

function initSearch() {
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', handelSearch);
}

async function initPreviewCache() {
  let tabs = await browser.tabs.query({ windowType: 'normal' });

  for (const tab of tabs) {
    const tabPreview = await browser.tabs.captureTab(tab.id);
    previewCache.push({
      tabId: tab.id,
      preview: tabPreview,
    });
  }
}

function handelSearch(e) {
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

// async function populateTabsList() {
//   let tabs = await browser.tabs.query({ windowType: 'normal' });
//   const tabList = document.querySelector('#tab-list');
//   const tabListItemTemplate = document.querySelector('#tab-list-item');
//   const preview = document.querySelector('#preview');
//
//   // clear tablist
//   tabList.innerHTML = '';
//
//   // populate tab list
//   for (const tab of tabs) {
//     const clone = document.importNode(tabListItemTemplate.content, true);
//     let li = clone.querySelector('li');
//     let tabTitle = clone.querySelector('.tab-title');
//     let tabUrl = clone.querySelector('.tab-url');
//     let tabCloseBtn = clone.querySelector('.close-btn');
//     let tabFavicon = clone.querySelector('.tab-favicon');
//
//     li.dataset.tabId = tab.id;
//     li.dataset.tabIndex = tab.index;
//     li.dataset.windowId = tab.windowId;
//
//     tabTitle.textContent = tab.title;
//     tabUrl.textContent = tab.url;
//
//     tabCloseBtn.dataset.tabId = tab.id;
//     tabCloseBtn.dataset.windowId = tab.windowId;
//
//     tabFavicon.src = tab.favIconUrl;
//
//     li.addEventListener('click', handleSwitch);
//     tabCloseBtn.addEventListener('click', handleClose);
//     tabFavicon.addEventListener('error', handleFaviconFailure);
//
//     // handle previews
//     ['mouseenter', 'focus'].forEach((e) => {
//       li.addEventListener(e, () => {
//         previewTimer = setTimeout(async () => {
//           let tabPreview = await browser.tabs.captureTab(tab.id);
//           preview.src = tabPreview;
//           preview.classList.remove('hidden');
//         }, 100);
//       });
//     });
//
//     tabList.append(clone);
//   }
// }

initTabList();
initPreviewCache();
KeybordNav.init();
initSearch();
