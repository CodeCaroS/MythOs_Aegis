# Vollständige Security-Checkliste mit Prüfmethode

Format je Zeile: **Punkt** — Prüfmethode (was im Repo/Laufzeitverhalten
konkret zu prüfen ist) — Fail-Kriterium (woran ein Fehlschlag erkennbar ist).

## 1. Injection & Eingabevalidierung

- **XSS (Cross-Site Scripting)** — Prüfen, ob nutzerkontrollierte Werte ohne
  kontextabhängiges Encoding in HTML/DOM/Attribute/`innerHTML`/`dangerouslySetInnerHTML`
  o. Ä. landen; Payload wie `<script>alert(1)</script>` bzw.
  `"><img src=x onerror=alert(1)>` in jedes Eingabefeld, jeden Query-Parameter
  und jeden gespeicherten Text (Stored XSS) einspielen. — Fail: Payload wird
  ungefiltert im Browser ausgeführt oder im DOM als aktives Markup gerendert.
- **SQL Injection** — Codesuche nach String-Konkatenation/Interpolation in
  SQL-Statements statt parametrisierter Queries/ORM-Bindings; Payload wie
  `' OR '1'='1` bzw. `1; DROP TABLE ...` in Such-, Filter-, Sortier- und
  ID-Parameter. — Fail: Query-Struktur ändert sich durch Eingabe, Fehler mit
  SQL-Syntax-Hinweisen erscheinen, oder zusätzliche/andere Datensätze werden
  zurückgegeben.
- **Command Injection** — Codesuche nach `exec`, `system`, `popen`,
  `child_process.exec`, Shell-Aufrufen mit unvalidierter Eingabe; Payload wie
  `; whoami`, `` `id` ``, `$(whoami)` in Felder, die an Shell-Kommandos,
  Dateinamen oder externe Tools weitergereicht werden. — Fail: Payload wird
  als Kommando ausgeführt statt als Daten behandelt.
- **Path Traversal** — Datei-/Pfadparameter mit `../../../etc/passwd`,
  URL-kodiert und doppelt kodiert, sowie absoluten Pfaden testen; prüfen ob
  Pfade kanonisiert und gegen ein erlaubtes Verzeichnis geprüft werden. —
  Fail: Zugriff auf Dateien außerhalb des vorgesehenen Verzeichnisses möglich.
- **HTTP Parameter Pollution** — Denselben Parameter mehrfach in einer
  Anfrage senden (`?id=1&id=2`, im Body und in der Query gleichzeitig) und
  prüfen, welcher Wert serverseitig verwendet wird bzw. ob Validierung/Autorisierung
  umgangen werden kann. — Fail: Server verhält sich inkonsistent zu
  Validierungs-/Autorisierungslogik oder nutzt den unerwarteten Wert.
- **Input Validation (serverseitig)** — Für jedes Feld: Typ, Format, Länge,
  erlaubte Werte, Pflicht-/Optional-Status prüfen; unbekannte/zusätzliche
  Felder (`role`, `isAdmin`, `ownerId`, `price` etc.) im Request mitschicken. —
  Fail: Validierung existiert nur im Frontend, oder unbekannte/privilegierte
  Felder werden serverseitig übernommen.
- **Output Validation / Encoding** — Prüfen, ob Ausgabe kontextabhängig
  kodiert wird (HTML-Encoding, JSON-Serialisierung, URL-Encoding) statt
  Rohdaten direkt auszugeben; Fehlerantworten auf enthaltene Stacktraces,
  interne Pfade, Query-Strings prüfen. — Fail: Rohdaten oder interne Details
  erscheinen unkodiert in der Antwort.

## 2. Web-spezifische Angriffe

- **CSRF** — Prüfen, ob zustandsändernde Requests (POST/PUT/PATCH/DELETE)
  ein CSRF-Token, `SameSite=Lax/Strict`-Cookies oder Origin-/Referer-Prüfung
  verlangen; Request von einer fremden Origin ohne Token nachstellen. — Fail:
  Zustandsändernder Request wird ohne Token/Origin-Prüfung akzeptiert.
- **Clickjacking** — Antwort-Header auf `X-Frame-Options` oder
  `Content-Security-Policy: frame-ancestors` prüfen; Seite in ein `<iframe>`
  einer fremden Domain einbetten. — Fail: Seite lässt sich einbetten und
  sensible Aktionen sind darin auslösbar.
