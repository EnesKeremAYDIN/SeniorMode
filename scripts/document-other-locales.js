const headingKeys = (
  'install ai support use newProject existing standards library directory real how limitations roadmap ' +
  'docs contributors thanks license stars releases shuffle what why compare scopes manual managed troubleshoot security conduct'
).split(' ');
const columnKeys = 'host records categories native project global task decision'.split(' ');
const navKeys = 'install usage directory examples faq contribute'.split(' ');
const textKeys = (
  'tagline subtitle made what quickStart firstRun ' +
  'cliMcp contribute license scopes external manual managed ownership troubleshoot'
).split(' ');

function table(keys, values, field, language) {
  const entries = typeof values === 'string' ? values.trim().split('\n') : values;
  if (keys.length !== entries.length || entries.some(entry => !entry.trim())) {
    throw new Error(language + ' has incomplete ' + field + ' (' + entries.length + '/' + keys.length + ')');
  }
  return Object.fromEntries(keys.map((key, index) => [key, entries[index].trim()]));
}

function translation(language, installAnchor, nav, headings, columns, text, cases, contribution, questions) {
  return {
    language, installAnchor,
    nav: table(navKeys, nav, 'nav', language),
    headings: table(headingKeys, headings, 'headings', language),
    columns: table(columnKeys, columns, 'columns', language),
    text: table(textKeys, text, 'text', language),
    cases, contribution, questions,
  };
}

