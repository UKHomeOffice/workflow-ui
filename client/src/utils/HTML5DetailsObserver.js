import { Details } from 'govuk-frontend';

export default class HTML5DetailsObserver {
  constructor(node) {
    this.node = node;
  }

  create() {
    this.observer = new MutationObserver(() => {
      this.node.querySelectorAll('[data-module="govuk-details"]')
        .forEach((element) => {
          new Details(element).init();
        });
    });
    this.observer.observe(this.node, { childList: true, attributes: false });
    return this;
  }

  destroy() {
    this.observer.disconnect();
  }
}
