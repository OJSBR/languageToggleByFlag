# Changelog

All notable changes to this plugin are documented here.

## 3.5.0.4 — 2026-08-03

**Compatibility fix (no new features).**

- **Fixed:** switching languages sent the reader to the **portal home page** instead of keeping
  them on the current journal and page (e.g. `/artce/pt_BR` + flag `en` → `/index/en` instead of
  `/artce/en`).

  OJS 3.5 changed the contract of the `source` parameter of `user/setLocale`: the redirect target
  is now built by `PKPPageRouter::_setLocale()` as `protocol://<source>`, so `source` must carry
  **host + path**. The plugin was sending only the path (`$smarty.server.REQUEST_URI`), which
  produced `https:///path` — an empty host that fails `isAllowedHost()`, leaving the target empty
  and falling back to the portal home. On OJS 3.3 a bare path was still accepted, which is why the
  plugin worked there.

  The template now sends `$smarty.server.SERVER_NAME|cat:$smarty.server.REQUEST_URI`, byte for
  byte the same as the core `languageToggle` block plugin shipped with OJS 3.5.

  Diagnosed and validated on OJS 3.5.0.5 (UFG homolog) and independently reproduced and verified
  on OJS 3.5.0.3: all flags now keep the journal, and an internal page such as
  `/journal/pt_BR/about` correctly becomes `/journal/en/about`.

> **Upgrading:** clear the compiled template cache (`cache/t_compile/`) after updating, otherwise
> Smarty keeps serving the previously compiled template.

## 3.5.0.3 and earlier

Adaptation of the original `languageToggleByFlag` plugin by **Lepidus Tecnologia** to OJS/OMP/OPS
3.5, plus the flag set and packaging maintained by OJSBR. See the repository history.
