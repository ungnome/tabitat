export { init };

const searchInput = document.getElementById('search-input');

function init() {
  globalKeybinds();
}

function globalKeybinds() {
  document.addEventListener('keydown', (e) => {
    // ctrl+[ to cancel focus without closing popup
    if (e.ctrlKey && e.key === '[') {
      e.preventDefault();
      e.stopPropagation();

      if (document.activeElement && document.activeElement != document.body) {
        document.activeElement.blur();
      }

      return;
    }

    // '/' to focus search_input
    if (document.activeElement != searchInput && e.key === '/') {
      e.preventDefault();
      e.stopPropagation();
      searchInput.focus();
      return;
    }

    // enter focus first search result
    if (document.activeElement === searchInput && e.key === 'Enter') {
      e.preventDefault();
      moveFocus('top');
      return;
    }

    // tab start tab controls if nothing is active and down is pressed
    if (document.activeElement === document.body) {
      e.preventDefault();
      e.stopPropagation();

      switch (e.key) {
        case 'ArrowDown':
          moveFocus('top');
          break;
        case 'j':
          moveFocus('top');
          break;
        case 'n':
          moveFocus('top');
          break;
      }
      return;
    }

    // tab list controls
    if (document.activeElement.matches('.tab-list-item')) {
      e.preventDefault();
      e.stopPropagation();

      const tab = document.activeElement;
      const closeBtn = tab.querySelector('.close-btn');

      switch (e.key) {
        case 'ArrowUp':
          moveFocus('up');
          break;
        case 'k':
          moveFocus('up');
          break;
        case 'p':
          moveFocus('up');
          break;
        case 'ArrowDown':
          moveFocus('down');
          break;
        case 'j':
          moveFocus('down');
          break;
        case 'n':
          moveFocus('down');
          break;
        case 'x':
          closeBtn.click();
          break;
        case 'Enter':
          tab.click();
          break;
        case 'y':
          tab.click();
          break;
      }
    }
  });
}

function moveFocus(direction) {
  const tabListItems = Array.from(
    document.querySelectorAll('.tab-list-item:not(.search-not-match)')
  );
  const i = tabListItems.indexOf(document.activeElement);

  let next;

  switch (direction) {
    case 'top':
      next = 0;
      break;
    case 'up':
      next = Math.max(i - 1, 0);
      break;
    case 'down':
      next = Math.min(i + 1, tabListItems.length - 1);
      break;
  }

  tabListItems[next].focus();
}
