# Language Toggle by Flag — OJS/OMP/OPS plugin

[![OJS](https://img.shields.io/badge/OJS-3.5-brightgreen)](https://pkp.sfu.ca/ojs/)
[![Version](https://img.shields.io/badge/version-3.5.0.7-blue)](version.xml)
[![License](https://img.shields.io/badge/license-GPL--3.0-lightgrey)](LICENSE)

**⬇️ Install package:** [OJS/OMP/OPS 3.5](https://github.com/OJSBR/languageToggleByFlag/releases/download/3.5.0.7/languageToggleByFlag-3.5.0.7.tar.gz) — or browse all [Releases](../../releases).

A **block plugin** for **Open Journal Systems (OJS)**, **Open Monograph Press (OMP)** and
**Open Preprint Systems (OPS)** that renders the language switcher in the sidebar as a list of
**country flags** with each language name, instead of the plain default toggle.

> **Maintained by [OJSBR](https://ojsbr.com).** Adapted for PKP 3.5 from the original
> `languageToggleByFlag` plugin by **Lepidus Tecnologia**. See the
> [Credits & authorship](#credits--authorship) section below.

## Compatibility & branches

| PKP version | Branch | Plugin release |
|-------------|--------|----------------|
| OJS/OMP/OPS 3.5.x | [`stable-3_5_0`](../../tree/stable-3_5_0) *(default)* | 3.5.0.7 |

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

- **PHPUnit** (`tests/*Test.php`, on `PKP\tests\PKPTestCase`): the classes against the installed
  PKP, the plugin found by PKP's plugin registry, the stylesheet rules matching the flag images
  shipped, flags only for languages that have one, escaping in the template and the 38
  translations. From the application root:

  ```bash
  lib/pkp/lib/vendor/bin/phpunit --configuration lib/pkp/tests/phpunit.xml --no-coverage "$PWD/plugins/blocks/languageToggleByFlag/tests"
  ```

- **Cypress** (`cypress/tests/functional/LanguageToggleByFlag.cy.js`, run by
  [pkp-github-actions](https://github.com/pkp/pkp-github-actions) on OJS, OMP and OPS on every
  push): enables the plugin and places the block in the sidebar, then on a reader page checks that
  the stylesheet loads once, the flags are drawn, and the link of a language brings the reader back
  to the same page, also when the browser sends no `Referer` (it fails with the path-only link of releases before 3.5.0.4).
  The sidebar is put back after the run.
- Verified on OJS 3.5.0.3.

Tests are kept in the repository and are not part of the release package.

## Credits & authorship

- **Maintained by** [OJSBR](https://ojsbr.com) — adaptation to PKP 3.5.
- **Original work:** `languageToggleByFlag` by **Lepidus Tecnologia**
  (<https://github.com/lepidus/languageToggleByFlag>), © Lepidus Tecnologia 2019–2024,
  © Simon Fraser University / John Willinsky.
- Distributed under the **GNU GPL v3**, consistent with the original licensing.

## AI use

Generative AI (Claude, by Anthropic) was used to write and run tests, improve the code and bring
it in line with PKP standards. Every change is reviewed and tested by OJSBR, which is responsible
for the published releases.

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

PHPUnit em `tests/` (sobre `PKP\tests\PKPTestCase`) e Cypress em `cypress/tests/functional/`
(rodado pelo [pkp-github-actions](https://github.com/pkp/pkp-github-actions) no OJS, OMP e OPS a
cada push), com os comandos da seção em inglês. A suíte cobre as classes contra o PKP instalado, o
plugin encontrado pelo registro de plugins, as regras do CSS batendo com as bandeiras distribuídas,
bandeira só para idioma que tem imagem, escape no template e as 38 traduções. O Cypress liga o
plugin, põe o bloco na barra lateral e, numa página do leitor, confere o CSS carregado uma vez, as
bandeiras e que o link de cada idioma devolve o leitor à mesma página, inclusive quando o navegador
não envia `Referer` (falha com o link só com caminho das versões anteriores à 3.5.0.4); a barra lateral volta ao que era no fim.
Verificado no OJS 3.5.0.3.

Os testes ficam no repositório e não fazem parte do pacote da release.

### Créditos e autoria

- **Mantido pela** [OJSBR](https://ojsbr.com) — adaptação para o PKP 3.5.
- **Trabalho original:** `languageToggleByFlag` da **Lepidus Tecnologia**
  (<https://github.com/lepidus/languageToggleByFlag>), © Lepidus Tecnologia 2019–2024,
  © Simon Fraser University / John Willinsky.
- Distribuído sob a **GNU GPL v3**, coerente com o licenciamento original.

### Uso de IA

Foi usada IA generativa (Claude, da Anthropic) para escrever e rodar testes, melhorar o código e
alinhá-lo aos padrões da PKP. Toda mudança é revisada e testada pela OJSBR, que responde pelas
releases publicadas.

### Licença

Distribuído sob a **GNU GPL v3**. Veja [`LICENSE`](LICENSE) e `docs/COPYING`.
