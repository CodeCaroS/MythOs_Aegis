---
name: security-checklist-de
description: >
  Deutschsprachige, repository-weite Security-Testcheckliste für Webanwendungen
  und APIs: OWASP-Top-10-Angriffsklassen, Auth/Session/Cookie-Härtung,
  API-Sicherheit, Verschlüsselung, Security-Header, Infrastruktur/Betrieb,
  Test- und Reviewprozesse sowie DSGVO-Pflichten. Use when a repository must
  be audited against XSS, SQL-Injection, CSRF, SSRF, IDOR/BOLA, session and
  cookie security, CORS, secret handling, security headers, dependency and
  patch hygiene, SAST/DAST/pentest coverage, or GDPR obligations before
  release or as a recurring audit.
version: 1.0.0
author: Caro
license: Apache-2.0
tags:
  - security
  - owasp
  - asvs
  - dsgvo
  - gdpr
  - authentication
  - authorization
  - api-security
  - security-headers
  - dependency-security
triggers:
  - security checklist
  - security-checkliste
  - prüfe das repo auf sicherheit
  - dsgvo check
  - owasp top 10 check
  - pentest checkliste
capabilities:
  - repo-wide-security-audit
  - owasp-top-10-mapping
  - asvs-mapping
  - gdpr-compliance-review
outputs:
  - markdown
  - checklist-with-status
  - findings
requires:
  - repository-access
constraints:
  read_only_by_default: true
  require_evidence_for_findings: true
  no_status_without_verification: true
---

# Security-Checkliste (DE)

## Zweck

Eine Checkliste ist kein Sicherheitsnachweis. Ein Häkchen ist nur gültig, wenn
es durch eine konkrete Prüfung im Repo belegt ist (Codestelle, Testlauf,
Tool-Output, Konfigurationsdatei). "Kenne ich, ist meistens so gemacht" zählt
nicht. Wenn ein Punkt nicht geprüft werden kann (fehlender Zugriff, fehlende
Laufzeitumgebung), als `UNGEPRÜFT` markieren statt als bestanden zu werten.

Diese Checkliste ersetzt keinen professionellen Penetrationstest, keine
Rechtsberatung zur DSGVO und kein SAST/DAST-Tooling. Sie strukturiert, was
davor und danach im Repository nachweisbar sein muss.

## Ablauf

1. Repository-Typ bestimmen (Frontend, Backend/API, Monorepo, Infrastruktur)
   und die relevanten Abschnitte aus
   [references/checklist.md](references/checklist.md) auswählen.
2. Für jeden Punkt: Codestelle oder Konfiguration suchen, die die Kontrolle
   umsetzt. Ohne Fundstelle gilt der Punkt als offen, nicht als "vermutlich ok".
3. Wo möglich, den Angriff exemplarisch nachstellen (z. B. XSS-Payload in ein
   Eingabefeld, fremde ID in einen API-Call, abgelaufenes Token) statt nur
   Code zu lesen. Statischer Code kann eine Kontrolle enthalten, die zur
   Laufzeit nicht greift.
4. Ergebnis pro Punkt festhalten: `PASS` (mit Beleg), `FAIL` (mit Reproduktion
   und Auswirkung), oder `UNGEPRÜFT` (mit Grund).
5. Am Ende eine Gesamtbewertung nach Schweregrad ausgeben, keine reine
   Ja/Nein-Zusammenfassung. Ein einziger `BLOCKER` (z. B. SQL-Injection,
   fehlende Autorisierung, Klartext-Passwörter) verhindert ein "sicher"-Urteil
   unabhängig davon, wie viele andere Punkte bestanden wurden.
6. Für Auth/Autorisierung/Rate-Limiting/Injection-Tiefenprüfung zusätzlich den
   Skill `.agents/skills/pre-launch-security-gate/SKILL.md` heranziehen — er
   deckt diese vier Kontrollen mit Testfällen und Findings-Format im Detail ab.

## Struktur der Checkliste

Die vollständige Liste mit Prüfmethode je Punkt steht in
[references/checklist.md](references/checklist.md), gegliedert in:

1. Injection & Eingabevalidierung (XSS, SQLi, Command Injection, Path
   Traversal, HTTP Parameter Pollution, Input-/Output-Validierung)
2. Web-spezifische Angriffe (CSRF, Clickjacking, Open Redirect,
   Host-Header-Angriffe, SSRF)
3. Authentifizierung & Zugangsdaten (Brute-Force, Rate Limiting, Passwörter,
   Passwort-Hashing, MFA, Account Enumeration)
4. Sessions & Cookies (sichere Sessions, Timeout, Rotation, sichere Cookies)
5. Autorisierung (RBAC, IDOR, BOLA, Least Privilege)
6. API-Sicherheit (API-Auth, API-Authz, Request-Limits, CORS, Secret-/
   API-Key-Schutz, Webhook-Sicherheit, Replay-Schutz)
7. Transport, Verschlüsselung & Daten (HTTPS/TLS, Verschlüsselung,
   Row-Level Security, DB-Berechtigungen, Backups, Datenminimierung, Logs)
8. Datei-Upload-Sicherheit & Malware-Scanning
9. Security-Header (CSP, HSTS, X-Content-Type-Options, X-Frame-Options,
   Referrer-Policy, Permissions-Policy)
10. Infrastruktur & Betrieb (Firewall, Patches, Dependency-Security,
    Secret-Scanning, Prod-/Dev-Trennung, Monitoring, Alerting)
11. Testprozesse (Dependency Scanning, SAST, DAST, Code Reviews,
    Security-Tests, Penetrationstests, OWASP Top 10, OWASP ASVS)
12. DSGVO/Datenschutz (Löschung, Export, Berichtigung, Aufbewahrungsfristen,
    AVV, Drittanbieter-Sicherheit, Privacy by Design/Default)

## Ergebnisformat

```markdown
## Security-Checkliste – Ergebnis

Status: SICHER GENUG FÜR RELEASE | NICHT RELEASEFÄHIG | UNVOLLSTÄNDIG GEPRÜFT

### Blocker (sofort beheben)
- [Kategorie] Punkt – Fundstelle – Angriffsszenario – Auswirkung

### Offene Punkte nach Schweregrad
- HIGH / MEDIUM / LOW – Punkt – Fundstelle – empfohlene Maßnahme

### Ungeprüfte Punkte
- Punkt – Grund (kein Zugriff, keine Laufzeitumgebung, außerhalb Scope)

### Bestandene Punkte (mit Beleg)
- Punkt – Fundstelle/Testlauf, der die Kontrolle belegt
```

Eine Aussage wie "alles wurde geprüft und ist sicher" ist ohne diese
Belegliste nicht zulässig. DSGVO-Bußgelder bis 20 Mio. € bzw. 4 % des
weltweiten Jahresumsatzes (Art. 83 DSGVO) sind ein Grund, unvollständige
Prüfungen als `UNVOLLSTÄNDIG GEPRÜFT` zu kennzeichnen statt sie zu beschönigen.
