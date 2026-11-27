export const readmeFooterByLocale = {
  en: { starPrompt: 'If SeniorMode helps on your next project, {star} so others can find it.', starAction: 'give it a star on GitHub', acknowledgments: 'SeniorMode builds on these open projects.' },
  tr: { starPrompt: 'SeniorMode işine yaradıysa başkalarının da projeyi keşfedebilmesi için {star}.', starAction: 'GitHub’da yıldız verebilirsin', acknowledgments: 'SeniorMode bu açık projelerin üzerine kurulu.' },
  de: { starPrompt: 'Wenn dir SeniorMode bei einem Projekt hilft, {star}, damit andere es leichter finden.', starAction: 'gib ihm einen Stern auf GitHub', acknowledgments: 'SeniorMode baut auf diesen offenen Projekten auf.' },
  es: { starPrompt: 'Si SeniorMode te resulta útil, {star} para que otras personas puedan encontrarlo.', starAction: 'dale una estrella en GitHub', acknowledgments: 'SeniorMode se apoya en estos proyectos abiertos.' },
  fr: { starPrompt: 'Si SeniorMode vous aide dans un projet, {star} pour le faire découvrir à d’autres.', starAction: 'donnez-lui une étoile sur GitHub', acknowledgments: 'SeniorMode s’appuie sur ces projets ouverts.' },
  ja: { starPrompt: 'SeniorMode が役に立ったら、{star}と、他の人にも見つけてもらいやすくなります。', starAction: 'GitHub でスターを付ける', acknowledgments: 'SeniorMode は次のオープンなプロジェクトを活用しています。' },
  'pt-BR': { starPrompt: 'Se o SeniorMode ajudar no seu projeto, {star} para que mais pessoas possam encontrá-lo.', starAction: 'dê uma estrela no GitHub', acknowledgments: 'O SeniorMode se apoia nestes projetos abertos.' },
  'zh-CN': { starPrompt: '如果 SeniorMode 对你的项目有帮助，欢迎{star}，让更多人发现它。', starAction: '在 GitHub 上点个星', acknowledgments: 'SeniorMode 基于以下开放项目。' },
};

function experience(working, installLead, prompt, newScenario, existingScenario,
  hostSupport) {
  return {
    working, installLead, prompt, newScenario, existingScenario,
    hostSupport,
  };
}