- **Open Redirect** — Alle Redirect-/Callback-/`returnUrl`-Parameter mit einer
  externen Domain testen (`?redirect=https://evil.example`). — Fail: Nutzer
  wird ohne Allowlist-Prüfung zu einer beliebigen externen Domain
  weitergeleitet.
- **Host-Header-Angriffe** — Anfrage mit manipuliertem `Host`-Header senden
  und prüfen, ob Passwort-Reset-Links, Cache-Keys oder Redirects diesen
  Header übernehmen. — Fail: Server nutzt den Host-Header ungeprüft für
  Links, Weiterleitungen oder Cache-Schlüssel.
- **SSRF (Server-Side Request Forgery)** — Jede Stelle, an der der Server auf
  Anweisung des Nutzers eine URL abruft (Webhooks, Bild-/Datei-Import,
  URL-Vorschau), mit internen Zielen testen (`http://127.0.0.1`,
  `http://169.254.169.254/` Cloud-Metadata, interne Hostnamen). — Fail: Server
  stellt Verbindung zu internen/lokalen Zielen her oder liefert deren Antwort
  zurück.

## 3. Authentifizierung & Zugangsdaten

- **Brute-Force-Schutz** — Login mehrfach hintereinander mit falschen
  Zugangsdaten testen (automatisiert). — Fail: Keine Sperre, kein
  ansteigendes Delay, kein CAPTCHA nach wiederholten Fehlversuchen.
- **Rate Limiting** — Für Login, Registrierung, Passwort-Reset, Suche,
  Export, teure Endpunkte prüfen, ob ein Limit pro Account/IP/API-Key existiert
  und greift (Lasttest mit vielen Requests kurz hintereinander). — Fail: Kein
  Limit, oder Limit nur global statt pro Akteur, oder per Header
  (`X-Forwarded-For`) umgehbar.
- **Sichere Passwörter** — Prüfen, ob eine Mindestkomplexität/-länge
  serverseitig erzwungen wird (NIST-konform: Länge statt erzwungener
  Sonderzeichen-Regeln, Prüfung gegen bekannte kompromittierte Passwörter
  empfehlenswert). — Fail: Keine serverseitige Prüfung, oder Prüfung nur im
  Frontend.
- **Passwort-Hashing** — Codesuche nach der verwendeten Hash-Funktion. Nur
  `bcrypt`, `argon2` oder `scrypt` mit ausreichendem Kostenfaktor sind
  akzeptabel. — Fail: MD5, SHA-1, SHA-256 ohne Salt/Kostenfaktor, eigene
  Hash-Implementierung, oder Klartext-Speicherung.
- **MFA (Multi-Faktor-Authentifizierung)** — Prüfen, ob MFA für Login und
  insbesondere privilegierte/sensible Aktionen verfügbar bzw. erzwingbar ist,
  und ob der zweite Faktor serverseitig verifiziert wird. — Fail: Kein MFA
  vorhanden, oder MFA-Prüfung nur clientseitig/umgehbar.
- **Account Enumeration** — Login, Registrierung und Passwort-Reset mit
  existierender und nicht-existierender E-Mail/Nutzername vergleichen
  (Fehlermeldung, Statuscode, Antwortzeit). — Fail: Unterschiedliche
  Antworten verraten, ob ein Account existiert.

## 4. Sessions & Cookies

- **Sichere Sessions** — Prüfen, ob Session-IDs/Tokens serverseitig
  verifiziert werden, hohe Entropie haben und nach Login neu generiert
  werden (Session Fixation testen: Session-ID vor Login merken, nach Login
  vergleichen). — Fail: Gleiche Session-ID vor/nach Login, vorhersagbare IDs.
- **Session-Timeout** — Prüfen, ob Sessions nach Inaktivität und nach einer
  absoluten Maximaldauer ablaufen (Token-Ablaufzeit im Code/Config
  nachvollziehen, abgelaufenes Token gegen geschützten Endpunkt testen). —
  Fail: Keine Ablaufzeit, oder abgelaufenes Token wird weiter akzeptiert.
- **Session-Rotation** — Nach Login, Passwortänderung, Rechteänderung und
  Logout prüfen, ob alte Sessions/Tokens invalidiert werden (altes Token nach
  Logout/Passwortänderung erneut verwenden). — Fail: Altes Token funktioniert
  weiterhin.
