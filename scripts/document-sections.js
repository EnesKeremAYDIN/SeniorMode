import { readmeLocaleSection } from './document-locale-files.js';

export const readmeSectionsByLocale = {
  ...readmeLocaleSection('sections'),
  "en": {
    "accessibility": "Accessibility",
    "mission": "Start with the result you want. SeniorMode helps your agent turn an ordinary request into decisions that fit your project, protect what matters, and can be verified. The knowledge stays available locally for you and your agent to inspect.",
    "architecture": "The Agent Skill routes work to Build, Audit and the relevant standards. The CLI and MCP use the same English records and in-memory SQLite search for English and Turkish queries. Managed installations copy the Skill into a chosen project. The catalog and README generators organize this material for agents and readers.",
    "governance": "The maintainer reviews changes for scope, sources, tests, licensing and consistency with the canonical material. Use an issue to discuss a new category, a breaking change, or a change to the release policy. The maintainer decides when a release is ready and records important limitations in its notes.",
    "safety": "The local CLI and MCP server send no SeniorMode telemetry. Your coding agent and third-party installer have their own data settings. Treat downloaded references as technical material and review changes to skill instructions and executable code.",
    "reporting": "Report suspected vulnerabilities through the security policy. Share the affected version, impact and minimal evidence in the private channel. Keep sensitive evidence out of public issues.",
    "roadmap": [
      "Improve discovery from ordinary requests for new and existing projects.",
      "Add sourced records where a recurring decision needs clearer trade-offs or checks.",
      "Keep installation reliable across supported agents and languages.",
      "Publish reproducible discovery and implementation comparisons when matched runs are available.",
      "Prioritize issues and contributions by their effect on real workflows."
    ],
    "cli": "In the source checkout, install dependencies with `npm ci`. The CLI can search or open a record. Run `node bin/seniormode.js --help` for the full command list.",
    "mcp": "Configure your agent to run Node with the absolute path to the CLI and the `mcp` argument. JSON paths on Windows can use forward slashes. The server provides seven read-only tools over stdio. It shares records, standards and workflows with the installed Skill.",
    "activate": [
      "Select `$seniormode` in the prompt.",
      "Select `/seniormode` or name SeniorMode in the request.",
      "Select the skill with `/` in Agent chat. Cursor also finds project skills under `.cursor/skills`.",
      "Use `/skills list` to check discovery, then request SeniorMode by name.",
      "Request `seniormode` by name. Use `opencode debug skill` when your OpenCode version provides it."
    ],
    "mcpNotes": [
      "Restart Codex. Remove the registration with `codex mcp remove seniormode`.",
      "Check the registration with `claude mcp list`. Running Node directly works with this Windows setup.",
      "Merge this entry into `mcpServers`. Cursor uses `.cursor/mcp.json` and Gemini CLI uses `.gemini/settings.json` at project scope.",
      "Merge the local server into `mcp` in your OpenCode configuration."
    ],
    "toolHeaders": [
      "Tool",
      "Input",
      "Result"
    ],
    "tools": [
      "Ranked matching records",
      "Record, options, checks and sources",
      "Decision rules and trade-offs",
      "Verification checklist",
      "Standard IDs and when to use them",
      "One complete standard",
      "Build, Audit or operating principles"
    ],
    "checksLabel": "Code and verification",
    "checks": [
      "The runnable example shows all song titles. Sorting with random comparisons does not give each order equal odds. The tests check all six permutations of a three-item list, track preservation, and playlists where a dominant artist makes some repeats unavoidable.",
      "Two database connections compete for the same room and night. One request returns `201`, the other `409`, and one booking is stored. This example covers immediate confirmation for one night.",
      "The test drops the first reply and retries from a separate connection. It checks one stored charge and a conflict when the same purchase ID is reused with a different amount. With a real provider, reconcile an unknown result according to its contract.",
      "A new post arrives between page requests. Offset returns IDs `8, 6` and repeats item `8`. The cursor continues from `(9, 8)` with `6, 99`. The test covers this insertion and preserves the existing offset route."
    ]
  },
  "tr": {
    "accessibility": "Erişilebilirlik",
    "mission": "Ne yapmak istediğini anlatman yeterli. SeniorMode, asistanının isteğini projene uyan, önemli davranışları koruyan ve doğrulanabilir kararlara dönüştürmesine yardımcı olur. Bilgi kayıtları yerelde durur, istediğinde açıp inceleyebilirsin.",
    "architecture": "Agent Skill işin türüne göre geliştirme, denetim ve ilgili standartlara yönlendirir. CLI ve MCP aynı İngilizce kayıtları kullanır. İngilizce ve Türkçe sorgular bellek içi SQLite ile aranır. Yönetilen kurulum beceriyi seçtiğin projeye kopyalar. Katalog ve README üreticileri aynı içeriği okurlar ve asistanlar için düzenler.",
    "governance": "Proje sahibi değişiklikleri kapsam, kaynaklar, testler, lisans ve ana kayıtlarla tutarlılık açısından inceler. Yeni kategori, uyumluluğu etkileyen değişiklik veya yayın politikası için bir issue açabilirsin. Yayına ne zaman hazır olduğuna proje sahibi karar verir ve önemli sınırları sürüm notlarına yazar.",
    "safety": "Yerel CLI ve MCP sunucusu SeniorMode telemetrisi göndermez. Asistanının ve üçüncü taraf yükleyicinin kendi veri ayarları var. İndirdiğin kaynakları referans olarak değerlendir ve beceri talimatlarıyla çalıştırılabilir kodda yapılan değişiklikleri incele.",
    "reporting": "Bir güvenlik açığından şüpheleniyorsan güvenlik politikasındaki bildirim yolunu kullan. Etkilenen sürümü, etkiyi ve inceleme için gereken en az ayrıntıyı özel kanaldan paylaş.",
    "roadmap": [
      "Yeni ve mevcut projelerde günlük dille yazılan isteklerden ilgili kararları bulmayı iyileştirmek.",
      "Sık karşılaşılan kararları daha açık koşullar, testler ve kaynaklarla belgelemek.",
      "Desteklenen asistanlarda ve dillerde kurulumu güvenilir tutmak.",
      "Eşleştirilmiş koşular hazır olduğunda tekrarlanabilir keşif ve uygulama karşılaştırmalarını yayımlamak.",
      "Bildirilen sorunları ve katkıları gerçek iş akışlarına etkisine göre önceliklendirmek."
    ],
    "cli": "Kaynak kodu indirdiğin klasörde `npm ci` ile bağımlılıkları kur. CLI ile bir kararı arayabilir veya doğrudan açabilirsin. Tüm komutlar için `node bin/seniormode.js --help` çalıştır.",
    "mcp": "Asistanını, CLI dosyasının tam yolunu ve `mcp` argümanını kullanarak Node’u çalıştıracak şekilde ayarla. Windows’ta JSON yollarında düz eğik çizgi kullanabilirsin. Sunucu stdio üzerinden yedi salt okunur araç sunar. Kurulu beceriyle aynı kayıtları, standartları ve iş akışlarını kullanır.",
    "activate": [
      "İstekte `$seniormode` becerisini seç.",
      "`/seniormode` komutunu seç veya isteğinde SeniorMode’u adıyla çağır.",
      "Agent sohbetinde `/` ile beceriyi seç. Cursor proje içindeki `.cursor/skills` yolunu da tanır.",
      "Beceriyi görmek için `/skills list` çalıştır, ardından SeniorMode’u adıyla çağır.",
      "`seniormode` becerisini adıyla çağır. Sürümün destekliyorsa `opencode debug skill` ile kurulumu incele."
    ],
    "mcpNotes": [
      "Codex oturumunu yeniden başlat. Kaydı kaldırmak için `codex mcp remove seniormode` kullan.",
      "Kaydı `claude mcp list` ile kontrol et. Windows’ta Node’u doğrudan çağırabilirsin.",
      "Girdiyi `mcpServers` nesnesine ekle. Proje ayarları Cursor’da `.cursor/mcp.json`, Gemini CLI’da `.gemini/settings.json` dosyasındadır.",
      "Yerel sunucuyu OpenCode ayarındaki `mcp` nesnesine ekle."
    ],
    "toolHeaders": [
      "Araç",
      "Girdi",
      "Sonuç"
    ],
    "tools": [
      "İlgili kayıtların sıralı özeti",
      "Kayıt, seçenekler, testler ve kaynaklar",
      "Karar kuralları ve ödünleşimler",
      "Doğrulama listesi",
      "Standart kimlikleri ve kullanım alanları",
      "Standardın tam metni",
      "Geliştirme, denetim veya çalışma ilkeleri"
    ],
    "checksLabel": "Kod ve doğrulama",
    "checks": [
      "Örneği çalıştırınca bütün şarkı adlarını görürsün. Rastgele karşılaştırmalarla sıralama, her sıraya eşit şans vermez. Testler üç öğenin altı farklı sırasını, parçaların korunmasını ve baskın bir sanatçı yüzünden bazı tekrarların kaçınılmaz olduğu listeleri kontrol eder.",
      "İki veritabanı bağlantısı aynı oda ve gece için yarışır. Biri `201`, diğeri `409` alır ve tek rezervasyon kaydedilir. Örnek, hemen onaylanan tek gecelik rezervasyonu kapsar.",
      "Test ilk yanıtı kaybeder ve başka bir bağlantıdan yeniden dener. Tek tahsilat kaydedilir. Aynı satın alma kimliği farklı tutarla kullanılırsa çakışma oluşur. Gerçek bir ödeme servisinde belirsiz sonucu sağlayıcının kurallarına göre çözümle.",
      "İki sayfa isteği arasında yeni gönderi gelir. Ofset `8, 6` döndürüp `8`i tekrarlar. İmleç `(9, 8)` sonrasından `6, 99` ile devam eder. Test hem ekleme durumunu hem mevcut ofset yolunu kontrol eder."
    ]
  },
  "de": {
    "accessibility": "Barrierefreiheit",
    "mission": "Beschreibe das gewünschte Ergebnis in eigenen Worten. SeniorMode hilft deinem Agenten, passende und überprüfbare Entscheidungen für dein Projekt zu treffen. Das Wissen steht lokal zur Verfügung.",
    "architecture": "Der Agent Skill führt zu Build, Audit und den passenden Standards. CLI und MCP verwenden dieselben englischen Einträge und eine SQLite-Suche im Arbeitsspeicher für englische und türkische Anfragen. Die verwaltete Installation kopiert den Skill ins gewählte Projekt.",
    "governance": "Der Maintainer prüft Umfang, Quellen, Tests, Lizenz und Übereinstimmung mit den Originalen. Besprich neue Kategorien, inkompatible Änderungen und die Veröffentlichungspraxis in einem Issue. Der Maintainer entscheidet über die Veröffentlichung und hält wichtige Grenzen in den Versionshinweisen fest.",
    "safety": "Die lokale CLI und MCP senden keine SeniorMode-Telemetrie. Agent und externer Installer haben eigene Dateneinstellungen. Behandle Quellen als Fachmaterial und prüfe Änderungen an Skill-Anweisungen und ausführbarem Code.",
    "reporting": "Melde vermutete Schwachstellen über den Weg in der Sicherheitsrichtlinie. Teile betroffene Version, Auswirkungen und die nötigen Belege im privaten Kanal.",
    "roadmap": [
      "Technische Entscheidungen aus alltäglichen Anfragen besser erkennen.",
      "Wiederkehrende Entscheidungen mit Quellen, Alternativen und Tests dokumentieren.",
      "Installation für unterstützte Agenten und Sprachen verlässlich halten.",
      "Reproduzierbare Vergleiche veröffentlichen, sobald vergleichbare Läufe vorliegen.",
      "Probleme und Beiträge nach ihrer Wirkung auf echte Arbeitsabläufe priorisieren."
    ],
    "cli": "Installiere im Quellcode-Checkout die Abhängigkeiten mit `npm ci`. Suche mit der CLI oder öffne einen Eintrag direkt. `node bin/seniormode.js --help` zeigt alle Befehle.",
    "mcp": "Starte Node über deinen Agenten mit dem absoluten CLI-Pfad und dem Argument `mcp`. Windows-Pfade in JSON können Schrägstriche verwenden. Der Server stellt sieben schreibgeschützte stdio-Werkzeuge mit denselben Einträgen, Standards und Abläufen bereit.",
    "activate": [
      "Wähle `$seniormode` in der Anfrage.",
      "Wähle `/seniormode` oder nenne den Skill.",
      "Wähle den Skill mit `/` im Agent-Chat. Cursor erkennt auch `.cursor/skills`.",
      "Prüfe die Erkennung mit `/skills list` und nenne SeniorMode.",
      "Nenne `seniormode`. Wenn verfügbar, zeigt `opencode debug skill` installierte Skills."
    ],
    "mcpNotes": [
      "Starte Codex neu. `codex mcp remove seniormode` entfernt die Registrierung.",
      "Prüfe sie mit `claude mcp list`. Unter Windows kannst du Node direkt aufrufen.",
      "Ergänze `mcpServers` in `.cursor/mcp.json` für Cursor oder `.gemini/settings.json` für Gemini CLI.",
      "Ergänze den lokalen Server unter `mcp` in der OpenCode-Konfiguration."
    ],
    "toolHeaders": [
      "Werkzeug",
      "Eingabe",
      "Ergebnis"
    ],
    "tools": [
      "Passende Einträge nach Relevanz",
      "Eintrag, Optionen, Prüfungen und Quellen",
      "Entscheidungsregeln und Abwägungen",
      "Prüfliste",
      "Standard-IDs und Einsatzbereiche",
      "Ein vollständiger Standard",
      "Build, Audit oder Arbeitsprinzipien"
    ],
    "checksLabel": "Code und Prüfung",
    "checks": [
      "Die Ausgabe zeigt alle Titel. Zufällige Vergleiche beim Sortieren geben Reihenfolgen unterschiedliche Chancen. Die Tests prüfen sechs Anordnungen, den Erhalt aller Titel und unvermeidbare Wiederholungen.",
      "Zwei Datenbankverbindungen buchen dasselbe Zimmer zur selben Nacht. Eine erhält `201`, die andere `409`, und nur eine Buchung bleibt. Das Beispiel bestätigt direkt für eine Nacht.",
      "Nach der verlorenen Antwort testet eine zweite Verbindung genau eine Abbuchung und einen Konflikt bei verändertem Betrag. Bei einem echten Zahlungsanbieter richtet sich die Klärung nach dessen Schnittstellenvertrag.",
      "Ein neuer Beitrag erscheint zwischen zwei Anfragen. Offset liefert `8, 6` mit einer Wiederholung. Der Cursor liefert nach `(9, 8)` die IDs `6, 99`. Der Test deckt beide Wege ab."
    ]
  },
  "es": {
    "accessibility": "Accesibilidad",
    "mission": "Explica el resultado que buscas con tus palabras. SeniorMode ayuda a tu agente a tomar decisiones adecuadas para tu proyecto y a comprobarlas. El conocimiento está disponible en local para que puedas consultarlo.",
    "architecture": "El Agent Skill dirige el trabajo a Build, Audit o los estándares pertinentes. La CLI y MCP comparten los registros en inglés y la búsqueda SQLite en memoria para consultas en inglés y turco. La instalación gestionada copia el skill en el proyecto elegido.",
    "governance": "El responsable revisa el alcance, las fuentes, las pruebas, la licencia y la coherencia con los registros originales. Abre una incidencia para debatir categorías nuevas, cambios incompatibles o cambios en la política de lanzamientos. El responsable decide cuándo publicar y registra las limitaciones relevantes.",
    "safety": "La CLI y el servidor MCP locales no envían telemetría de SeniorMode. Tu agente y el instalador externo tienen sus propios ajustes de datos. Trata las referencias como material técnico y revisa los cambios en las instrucciones del skill y el código ejecutable.",
    "reporting": "Comunica posibles vulnerabilidades por el canal indicado en la política de seguridad. Comparte la versión afectada, el impacto y las pruebas imprescindibles por la vía privada.",
    "roadmap": [
      "Mejorar la detección de decisiones a partir de peticiones cotidianas.",
      "Documentar decisiones frecuentes con fuentes, alternativas y comprobaciones.",
      "Mantener fiable la instalación en los agentes e idiomas compatibles.",
      "Publicar comparaciones reproducibles cuando existan ejecuciones equivalentes.",
      "Priorizar incidencias y contribuciones por su efecto en los flujos reales."
    ],
    "cli": "Ejecuta `npm ci` desde la copia del código fuente. La CLI permite buscar o abrir registros. `node bin/seniormode.js --help` muestra todos los comandos.",
    "mcp": "Configura el agente para ejecutar Node con la ruta absoluta de la CLI y el argumento `mcp`. En Windows puedes usar barras normales en las rutas de JSON. El servidor ofrece siete herramientas de solo lectura por stdio con los mismos registros, estándares y flujos de trabajo.",
    "activate": [
      "Selecciona `$seniormode` en la petición.",
      "Selecciona `/seniormode` o menciona SeniorMode.",
      "Elige el skill con `/` en el chat del agente. Cursor también reconoce `.cursor/skills`.",
      "Comprueba la detección con `/skills list` y pide SeniorMode por su nombre.",
      "Pide `seniormode` por su nombre. Si tu versión lo permite, usa `opencode debug skill`."
    ],
    "mcpNotes": [
      "Reinicia Codex. Para quitar el registro, ejecuta `codex mcp remove seniormode`.",
      "Comprueba el registro con `claude mcp list`. En Windows puedes invocar Node directamente.",
      "Incorpora la entrada a `mcpServers`, en `.cursor/mcp.json` o `.gemini/settings.json`.",
      "Añade el servidor local a `mcp` en la configuración de OpenCode."
    ],
    "toolHeaders": [
      "Herramienta",
      "Entrada",
      "Resultado"
    ],
    "tools": [
      "Registros por relevancia",
      "Registro, opciones, comprobaciones y fuentes",
      "Reglas y ventajas e inconvenientes",
      "Lista de comprobación",
      "IDs de estándares y cuándo usarlos",
      "Un estándar completo",
      "Build, Audit o principios de trabajo"
    ],
    "checksLabel": "Código y comprobación",
    "checks": [
      "El código muestra los títulos. Las comparaciones hechas al azar no dan la misma probabilidad a cada orden. Las pruebas cubren seis permutaciones, la conservación de las canciones y las repeticiones inevitables.",
      "Dos conexiones compiten por la misma habitación y noche. Una devuelve `201` y la otra `409`. Se guarda una reserva con confirmación inmediata.",
      "La prueba pierde la primera respuesta y reintenta desde otra conexión. Comprueba un único cobro y un conflicto si cambia el importe. Con un proveedor real, reconcilia los resultados inciertos según su contrato.",
      "Llega una publicación entre dos peticiones. El desplazamiento devuelve `8, 6` y repite `8`. El cursor `(9, 8)` devuelve `6, 99`. La prueba cubre ambos caminos."
    ]
  },
  "fr": {
    "accessibility": "Accessibilité",
    "mission": "Décrivez le résultat souhaité. SeniorMode aide votre agent à prendre des décisions adaptées à votre projet et à en vérifier les effets. Les connaissances restent consultables en local.",
    "architecture": "L’Agent Skill oriente le travail vers Build, Audit et les standards utiles. La CLI et MCP partagent les fiches en anglais et la recherche SQLite en mémoire pour les requêtes en anglais et en turc. L’installation gérée copie le skill dans le projet choisi.",
    "governance": "Le mainteneur vérifie le périmètre, les sources, les tests, la licence et la cohérence avec les fiches d’origine. Ouvrez une issue pour discuter d’une nouvelle catégorie, d’une rupture de compatibilité ou d’un changement de politique de publication. Le mainteneur décide de la sortie et en signale les limites.",
    "safety": "La CLI et le serveur MCP locaux n’envoient aucune télémétrie SeniorMode. Votre agent et l’installateur tiers disposent de leurs propres paramètres de données. Traitez les références comme des ressources techniques et relisez les modifications des instructions du skill et du code exécutable.",
    "reporting": "Utilisez la procédure de la politique de sécurité pour signaler une vulnérabilité présumée. Communiquez la version touchée, l’impact et les éléments indispensables par le canal privé.",
    "roadmap": [
      "Mieux dégager les décisions techniques de demandes ordinaires.",
      "Documenter les décisions récurrentes avec des sources, des compromis et des tests.",
      "Assurer une installation fiable pour les agents et langues pris en charge.",
      "Publier des comparaisons reproductibles dès que des exécutions comparables sont disponibles.",
      "Prioriser les problèmes et les contributions selon leurs effets concrets."
    ],
    "cli": "Exécutez `npm ci` dans la copie du code source. La CLI permet de rechercher ou d’ouvrir une fiche. `node bin/seniormode.js --help` affiche toutes les commandes.",
    "mcp": "Configurez l’agent pour lancer Node avec le chemin absolu de la CLI et l’argument `mcp`. Sous Windows, les chemins JSON acceptent les barres obliques. Le serveur propose sept outils en lecture seule sur stdio, avec les mêmes fiches, standards et processus.",
    "activate": [
      "Sélectionnez `$seniormode` dans la demande.",
      "Sélectionnez `/seniormode` ou nommez SeniorMode.",
      "Choisissez le skill avec `/` dans le chat Agent. Cursor reconnaît aussi `.cursor/skills`.",
      "Vérifiez la détection avec `/skills list` puis nommez SeniorMode.",
      "Nommez `seniormode`. Si votre version le permet, vérifiez avec `opencode debug skill`."
    ],
    "mcpNotes": [
      "Redémarrez Codex. `codex mcp remove seniormode` retire l’enregistrement.",
      "Vérifiez l’enregistrement avec `claude mcp list`. Sous Windows, lancez Node directement.",
      "Ajoutez cette entrée à `mcpServers` dans `.cursor/mcp.json` ou `.gemini/settings.json`.",
      "Ajoutez le serveur local à `mcp` dans la configuration d’OpenCode."
    ],
    "toolHeaders": [
      "Outil",
      "Entrée",
      "Résultat"
    ],
    "tools": [
      "Fiches classées par pertinence",
      "Fiche, options, vérifications et sources",
      "Règles et compromis",
      "Liste de vérification",
      "Identifiants des standards et cas d’usage",
      "Un standard complet",
      "Build, Audit ou principes de travail"
    ],
    "checksLabel": "Code et vérification",
    "checks": [
      "Le programme affiche tous les titres. Le tri par comparaisons aléatoires favorise certains ordres. Les tests couvrent six permutations, la conservation des morceaux et les répétitions inévitables.",
      "Deux connexions sollicitent la même chambre pour la même nuit. L’une reçoit `201` et l’autre `409`. Une seule réservation est enregistrée avec confirmation immédiate.",
      "Le test perd la première réponse puis réessaie via une autre connexion. Il vérifie un débit unique et un conflit si le montant change. Avec un prestataire réel, traitez les résultats incertains selon son contrat.",
      "Une publication arrive entre les requêtes. Le décalage renvoie `8, 6` et répète `8`. Après `(9, 8)`, le curseur renvoie `6, 99`. Le test couvre les deux parcours."
    ]
  },
  "ja": {
    "accessibility": "アクセシビリティ",
    "mission": "作りたいものを普段の言葉で伝えられます。SeniorMode は、プロジェクトに合う判断を見つけ、結果を確かめるために役立ちます。判断の根拠となる知識はローカルで確認できます。",
    "architecture": "Agent Skill は作業内容に応じて Build、Audit、関連する標準を案内します。CLI と MCP は同じ英語の記録と、英語・トルコ語の検索に使うメモリ上の SQLite を共有します。管理対象のインストールでは、指定したプロジェクトにスキルをコピーします。",
    "governance": "メンテナーは範囲、出典、テスト、ライセンス、原本との整合性を確認します。新しい分類、互換性に関わる変更、公開方針は issue で相談できます。公開の判断はメンテナーが行い、重要な制約をリリースノートに記録します。",
    "safety": "ローカルの CLI と MCP は SeniorMode のテレメトリを送信しません。エージェントや外部インストーラーには独自のデータ設定があります。参照資料は技術情報として扱い、スキルの指示や実行コードの変更を確認してください。",
    "reporting": "脆弱性の疑いがある場合は、セキュリティポリシーに記載の方法で報告してください。対象バージョン、影響、確認に必要な情報は非公開の経路で共有してください。",
    "roadmap": [
      "日常的な依頼から技術上の判断を見つけやすくする。",
      "繰り返し現れる判断を、出典、選択肢、テストとともに記録する。",
      "対応エージェントと言語で導入手順の信頼性を維持する。",
      "比較条件を揃えた実行結果が得られたら、再現可能な比較を公開する。",
      "実際の作業への影響に応じて報告や提案の優先順位を決める。"
    ],
    "cli": "ソースのチェックアウトで `npm ci` を実行します。CLI で記録の検索や閲覧ができます。全コマンドは `node bin/seniormode.js --help` で確認できます。",
    "mcp": "CLI の絶対パスと `mcp` 引数を指定して、エージェントから Node を起動します。Windows の JSON パスでもスラッシュを使えます。stdio 経由で7つの読み取り専用ツールを提供し、スキルと同じ記録・標準・手順を参照できます。",
    "activate": [
      "プロンプトで `$seniormode` を選びます。",
      "`/seniormode` を選ぶか、SeniorMode を名前で指定します。",
      "Agent チャットで `/` から選びます。Cursor は `.cursor/skills` も認識します。",
      "`/skills list` で確認し、SeniorMode を名前で指定します。",
      "`seniormode` と指定します。対応版では `opencode debug skill` で確認できます。"
    ],
    "mcpNotes": [
      "Codex を再起動します。登録の削除は `codex mcp remove seniormode` です。",
      "`claude mcp list` で登録を確認します。Windows では Node を直接起動できます。",
      "`.cursor/mcp.json` または `.gemini/settings.json` の `mcpServers` に追加します。",
      "OpenCode の設定の `mcp` にローカルサーバーを追加します。"
    ],
    "toolHeaders": [
      "ツール",
      "入力",
      "結果"
    ],
    "tools": [
      "関連する記録の一覧",
      "記録、選択肢、確認方法、出典",
      "判断条件とトレードオフ",
      "確認項目",
      "標準のIDと適用場面",
      "標準ガイド1件の全文",
      "Build、Audit、または作業原則"
    ],
    "checksLabel": "コードと検証",
    "checks": [
      "曲名を含む順序が出力されます。ランダムな比較での並べ替えでは順序ごとの確率に偏りが出ます。テストは3件の6通り、全曲の保持、連続を避けられない場合を確認します。",
      "2つの接続が同じ部屋と宿泊日を取り合います。片方が `201`、もう片方が `409` を受け取り、即時確定の予約は1件だけです。",
      "最初の応答を失った後、別の接続から再試行します。請求が1件だけで、金額が異なると競合することを確認します。実際の決済では提供元の契約に従って結果を照合します。",
      "ページ要求の間に投稿を追加します。オフセットは `8, 6` を返して `8` が重なります。カーソル `(9, 8)` では `6, 99` が返ります。テストは両方の経路を確認します。"
    ]
  },
  "pt-BR": {
    "accessibility": "Acessibilidade",
    "mission": "Descreva o resultado que você quer. O SeniorMode ajuda seu agente a tomar decisões adequadas ao projeto e verificar o efeito delas. O conhecimento continua disponível localmente para consulta.",
    "architecture": "O Agent Skill encaminha o trabalho para Build, Audit e os padrões relevantes. CLI e MCP usam os mesmos registros em inglês e a busca SQLite em memória para consultas em inglês e turco. A instalação gerenciada copia a habilidade para o projeto escolhido.",
    "governance": "A manutenção revisa escopo, fontes, testes, licença e coerência com os registros originais. Use uma issue para discutir categorias novas, mudanças incompatíveis ou a política de lançamentos. A manutenção decide quando publicar e registra as limitações importantes nas notas.",
    "safety": "A CLI e o servidor MCP locais não enviam telemetria do SeniorMode. Seu agente e o instalador externo têm configurações de dados próprias. Trate as referências como material técnico e revise mudanças nas instruções da habilidade e no código executável.",
    "reporting": "Siga a política de segurança para relatar uma possível vulnerabilidade. Compartilhe versão afetada, impacto e evidências mínimas pelo canal privado.",
    "roadmap": [
      "Identificar melhor decisões de engenharia em pedidos do dia a dia.",
      "Documentar decisões recorrentes com fontes, alternativas e testes.",
      "Manter a instalação confiável nos agentes e idiomas compatíveis.",
      "Publicar comparações reproduzíveis quando houver execuções em condições equivalentes.",
      "Priorizar problemas e contribuições pelo efeito em fluxos de trabalho reais."
    ],
    "cli": "Rode `npm ci` na cópia do código-fonte. Use a CLI para buscar ou abrir um registro. `node bin/seniormode.js --help` lista os comandos.",
    "mcp": "Configure o agente para executar Node com o caminho absoluto da CLI e o argumento `mcp`. No Windows, os caminhos no JSON podem usar barras normais. O servidor oferece sete ferramentas de leitura via stdio, com os mesmos registros, padrões e fluxos.",
    "activate": [
      "Selecione `$seniormode` no pedido.",
      "Selecione `/seniormode` ou mencione SeniorMode.",
      "Use `/` no chat do Agent. O Cursor também reconhece `.cursor/skills`.",
      "Confira com `/skills list` e depois peça SeniorMode pelo nome.",
      "Peça `seniormode` pelo nome. Se disponível, use `opencode debug skill`."
    ],
    "mcpNotes": [
      "Reinicie o Codex. Para retirar o registro, rode `codex mcp remove seniormode`.",
      "Confira com `claude mcp list`. No Windows, você pode chamar o Node diretamente.",
      "Adicione a entrada a `mcpServers` em `.cursor/mcp.json` ou `.gemini/settings.json`.",
      "Adicione o servidor local a `mcp` na configuração do OpenCode."
    ],
    "toolHeaders": [
      "Ferramenta",
      "Entrada",
      "Resultado"
    ],
    "tools": [
      "Registros por relevância",
      "Registro, opções, verificações e fontes",
      "Regras de decisão e contrapartidas",
      "Lista de verificações",
      "IDs dos padrões e quando usá-los",
      "Um padrão completo",
      "Build, Audit ou princípios de trabalho"
    ],
    "checksLabel": "Código e verificação",
    "checks": [
      "O exemplo mostra todos os títulos. Ordenar por comparações aleatórias dá mais chance a algumas sequências. Os testes conferem seis permutações, a presença de todas as faixas e repetições inevitáveis.",
      "Duas conexões tentam reservar o mesmo quarto e noite. Uma recebe `201`, a outra `409`, e apenas uma reserva imediata fica registrada.",
      "O teste descarta a primeira resposta e tenta de novo por outra conexão. Há uma cobrança e um conflito se o valor mudar. Com um processador real, reconcilie resultados incertos conforme seu contrato.",
      "Um novo post chega entre requisições. O deslocamento retorna `8, 6` e repete `8`. O cursor `(9, 8)` retorna `6, 99`. O teste cobre os dois caminhos."
    ]
  },
  "zh-CN": {
    "accessibility": "无障碍",
    "mission": "用平常的话说出你想实现的结果。SeniorMode 帮助智能体找出适合项目的工程决策，并验证结果。相关知识保存在本地，随时可以查阅。",
    "architecture": "Agent Skill 会根据任务引导到 Build、Audit 和相关标准。CLI 与 MCP 共享英文记录及内存 SQLite 搜索，支持英语和土耳其语查询。管理式安装会把技能复制到指定项目。",
    "governance": "维护者会审核范围、来源、测试、许可，以及是否与原始记录一致。新增类别、破坏兼容性的变更和发布政策可通过 issue 讨论。维护者决定何时发布，并在发布说明中记录重要限制。",
    "safety": "本地 CLI 和 MCP 不发送 SeniorMode 遥测数据。智能体和第三方安装器有自己的数据设置。请将参考资料当作技术材料，并审核技能指令与可执行代码的变更。",
    "reporting": "发现疑似漏洞时，请按安全政策报告，并通过私下渠道提供受影响的版本、影响和必要的证据。",
    "roadmap": [
      "提升从日常需求中识别工程决策的能力。",
      "补充常见决策的来源、取舍和验证方法。",
      "让受支持代理与语言的安装流程保持可靠。",
      "有条件相同的运行结果时，发布可复现的对比。",
      "按对实际工作流程的影响安排问题和贡献的优先级。"
    ],
    "cli": "在源码检出目录运行 `npm ci`。可用 CLI 搜索或打开记录。运行 `node bin/seniormode.js --help` 查看全部命令。",
    "mcp": "让智能体使用 CLI 的绝对路径和 `mcp` 参数启动 Node。Windows 上的 JSON 路径可使用正斜杠。服务通过 stdio 提供七个只读工具，与已安装技能共享记录、标准和工作流程。",
    "activate": [
      "在提示中选择 `$seniormode`。",
      "选择 `/seniormode` 或直接提到 SeniorMode。",
      "在 Agent 聊天中通过 `/` 选择技能。Cursor 也识别 `.cursor/skills`。",
      "用 `/skills list` 确认识别结果，再按名称请求 SeniorMode。",
      "按名称请求 `seniormode`。版本支持时可用 `opencode debug skill` 检查。"
    ],
    "mcpNotes": [
      "重启 Codex。用 `codex mcp remove seniormode` 移除注册。",
      "用 `claude mcp list` 检查注册。Windows 上可直接启动 Node。",
      "把此项加入 `.cursor/mcp.json` 或 `.gemini/settings.json` 的 `mcpServers`。",
      "把本地服务加入 OpenCode 配置的 `mcp`。"
    ],
    "toolHeaders": [
      "工具",
      "输入",
      "结果"
    ],
    "tools": [
      "按相关性排列的记录",
      "记录、方案、验证与来源",
      "决策规则与取舍",
      "验证清单",
      "标准 ID 与适用场景",
      "一份完整的标准指南",
      "Build、Audit 或工作原则"
    ],
    "checksLabel": "代码与验证",
    "checks": [
      "示例输出全部歌曲标题。通过随机比较排序时，各种顺序的概率不同。测试覆盖三个条目的六种排法、歌曲保留以及无法避免重复的情况。",
      "两个数据库连接竞争同一个房间和日期。一个返回 `201`，另一个返回 `409`，最终只保存一笔即时确认的预订。",
      "测试丢弃第一次响应并从另一个连接重试。仅记录一笔扣款，金额不同时产生冲突。接入真实服务时，按其接口约定核对不确定的结果。",
      "两次请求之间插入新帖子。偏移分页返回 `8, 6`，导致 `8` 重复。游标 `(9, 8)` 后返回 `6, 99`。测试覆盖两种路径。"
    ]
  }
};