const de = translation(
  "Deutsch",
  "installation",
  [
  "Installationshilfe",
  "Nutzung",
  "Skill-Verzeichnis",
  "Beispiele",
  "FAQ",
  "Mitwirken"
],
  [
  "Installation",
  "Mit KI installieren",
  "Unterstützte Agenten",
  "Anwendung",
  "Neues Projekt",
  "Bestehendes Projekt",
  "Engineering-Standards",
  "Wissensbibliothek",
  "Skill-Verzeichnis",
  "Praxisbeispiele",
  "Funktionsweise",
  "Grenzen",
  "Roadmap",
  "Dokumentation",
  "Mitwirkende",
  "Danksagung",
  "Lizenz",
  "Sternverlauf",
  "Releases",
  "Warum fühlt sich Shuffle manchmal falsch an?",
  "Was ist SeniorMode?",
  "Warum SeniorMode?",
  "Vorher und nachher",
  "Projekt- und Benutzerbereich",
  "Manuelle Installation",
  "CLI-verwaltete Installation",
  "Fehlerbehebung",
  "Sicherheit",
  "Verhaltensregeln"
],
  [
  "Agent",
  "Engineering-Entscheidungen",
  "Kategorien",
  "Manuell oder SeniorMode im Projekt",
  "Vercel skills im Projekt",
  "Vercel skills global",
  "Anfrage",
  "Entscheidung"
],
  [
  "Deine KI kann programmieren. Jetzt soll sie technische Entscheidungen treffen.",
  "Technisches Praxiswissen für Coding-Agenten.",
  "Entwickelt in der Türkei 🇹🇷",
  "SeniorMode gibt deinem Coding-Agenten eine Bibliothek technischer Entscheidungen und einen Ablauf, um sie anzuwenden. So erkennt der Agent Risiken, wählt einen passenden Ansatz und prüft das Ergebnis.",
  "Führe im Projektstamm den Befehl für deinen Agenten aus. Der Vercel-Installer benötigt",
  "Starte die Agent-Sitzung neu. Beschreibe deine Aufgabe und erwähne bei Bedarf SeniorMode. In Codex ruft $seniormode den Skill explizit auf. Die integrierten Einträge funktionieren ohne MCP.",
  "Die optionale CLI durchsucht lokale Einträge. Über MCP kann dein Agent auch Standards und Arbeitsabläufe abrufen. SeniorMode läuft lokal und braucht keinen API-Schlüssel. Dein Agent kann ein eigenes Konto voraussetzen.",
  "Ergänze eine technische Entscheidung, verbessere ein Beispiel oder eine Übersetzung oder sag uns, wo du noch Verbesserungsbedarf siehst.",
  "Code und Agentenabläufe stehen unter MIT. Die Bibliothek und die daraus erzeugten Katalogseiten stehen unter CC BY 4.0.",
  "Der empfohlene Installer verwendet standardmäßig den Projektbereich. -g wählt den Benutzerbereich. Die SeniorMode-CLI verwaltet nur bestehende Projekte. Hänge seniormode an die Pfade an. ~ ist das Benutzerverzeichnis.",
  "Vercel skills speichert Projektinstallationen in skills-lock.json und globale Installationen in .skill-lock.json. Nutze --project für Projekt-Updates und --global für globale Aktionen. Der Installer kann den gewählten Skill-Ordner und die Lockdatei ändern.",
  "Kopiere den gesamten Ordner skills/seniormode aus einem vertrauenswürdigen Checkout in das Skills-Verzeichnis deines Hosts. SKILL.md, Referenzen und Lizenzen bleiben zusammen. Ersetze oder entferne zur Pflege nur diesen Ordner und prüfe lokale Änderungen.",
  "Führe diese Schritte einzeln aus einem SeniorMode-Checkout gegen ein bestehendes Projekt aus. Laufzeit:",
  "Das CLI-Manifest schützt veränderte oder nicht verwaltete Ordner. Update und Uninstall bearbeiten nur saubere Kopien, die das CLI angelegt hat. Bestehende Agent-Einstellungen bleiben erhalten. MCP wird separat eingerichtet.",
  "Prüfe Projektstamm, Installationspfad und Node.js-Version. Starte die Sitzung neu und rufe SeniorMode bei Bedarf namentlich auf. Bei CLI-Fehlern hilft die Laufzeitdokumentation.",
],
  [
  [
    "Musik-Shuffle",
    "Füge meiner Musik-App Shuffle hinzu.",
    "Das Beispiel gibt die vollständige Abspielreihenfolge für jede Methode mit Titeln aus."
  ],
  [
    "Letztes Zimmer",
    "Baue eine Hotelreservierung.",
    "Der Test sendet zwei Anfragen gleichzeitig. Eine bucht das Zimmer, die andere erfährt, dass es bereits vergeben ist."
  ],
  [
    "Wiederholte Zahlung",
    "Baue einen Checkout mit Zahlung.",
    "Der Test verwirft die erste Antwort, wiederholt die Anfrage und prüft, dass nur eine Abbuchung erfasst wurde."
  ],
  [
    "Doppelte Feed-Einträge",
    "Finde den Grund für Duplikate.",
    "Das Beispiel schiebt zwischen zwei Anfragen einen Beitrag ein und zeigt, wie sich doppelte Einträge vermeiden lassen."
  ]
],
  [
  "Zuerst im Katalog nach bestehenden Entscheidungen suchen.",
  "Die englische Quelle mit Szenario, Quellen, Alias und Prüfungen bearbeiten.",
  "Katalog neu erzeugen und abgeleitete Dateien zum Pull Request hinzufügen.",
  "Tests ausführen und Übersetzungen mit englischen Links, Befehlen und Einschränkungen abgleichen."
],
  [
  [
    "Brauche ich einen SeniorMode-API-Schlüssel?",
    "Skill, CLI und MCP laufen lokal und brauchen keinen SeniorMode-API-Schlüssel. Dein Agent kann ein eigenes Konto oder Modellzugriff voraussetzen. Die Installation über Git oder Vercel skills kann eine Internetverbindung erfordern."
  ],
  [
    "Aktiviert sich der Skill automatisch?",
    "Ob der Skill automatisch gefunden wird, hängt vom Agenten ab. Starte nach der Installation eine neue Sitzung. Nenne SeniorMode, falls der Skill nicht ausgewählt wird."
  ],
  [
    "Wie aktualisiere oder entferne ich den Skill?",
    "Nutze die ursprünglich verwendete Methode. Vercel skills führt eigene Lockdateien. Die SeniorMode-CLI prüft ihren Installationsnachweis und schützt geänderte oder fremd installierte Ordner."
  ],
  [
    "Welche Inhalte sind übersetzt?",
    "Anleitungen, Beispiele und die Kurzbeschreibungen im Skill-Verzeichnis gibt es in den Sprachen im Menü oben. Die vollständigen Einträge und Standards sind auf Englisch. Die Suche unterstützt Englisch und Türkisch. Dein Agent kann das Ergebnis in deiner Sprache erklären."
  ],
],
);

