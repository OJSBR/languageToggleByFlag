# Language Toggle by Flag — OJS/OMP/OPS plugin

[![OJS](https://img.shields.io/badge/OJS-3.5-brightgreen)](https://pkp.sfu.ca/ojs/)
[![Version](https://img.shields.io/badge/version-3.5.0.6-blue)](version.xml)
[![License](https://img.shields.io/badge/license-GPL--3.0-lightgrey)](LICENSE)

**⬇️ Install package:** [OJS/OMP/OPS 3.5](https://github.com/OJSBR/languageToggleByFlag/releases/download/3.5.0.6/languageToggleByFlag-3.5.0.6.tar.gz) — or browse all [Releases](../../releases).

A **block plugin** for **Open Journal Systems (OJS)**, **Open Monograph Press (OMP)** and
**Open Preprint Systems (OPS)** that renders the language switcher in the sidebar as a list of
**country flags** with each language name, instead of the plain default toggle.

> **Maintained by [OJSBR](https://ojsbr.com).** Adapted for PKP 3.5 from the original
> `languageToggleByFlag` plugin by **Lepidus Tecnologia**. See the
> [Credits & authorship](#credits--authorship) section below.

## Compatibility & branches

| PKP version | Branch | Plugin release |
|-------------|--------|----------------|
| OJS/OMP/OPS 3.5.x | [`stable-3_5_0`](../../tree/stable-3_5_0) *(default)* | 3.5.0.6 |

> Need 3.4 or earlier? Use the original repository:
> [lepidus/languageToggleByFlag](https://github.com/lepidus/languageToggleByFlag).

## The problem

The default language toggle is a plain list or drop-down of language names. In a multilingual
journal, readers who do not read the current interface language have to find their own language in
that list; a flag next to each name makes the switcher recognizable at a glance.

## What it does

- Lists every language enabled for the site or journal, each with its name in that language and,
  when the plugin ships an image for it, a flag (24 flags). Languages without a flag are listed by
  name only.
- Switching language keeps the reader on the same page.

## Installation

1. Install via **Settings → Website → Plugins → Upload A New Plugin**, or extract the folder
   into `plugins/blocks/` so you get `plugins/blocks/languageToggleByFlag/`.
2. Enable **Language Toggle By Flag** under the *Block* plugins list.
3. Place the block in the sidebar under **Settings → Website → Appearance → Sidebar**.

## Notes (PKP 3.5)

- **3.5 compatibility:** `PKP\session\SessionManager` was removed in 3.5 (session handling moved
  to a Laravel-based guard), so the plugin now uses
  `PKP\core\PKPSessionGuard::isSessionDisable()`.
- **Consistent casing (OJSBR):** the ICU library returns each language's endonym with its native
  casing (`English`, but `español`/`português` in lowercase). This build normalizes every language
  name to an initial uppercase letter — multibyte-safe — so the list reads
  `English / Español / Português`.

## Tests

- **PHP suite** (`tests/`, 19 tests): the plugin class against the installed PKP, the stylesheet
  rules matching the flag images shipped, the languages listed with and without a flag, escaping in
  the template and the 38 translations. Run either way from the application root:

  ```bash
  php plugins/blocks/languageToggleByFlag/tests/run.php
  lib/pkp/lib/vendor/bin/phpunit --configuration lib/pkp/tests/phpunit.xml --no-coverage "$PWD/plugins/blocks/languageToggleByFlag/tests"
  ```

- **Cypress** (`cypress/tests/functional/LanguageToggleByFlag.cy.js`): on a journal page, the block
  loads its stylesheet once, shows the flags and switching language keeps the reader on the same
  page. Verified on OJS 3.5.0.3.

## Credits & authorship

- **Maintained by** [OJSBR](https://ojsbr.com) — adaptation to PKP 3.5.
- **Original work:** `languageToggleByFlag` by **Lepidus Tecnologia**
  (<https://github.com/lepidus/languageToggleByFlag>), © Lepidus Tecnologia 2019–2024,
  © Simon Fraser University / John Willinsky.
- Distributed under the **GNU GPL v3**, consistent with the original licensing.

## Contributing

Issues and pull requests are welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

Distributed under the **GNU GPL v3**. See [`LICENSE`](LICENSE) and `docs/COPYING`.

---

## 🇧🇷 Português

Plugin de **bloco** para **Open Journal Systems (OJS)**, **Open Monograph Press (OMP)** e
**Open Preprint Systems (OPS)** que exibe o seletor de idiomas na barra lateral como uma lista de
**bandeiras** com o nome de cada idioma, no lugar do seletor padrão simples.

> **Mantido pela [OJSBR](https://ojsbr.com).** Adaptado para o PKP 3.5 a partir do plugin
> original `languageToggleByFlag` da **Lepidus Tecnologia**. Veja a seção
> [Créditos e autoria](#créditos-e-autoria) abaixo.

### O problema

O seletor de idiomas padrão é uma lista simples de nomes. Numa revista multilíngue, quem não lê o
idioma atual da interface precisa achar o seu nessa lista; a bandeira ao lado de cada nome torna o
seletor reconhecível de relance.

### O que faz

- Lista os idiomas ativos no site ou na revista, cada um com o nome no próprio idioma e, quando o
  plugin traz a imagem, uma bandeira (24 bandeiras). Idiomas sem bandeira aparecem só com o nome.
- Trocar de idioma mantém o leitor na mesma página.

### Instalação

1. Instale em **Configurações → Website → Plugins → Enviar um novo plugin**, ou extraia a pasta
   em `plugins/blocks/` (ficando `plugins/blocks/languageToggleByFlag/`).
2. Ative o **Language Toggle By Flag** na lista de plugins de *Bloco*.
3. Posicione o bloco na barra lateral em **Configurações → Website → Aparência → Barra lateral**.

### Notas (PKP 3.5)

- **Compatibilidade 3.5:** a classe `PKP\session\SessionManager` foi removida no 3.5 (a sessão
  passou a ser gerenciada pelo Laravel), então o plugin agora usa
  `PKP\core\PKPSessionGuard::isSessionDisable()`.
- **Padronização de maiúsculas (OJSBR):** o ICU devolve o endônimo de cada idioma com a grafia
  nativa (`English`, mas `español`/`português` em minúscula). Esta versão normaliza todos os nomes
  para inicial maiúscula (seguro para acentos), exibindo `English / Español / Português`.

### Testes

Suíte PHP em `tests/` (19 testes, pelo `tests/run.php` ou pelo PHPUnit do PKP): classe do plugin
contra o PKP instalado, regras do CSS batendo com as bandeiras distribuídas, idiomas com e sem
bandeira, escape no template e as 38 traduções. Spec Cypress em `cypress/tests/functional/`: o bloco
carrega o CSS uma vez, mostra as bandeiras e a troca de idioma mantém a página. Verificado no
OJS 3.5.0.3.

### Créditos e autoria

- **Mantido pela** [OJSBR](https://ojsbr.com) — adaptação para o PKP 3.5.
- **Trabalho original:** `languageToggleByFlag` da **Lepidus Tecnologia**
  (<https://github.com/lepidus/languageToggleByFlag>), © Lepidus Tecnologia 2019–2024,
  © Simon Fraser University / John Willinsky.
- Distribuído sob a **GNU GPL v3**, coerente com o licenciamento original.

### Licença

Distribuído sob a **GNU GPL v3**. Veja [`LICENSE`](LICENSE) e `docs/COPYING`.