- **Sichere Cookies** — Set-Cookie-Header auf `Secure`, `HttpOnly`,
  `SameSite=Lax/Strict` prüfen. — Fail: Session-Cookie fehlt eines dieser
  Attribute ohne dokumentierten Grund.

## 5. Autorisierung

- **Authentication vs. Authorization** — Prüfen, dass jeder geschützte
  Endpunkt sowohl Identität als auch Berechtigung für die konkrete Aktion und
  Ressource prüft (nicht nur "ist eingeloggt"). — Fail: Eingeloggter Nutzer
  kann Aktionen/Ressourcen erreichen, für die er keine Berechtigung hat.
- **RBAC (Role-Based Access Control)** — Rollen-/Rechtematrix aus dem Code
  extrahieren; mit niedrig-privilegiertem Account versuchen,
  admin-/höher-privilegierte Endpunkte aufzurufen. — Fail: Rollenprüfung
  fehlt serverseitig oder ist inkonsistent zwischen Endpunkten.
- **IDOR (Insecure Direct Object Reference)** — In jedem Endpunkt mit
  ID-Parameter (`/api/orders/123`) die ID durch eine fremde, aber gültige ID
  ersetzen. — Fail: Fremde Ressource wird gelesen, geändert oder gelöscht.
- **BOLA (Broken Object Level Authorization)** — Wie IDOR, zusätzlich auf
  API-Ebene inkl. verschachtelter/referenzierter Objekte, Bulk-Endpunkten,
  Export und Suche testen. — Fail: Objektzugriff wird nicht pro Request neu
  gegen den Akteur geprüft.
- **Least Privilege** — DB-Nutzer, Service-Accounts, API-Keys und
  CI/CD-Credentials auf ihre tatsächlich benötigten Rechte prüfen (Config/IaM
  lesen). — Fail: Anwendung nutzt einen DB-Superuser/Admin-Rolle für normale
  Requests, Service-Accounts haben mehr Rechte als für ihre Aufgabe nötig.

## 6. API-Sicherheit

- **API-Authentifizierung** — Jeden API-Endpunkt ohne Token/API-Key
  aufrufen. — Fail: Endpunkt liefert Daten oder führt Aktionen ohne gültige
  Authentifizierung aus.
- **API-Authorization** — Siehe IDOR/BOLA/RBAC oben, zusätzlich für
  interne/administrative API-Routen, die evtl. nicht in der öffentlichen
  Doku stehen. — Fail: Interne Route ist ohne Berechtigungsprüfung erreichbar.
- **Request-Limits** — Body-Größe, Datei-Größe/-Anzahl, Pagination-Größe,
  Batch-Größe, Query-Komplexität prüfen (übergroßen Request/Batch senden). —
  Fail: Kein Limit, Server verarbeitet beliebig große/teure Requests.
- **CORS** — `Access-Control-Allow-Origin`/`-Credentials`-Header prüfen. —
  Fail: `Access-Control-Allow-Origin: *` in Kombination mit
  `Access-Control-Allow-Credentials: true`, oder Origin-Reflection ohne
  Allowlist.
- **Secret-Schutz** — Repository (inkl. Git-Historie) nach Secrets
  durchsuchen (`.env`, Config-Dateien, Frontend-Bundles, Logs); prüfen, dass
  Secrets aus Umgebungsvariablen/Secret-Manager statt Code kommen. — Fail:
  Secret im Quellcode, in einem Commit oder im ausgelieferten Frontend-Bundle
  auffindbar.
- **API-Key-Schutz** — Prüfen, wie API-Keys übertragen (nicht in der URL/Query
  wegen Logging), gespeichert (gehasht, nicht im Klartext) und rotiert
  werden. — Fail: API-Key in der URL, im Klartext in der DB, ohne
  Rotations-/Widerrufsmöglichkeit.
- **Webhook-Sicherheit** — Prüfen, ob eingehende Webhooks per Signatur
  (HMAC) verifiziert werden, bevor die Payload verarbeitet wird; gefälschten
  Webhook ohne/mit falscher Signatur senden. — Fail: Payload wird ohne
  gültige Signaturprüfung verarbeitet.