const es = translation(
  "Español",
  "instalación",
  [
  "Guía de instalación",
  "Uso",
  "Directorio de habilidades",
  "Ejemplos",
  "Preguntas frecuentes",
  "Contribuir"
],
  [
  "Instalación",
  "Instalar con IA",
  "Agentes compatibles",
  "Cómo usarlo",
  "Proyecto nuevo",
  "Proyecto existente",
  "Estándares de ingeniería",
  "Biblioteca de conocimiento",
  "Directorio de habilidades",
  "Ejemplos reales",
  "Cómo funciona",
  "Limitaciones",
  "Hoja de ruta",
  "Documentación",
  "Colaboradores",
  "Agradecimientos",
  "Licencia",
  "Historial de estrellas",
  "Versiones",
  "¿Por qué parece fallar la reproducción aleatoria?",
  "¿Qué es SeniorMode?",
  "¿Por qué SeniorMode?",
  "Antes y después",
  "Ámbito del proyecto y global",
  "Instalación manual",
  "Instalación gestionada por CLI",
  "Solución de problemas",
  "Política de seguridad",
  "Código de conducta"
],
  [
  "Agente",
  "registros de ingeniería",
  "categorías",
  "Manual o CLI en el proyecto",
  "Vercel skills en el proyecto",
  "Vercel skills global",
  "Petición",
  "Decisión"
],
  [
  "Tu IA puede programar. Haz que tome decisiones de ingeniería.",
  "Conocimiento práctico de ingeniería para agentes de programación.",
  "Hecho en Türkiye 🇹🇷",
  "SeniorMode aporta a tu agente de programación una biblioteca de decisiones de ingeniería y un método para aplicarlas. Le ayuda a detectar riesgos, elegir un enfoque adecuado y comprobar el resultado.",
  "Desde la raíz del proyecto, ejecuta el comando de tu agente. El instalador de Vercel requiere",
  "Reinicia la sesión y describe tu tarea. Si no se selecciona la habilidad, menciona SeniorMode. En Codex puedes usar $seniormode. Los registros empaquetados funcionan sin MCP.",
  "La CLI opcional busca registros locales. Con MCP, tu agente también puede consultar los estándares y flujos de trabajo. SeniorMode funciona en local y no requiere una clave de API. Tu agente puede necesitar su propia cuenta.",
  "Añade una decisión técnica, mejora un ejemplo o una traducción, o cuéntanos qué podría funcionar mejor.",
  "El código y los flujos del skill tienen licencia MIT. La biblioteca y su catálogo generado usan CC BY 4.0.",
  "El instalador recomendado usa el proyecto por defecto. -g usa el directorio del usuario. La CLI de SeniorMode escribe solo en proyectos existentes. Añade seniormode a las rutas. ~ es tu directorio de usuario.",
  "Vercel skills registra las instalaciones de proyecto en skills-lock.json y las globales en .skill-lock.json. Usa --project para las actualizaciones de proyecto y --global para las operaciones globales. El instalador puede modificar la carpeta elegida y el archivo de bloqueo.",
  "Copia todo el directorio skills/seniormode de una copia fiable a la carpeta de habilidades. Conserva juntos SKILL.md, las referencias y licencias. Para actualizarlo o eliminarlo, revisa los cambios locales y actúa solo sobre esa carpeta.",
  "Ejecuta estas acciones por separado desde una copia de SeniorMode para un proyecto existente. La versión mínima es",
  "La CLI guarda un manifiesto y protege las carpetas editadas o no gestionadas. Update y uninstall actúan sobre copias gestionadas sin cambios. El instalador conserva la configuración del agente. Configura MCP aparte.",
  "Revisa la raíz del proyecto, la ruta de instalación y la versión de Node.js. Reinicia el agente e invoca SeniorMode por su nombre si hace falta. La guía del entorno de ejecución cubre los errores de la CLI.",
],
  [
  [
    "Reproducción aleatoria",
    "Añade reproducción aleatoria a mi aplicación de música.",
    "Ejecuta el ejemplo para ver la lista completa de canciones en cada orden."
  ],
  [
    "Última habitación",
    "Construye un sistema de reservas para mi hotel.",
    "La prueba envía dos solicitudes a la vez. Una reserva la habitación y la otra confirma que ya está ocupada."
  ],
  [
    "Reintento de pago",
    "Construye un proceso de pago.",
    "La prueba descarta la primera respuesta, reintenta la petición y comprueba que solo se registra un cobro."
  ],
  [
    "Duplicados en el feed",
    "Averigua por qué hay elementos duplicados.",
    "El ejemplo intercala una publicación entre dos peticiones y muestra cómo evitar que se repitan entradas en el feed."
  ]
],
  [
  "Busca la decisión en el catálogo antes de añadirla.",
  "Edita la fuente inglesa con escenarios, fuentes, alias y comprobaciones propios.",
  "Vuelve a generar el catálogo e incluye los archivos generados en la solicitud de cambios.",
  "Ejecuta los controles y compara traducciones, comandos, enlaces y límites con el inglés."
],
  [
  [
    "¿Necesito una clave de API de SeniorMode?",
    "El skill, la CLI y MCP funcionan en local sin una clave de API de SeniorMode. Tu agente puede necesitar una cuenta propia o acceso a un modelo. La instalación desde Git o con Vercel skills puede requerir conexión a internet."
  ],
  [
    "¿El skill se activa automáticamente?",
    "La detección automática depende del agente. Reinicia la sesión tras instalar y menciona SeniorMode si el agente no selecciona el skill."
  ],
  [
    "¿Cómo lo actualizo o elimino?",
    "Usa el método original. Vercel skills lleva sus propios archivos de bloqueo. La CLI de SeniorMode comprueba su registro de instalación y protege las carpetas modificadas o instaladas por otros medios."
  ],
  [
    "¿Qué está traducido?",
    "En el menú de arriba puedes elegir el idioma de las guías, los ejemplos y los resúmenes del directorio. Los registros completos y los estándares están en inglés. Puedes buscar en inglés y turco, y tu agente puede explicar el resultado en tu idioma."
  ],
],
);

