import { scrollToMainContent } from './scrollToMainContent';

describe('scrollToMainContent', () => {
  const preventDefault = jest.fn();
  const setAttribute = jest.fn();
  const focus = jest.fn();
  const removeAttribute = jest.fn();
  window.HTMLElement.prototype.setAttribute = setAttribute;
  window.HTMLElement.prototype.focus = focus;
  window.HTMLElement.prototype.removeAttribute = removeAttribute;

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls preventDefault', () => {
    scrollToMainContent({ preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it('fires methods if div found', () => {
    document.body.innerHTML = '<div id="main-content">Hello!</div>';
    scrollToMainContent({ preventDefault });
    expect(setAttribute).toHaveBeenCalledTimes(1);
    expect(setAttribute).toHaveBeenLastCalledWith('tabindex', '-1');
    expect(focus).toHaveBeenCalledTimes(1);
    expect(removeAttribute).toHaveBeenCalledTimes(1);
    expect(removeAttribute).toHaveBeenLastCalledWith('tabindex');
  });

  it('does not fire methods if div not found', () => {
    document.body.innerHTML = '<div>Hello!</div>';
    scrollToMainContent({ preventDefault });
    expect(setAttribute).not.toHaveBeenCalled();
    expect(focus).not.toHaveBeenCalled();
    expect(removeAttribute).not.toHaveBeenCalled();
  });
});
