<?php

/**
 * @file plugins/blocks/languageToggleByFlag/tests/LanguageToggleByFlagTest.php
 *
 * Copyright (c) 2026 OJSBR (https://ojsbr.com)
 * Distributed under the GNU GPL v3. For full terms see the file docs/COPYING.
 *
 * @class LanguageToggleByFlagTest
 *
 * @brief Flags, the stylesheet and the template of the block.
 */

namespace APP\plugins\blocks\languageToggleByFlag\tests;

use APP\plugins\blocks\languageToggleByFlag\LanguageToggleByFlagPlugin;

class LanguageToggleByFlagTest extends TestCase
{
    public function testEveryStylesheetRulePointsToAnExistingFlag(): void
    {
        $root = dirname(__DIR__);
        preg_match_all('#\.flagToggle\.([A-Za-z_@]+) \{\s*background-image: url\("\.\./locale/([^/]+)/flag\.png"\)#', (string) file_get_contents($root . '/styles/flagToggle.css'), $m, PREG_SET_ORDER);
        $this->assertNotEmpty($m);
        foreach ($m as [, $class, $folder]) {
            $this->assertSame($class, $folder, "The class {$class} points to another folder.");
            $this->assertTrue(is_file($root . '/locale/' . $folder . '/flag.png'), "No flag for {$class}.");
        }
    }

    public function testEveryFlagHasAStylesheetRule(): void
    {
        $root = dirname(__DIR__);
        $css = (string) file_get_contents($root . '/styles/flagToggle.css');
        foreach (glob($root . '/locale/*/flag.png') as $flag) {
            $locale = basename(dirname($flag));
            $this->assertStringContainsString('.flagToggle.' . $locale . ' {', $css, "The flag of {$locale} is never shown.");
        }
    }

    public function testOnlyLocalesWithAFlagImageGetOne(): void
    {
        $plugin = new class () extends LanguageToggleByFlagPlugin {
            public function getPluginPath()
            {
                return dirname(__DIR__);
            }
        };
        $this->assertSame(['en', 'pt_BR'], $plugin->getLocalesWithFlag(['en', 'pl', 'pt_BR', '../../etc']));
    }

    public function testTheTemplateEscapesNamesAndDrawsFlagsOnlyWhenTheyExist(): void
    {
        $template = (string) file_get_contents(dirname(__DIR__) . '/templates/block.tpl');
        $this->assertStringContainsString('{$localeName|escape}', $template);
        $this->assertStringContainsString('{if in_array($localeKey, $languageToggleFlags)}', $template);
        $this->assertStringNotContainsString('{$baseUrl}/plugins/blocks', $template);
    }
}