const fr = translation(
  "Français",
  "installation",
  [
  "Guide d’installation",
  "Utilisation",
  "Répertoire des skills",
  "Exemples",
  "FAQ",
  "Contribuer"
],
  [
  "Installation",
  "Installer avec une IA",
  "Agents compatibles",
  "Mode d’emploi",
  "Nouveau projet",
  "Projet existant",
  "Standards d’ingénierie",
  "Bibliothèque de connaissances",
  "Répertoire des skills",
  "Exemples concrets",
  "Fonctionnement",
  "Limites",
  "Feuille de route",
  "Documentation",
  "Contributeurs",
  "Remerciements",
  "Licence",
  "Historique des étoiles",
  "Versions",
  "Pourquoi la lecture aléatoire semble-t-elle parfois fausse ?",
  "Qu’est-ce que SeniorMode ?",
  "Pourquoi SeniorMode ?",
  "Avant et après",
  "Périmètre projet ou global",
  "Installation manuelle",
  "Installation gérée par la CLI",
  "Dépannage",
  "Politique de sécurité",
  "Code de conduite"
],
  [
  "Agent",
  "fiches techniques",
  "catégories",
  "Manuel ou CLI projet",
  "Vercel skills projet",
  "Vercel skills global",
  "Demande",
  "Décision"
],
  [
  "Votre IA sait coder. Donnez-lui de vrais choix d’ingénierie.",
  "Des repères d’ingénierie issus de la pratique pour vos agents de programmation.",
  "Développé en Türkiye 🇹🇷",
  "SeniorMode fournit à votre agent de programmation une bibliothèque de décisions d’ingénierie et une méthode pour les appliquer. Il l’aide à repérer les risques, à choisir une approche adaptée à votre projet et à vérifier le résultat.",
  "À la racine du projet, lancez la commande de votre agent. L’installateur Vercel nécessite",
  "Redémarrez la session et décrivez votre demande. Mentionnez SeniorMode si l’agent ne sélectionne pas le skill. Dans Codex, utilisez $seniormode. Les fiches intégrées fonctionnent sans serveur MCP.",
  "La CLI facultative recherche les fiches locales. Avec MCP, votre agent peut aussi consulter les standards et les méthodes de travail. SeniorMode fonctionne en local sans clé d’API. Votre agent peut nécessiter son propre compte.",
  "Ajoutez une décision, améliorez un exemple ou une traduction, ou signalez ce qui mérite d’être amélioré.",
  "Le code et les workflows du skill sont sous MIT. La bibliothèque et son catalogue généré sont sous CC BY 4.0.",
  "L’installateur recommandé cible le projet. -g utilise le répertoire utilisateur. La CLI SeniorMode cible uniquement un projet existant. Ajoutez seniormode aux chemins ci-dessous. ~ indique le dossier personnel.",
  "Vercel skills consigne les installations par projet dans skills-lock.json et les installations globales dans .skill-lock.json. Utilisez --project pour les mises à jour du projet et --global pour les opérations globales. L’installateur peut modifier le dossier choisi et le fichier de verrouillage.",
  "Copiez le dossier skills/seniormode entier depuis une source fiable vers le dossier des compétences. Conservez SKILL.md, les références et les licences ensemble. Pour actualiser ou retirer la copie, vérifiez les modifications et agissez sur ce seul dossier.",
  "Exécutez ces actions séparément depuis un checkout SeniorMode vers un projet existant. Version minimale :",
  "La CLI utilise un manifeste et protège les copies modifiées ou non gérées. Update et uninstall agissent sur une copie gérée intacte. L’installation laisse la configuration de l’agent en place. MCP se configure séparément.",
  "Vérifiez la racine du projet, le chemin d’installation et la version de Node.js. Relancez l’agent et appelez SeniorMode par son nom si nécessaire. Consultez le guide d’exécution pour les erreurs de la CLI.",
],
  [
  [
    "Lecture aléatoire",
    "Ajoute une lecture aléatoire à mon application musicale.",
    "Lancez l’exemple pour voir, titre par titre, l’ordre produit par chaque méthode."
  ],
  [
    "Dernière chambre",
    "Construis un système de réservation pour mon hôtel.",
    "Le test envoie deux demandes simultanées. L’une réserve la chambre, l’autre la trouve déjà prise."
  ],
  [
    "Relance d’un paiement",
    "Construis un panier qui accepte les paiements.",
    "Le test écarte la première réponse, renvoie la demande et confirme qu’un seul débit a été enregistré."
  ],
  [
    "Doublons dans le fil",
    "Trouve pourquoi certaines publications s’affichent deux fois.",
    "L’exemple ajoute une publication entre deux requêtes et montre comment éviter que le fil répète une entrée."
  ]
],
  [
  "Cherchez d’abord la décision dans le catalogue.",
  "Modifiez la source anglaise avec scénario, sources, alias et vérifications.",
  "Régénérez les fichiers et joignez-les à la demande de modification.",
  "Exécutez les contrôles et comparez liens, commandes et limites avec l’anglais."
],
  [
  [
    "Faut-il une clé API SeniorMode ?",
    "Le skill, la CLI et MCP fonctionnent en local sans clé d’API SeniorMode. Votre agent peut avoir besoin d’un compte ou d’un accès à un modèle. Une installation depuis Git ou via Vercel skills peut nécessiter une connexion."
  ],
  [
    "Le skill s’active-t-il automatiquement ?",
    "La détection automatique dépend de l’agent. Redémarrez la session après l’installation et mentionnez SeniorMode si le skill n’est pas choisi."
  ],
  [
    "Comment mettre à jour ou supprimer le skill ?",
    "Reprenez la méthode d’installation d’origine. Vercel skills utilise ses propres fichiers de verrouillage. La CLI de SeniorMode vérifie son registre d’installation et protège les dossiers modifiés ou installés autrement."
  ],
  [
    "Qu’est-ce qui est traduit ?",
    "Le menu en haut de la page permet de choisir la langue des guides, des exemples et des résumés du répertoire. Les fiches complètes et les standards sont en anglais. La recherche fonctionne en anglais et en turc. Votre agent peut expliquer le résultat dans votre langue."
  ],
],
);


