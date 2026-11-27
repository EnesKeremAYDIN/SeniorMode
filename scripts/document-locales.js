import { otherLocales } from './document-other-locales.js';
import { readmeLocaleFiles, readmeLocaleSection } from './document-locale-files.js';

const en = {
  language: 'English',
  installAnchor: 'install',
  nav: { install: 'Installation', usage: 'Usage', directory: 'Skill Directory', examples: 'Examples', faq: 'FAQ', contribute: 'Contributing' },
  headings: {
    install: 'Install', ai: 'Install with AI', support: 'Supported agents', use: 'How to use', newProject: 'New project',
    existing: 'Existing project', standards: 'Engineering standards', library: 'Knowledge Catalog', directory: 'Skill directory',
    real: 'Real-world examples', how: 'How it works', limitations: 'Limitations',
    roadmap: 'Roadmap', docs: 'Documentation', contributors: 'Contributors', thanks: 'Acknowledgments',
    license: 'License', stars: 'Star history', releases: 'Releases', shuffle: 'Why does shuffle feel broken?',
    what: 'What is SeniorMode?', why: 'Why SeniorMode?', compare: 'Before and after', scopes: 'Project and global scope',
    manual: 'Manual installation', managed: 'CLI-managed installation', troubleshoot: 'Troubleshooting',
    security: 'Security policy', conduct: 'Code of conduct',
  },
  columns: {
    host: 'Agent', records: 'Engineering Decisions',
    categories: 'Categories', native: 'Manual / SeniorMode project path',
    project: 'Vercel skills project path', global: 'Vercel skills global path', task: 'User request', decision: 'Engineering decision',
  },
  text: {
    tagline: 'Your AI can code. Now make it engineer.',
    subtitle: 'Real-world engineering knowledge for AI coding agents.',
    made: 'Made in Türkiye 🇹🇷',
    what: 'SeniorMode gives your coding agent a library of engineering decisions and a workflow for applying them. It helps the agent spot risks, choose an approach that fits your project, and test the result.',
    quickStart: 'From your project root, run the command for your agent. The Vercel installer requires',
    firstRun: 'Restart the agent session and ask for the change in your own words. Mention SeniorMode if the host does not select the skill. In Codex, $seniormode is the explicit skill reference. Bundled records work without an MCP server.',
    cliMcp: 'The optional CLI searches local records. MCP also gives your agent access to the standards and workflows. SeniorMode runs locally without an API key. Your agent may require its own account.',
    contribute: 'Add an engineering decision, improve an example or translation, or tell us what could work better.',
    license: 'Code and skill workflows use MIT. The engineering decision library and its generated catalog pages use CC BY 4.0.',
    scopes: 'The recommended installer uses project scope by default. Its optional global flag changes the home-level location. The managed SeniorMode CLI writes into an existing project only. Append seniormode to each skills path below. Tilde means your home directory.',
    external: 'Vercel skills records project installations in skills-lock.json and global installations in .skill-lock.json. Use --project for project updates and --global for global operations. The installer can change the selected skill folder and lock file.',
    manual: 'Copy the entire skills/seniormode directory from a trusted checkout into the host’s skills directory. Retain SKILL.md, references, and licenses together. To refresh or remove your manual copy, replace or delete only that folder after reviewing any local edits.',
    managed: 'With dependencies installed in a SeniorMode checkout, run these actions individually against an existing project. The runtime requires',
    ownership: 'The managed CLI checks that it owns the installed files and that they are unmodified before updating or removing them. It limits changes to the managed skill and its installation records. Configure MCP in your agent if you need it.',
    troubleshoot: 'Check the project root, installation path, and Node.js version. Restart the session, then invoke SeniorMode by name if the agent has yet to discover it. For managed CLI errors, see the runtime guide.',
  },
  cases: [
    ['Music shuffle', 'Add shuffle to my music app.', 'Run this example to see the song titles and the complete order for each method.'],
    ['Last-room reservations', 'Build a reservation system for my small hotel.', 'The test sends two requests at the same time. One books the room. The other finds it taken.'],
    ['Payment retry', 'Build a checkout with payments.', 'The test drops the first reply, retries the request, and confirms only one charge was recorded.'],
    ['Repeated posts in a feed', 'Some posts in this feed show up twice. Find out why.', 'The example inserts a post between requests and shows two ways to continue the feed, including one that avoids repeating a post.'],
  ],
  contribution: [
    'Search the catalog for the decision before adding a record.',
    'Edit the canonical English Markdown with original scenarios, sources, aliases, and checks.',
    'Regenerate the catalog and include the resulting docs and indexes in your pull request.',
    'Run the checks. For a translation, review the corresponding English text, links, commands, and caveats.',
  ],
  questions: [
    ['Do I need a SeniorMode API key?', 'The skill, CLI, and MCP server run locally without a SeniorMode API key. Your agent may need its own account or model access. Installing from Git or with Vercel skills can require network access.'],
    ['Will SeniorMode activate automatically?', 'Automatic discovery depends on your agent. Restart the session after installing and mention SeniorMode if the skill isn’t selected.'],
    ['Which installer should I use to update or uninstall?', 'Use the method that installed the copy. Vercel skills tracks its own copies in lock files. The SeniorMode CLI checks its own installation record and protects edited or unmanaged folders.'],
    ['What is translated?', 'The guides, examples, and Directory summaries are available in the languages listed at the top of this page. Full records and standards are in English. Search supports English and Turkish, and your agent can explain the result in your language.'],
  ],
};

