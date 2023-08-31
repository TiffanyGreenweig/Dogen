/* ! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. MIT license */
// @ts-nocheck
// tslint:disable
/* eslint-disable */
// @ts-ignore
export const matchMedia = () => {
  return (
    window.matchMedia ||
    (function () {
      // For browsers that support matchMedium api such as IE 9 and webkit
      let styleMedia = window.styleMedia || window.media;

      // For those that don't support matchMedium
      if (!styleMedia) {
        let style = document.createElement('style');
        let script = document.getElementsByTagName('script')[0];
        let info = null;

        style.type = 'text/css';
        style.id = 'matchmediajs-test';

        if (!script) {
          document.head.appendChild(style);
        } else {
          script.parentNode.insertBefore(style, script);
        }

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window && window.getComputedStyle(style, null)) || style.currentStyle;

        styleMedia = {
          matchMedium: function (media) {
            let text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

            // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
            if (style.styleSheet) {
              style.styleSheet.cssText = text;
            } else {
              style.textContent = text;
            }

            // Test if media query is true or false
            return info.width === '1px';
          },
        };
      }

      return function (media) {
        return {
          matches: styleMedia.matchMedium(media || 'all'),
          media: media || 'all',
        };
      };
    })()
  );
};

/* ! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. MIT license */
export const matchMediaAddListener = () => {
  // Bail out for browsers that have addListener support
  if (window.matchMedia && window.matchMedia('all').addEventListener) {
    return false;
  }

  let localMatchMedia = window.matchMedia;
  let hasMediaQueries = localMatchMedia('only all').matches;
  let isListening = false;
  let timeoutID = 0; // setTimeout for debouncing 'handleChange'
  let queries = []; // Contains each 'mql' and associated 'listeners' if 'addListener' is used
  let handleChange = function (evt) {
    // Debounce
    clearTimeout(timeoutID);

    timeoutID = setTimeout(function () {
      for (let i = 0, il = queries.length; i < il; i++) {
        let mql = queries[i].mql;
        let listeners = queries[i].listeners || [];
        let matches = localMatchMedia(mql.media).matches;

        // Update mql.matches value and call listeners
        // Fire listeners only if transitioning to or from matched state
        if (matches !== mql.matches) {
          mql.matches = matches;

          for (let j = 0, jl = listeners.length; j < jl; j++) {
            listeners[j].call(window, mql);
          }
        }
      }
    }, 30);
  };

  window.matchMedia = function (media) {
    let mql = localMatchMedia(media);
    let listeners = [];
    let index = 0;

    mql.addEventListener = function (listener) {
      // Changes would not occur to css media type so return now (Affects IE <= 8)
      if (!hasMediaQueries) {
        return;
      }

      // Set up 'resize' listener for browsers that support CSS3 media queries (Not for IE <= 8)
      // There should only ever be 1 resize listener running for performance
      if (!isListening) {
        isListening = true;
        window.addEventListener('resize', handleChange, true);
      }

      // Push object only if it has not been pushed already
      if (index === 0) {
        index = queries.push({
          mql: mql,
          listeners: listeners,
        });
      }

      listeners.push(listener);
    };

    mql.removeEventListener = function (listener) {
      for (let i = 0, il = listeners.length; i < il; i++) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
        }
      }
    };

    return mql;
  };
};