const ja = translation(
  "日本語",
  "インストール",
  [
  "導入ガイド",
  "使い方",
  "スキルディレクトリ",
  "実行例",
  "よくある質問",
  "コントリビュート"
],
  [
  "インストール",
  "AIでインストール",
  "対応エージェント",
  "使い方",
  "新規プロジェクト",
  "既存プロジェクト",
  "エンジニアリング基準",
  "知識ライブラリ",
  "スキルディレクトリ",
  "実務に近い例",
  "動作の流れ",
  "制約",
  "ロードマップ",
  "ドキュメント",
  "貢献者",
  "謝辞",
  "ライセンス",
  "スター履歴",
  "リリース",
  "なぜシャッフルが不自然に感じるのか",
  "SeniorModeとは",
  "なぜSeniorModeか",
  "比較",
  "プロジェクトとグローバル",
  "手動インストール",
  "CLIで管理するインストール",
  "トラブルシューティング",
  "セキュリティ",
  "行動規範"
],
  [
  "エージェント",
  "件の設計記録",
  "カテゴリ",
  "手動または管理CLIのプロジェクトパス",
  "Vercelのプロジェクトパス",
  "Vercelのグローバルパス",
  "利用者の依頼",
  "設計判断"
],
  [
  "AIはコードを書ける。次は、設計を判断できるように。",
  "コーディングエージェントに、実務で使えるエンジニアリング知識を。",
  "トルコで開発 🇹🇷",
  "SeniorMode は、コーディングエージェントに設計判断のライブラリと、それを使う手順を提供します。エージェントがリスクを見つけ、プロジェクトに合う方法を選び、結果を検証するために使えます。",
  "プロジェクトのルートで、使っているエージェント向けのコマンドを実行します。Vercel インストーラーに必要なバージョンは",
  "セッションを再起動し、やりたいことを自分の言葉で依頼します。自動で選ばれなければSeniorModeを指定してください。Codexでは $seniormode が使えます。同梱の知識はMCPなしで利用できます。",
  "CLI はローカルの記録を検索します。MCP ではエージェントが標準ガイドや作業手順も参照できます。どちらも任意で、SeniorMode の API キーは不要です。エージェント自体にはアカウントが必要な場合があります。",
  "新しい設計判断、例や翻訳の改善、使いにくかった点の報告を歓迎します。",
  "コードとスキルの手順はMIT、知識集と生成したカタログはCC BY 4.0です。",
  "推奨のインストーラーではプロジェクト内が既定です。-g はユーザー領域を使います。SeniorModeの管理CLIは既存のプロジェクトを対象にします。下記のパスに seniormode を付けます。~ はホームディレクトリです。",
  "Vercel skills はプロジェクトへの導入を skills-lock.json に、グローバルへの導入を .skill-lock.json に記録します。プロジェクトの更新には --project、グローバル操作には --global を使います。インストーラーは指定先のフォルダーやロックファイルを変更する場合があります。",
  "信頼できるチェックアウトの skills/seniormode を丸ごとコピーします。SKILL.md、参照、ライセンスをまとめて保持します。更新または削除の前にローカルの変更を確認してください。",
  "SeniorModeのソースに依存関係を入れ、対象の既存プロジェクトを指定してコマンドを個別に実行します。必要なバージョンは",
  "管理CLIはマニフェストで整合性を確認し、未管理または編集されたフォルダーを保護します。updateとuninstallは未変更の管理コピーが対象です。既存のホスト設定は保持し、MCPは別に設定します。",
  "プロジェクトのルート、インストール先、Node.js のバージョンを確認してください。セッションを再起動し、必要なら SeniorMode を名前で指定します。CLI のエラーはランタイムガイドを参照してください。",
],
  [
  [
    "音楽シャッフル",
    "音楽プレイヤーにシャッフルを追加して。",
    "例を実行すると、曲名を含む再生順を方式ごとに確認できます。"
  ],
  [
    "最後の空室",
    "小さなホテルの予約システムを作って。",
    "テストでは予約を同時に2件送ります。1件だけが確定し、もう1件には空きがないことが伝わります。"
  ],
  [
    "支払いの再試行",
    "支払いできる購入画面を作って。",
    "テストでは最初の応答を破棄してから支払いを再試行し、請求が1件だけ残ることを確認します。"
  ],
  [
    "フィードの重複",
    "投稿が2回出る原因を調べて。",
    "ページを取得する間に投稿を追加し、同じ投稿が繰り返し表示されない方法を示します。"
  ]
],
  [
  "まず知識カタログで既存の判断を探します。",
  "英文の原本にシナリオ、出典、検索語と検証を追加します。",
  "生成したカタログと索引もプルリクエストに含めます。",
  "検証を実行し、翻訳でコマンド、リンク、制約を英語原本と照合します。"
],
  [
  [
    "SeniorModeのAPIキーは必要ですか",
    "スキル、CLI、MCP はローカルで動作し、SeniorMode の API キーは不要です。エージェント側でアカウントやモデルへのアクセスが必要なことがあります。Git や Vercel skills での導入には通信が必要な場合があります。"
  ],
  [
    "自動で起動しますか",
    "自動で見つかるかどうかはエージェントによります。導入後はセッションを再開し、選ばれない場合は SeniorMode を名前で指定してください。"
  ],
  [
    "更新や削除はどうしますか",
    "最初に導入した方法を使います。Vercel skills は独自のロックファイルを使います。SeniorMode CLI は自身の導入記録を確認し、編集済みのフォルダーや他の方法で導入したフォルダーを保護します。"
  ],
  [
    "翻訳の対象は何ですか",
    "ガイド、使用例、スキルディレクトリの概要は、ページ上部のメニューから言語を選んで読めます。記録の本文と標準ガイドは英語です。検索は英語とトルコ語に対応し、エージェントに自分の言語で説明してもらえます。"
  ],
],
);

