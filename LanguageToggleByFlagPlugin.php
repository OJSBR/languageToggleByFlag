<?php

/**
 * @file plugins/blocks/languageToggleByFlag/LanguageToggleByFlagPlugin.php
 *
 * Copyright (c) 2014-2021 Simon Fraser University
 * Copyright (c) 2003-2021 John Willinsky
 * Copyright (c) 2019-2024 Lepidus Tecnologia
 * Copyright (c) 2026 OJSBR (https://ojsbr.com)
 *
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @class LanguageToggleByFlagPlugin
 * @ingroup plugins_blocks_languageToggleByFlag
 *
 * @brief Class for language selector by flag block plugin
 */

namespace APP\plugins\blocks\languageToggleByFlag;

use PKP\plugins\BlockPlugin;
use PKP\config\Config;
use PKP\core\PKPSessionGuard;
use APP\core\Application;
use PKP\facades\Locale;
use PKP\i18n\LocaleMetadata;

class LanguageToggleByFlagPlugin extends BlockPlugin
{
    public function getInstallSitePluginSettingsFile()
    {
        return $this->getPluginPath() . '/settings.xml';
    }

    public function getContextSpecificPluginSettingsFile()
    {
        return $this->getPluginPath() . '/settings.xml';
    }

    public function getSeq($contextId = null)
    {
        if (!Config::getVar('general', 'installed')) {
            return 3;
        }
        return parent::getSeq($contextId);
    }

    public function getDisplayName()
    {
        return __('plugins.block.languageToggleByFlag.displayName');
    }

    public function getDescription()
    {
        return __('plugins.block.languageToggleByFlag.description');
    }

    /**
     * The locales of a list that have a flag image in the plugin.
     *
     * @param string[] $localeKeys
     *
     * @return string[]
     */
    public function getLocalesWithFlag(array $localeKeys): array
    {
        return array_values(array_filter($localeKeys, fn ($locale) => preg_match('/^[a-zA-Z_@]+$/', (string) $locale) && is_file($this->getPluginPath() . '/locale/' . $locale . '/flag.png')));
    }

    public function getContents($templateMgr, $request = null)
    {
        $request ??= Application::get()->getRequest();
        $templateMgr->assign('isPostRequest', $request->isPost());

        if (!PKPSessionGuard::isSessionDisable()) {
            $context = $request->getContext();
            $locales = Locale::getFormattedDisplayNames(
                isset($context)
                    ? $context->getSupportedLocales()
                    : $request->getSite()->getSupportedLocales(),
                Locale::getLocales(),
                LocaleMetadata::LANGUAGE_LOCALE_ONLY
            );
        } else {
            $locales = Locale::getFormattedDisplayNames(null, null, LocaleMetadata::LANGUAGE_LOCALE_ONLY);
        }

        if (!empty($locales)) {
            // Normalise language names to start with a capital letter (multibyte-safe):
            // ICU returns the endonym with its native casing (English, but "espanol" /
            // "portugues" in lower case), so we upper-case the first letter of each name.
            $locales = array_map(
                fn($name) => mb_strtoupper(mb_substr($name, 0, 1)) . mb_substr($name, 1),
                $locales
            );
            $templateMgr->assign([
                'enableLanguageToggle' => true,
                'languageToggleLocales' => $locales,
                // A language without a flag image is listed by name only, without an empty gap.
                'languageToggleFlags' => $this->getLocalesWithFlag(array_keys($locales)),
                'languageToggleStyleUrl' => $request->getBaseUrl() . '/' . $this->getPluginPath() . '/styles/flagToggle.css',
            ]);
        }

        return parent::getContents($templateMgr, $request);
    }
}