const tr = {
  language: 'Türkçe',
  installAnchor: 'kurulum',
  nav: { install: 'Kurulum rehberi', usage: 'Kullanım', directory: 'Beceri Dizini', examples: 'Örnekler', faq: 'SSS', contribute: 'Katkı rehberi' },
  headings: {
    install: 'Kurulum', ai: 'Yapay zekâyla kur', support: 'Desteklenen yapay zekâ araçları', use: 'Nasıl kullanılır?', newProject: 'Yeni proje',
    existing: 'Mevcut proje', standards: 'Mühendislik standartları', library: 'Bilgi Kataloğu', directory: 'Beceri dizini',
    real: 'Gerçek dünya örnekleri', how: 'Nasıl çalışır?', limitations: 'Sınırlar',
    roadmap: 'Yol haritası', docs: 'Dokümantasyon', contributors: 'Katkıda bulunanlar', thanks: 'Teşekkürler',
    license: 'Lisans', stars: 'Yıldız geçmişi', releases: 'Sürümler', shuffle: 'Karışık çalma neden bozuk gibi gelir?',
    what: 'SeniorMode nedir?', why: 'Neden SeniorMode?', compare: 'Öncesi ve sonrası', scopes: 'Proje ve global kapsam',
    manual: 'Elle kurulum', managed: 'CLI yönetimli kurulum', troubleshoot: 'Sorun giderme',
    security: 'Güvenlik politikası', conduct: 'Davranış kuralları',
  },
  columns: {
    host: 'Yapay zekâ aracı', records: 'mühendislik kaydı',
    categories: 'kategori', native: 'Elle / SeniorMode proje yolu',
    project: 'Vercel skills proje yolu', global: 'Vercel skills global yolu', task: 'Kullanıcı isteği', decision: 'Mühendislik kararı',
  },
  text: {
    tagline: 'Yapay zekân kod yazabiliyor. Şimdi mühendislik yapsın.',
    subtitle: 'Yapay zekâ asistanın için gerçek dünyadan mühendislik bilgisi.',
    made: 'Türkiye’de geliştirildi 🇹🇷',
    what: 'SeniorMode, asistanının projendeki riskleri fark etmesine, doğru mühendislik kararlarını vermesine ve sonucu test etmesine yardımcı olur.',
    quickStart: 'Proje kökünde asistanına ait komutu çalıştır. Vercel yükleyicisinin gerektirdiği sürüm',
    firstRun: 'Asistan oturumunu yeniden başlat ve değişikliği kendi kelimelerinle anlat. Asistan beceriyi seçmezse SeniorMode’u adıyla çağır. Codex’te $seniormode ile açıkça çağırabilirsin. Paketteki kayıtlar MCP sunucusu olmadan çalışır.',
    cliMcp: 'İsteğe bağlı CLI ile kayıtları arayabilirsin. MCP üzerinden asistanın standartlara ve iş akışlarına da erişebilir. SeniorMode yerel çalışır ve API anahtarı istemez. Asistanın kendi hesabını isteyebilir.',
    contribute: 'Yeni bir karar kaydı, örnek veya çeviri ekleyebilir ya da iyileştirilmesini istediğin bir noktayı paylaşabilirsin.',
    license: 'Kod ve beceri iş akışları MIT kapsamındadır. Mühendislik karar kütüphanesi ve üretilen katalog sayfaları CC BY 4.0 kapsamındadır.',
    scopes: 'Önerilen yükleyici varsayılan olarak projeye kurar. İsteğe bağlı global bayrak, kullanıcı dizinini seçer. Yönetilen SeniorMode CLI yalnızca mevcut projeye yazar. Aşağıdaki skills yollarının sonuna seniormode eklenir. ~ işareti kullanıcı dizinini gösterir.',
    external: 'Vercel skills proje kurulumlarını skills-lock.json, genel kurulumları .skill-lock.json dosyasına kaydeder. Proje güncellemeleri için --project, genel işlemler için --global kullan. Yükleyici seçilen klasörü ve kilit dosyasını değiştirebilir.',
    manual: 'Güvenilir bir kopyadaki skills/seniormode dizininin tamamını asistanın skills klasörüne kopyala. SKILL.md, references ve lisansları birlikte tut. Elle kurulan kopyayı güncellerken veya kaldırırken yerel değişiklikleri incele ve yalnızca bu klasöre işlem yap.',
    managed: 'SeniorMode kaynak klasöründe bağımlılıkları kur. Ardından gereken komutu, mevcut projenin yolunu belirterek çalıştır. En düşük sürüm',
    ownership: 'SeniorMode CLI, yalnızca kendi kurduğu ve sonradan düzenlenmemiş kopyaları günceller veya kaldırır. Sadece beceri klasöründe ve kurulum kayıtlarında değişiklik yapar. Asistan ayarların korunur. İstersen MCP’yi ayrıca kurabilirsin.',
    troubleshoot: 'Proje kökünü, kurulum yolunu ve Node.js sürümünü kontrol et. Oturumu yeniden başlat. Asistan beceriyi bulamazsa SeniorMode’u adıyla çağır. Yönetilen CLI hataları için çalışma zamanı rehberine bak.',
  },
  cases: [
    ['Karışık müzik çalma', 'Müzik uygulamama karışık çalma ekle.', 'Her yöntemin çalma sırasını parça adlarıyla görmek için örneği çalıştırabilirsin.'],
    ['Son oda rezervasyonu', 'Küçük otelim için rezervasyon sistemi yap.', 'Test aynı anda iki rezervasyon isteği gönderir. Biri odayı alır, diğeri odanın artık müsait olmadığı yanıtını alır.'],
    ['Ödeme tekrarı', 'Ödeme alan bir sepet yap.', 'Test ilk yanıtı kaybettikten sonra isteği tekrarlar ve yalnızca bir kez ücret çekildiğini doğrular.'],
    ['Akışta tekrarlanan öğeler', 'Bu akışta bazı öğeler iki kez görünüyor. Sebebini bul.', 'Örnek, sayfa istekleri arasında yeni bir gönderi ekleyerek akışın nasıl tekrar ürettiğini ve bunu önleyen yaklaşımı gösterir.'],
  ],
  contribution: [
    'Yeni kayıt açmadan önce katalogda ilgili kararı ara.',
    'Ana İngilizce Markdown’a özgün senaryo, kaynaklar, arama terimleri ve kontroller ekle.',
    'Kataloğu yeniden üret ve oluşan sayfa ve dizinleri pull request’e ekle.',
    'Kontrolleri çalıştır. Çeviride İngilizce metni, bağlantıları, komutları ve sınırlamaları karşılaştır.',
  ],
  questions: [
    ['SeniorMode için API anahtarı gerekir mi?', 'Beceri, CLI ve MCP yerel çalışır. SeniorMode için API anahtarı gerekmez. Asistanın kendi hesabına veya model erişimine ihtiyaç duyabilir. Git ya da Vercel skills ile kurulum için internet bağlantısı gerekebilir.'],
    ['SeniorMode otomatik etkinleşir mi?', 'Otomatik keşif kullandığın asistana bağlı. Kurulumdan sonra oturumu yeniden başlat. Beceri seçilmezse SeniorMode’u adıyla çağır.'],
    ['Güncelleme veya kaldırma için hangi aracı kullanmalıyım?', 'Kopyayı ilk kurduğun yöntemle güncelle veya kaldır. Vercel skills kendi kilit dosyalarını kullanır. SeniorMode CLI kendi kurulum kaydını kontrol eder ve düzenlediğin ya da başka bir yöntemle kurduğun kopyaları korur.'],
    ['Hangi içerikler çevrildi?', 'Rehberleri, örnekleri ve Beceri Dizini’ndeki özetleri sayfanın başındaki menüde yer alan dillerde okuyabilirsin. Kayıtların ve standartların tam metni İngilizce. İngilizce veya Türkçe arama yapabilir, sonucu kendi dilinde açıklamasını asistanından isteyebilirsin.'],
  ],
};