const ptBr = translation(
  "Português (Brasil)",
  "instalação",
  [
  "Guia de instalação",
  "Uso",
  "Diretório de habilidades",
  "Exemplos",
  "Perguntas frequentes",
  "Contribuir"
],
  [
  "Instalação",
  "Instalar com IA",
  "Agentes compatíveis",
  "Como usar",
  "Projeto novo",
  "Projeto existente",
  "Padrões de engenharia",
  "Biblioteca de conhecimento",
  "Diretório de habilidades",
  "Exemplos reais",
  "Como funciona",
  "Limites",
  "Roteiro",
  "Documentação",
  "Colaboradores",
  "Agradecimentos",
  "Licença",
  "Histórico de estrelas",
  "Versões",
  "Por que o modo aleatório às vezes parece errado?",
  "O que é SeniorMode?",
  "Por que usar SeniorMode?",
  "Antes e depois",
  "Escopo do projeto e global",
  "Instalação manual",
  "Instalação gerenciada pela CLI",
  "Resolução de problemas",
  "Política de segurança",
  "Código de conduta"
],
  [
  "Agente",
  "registros de engenharia",
  "categorias",
  "Manual ou CLI no projeto",
  "Vercel skills no projeto",
  "Vercel skills global",
  "Pedido",
  "Decisão"
],
  [
  "Sua IA sabe programar. Agora faça com que tome decisões de engenharia.",
  "Conhecimento prático de engenharia para agentes de programação.",
  "Feito na Turquia 🇹🇷",
  "O SeniorMode oferece ao seu agente de programação uma biblioteca de decisões de engenharia e um processo para aplicá-las. Assim, o agente pode identificar riscos, escolher uma abordagem adequada ao projeto e testar o resultado.",
  "Na raiz do projeto, execute o comando do seu agente. O instalador da Vercel exige",
  "Reinicie a sessão e descreva o trabalho. Se o agente não escolher a habilidade, mencione SeniorMode. No Codex, $seniormode é a chamada explícita. Os registros incluídos funcionam sem MCP.",
  "A CLI opcional pesquisa registros locais. Com MCP, seu agente também pode consultar os padrões e os fluxos de trabalho. O SeniorMode roda localmente sem chave de API. Seu agente pode exigir uma conta própria.",
  "Adicione uma decisão de engenharia, melhore um exemplo ou uma tradução ou conte o que poderia funcionar melhor.",
  "O código e os fluxos da habilidade usam MIT. A biblioteca e o catálogo gerado usam CC BY 4.0.",
  "O instalador recomendado usa o projeto por padrão. -g usa a pasta do usuário. A CLI de SeniorMode gerencia apenas projetos existentes. Acrescente seniormode aos caminhos. ~ indica sua pasta pessoal.",
  "O Vercel skills registra instalações de projeto em skills-lock.json e instalações globais em .skill-lock.json. Use --project para atualizar no projeto e --global para operações globais. O instalador pode alterar a pasta escolhida e o arquivo de bloqueio.",
  "Copie o diretório inteiro skills/seniormode de uma origem confiável. Mantenha SKILL.md, referências e licenças juntos. Para atualizar ou remover, revise alterações locais e mexa apenas nessa pasta.",
  "Execute estas ações separadamente a partir do código de SeniorMode, apontando para um projeto existente. A versão mínima é",
  "A CLI valida um manifesto e preserva pastas modificadas ou não gerenciadas. Update e uninstall atuam apenas numa cópia gerenciada intacta. A instalação preserva a configuração do agente. Configure MCP separadamente.",
  "Confira a raiz do projeto, o caminho de instalação e a versão do Node.js. Reinicie a sessão e invoque o SeniorMode pelo nome se necessário. Consulte o guia de execução para erros da CLI.",
],
  [
  [
    "Modo aleatório",
    "Adicione modo aleatório ao meu aplicativo de música.",
    "Execute o exemplo para ver a ordem de reprodução com os títulos das faixas em cada método."
  ],
  [
    "Último quarto",
    "Crie um sistema de reservas para meu hotel.",
    "O teste envia dois pedidos juntos. Um garante a reserva e o outro recebe a notícia de que o quarto já foi reservado."
  ],
  [
    "Nova tentativa de pagamento",
    "Crie um carrinho que aceite pagamentos.",
    "O teste descarta a primeira resposta, repete a solicitação e confirma que só uma cobrança ficou registrada."
  ],
  [
    "Duplicatas no feed",
    "Descubra por que algumas publicações aparecem duas vezes.",
    "O exemplo insere uma publicação entre duas requisições e mostra como evitar que itens apareçam duas vezes no feed."
  ]
],
  [
  "Busque a decisão no catálogo antes de criar um registro.",
  "Edite a fonte inglesa com cenário, referências, aliases e verificações.",
  "Gere o catálogo e inclua os arquivos derivados na solicitação de mudança.",
  "Rode as verificações e compare links, comandos e limites com o inglês."
],
  [
  [
    "Preciso de uma chave de API do SeniorMode?",
    "A habilidade, a CLI e o MCP funcionam localmente sem chave de API do SeniorMode. Seu agente pode precisar de conta própria ou acesso a um modelo. A instalação pelo Git ou pelo Vercel skills pode exigir conexão com a internet."
  ],
  [
    "A habilidade ativa automaticamente?",
    "A descoberta automática depende do agente. Reinicie a sessão depois de instalar e mencione o SeniorMode se a habilidade não for selecionada."
  ],
  [
    "Como atualizo ou removo?",
    "Use o método original. O Vercel skills mantém seus próprios arquivos de bloqueio. A CLI do SeniorMode confere o cadastro da instalação e preserva pastas alteradas ou instaladas de outra forma."
  ],
  [
    "O que foi traduzido?",
    "No menu no topo da página, você pode escolher o idioma dos guias, exemplos e resumos do diretório. Os registros completos e os padrões estão em inglês. A busca funciona em inglês e turco, e seu agente pode explicar o resultado no seu idioma."
  ],
],
);

