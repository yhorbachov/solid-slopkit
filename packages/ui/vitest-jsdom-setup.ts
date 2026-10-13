// jsdom has no Popover API, which the overlays call (the browser baseline has it; ADR 0010). These stand-ins only
// record whether an element is shown, in `data-test-popover-open`: anything about the top layer itself is tested in
// the browser project.
if (typeof HTMLElement !== 'undefined' && !('showPopover' in HTMLElement.prototype)) {
  Object.assign(HTMLElement.prototype, {
    showPopover(this: HTMLElement) {
      this.setAttribute('data-test-popover-open', '');
    },
    hidePopover(this: HTMLElement) {
      this.removeAttribute('data-test-popover-open');
    },
    togglePopover(this: HTMLElement, force?: boolean) {
      const open = force ?? !this.hasAttribute('data-test-popover-open');
      this.toggleAttribute('data-test-popover-open', open);
      return open;
    },
  });
}