const builtInLocales = { en, tr, ...otherLocales };
const translationLinks = {
  "en": { addLanguage: "Add your language", translationForm: "Propose a language or suggest a translation fix" },
  "tr": { addLanguage: "Kendi dilini ekle", translationForm: "Yeni bir dil öner veya çeviri düzeltmesi gönder" },
  "de": { addLanguage: "Eigene Sprache hinzufügen", translationForm: "Eine Sprache vorschlagen oder eine Übersetzung korrigieren" },
  "es": { addLanguage: "Añade tu idioma", translationForm: "Propón un idioma o una corrección de traducción" },
  "fr": { addLanguage: "Ajouter votre langue", translationForm: "Proposer une langue ou une correction de traduction" },
  "ja": { addLanguage: "自分の言語を追加", translationForm: "言語の追加や翻訳の修正を提案する", period: '。' },
  "pt-BR": { addLanguage: "Adicione seu idioma", translationForm: "Sugira um idioma ou uma correção de tradução" },
  "zh-CN": { addLanguage: "添加你的语言", translationForm: "建议新增语言或修正翻译", period: '。' },
};

const fileLocales = readmeLocaleSection('guide');
for (const locale of Object.keys(fileLocales)) {
  if (Object.hasOwn(builtInLocales, locale)) throw new Error('Duplicate README locale ' + locale);
}
export const locales = { ...builtInLocales, ...fileLocales };

export function localeMetadata(locale) {
  return readmeLocaleFiles[locale] ?? translationLinks[locale];
}