- **Replay-Schutz** — Prüfen, ob Requests/Webhooks einen Timestamp/Nonce
  enthalten, der serverseitig geprüft wird; denselben signierten Request
  erneut senden. — Fail: Identischer Request wird beliebig oft erneut
  akzeptiert und erneut ausgeführt.

## 7. Transport, Verschlüsselung & Daten

- **HTTPS/TLS** — Prüfen, dass HTTP-Traffic auf HTTPS umgeleitet wird, keine
  gemischten Inhalte (Mixed Content) existieren, und TLS-Version/Cipher
  aktuell sind (z. B. via `testssl.sh`/SSL Labs). — Fail: HTTP ohne
  Redirect erreichbar, veraltete TLS-Version aktiv.
- **Verschlüsselung ruhender Daten** — Prüfen, ob sensible Felder
  (Passwörter, Tokens, personenbezogene Daten je nach Schutzbedarf) im
  Ruhezustand verschlüsselt bzw. gehasht gespeichert werden. — Fail: Sensible
  Klartextdaten in DB/Backups ohne Verschlüsselung.
- **Row-Level Security (RLS)** — Falls DB RLS unterstützt: Policies für
  SELECT/INSERT/UPDATE/DELETE auf allen relevanten Tabellen prüfen; Zugriff
  mit der von der Anwendung genutzten DB-Rolle auf fremde Mandanten-/
  Nutzerdaten testen. — Fail: RLS fehlt, ist nur lesend aktiv, oder die
  Anwendungsrolle umgeht die Policy.
- **Sichere Datenbankberechtigungen** — DB-Rollen/Grants prüfen (kein
  Anwendungszugriff mit Owner-/Superuser-Rechten). — Fail: Anwendung nutzt
  eine Rolle mit Rechten außerhalb ihres tatsächlichen Bedarfs (z. B. `DROP`,
  `CREATE ROLE`).
- **Sichere Backups** — Prüfen, ob Backups verschlüsselt gespeichert werden,
  Zugriff eingeschränkt ist, und ob ein Restore-Test dokumentiert/durchgeführt
  wurde. — Fail: Unverschlüsseltes Backup, öffentlich erreichbarer
  Backup-Speicher, kein getesteter Restore.
- **Datenminimierung** — Prüfen, welche personenbezogenen Felder tatsächlich
  erhoben/gespeichert werden und ob dafür ein dokumentierter Zweck besteht. —
  Fail: Daten werden erhoben/gespeichert ohne erkennbaren Zweck oder
  Rechtsgrundlage.
- **Sichere Logs** — Log-Statements auf Passwörter, Tokens, vollständige
  Kreditkarten-/Ausweisnummern, Session-IDs durchsuchen. — Fail: Sensible
  Werte erscheinen im Klartext in Logs.

## 8. Datei-Upload-Sicherheit

- **Datei-Upload-Sicherheit** — Upload-Endpunkte mit falscher/gefälschter
  MIME-Type, ausführbaren Dateitypen (`.php`, `.exe`, `.svg` mit
  eingebettetem Script), übergroßen Dateien und manipuliertem Dateinamen
  (Path Traversal, doppelte Extension) testen. — Fail: Dateityp wird nur
  über Extension/Client-Angabe geprüft, ausführbare Dateien landen in einem
  öffentlich erreichbaren/ausführbaren Verzeichnis.
- **Malware-Scanning** — Prüfen, ob hochgeladene Dateien vor Freigabe/Weiterverarbeitung
  durch einen Virenscanner (z. B. ClamAV) laufen, besonders bei
  öffentlich weiterverteilten Uploads. — Fail: Keine Prüfung, Datei ist
  sofort für andere Nutzer abrufbar.

## 9. Security-Header

- **Content Security Policy (CSP)** — `Content-Security-Policy`-Header
  prüfen (keine `unsafe-inline`/`unsafe-eval` ohne Nonce/Hash-Strategie,
  restriktive `default-src`). — Fail: Kein CSP-Header, oder CSP erlaubt
  beliebiges Inline-Skript.
- **HSTS** — `Strict-Transport-Security`-Header mit ausreichendem `max-age`
  (und idealerweise `includeSubDomains`) prüfen. — Fail: Header fehlt oder
  `max-age` ist zu niedrig/0.
