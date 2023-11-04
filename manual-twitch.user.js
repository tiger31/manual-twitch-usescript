// ==UserScript==
// @name         Manual Twitch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       github.com/tiger31
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// ==/UserScript==

const oldPushState = history.pushState;
history.pushState = function pushState() {
    let ret = oldPushState.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
};

const oldReplaceState = history.replaceState;
history.replaceState = function replaceState() {
    let ret = oldReplaceState.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
};

const redirectToFollowing = () => {
    if (window.location.pathname === "" || window.location.pathname === "/") {
        window.location.href = "/directory/following";
    }
}

window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'));
});

window.addEventListener("locationchange", redirectToFollowing)

const targetSelectors = [
    ['class', 'find-me'],
    ['query', '[aria-label="Recommended Channels"]']
];

(function() {
    'use strict';
    redirectToFollowing()
    const hideFn = () => {
        const hideTargets = targetSelectors.reduce((acc, selector) => {
            switch (selector[0]) {
                case 'class':
                    acc.push(...document.getElementsByClassName(selector[1]));
                    break;
                case 'query':
                    acc.push(...document.querySelectorAll(selector[1]));
                    break;
            }
            return acc;
         }, []);
        for (let i of hideTargets) {
            i.style.cssText = "display: none !important";
        }
    }
    const handleMutation = (mutationsList, observer) => {
        if (mutationsList.some(m => m.type === 'childList')) {
            hideFn();
        }
    }

    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, { childList: true, subtree: true });
})();
