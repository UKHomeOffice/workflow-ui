export const scrollToMainContent = e => {
  e.preventDefault();
  const div = document.getElementById('main-content');
  if (div) {
    div.setAttribute('tabindex', '-1');
    div.focus();
    div.removeAttribute('tabindex');
  }
};

export default scrollToMainContent;