const zhCN = translation(
  "简体中文",
  "安装",
  [
  "安装指南",
  "使用",
  "技能目录",
  "示例",
  "常见问题",
  "贡献"
],
  [
  "安装",
  "让 AI 安装",
  "支持的智能体",
  "使用方法",
  "新项目",
  "现有项目",
  "工程标准",
  "知识库",
  "技能目录",
  "实际场景",
  "工作流程",
  "限制",
  "路线图",
  "文档",
  "贡献者",
  "致谢",
  "许可证",
  "星标历史",
  "发布版本",
  "随机播放为什么有时感觉不对",
  "SeniorMode 是什么",
  "为什么用 SeniorMode",
  "前后对比",
  "项目与全局作用域",
  "手动安装",
  "CLI 管理安装",
  "排查问题",
  "安全策略",
  "行为准则"
],
  [
  "智能体",
  "条工程记录",
  "个类别",
  "手动或管理 CLI 的项目路径",
  "Vercel skills 项目路径",
  "Vercel skills 全局路径",
  "用户请求",
  "工程决策"
],
  [
  "AI 会写代码，也该学会作出工程判断。",
  "为编程智能体提供实用的工程知识。",
  "在土耳其开发 🇹🇷",
  "SeniorMode 为你的编程智能体提供工程决策库，以及把这些决策用到项目里的步骤。它帮助智能体发现风险，选择适合项目的方法，并验证结果。",
  "在项目根目录运行适用于你的智能体的命令。Vercel 安装工具要求",
  "重启会话，用自己的话描述任务。若智能体未选用该技能，请明确提到 SeniorMode。Codex 可以用 $seniormode 调用。内置记录可在没有 MCP 的情况下使用。",
  "可选的 CLI 用于搜索本地记录。通过 MCP，智能体还可以查阅工程标准和工作流程。SeniorMode 在本地运行，无需 API 密钥。智能体本身可能需要账号。",
  "欢迎添加新的工程决策，改进示例或翻译，也欢迎告诉我们哪里还可以做得更好。",
  "代码与技能工作流采用 MIT。知识记录和生成的目录采用 CC BY 4.0。",
  "推荐安装器默认作用于项目。-g 作用于用户目录。SeniorMode 管理 CLI 只写入已有项目。在下列路径后加上 seniormode。~ 表示主目录。",
  "Vercel skills 将项目安装记录在 skills-lock.json 中，将全局安装记录在 .skill-lock.json 中。更新项目安装时使用 --project，全局操作使用 --global。安装工具可能修改所选文件夹和锁文件。",
  "从可信的代码副本复制完整的 skills/seniormode 目录。保留 SKILL.md、引用文件和许可证。替换或删除前先检查本地更改。",
  "在已安装依赖的 SeniorMode 源码目录运行这些操作，指向已有项目。所需版本是",
  "管理 CLI 以清单验证文件，保留未管理或编辑过的副本。update 和 uninstall 作用于原样的管理副本。安装保留既有设置，MCP 单独配置。",
  "检查项目根目录、安装路径和 Node.js 版本。重启会话，必要时按名称调用 SeniorMode。CLI 报错时可查阅运行指南。",
],
  [
  [
    "音乐随机播放",
    "给我的音乐应用加入随机播放。",
    "运行示例即可查看每种方法生成的完整播放顺序和歌名。"
  ],
  [
    "最后一间客房",
    "为我的小旅馆搭建预约系统。",
    "测试同时发出两个预订请求。一个订到房，另一个收到房间已被订走的结果。"
  ],
  [
    "支付重试",
    "创建一个接受支付的购物车。",
    "测试丢弃第一次支付的响应，重试后确认只记录了一次扣款。"
  ],
  [
    "信息流重复",
    "找出帖子为何出现两次。",
    "示例在两次请求之间插入一篇帖子，并说明怎样避免信息流出现重复内容。"
  ]
],
  [
  "新增记录前先在目录中查找已有决策。",
  "编辑英文原文并提供原创场景、来源、别名和验证。",
  "重新生成目录和索引，把生成文件一同提交审查。",
  "运行检查，翻译时比对英文中的链接、命令和限制。"
],
  [
  [
    "需要 SeniorMode API 密钥吗",
    "技能、CLI 和 MCP 都在本地运行，无需 SeniorMode API 密钥。智能体可能需要自己的账号或模型访问权限。通过 Git 或 Vercel skills 安装可能需要联网。"
  ],
  [
    "技能会自动启用吗",
    "能否自动找到技能取决于智能体。安装后重启会话，如果未自动选中技能，可以直接提到 SeniorMode。"
  ],
  [
    "如何更新或卸载",
    "请使用原来的安装方式。Vercel skills 使用自己的锁文件。SeniorMode CLI 会核对自己的安装记录，并保护已修改或通过其他方式安装的文件夹。"
  ],
  [
    "哪些内容有翻译",
    "你可以在页面顶部切换指南、示例和技能目录摘要的语言。完整记录与工程标准使用英语。搜索支持英语和土耳其语，智能体也可以用你的语言解释结果。"
  ],
],
);

export const otherLocales = { de, es, fr, ja, 'pt-BR': ptBr, 'zh-CN': zhCN };

