(function () {
    var NAV_ITEMS = [
        { key: 'home', href: '/', i18n: 'home.home', fallback: 'Home' },
        { key: 'race', href: '/race', i18n: 'ui.race', fallback: 'Race' },
        { key: 'world', href: '/world', i18n: 'home.world_map', fallback: 'World Map' },
        { key: 'leaderboard', href: '/leaderboard', i18n: 'ui.leaderboard', fallback: 'Leaderboard' },
        { key: 'advertise', href: '/advertise', i18n: 'home.advertise', fallback: 'Advertise' },
        { key: 'play', href: '/game', i18n: 'home.play', fallback: 'Play' },
        { key: 'tutorial', href: '/tutorial', i18n: 'home.learn_to_sail', fallback: 'Learn to Sail' },
        { key: 'highsea', href: '/highsea', i18n: 'home.start_high_sea_mode', fallback: 'Beta High Sea' },
        { key: 'changelog', href: '/blog', fallback: 'Blog' },
        { key: 'feedback', href: '/feedback', fallback: 'Feedback' },
        { key: 'contact', href: '/contact', fallback: 'Contact' },
        { key: 'recap', href: '/2025recap', i18n: 'home.recap', fallback: '2025 Recap' },
        { key: 'sponsors', href: '/sponsors', i18n: 'home.sponsors', fallback: 'Sponsors' }
    ];
    var HIDDEN_NAV_ITEMS = {
        play: true,
        tutorial: true,
        highsea: true,
        sponsors: true
    };
    var MORE_NAV_ITEMS = {
        feedback: true,
        contact: true,
        recap: true,
        changelog: true
    };
    var MOBILE_MORE_NAV_ITEMS = {
        advertise: true
    };

    function inferActivePage(pathname) {
        if (pathname === '/' || pathname.indexOf('/lang/') === 0) return 'home';
        if (pathname.indexOf('/game') === 0) {
            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('mode') === 'tutorial') return 'tutorial';
            return 'play';
        }
        if (pathname === '/tutorial' || pathname === '/tutorial/' || pathname === '/tutorial.html') return 'tutorial';
        if (pathname === '/profile' || pathname === '/profile/' || pathname === '/profile.html') return 'profile';
        if (pathname.indexOf('/world') === 0) return 'world';
        if (
            pathname === '/race'
            || pathname.indexOf('/race/') === 0
            || pathname.indexOf('/races') === 0
            || pathname.indexOf('/daily-race') === 0
        ) return 'race';
        if (pathname.indexOf('/leaderboard') === 0) return 'leaderboard';
        if (pathname.indexOf('/highsea') === 0) return 'race';
        if (pathname.indexOf('/blog') === 0 || pathname.indexOf('/changelog') === 0) return 'changelog';
        if (pathname.indexOf('/feedback') === 0) return 'feedback';
        if (pathname.indexOf('/contact') === 0) return 'contact';
        if (pathname.indexOf('/privacy') === 0) return 'privacy';
        if (pathname.indexOf('/2025recap') === 0) return 'recap';
        if (pathname.indexOf('/advertise') === 0) return 'advertise';
        if (pathname.indexOf('/billing') === 0) return 'billing';
        if (pathname.indexOf('/sponsors') === 0) return 'sponsors';
        return 'home';
    }

    function isNavItemVisible(item) {
        return !HIDDEN_NAV_ITEMS[item.key];
    }

    function isNavItemActive(item, activePage) {
        if (item.key === activePage) return true;
        // Monetization siblings share the Advertise nav highlight.
        if ((activePage === 'sponsors' || activePage === 'billing') && item.key === 'advertise') return true;
        return false;
    }

    function buildNavLinks(activePage) {
        return NAV_ITEMS.filter(function (item) {
            return isNavItemVisible(item) && !MORE_NAV_ITEMS[item.key];
        }).map(function (item) {
            var cls = isNavItemActive(item, activePage) ? 'nav-link active' : 'nav-link';
            if (MOBILE_MORE_NAV_ITEMS[item.key]) cls += ' nav-link-mobile-more';
            var i18nAttr = item.i18n ? ' data-i18n="' + item.i18n + '"' : '';
            return '<a href="' + item.href + '" class="' + cls + '"' + i18nAttr + '>' + item.fallback + '</a>';
        }).join('');
    }

    function buildMoreMenu(activePage) {
        var moreItems = NAV_ITEMS.filter(function (item) {
            return isNavItemVisible(item) && MORE_NAV_ITEMS[item.key];
        });
        if (moreItems.length === 0) return '';

        var hasActiveChild = moreItems.some(function (item) {
            return isNavItemActive(item, activePage);
        });
        var hasMobileActiveChild = NAV_ITEMS.some(function (item) {
            return MOBILE_MORE_NAV_ITEMS[item.key] && isNavItemActive(item, activePage);
        });
        var triggerCls = 'nav-link more-trigger' +
            (hasActiveChild ? ' active' : '') +
            (hasMobileActiveChild ? ' mobile-active' : '');

        var dropdownItems = moreItems.map(function (item) {
            var cls = isNavItemActive(item, activePage) ? 'more-option active' : 'more-option';
            var i18nAttr = item.i18n ? ' data-i18n="' + item.i18n + '"' : '';
            return '<a href="' + item.href + '" class="' + cls + '"' + i18nAttr + '>' + item.fallback + '</a>';
        }).join('');
        var mobileDropdownItems = NAV_ITEMS.filter(function (item) {
            return isNavItemVisible(item) && MOBILE_MORE_NAV_ITEMS[item.key];
        }).map(function (item) {
            var cls = isNavItemActive(item, activePage)
                ? 'more-option more-option-mobile active'
                : 'more-option more-option-mobile';
            var i18nAttr = item.i18n ? ' data-i18n="' + item.i18n + '"' : '';
            return '<a href="' + item.href + '" class="' + cls + '"' + i18nAttr + '>' + item.fallback + '</a>';
        }).join('');

        return (
            '<div class="more-menu">' +
            '<button type="button" class="' + triggerCls + '" aria-haspopup="true" aria-expanded="false">More</button>' +
            '<div class="more-dropdown">' + mobileDropdownItems + dropdownItems + '</div>' +
            '</div>'
        );
    }

    function buildHeaderHtml(activePage) {
        var socialLinksHtml =
            '<a class="social-link social-x" href="https://x.com/i/communities/1899916294415409599" target="_blank" rel="noopener noreferrer" aria-label="Join the community on X">𝕏</a>' +
            '<a class="social-link social-instagram" href="https://www.instagram.com/vibesailgame/" target="_blank" rel="noopener noreferrer" aria-label="Follow VibeSail on Instagram">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<rect x="3" y="3" width="18" height="18" rx="5"></rect>' +
            '<circle cx="12" cy="12" r="4"></circle>' +
            '<circle cx="17.5" cy="6.5" r="1"></circle>' +
            '</svg>' +
            '</a>' +
            '<a class="social-link social-threads" href="https://www.threads.com/@vibesailgame" target="_blank" rel="noopener noreferrer" aria-label="Follow VibeSail on Threads">' +
            '<svg width="18" height="18" viewBox="0 0 192 192" fill="currentColor" aria-hidden="true">' +
            '<path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path>' +
            '</svg>' +
            '</a>';

        socialLinksHtml = '<div class="nav-social-actions" role="group" aria-label="VibeSail social links">' + socialLinksHtml + '</div>';

        return (
            '<nav class="navbar site-page-nav">' +
            '<a href="/" class="logo-brand" aria-label="VibeSail Home">' +
            '<img class="logo-icon" src="/favicon.ico" alt="VibeSail">' +
            '<span class="logo-text">VibeSail</span>' +
            '</a>' +
            '<div class="nav-links-container">' +
            buildNavLinks(activePage) +
            buildMoreMenu(activePage) +
            '</div>' +
            '<div class="nav-actions">' +
            '<div id="lang-menu" class="lang-menu">' +
            '<button class="lang-button" type="button" data-lang-toggle aria-haspopup="listbox" aria-expanded="false" aria-label="Choose language">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<circle cx="12" cy="12" r="9"></circle>' +
            '<path d="M3.6 9h16.8"></path>' +
            '<path d="M3.6 15h16.8"></path>' +
            '<path d="M12 3c2.8 3.2 2.8 14.8 0 18"></path>' +
            '<path d="M12 3c-2.8 3.2-2.8 14.8 0 18"></path>' +
            '</svg>' +
            '<span class="lang-label" data-lang-label>EN</span>' +
            '</button>' +
            '<div class="lang-dropdown" data-lang-menu role="listbox" aria-label="Select language"></div>' +
            '</div>' +
            socialLinksHtml +
            '<div class="nav-profile-actions">' +
            '<a class="profile-action" href="/profile" data-i18n-attr="aria-label:ui.profile" aria-label="Profile">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>' +
            '<circle cx="12" cy="7" r="4"></circle>' +
            '</svg>' +
            '<span class="profile-action-label" data-i18n="ui.profile">Profile</span>' +
            '</a>' +
            '</div>' +
            '</div>' +
            '</nav>'
        );
    }

    function getHeaderExtraGapPx() {
        var fallback = 16;
        try {
            var raw = window.getComputedStyle(document.documentElement).getPropertyValue('--vs-header-extra-gap');
            var parsed = parseFloat(raw);
            if (!Number.isNaN(parsed)) return parsed;
        } catch (_) { }
        return fallback;
    }

    function updateHeaderClearance(navEl) {
        if (!navEl) return;
        try {
            var rect = navEl.getBoundingClientRect();
            var extra = getHeaderExtraGapPx();
            var clearance = Math.max(0, Math.ceil(rect.bottom + extra));
            document.documentElement.style.setProperty('--vs-header-clearance', clearance + 'px');
        } catch (_) { }
    }

    function bindHeaderMetrics(navEl) {
        if (!navEl || navEl.__vsHeaderMetricsBound) return;
        navEl.__vsHeaderMetricsBound = true;

        var queued = false;
        function scheduleUpdate() {
            if (queued) return;
            queued = true;
            window.requestAnimationFrame(function () {
                queued = false;
                updateHeaderClearance(navEl);
            });
        }

        scheduleUpdate();
        setTimeout(scheduleUpdate, 120);

        window.addEventListener('resize', scheduleUpdate, { passive: true });
        window.addEventListener('orientationchange', scheduleUpdate, { passive: true });
        window.addEventListener('language:changed', scheduleUpdate);

        if (window.ResizeObserver) {
            var observer = new ResizeObserver(scheduleUpdate);
            observer.observe(navEl);
            navEl.__vsHeaderResizeObserver = observer;
        }

        if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
            document.fonts.ready.then(scheduleUpdate).catch(function () { });
        }
    }

    function bindMoreMenu(navEl) {
        if (!navEl) return;
        var menu = navEl.querySelector('.more-menu');
        if (!menu) return;
        var trigger = menu.querySelector('.more-trigger');
        if (!trigger) return;

        function closeMenu() {
            menu.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            if (menu.classList.contains('open')) {
                closeMenu();
            } else {
                var langMenu = navEl.querySelector('.lang-menu');
                if (langMenu) langMenu.classList.remove('open');
                menu.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });

        document.addEventListener('click', closeMenu);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });
    }

    function render(activePage) {
        var resolved = activePage || inferActivePage(window.location.pathname || '/');
        var existing = document.querySelector('.site-page-nav');
        if (existing) {
            bindHeaderMetrics(existing);
            return;
        }

        var html = buildHeaderHtml(resolved);
        var current = document.currentScript;
        var navEl = null;
        if (current && current.parentNode) {
            current.insertAdjacentHTML('beforebegin', html);
            navEl = current.previousElementSibling;
        } else if (document.body) {
            document.body.insertAdjacentHTML('afterbegin', html);
            navEl = document.querySelector('.site-page-nav');
        }

        bindHeaderMetrics(navEl);
        bindMoreMenu(navEl);
    }

    window.VibeSailHeader = {
        render: render
    };
})();