export const experienceByLocale = {
  en: experience(
    'Working code is not enough.',
    'Give this prompt to your coding agent, or choose your agent below for the terminal command.',
    'Install SeniorMode from {source}. Follow the installation instructions for my coding agent and current project. Check the target directory before writing, preserve my settings and any existing skill edits, and verify that the skill is available. Ask before overwriting an existing copy. Leave MCP setup for a separate request.',
    ['Use SeniorMode to build a music streaming app.', 'Describe what you want to build. Your agent picks a starting design, builds the first useful version, and checks how it works.', 'Can I start a new project?', 'Yes. Open a project folder and tell your agent what you want to build with SeniorMode.'],
    ['Use SeniorMode to add shuffle to my music app.', 'Describe the change or the problem in your project. Your agent reads the existing code first. When you ask for an audit, it reports findings without editing files.', 'Can I use this on an existing project?', 'Yes. Use SeniorMode for a feature, fix, refactor, or audit. An audit starts read-only.'],
    'Install SeniorMode in any of these five agents. You can also use MCP from a compatible client.',
  ),
  tr: experience(
    'Çalışan kod tek başına yetmez.',
    'Bu isteği asistanına göndererek SeniorMode’u kurdurabilirsin. Terminalden kurmak için aşağıdan kullandığın aracı seç.',
    'SeniorMode’u {source} adresinden kur. Kullandığım yapay zekâ asistanı ve mevcut proje için kurulum rehberini izle. Yazmadan önce hedef dizini kontrol et, ayarlarımı ve becerideki mevcut düzenlemeleri koru. Becerinin kullanılabildiğini doğrula. Mevcut kopyanın üzerine yazmadan önce sor. MCP kurulumunu ayrı bir isteğe bırak.',
    ['SeniorMode ile bir müzik yayını uygulaması geliştir.', 'Ne yapmak istediğini anlat. Asistanın işe nereden başlayacağına karar verir, kullanılabilir bir ilk sürüm geliştirir ve sonucu test eder.', 'Sıfırdan bir proje başlatabilir miyim?', 'Evet. Bir proje klasörü aç ve SeniorMode ile ne geliştirmek istediğini asistanına söyle.'],
    ['SeniorMode ile müzik uygulamama karışık çalma ekle.', 'Projende neyin değişmesini istediğini veya hangi sorunla karşılaştığını anlat. Asistanın önce mevcut kodu inceler. Denetim istediğinde dosyaları değiştirmeden bulgularını paylaşır.', 'Mevcut projemde kullanabilir miyim?', 'Evet. SeniorMode ile özellik ekleyebilir, hata düzeltebilir, kodu yeniden düzenleyebilir veya denetim isteyebilirsin. Denetim, dosyalarda değişiklik yapmadan başlar.'],
    'SeniorMode’u bu beş asistandan birine kurabilirsin. MCP’yi uyumlu bir istemciyle de kullanabilirsin.',
  ),
  de: experience(
    'Funktionierender Code reicht allein nicht.',
    'Gib deinem Coding-Agenten diese Anfrage oder wähle unten deinen Agenten für den passenden Terminalbefehl.',
    'Installiere SeniorMode von {source}. Befolge die Anleitung für meinen Coding-Agenten und das aktuelle Projekt. Prüfe zuerst das Ziel. Erhalte meine Einstellungen und vorhandene Änderungen am Skill. Verifiziere die Installation und frage vor dem Ersetzen einer vorhandenen Kopie nach. Richte MCP nur auf Anfrage ein.',
    ['Entwickle mit SeniorMode eine Musikstreaming-App.', 'Beschreibe, was du bauen möchtest. Dein Agent wählt einen passenden Einstieg, baut eine erste brauchbare Version und prüft das Ergebnis.', 'Kann ich ein neues Projekt beginnen?', 'Ja. Öffne einen Projektordner und sag deinem Agenten, was du mit SeniorMode bauen möchtest.'],
    ['Ergänze meine Musik-App mit SeniorMode um eine Zufallswiedergabe.', 'Beschreibe die gewünschte Änderung oder das Problem. Dein Agent liest zuerst den vorhandenen Code. Bei einer Prüfung meldet er seine Befunde, ohne Dateien zu ändern.', 'Kann ich ein bestehendes Projekt verbessern?', 'Ja. Nutze SeniorMode für eine Funktion, Fehlerbehebung, ein Refactoring oder eine Prüfung. Eine Prüfung beginnt im Lesemodus.'],
    'SeniorMode lässt sich in diesen fünf Agenten installieren. MCP kannst du auch über einen kompatiblen Client nutzen.',
  ),
  es: experience(
    'No basta con que el código funcione.',
    'Dale esta instrucción a tu agente o elige tu herramienta abajo para copiar el comando de terminal.',
    'Instala SeniorMode desde {source}. Sigue las instrucciones de mi agente y del proyecto actual. Comprueba el destino antes de escribir, conserva mis ajustes y los cambios existentes, y verifica que la habilidad esté disponible. Pregunta antes de sustituir una copia. Configura MCP solo si te lo pido.',
    ['Usa SeniorMode para crear una aplicación de música en streaming.', 'Cuenta qué quieres crear. Tu agente elige cómo empezar, desarrolla una primera versión útil y comprueba el resultado.', '¿Puedo iniciar un proyecto nuevo?', 'Sí. Abre una carpeta de proyecto y dile a tu agente qué quieres crear con SeniorMode.'],
    ['Usa SeniorMode para añadir reproducción aleatoria a mi aplicación de música.', 'Describe el cambio que quieres o el problema que has encontrado. El agente primero lee el código. Si pides una auditoría, te explica lo que encontró sin editar archivos.', '¿Puedo usarlo en un proyecto existente?', 'Sí. Usa SeniorMode para añadir una función, corregir un fallo, refactorizar o auditar. La auditoría comienza en modo de solo lectura.'],
    'Puedes instalar SeniorMode en estos cinco agentes. También puedes usar MCP desde un cliente compatible.',
  ),
  fr: experience(
    'Un code qui fonctionne ne suffit pas.',
    'Envoyez cette demande à votre agent ou choisissez votre outil ci-dessous pour copier la commande de terminal.',
    'Installe SeniorMode depuis {source}. Suis le guide pour mon agent et ce projet. Vérifie le dossier cible avant d’écrire et préserve mes réglages ainsi que les modifications d’un skill existant. Vérifie que le skill est disponible. Demande avant de remplacer une copie. Configure MCP uniquement à ma demande.',
    ['Utilise SeniorMode pour créer une application de musique en streaming.', 'Décrivez ce que vous voulez créer. Votre agent choisit une façon de démarrer, réalise une première version utile et vérifie son fonctionnement.', 'Puis-je démarrer un nouveau projet ?', 'Oui. Ouvrez un dossier de projet et dites à votre agent ce que vous voulez créer avec SeniorMode.'],
    ['Utilise SeniorMode pour ajouter la lecture aléatoire à mon application musicale.', 'Décrivez le changement souhaité ou le problème rencontré. Votre agent lit d’abord le code. Si vous demandez un audit, il présente ses constats sans modifier les fichiers.', 'Puis-je améliorer un projet existant ?', 'Oui. Utilisez SeniorMode pour ajouter une fonctionnalité, corriger un bug, refactoriser ou auditer. Un audit commence en lecture seule.'],
    'SeniorMode s’installe dans ces cinq agents. Vous pouvez aussi utiliser MCP depuis un client compatible.',
  ),
  ja: experience(
    '動くコードだけでは足りません。',
    '次の依頼をエージェントに送ると導入できます。ターミナルから導入する場合は、以下で利用中のエージェントを選んでください。',
    '{source} から SeniorMode を導入してください。利用中のエージェントとこのプロジェクト向けの手順に従ってください。書き込み前に配置先を確認し、既存の設定とスキルの編集内容を保護してください。利用可能になったことを確認してください。上書きは確認を取ってから行い、MCP は別途依頼した場合にだけ設定してください。',
    ['SeniorMode を使って音楽ストリーミングアプリを作って。', '作りたいものを伝えてください。エージェントが方針を決め、まず使える版を作って動作を確認します。', '新しいプロジェクトを始められますか？', 'はい。プロジェクトのフォルダを開き、SeniorMode を使って何を作りたいか伝えてください。'],
    ['SeniorMode を使って、音楽アプリにシャッフル再生を追加して。', '変更したいことや困っていることを伝えてください。エージェントはまず既存のコードを読みます。監査を依頼した場合は、ファイルを変更せずに結果を報告します。', '既存のプロジェクトにも使えますか？', 'はい。機能追加、バグ修正、リファクタリング、監査に使えます。監査は読み取り専用で始めます。'],
    'SeniorMode は次の 5 つのエージェントに導入できます。MCP は対応クライアントからも利用できます。',
  ),
  'pt-BR': experience(
    'Código funcionando não basta.',
    'Envie este pedido ao seu agente ou escolha sua ferramenta abaixo para copiar o comando de terminal.',
    'Instale o SeniorMode a partir de {source}. Siga as instruções para meu agente e meu projeto atual. Confira o destino antes de gravar, preserve minhas configurações e edições existentes e verifique se a habilidade está disponível. Pergunte antes de substituir uma cópia. Configure MCP só se eu pedir.',
    ['Use o SeniorMode para criar um aplicativo de streaming de música.', 'Conte o que quer criar. O agente escolhe como começar, desenvolve uma primeira versão útil e verifica o resultado.', 'Posso começar um projeto novo?', 'Sim. Abra a pasta do projeto e diga ao agente o que quer criar com o SeniorMode.'],
    ['Use o SeniorMode para adicionar reprodução aleatória ao meu aplicativo de música.', 'Descreva a mudança que você quer ou o problema que encontrou. O agente lê o código primeiro. Se você pedir uma auditoria, ele relata o que encontrou sem editar os arquivos.', 'Posso usar em um projeto existente?', 'Sim. Use o SeniorMode para adicionar uma funcionalidade, corrigir um erro, refatorar ou fazer uma auditoria. A auditoria começa em modo somente leitura.'],
    'O SeniorMode pode ser instalado nestes cinco agentes. Você também pode usar MCP com um cliente compatível.',
  ),
  'zh-CN': experience(
    '代码能运行，还不够。',
    '把下面的提示发给你的编程智能体，也可以在下方选择工具并复制终端命令。',
    '请从 {source} 安装 SeniorMode。遵循当前智能体和项目对应的安装说明。写入前检查目标目录，保留现有配置以及已安装技能的修改，并验证技能可用。覆盖现有副本前先征求确认。除非我另行要求，不要配置 MCP。',
    ['用 SeniorMode 做一个音乐流媒体应用。', '说说你想做什么。智能体会选择合适的起步方案，做出第一个可用版本，再检查运行效果。', '能从零开始新项目吗？', '可以。打开项目文件夹，告诉智能体你想用 SeniorMode 做什么。'],
    ['用 SeniorMode 给我的音乐应用加上随机播放。', '描述你想改什么，或者遇到了什么问题。智能体会先读现有代码。如果你只要求审查，它会报告发现的问题，不修改文件。', '能在现有项目里使用吗？', '可以。你可以用 SeniorMode 添加功能、修复问题、重构或审查代码。审查以只读方式开始。'],
    '这五款智能体均可安装 SeniorMode。你也可以通过兼容的客户端使用 MCP。',
  ),
};

