// Expose browser timer APIs as globals for happy-dom.
// happy-dom attaches these to `window` but not to the bare global scope,
// which causes ReferenceError when LitElement/base-card calls clearInterval().
(globalThis as Record<string, unknown>).setInterval  ??= window.setInterval.bind(window);
(globalThis as Record<string, unknown>).clearInterval ??= window.clearInterval.bind(window);
(globalThis as Record<string, unknown>).setTimeout   ??= window.setTimeout.bind(window);
(globalThis as Record<string, unknown>).clearTimeout  ??= window.clearTimeout.bind(window);
