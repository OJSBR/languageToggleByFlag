/**
 * @file cypress/tests/functional/LanguageToggleByFlag.cy.js
 *
 * Copyright (c) 2026 OJSBR (https://ojsbr.com)
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * Functional test: the language switcher a reader sees.
 *
 * Parameters (--env): contextPath, pagePath (a reader page with the block; default
 * "about"). The block must be enabled and in the sidebar, and the journal must
 * offer at least two languages. No login, nothing changed on the server.
 */

describe('Language Toggle by Flag plugin', function() {
	const contextPath = Cypress.env('contextPath') || 'publicknowledge';
	const pagePath = Cypress.env('pagePath') || 'about';

	it('Lists the languages with their flags and switches language on the same page', function() {
		cy.visit('/index.php/' + contextPath + '/' + pagePath, {headers: {Cookie: 'OJSSID=cypress' + Date.now()}});
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
			cy.wrap($li).find('a').click();
			cy.location('pathname').should('contain', '/' + contextPath + '/').and('contain', '/' + pagePath);
			cy.get('.language_toggle_flag li.locale_' + locale).should('have.class', 'current');
		});
	});
});
