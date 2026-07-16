{**
 * plugins/blocks/languageToggle/block.tpl
 *
 * Copyright (c) 2014-2019 Simon Fraser University
 * Copyright (c) 2003-2019 John Willinsky
 * Distributed under the GNU GPL v3.0. For full terms see the file docs/COPYING.
 *
 * Common site sidebar menu -- language toggle.
 *}

<link rel="stylesheet" type="text/css" href="/plugins/blocks/languageToggleByFlag/styles/flagToggle.css">

{if $enableLanguageToggle}
<div class="pkp_block block_language language_toggle_flag">
	<span class="title">
		{translate key="common.language"}
	</span>

	<div class="content">
		<ul>
			{foreach from=$languageToggleLocales item=localeName key=localeKey}
				<li class="locale_{$localeKey|escape}{if $localeKey == $currentLocale} current{/if}" lang="{$localeKey|replace:"_":"-"}">
					<a href="{url router=\PKP\core\PKPApplication::ROUTE_PAGE page="user" op="setLocale" path=$localeKey source=$smarty.server.REQUEST_URI}">

						{* Adding a flag according to every language *}
						<span class="flagToggle {$localeKey}">
							&nbsp;
						</span>

						{* Improve the UX making the selected language be bold *}
						{if $currentLocale === $localeKey}
							<strong>{$localeName}</strong>
						{else}
							{$localeName}
						{/if}
					</a>
				</li>
			{/foreach}
		</ul>
	</div>
</div><!-- .block_language -->
{/if}
