/**
 * @file cypress/tests/functional/LanguageToggleByFlag.cy.js
 *
 * Copyright (c) 2026 OJSBR (https://ojsbr.com)
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * Functional tests: the language switcher a reader sees.
 *
 * Parameters (--env): contextPath, adminUser, adminPassword (captcha on login
 * must be off for the run), pagePath (a reader page; default "about"). The
 * defaults match the data set of PKP's continuous integration, whose journal
 * offers two languages. The first test enables the plugin and places the block
 * in the sidebar when needed; the sidebar is put back as it was after the run.
 */

describe('Language Toggle by Flag plugin', function() {
	const contextPath = Cypress.env('contextPath') || 'publicknowledge';
	const adminUser = Cypress.env('adminUser') || 'admin';
	const adminPassword = Cypress.env('adminPassword') || 'admin';
	const pagePath = Cypress.env('pagePath') || 'about';

	const block = 'languagetogglebyflagplugin';
	let originalSidebar = null;

	// ---- OJSBR spec helpers (padrão v2): work on OJS/OMP 3.3, 3.4 and 3.5 and in PKP's CI ----

	const pageUrl = (path) => '/index.php/' + contextPath + (path ? '/' + path : '');

	// Same as PKP's cy.waitJQuery(), which the support files of OJS 3.3 test sites may lack.
	// The Plugins tab can keep requests open for a while (the plugin gallery), hence the timeout.
	const waitJQuery = () => cy.window().its('jQuery.active', {timeout: 60000}).should('eq', 0);

	// Requests carry the browser's User-Agent: OJS 3.3 drops a session whose agent changes.
	const request = (options) => cy.window({log: false}).then((win) => cy.request(Object.assign(
		typeof options === 'string' ? {url: options} : options,
		{headers: Object.assign({'User-Agent': win.navigator.userAgent}, (typeof options === 'string' ? {} : options.headers) || {})}
	)));

	// Signs in through requests (the login page can re-render while it is typed into), then
	// falls back to the form when the session did not stick (OJS 3.3 cookie handling).
	const login = (username, password) => {
		cy.clearCookies();
		request(pageUrl('login')).then((response) => {
			const token = /name="csrfToken" value="([^"]+)"/.exec(response.body)[1];
			// The form posts to the URL with the language: a redirect would turn the POST into a GET.
			const action = /<form[^>]*id="login"[^>]*action="([^"]+)"/.exec(response.body)[1];
			request({method: 'POST', url: action, form: true, body: {csrfToken: token, username: username, password: password}, log: false});
		});
		cy.visit(pageUrl('submissions') + '?reload=' + Date.now());
		cy.get('body').then(($body) => {
			if ($body.find('form#login').length) {
				cy.get('form#login input[name="username"]').type(username, {delay: 0});
				cy.get('form#login input[name="password"]').type(password, {delay: 0, log: false});
				cy.get('form#login').submit();
				cy.get('form#login', {timeout: 30000}).should('not.exist');
			}
		});
	};

	// REST API calls made from the page itself, so they carry the browser's own session.
	const api = (path, options = {}) => cy.window({log: false}).then((win) => cy.wrap(
		win.fetch(path, Object.assign({credentials: 'same-origin'}, options)).then((response) => {
			if (!response.ok) {
				return response.text().then((text) => {
					throw new Error(path + ' answered ' + response.status + ': ' + text.slice(0, 300));
				});
			}
			return response.json();
		}),
		{log: false, timeout: 30000}
	));

	// The website settings page on its Plugins tab (a new query string forces a load). Load it
	// once per test: loading it again while its plugin gallery request is pending stalls the
	// web server of PKP's CI; API calls and settings modals work on the page already open.
	const openPluginsTab = () => {
		cy.visit(pageUrl('management/settings/website') + '?reload=' + Date.now() + '#plugins');
		cy.get('button[id="plugins-button"]', {timeout: 60000}).click();
		cy.get('button[id="plugins-button"]').should('have.attr', 'aria-selected', 'true');
		waitJQuery();
	};

	// Enables the plugin in the grid when it is off (never turns it off).
	const enablePlugin = (rowName) => {
		cy.get('input[id^="select-cell-' + rowName + '-enabled"]', {timeout: 30000}).then(($checkbox) => {
			if (!$checkbox.is(':checked')) {
				cy.wrap($checkbox).click();
				waitJQuery();
			}
		});
		cy.get('input[id^="select-cell-' + rowName + '-enabled"]').should('be.checked');
	};

	// Opens the settings modal from the grid, without reloading the page: a reload right
	// after saving can stall the web server of PKP's CI. The form is fetched each time.
	const openPluginSettings = (rowName, formSelector) => {
		cy.get('a[id*="-row-' + rowName + '-settings-button-"]', {timeout: 30000}).then(($link) => {
			if (!$link.is(':visible')) {
				cy.get('tr[id$="-row-' + rowName + '"] a.show_extras').first().click();
			}
		});
		// The grid may still be animating the extras row: the link is clicked once it exists.
		cy.get('a[id*="-row-' + rowName + '-settings-button-"]').first().click({force: true});
		waitJQuery();
		cy.window().should((win) => {
			expect(win.jQuery(formSelector).data('pkp.handler')).to.exist;
		});
	};

	// ---- end of helpers ----

	// The journal of contextPath with all its settings, and the CSRF token of the page.
	const withJournal = (callback) => {
		cy.window({timeout: 60000}).its('pkp.currentUser.csrfToken').then((token) => {
			api('/index.php/index/api/v1/contexts?count=100').then((list) => {
				const journal = list.items.find((item) => item.urlPath === contextPath);
				api(pageUrl('api/v1/contexts/' + journal.id)).then((details) => callback(details, token));
			});
		});
	};

	const saveSidebar = (journal, token, sidebar) => api(pageUrl('api/v1/contexts/' + journal.id), {
		method: 'PUT',
		headers: {'Content-Type': 'application/json', 'X-Csrf-Token': token},
		body: JSON.stringify({sidebar: sidebar}),
	});

	it('Enables the plugin and places the block in the sidebar', function() {
		login(adminUser, adminPassword);
		openPluginsTab();
		enablePlugin(block);
		withJournal((journal, token) => {
			originalSidebar = journal.sidebar || [];
			if (!originalSidebar.includes(block)) {
				saveSidebar(journal, token, [block].concat(originalSidebar));
			}
		});
	});

	it('Lists the languages with their flags and switches language on the same page', function() {
		cy.clearCookies();
		cy.visit(pageUrl(pagePath) + '?reload=' + Date.now());
		cy.get('link[href*="/languageToggleByFlag/styles/flagToggle.css"]').should('have.length', 1);
		cy.get('.language_toggle_flag li').should('have.length.at.least', 2);

		cy.get('.language_toggle_flag li .flagToggle').each(($flag) => {
			cy.wrap($flag).should('have.attr', 'aria-hidden', 'true');
			cy.window().then((win) => {
				expect(win.getComputedStyle($flag[0]).backgroundImage, 'a drawn flag has an image').to.match(/flag\.png/);
			});
		});

		cy.get('.language_toggle_flag li:not(.current)').first().then(($li) => {
			const locale = $li.attr('class').match(/locale_([A-Za-z_@]+)/)[1];
			const href = $li.find('a').attr('href');
			// Without a Referer header (a privacy setting, a link opened directly) OJS 3.5 relies
			// on the source of the link alone: it must bring the reader back to the same page,
			// not to the portal home. cy.request() sends no Referer, a click does.
			request({url: href, followRedirect: false}).then((response) => {
				expect(response.status).to.eq(302);
				const target = new URL(response.redirectedToUrl);
				expect(target.pathname).to.contain('/' + contextPath + '/');
				expect(target.pathname).to.match(new RegExp('/' + pagePath + '$'));
			});
			// The request above already switched the session: start again from a new one.
			cy.clearCookies();
			cy.visit(pageUrl(pagePath) + '?reload=' + Date.now());
			cy.get('.language_toggle_flag li.locale_' + locale + ' a').click();
			cy.get('.language_toggle_flag li.locale_' + locale, {timeout: 30000}).should('have.class', 'current');
			cy.location('pathname').should('match', new RegExp('/' + pagePath + '$'));
		});
	});

	// Puts the sidebar back as it was, also when a test failed.
	after(function() {
		if (originalSidebar === null || originalSidebar.includes(block)) {
			return;
		}
		login(adminUser, adminPassword);
		withJournal((journal, token) => saveSidebar(journal, token, originalSidebar));
	});
});