- **X-Content-Type-Options** — Header auf `nosniff` prüfen. — Fail: Header
  fehlt.
- **X-Frame-Options** — Siehe Clickjacking oben. — Fail: Header fehlt und
  CSP `frame-ancestors` ist ebenfalls nicht gesetzt.
- **Referrer-Policy** — Header prüfen (z. B. `strict-origin-when-cross-origin`
  oder restriktiver). — Fail: Header fehlt oder `unsafe-url`.
- **Permissions-Policy** — Header prüfen, ob nicht benötigte Browser-Features
  (Kamera, Mikrofon, Geolocation) explizit deaktiviert sind. — Fail: Header
  fehlt vollständig.

## 10. Infrastruktur & Betrieb

- **Firewall** — Netzwerk-/Security-Group-Konfiguration prüfen: nur
  notwendige Ports/Dienste von außen erreichbar (DB, Admin-Panels, interne
  Dienste NICHT öffentlich). — Fail: Datenbank, Admin-Interface oder interner
  Dienst ist direkt aus dem Internet erreichbar.
- **Security-Patches** — Betriebssystem-/Laufzeit-Versionen (Node, Python,
  Basis-Docker-Images etc.) auf bekannte offene CVEs prüfen und
  Patch-Prozess/Kadenz dokumentieren. — Fail: Veraltete Version mit
  bekannter kritischer Schwachstelle im Einsatz.
- **Dependency-Security** — `npm audit`/`pip-audit`/`osv-scanner` o. Ä.
  laufen lassen; Ergebnis auf High/Critical-Findings prüfen. — Fail:
  Bekannte kritische Schwachstelle in einer eingesetzten Abhängigkeit ohne
  Fix/Mitigation.
- **Secret-Scanning** — Automatisiertes Secret-Scanning (z. B. Gitleaks,
  GitHub Secret Scanning) über die gesamte Git-Historie laufen lassen. —
  Fail: Tool findet ungerotierte Secrets in der Historie.
- **Produktions-/Entwicklungs-Trennung** — Prüfen, dass Produktions- und
  Entwicklungs-/Test-Umgebungen getrennte Datenbanken, Secrets und Domains
  nutzen, und dass Debug-/Verbose-Fehlermodi in Produktion deaktiviert sind. —
  Fail: Debug-Modus, Test-Daten oder gemeinsame Secrets in Produktion.
- **Monitoring** — Prüfen, ob sicherheitsrelevante Ereignisse (Fehlgeschlagene
  Logins, Rechteänderungen, 5xx-Häufungen) erfasst und einsehbar sind. —
  Fail: Keine zentrale Erfassung, keine Möglichkeit einen Vorfall im
  Nachhinein zu rekonstruieren.
- **Alerting** — Prüfen, ob für kritische Ereignisse (Massenhafte
  Fehlversuche, Anomalien, Ausfälle) automatische Benachrichtigungen
  konfiguriert sind. — Fail: Vorfälle werden nur zufällig/manuell bemerkt.

## 11. Testprozesse

- **Dependency Scanning** — Automatisierter Lauf in CI vorhanden und aktiv
  (Datei in `.github/workflows/` o. Ä. suchen). — Fail: Kein automatisierter
  Scan, oder Scan existiert aber blockiert Merges nicht bei Critical-Findings.
- **SAST (Static Application Security Testing)** — Prüfen, ob ein SAST-Tool
  (z. B. Semgrep, CodeQL) in CI läuft und Ergebnisse tatsächlich adressiert
  werden. — Fail: Kein SAST, oder Findings werden dauerhaft ignoriert.
- **DAST (Dynamic Application Security Testing)** — Prüfen, ob die laufende
  Anwendung regelmäßig gegen bekannte Angriffsmuster automatisiert getestet
  wird (z. B. OWASP ZAP). — Fail: Keine dynamische Prüfung der laufenden
  Anwendung.
- **Code Reviews** — Prüfen, ob sicherheitsrelevante Änderungen (Auth, Zahlungen,
  Zugriffskontrolle) einen verpflichtenden Review-Schritt durchlaufen
  (Branch-Protection-Regeln). — Fail: Direkter Push auf den Hauptzweig ohne
  Review möglich.
- **Security-Tests** — Prüfen, ob automatisierte Negativ-Tests existieren
  (fremder Nutzer darf nicht zugreifen, abgelaufenes Token wird abgelehnt
  usw.), nicht nur Happy-Path-Tests. — Fail: Testsuite deckt nur erfolgreiche
  Fälle ab.
- **Penetrationstests** — Prüfen, ob und wann zuletzt ein externer oder
  interner Pentest durchgeführt wurde, und ob dessen Findings nachweisbar
  behoben wurden. — Fail: Kein dokumentierter Pentest, oder offene
  kritische Findings ohne Fix-Termin.
- **OWASP Top 10** — Jede der zehn aktuellen Kategorien explizit gegen das
  Repository durchgehen (deckt sich mit Abschnitten 1–8 dieser Liste). —
  Fail: Eine Kategorie wurde nicht geprüft.
- **OWASP ASVS** — Für sicherheitskritische Anwendungen das passende
  ASVS-Level (meist L2) als Referenzkatalog heranziehen und Abweichungen
  dokumentieren. — Fail: Kein Abgleich gegen ASVS bei einer Anwendung mit
  sensiblen Daten.

## 12. DSGVO/Datenschutz

- **Datenschutz allgemein** — Prüfen, ob eine Datenschutzerklärung existiert,
  die tatsächliche Datenverarbeitung beschreibt (Verarbeitungsverzeichnis,
  Art. 30 DSGVO). — Fail: Verarbeitung im Code weicht von der dokumentierten
  Erklärung ab, oder es existiert keine.
- **Datenlöschung** — Prüfen, ob ein Löschprozess (Art. 17 DSGVO) existiert
  und tatsächlich Daten aus Primär-DB, Backups, Caches, Logs und
  Drittsystemen entfernt/anonymisiert werden, nicht nur ein Soft-Delete-Flag
  setzt. — Fail: Gelöschte Nutzerdaten sind über einen anderen Pfad weiterhin
  abrufbar.
- **Datenexport** — Prüfen, ob ein maschinenlesbarer Export der eigenen Daten
  (Art. 20 DSGVO, Datenportabilität) für Nutzer bereitgestellt werden kann. —
  Fail: Keine Möglichkeit, die eigenen Daten strukturiert zu exportieren.
- **Datenberichtigung** — Prüfen, ob Nutzer fehlerhafte Daten korrigieren
  können (Art. 16 DSGVO) und die Korrektur an relevante Stellen propagiert
  wird. — Fail: Fehlerhafte Daten sind nicht korrigierbar oder Korrektur wird
  nicht überall übernommen.
- **Aufbewahrungsfristen** — Prüfen, ob für jede Datenkategorie eine
  Aufbewahrungsdauer definiert und technisch durchgesetzt ist (automatisches
  Löschen/Anonymisieren nach Ablauf). — Fail: Daten werden unbegrenzt
  vorgehalten ohne dokumentierten Grund.
- **AVV (Auftragsverarbeitungsvertrag)** — Prüfen, ob für jeden externen
  Dienstleister, der personenbezogene Daten verarbeitet (Hosting, E-Mail,
  Analytics, Zahlungsdienstleister), ein AVV nach Art. 28 DSGVO vorliegt. —
  Fail: Personenbezogene Daten fließen an einen Drittanbieter ohne AVV.
- **Drittanbieter-Sicherheit** — Prüfen, welche Drittanbieter-SDKs/APIs
  eingebunden sind und welche Daten an sie übertragen werden (Netzwerk-Traffic
  analysieren). — Fail: Unbekannte/undokumentierte Datenflüsse an
  Drittanbieter.
- **Privacy by Design** — Prüfen, ob Datenschutz bereits in der Architektur
  berücksichtigt ist (z. B. Pseudonymisierung, Zugriffsbeschränkung nach
  Rolle) statt nachträglich aufgesetzt. — Fail: Datenschutzmaßnahmen wurden
  erst nachträglich als Patch ergänzt, Architektur sammelt standardmäßig
  mehr Daten als nötig.
- **Privacy by Default** — Prüfen, ob datenschutzfreundliche Einstellungen
  (z. B. keine Marketing-Zustimmung, minimale Sichtbarkeit) der Standard
  sind, ohne dass der Nutzer aktiv etwas einschränken muss. — Fail: Opt-out
  statt Opt-in bei nicht notwendiger Datenverarbeitung, Standardeinstellung
  ist die datenintensivste.
