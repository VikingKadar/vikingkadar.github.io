/* ==========================================================================
   CONTENT - vikingkadar.github.io
   ==========================================================================
   Every word, number, image, video id and on/off switch on the site lives
   in this one file. Edit here, nowhere else.

   Rules the pages follow:
     - An empty string '' or an empty list [] hides that element, and nothing is
       requested from the server. Fill in the src when the file exists.
     - An image file that is missing on the server still hides itself quietly.
     - A `// TODO Viking:` marks something only you can fill in.

   Image shape : { src: 'images/x.webp', alt: 'what is in it', w: 1200, h: 800 }
   Video shape : { youtube: 'ID', title: 'Shown on the play button', channel: 'event name' }
   Loop shape  : { src: 'images/clips/x.mp4', poster: 'images/clips/x.webp', alt: '' }
   ========================================================================== */
window.CONTENT = {

  /* ---------- Switches ---------- */
  flags: {
    CURSOR: true,        // the custom mouse pointer on desktop
    SHOW_AMIDA: true,    // case-amida.html and its cards. false = hidden everywhere
    SEO_READY: false,    // course-seo.html. Flip to true when the SEO sections below are filled in
  },

  /* ---------- Site-wide ---------- */
  site: {
    name: 'Viking Kadar',
    url: 'https://vikingkadar.github.io/',
    email: 'viking@posterlab.ai',
    emailSubject: 'Internship Mar–Apr 2027',
    availability: 'Open for internship · Mar–Apr 2027',
    ctaLabel: 'Internship? Email me',
    contactHeadline: 'Let\'s build something',
    contactLine: 'Six weeks, March to April 2027. Creative or social, Stockholm or abroad. One email is enough, I reply fast.',
    linkedin: 'https://www.linkedin.com/in/viking-kadar-52895a234/',
    tiktok: 'https://www.tiktok.com/@sweden_ai',
    tiktokHandle: '@sweden_ai',
    github: 'https://github.com/VikingKadar',
    cv: '',              // TODO Viking: lägg cv.pdf i roten och skriv 'cv.pdf' här, så dyker "Download CV" upp av sig själv.
    footer: 'Viking Kadar, Growth Marketing, Berghs School of Communication',
    footerNote: 'Built in plain HTML, CSS and JavaScript. Published via GitHub Pages.',
  },

  nav: [
    { label: 'Work', href: 'index.html#work' },
    { label: 'Own projects', href: 'projects.html' },
    { label: 'Berghs', href: 'berghs.html' },
    { label: 'About', href: 'index.html#about' },
  ],

  /* ==========================================================================
     HOME  (index.html)
     ========================================================================== */
  home: {
    hero: {
      badge: 'Open for internship · Mar–Apr 2027',
      title: 'Ideas that move',
      words: ['NUMBERS', 'VIEWS', 'BELTS', 'SNEAKERS', 'PEOPLE'],   // the red word, changes every 2 s
      sub: 'I\'m Viking Kadar, an AI-native growth marketer. I make the content, build the tool and measure what it did.',
      primary: { label: 'See the work', href: '#work' },
      secondary: { label: 'Email me' },
    },

    // The living wall next to the hero. Three columns, full colour, slow scroll.
    // Loops from swedenAI.clips are mixed in automatically when they exist.
    wall: [
      { src: 'images/wall/portrait.webp',   alt: 'Viking Kadar',                                          w: 540, h: 961, href: 'index.html#about',                  case: 'about',       label: 'About' },
      { src: 'images/wall/choco.webp',      alt: 'Aroma Roast ad: a coffee bag pressed into a chocolate cake', w: 540, h: 675, href: 'course-performance-marketing.html', case: 'aromaroast', label: 'Aroma Roast' },
      { src: 'images/wall/gossip.webp',     alt: 'Royal Opera poster: two women whispering over a martini', w: 540, h: 802, href: 'course-opera.html',                case: 'opera',       label: 'The Royal Opera' },
      { src: 'images/wall/claw.webp',       alt: 'Aroma Roast ad: coffee bags as prizes in a claw machine', w: 540, h: 675, href: 'course-performance-marketing.html', case: 'aromaroast', label: 'Aroma Roast' },
      { src: 'images/wall/fotboll.webp',    alt: 'Royal Opera poster: an opera singer in tails in front of a stand with flares', w: 540, h: 802, href: 'course-opera.html', case: 'opera', label: 'The Royal Opera' },
      { src: 'images/wall/suitcase.webp',   alt: 'Aroma Roast ad: the whole range packed in a suitcase',   w: 540, h: 675, href: 'course-performance-marketing.html', case: 'aromaroast', label: 'Aroma Roast' },
      { src: 'images/wall/hearthbreak.webp', alt: 'Royal Opera poster: roses in a rubbish bin',             w: 540, h: 802, href: 'course-opera.html',                case: 'opera',       label: 'The Royal Opera' },
      { src: 'images/wall/tv.webp',         alt: 'Aroma Roast ad: three screens, three ways to drink it',  w: 540, h: 675, href: 'course-performance-marketing.html', case: 'aromaroast', label: 'Aroma Roast' },
    ],

    // Four numbers that count up. `text` is what the HTML ships with, so the
    // page reads right before JavaScript runs.
    stats: [
      { value: 41.8, dec: 1, suf: 'M',  text: '41.8M',    label: 'views on my own TikTok',                       href: 'case-sweden-ai.html' },
      { value: 500,                       text: '500',      label: 'belts sold out',                                href: 'case-william-manor.html' },
      { value: 1.3,  dec: 1, pre: 'SEK ', suf: 'M', text: 'SEK 1.3M', label: 'in sneaker sales as a teenager',   href: 'projects.html#sneakers' },
      { value: 2,                         text: '2',        label: 'real-client briefs (Royal Swedish Opera, Aroma Roast)', href: 'berghs.html' },
    ],

    // "Can you stop the scroll?" The phone feed is built from performance.ads
    // and opera.posters below, so there is nothing to duplicate here.
    feed: {
      title: 'Can you stop the scroll?',
      intro: 'My ads and posters roll past like a feed. Hit Stop and see the thinking behind whatever you landed on.',
      button: 'Stop',
      again: 'Roll again',
      sub: 'Everything I make has one job: stop the thumb.',
      see: 'See the case →',
    },

    // Selected work: the bento grid. size 'lg' = a big tile, 'sm' = a small one.
    work: [
      { id: 'sweden_ai', size: 'lg', href: 'case-sweden-ai.html', title: 'Sweden AI',
        line: 'My own TikTok. Idea, production and editing, all me.',
        num: '41.8M', numLabel: 'views', tags: ['#Content', '#Hooks', '#Organic'],
        // TODO Viking: en skärmdump eller stillbild från kontot. Saknas filen visas siffran stort i stället.
        img: { src: '' /* TODO Viking: t.ex. 'images/swedenai-cover.webp' */, alt: 'The Sweden AI TikTok account', w: 1200, h: 1500 } },
      { id: 'aromaroast', size: 'sm', href: 'course-performance-marketing.html', title: 'Aroma Roast',
        line: 'Real client, live on Meta. Concept and all the ad creative.',
        num: '6', numLabel: 'ads, 3 stages', tags: ['#MetaAds', '#AIProduction', '#Funnel'],
        img: { src: 'images/aroma/choco.webp', alt: 'Aroma Roast ad: a coffee bag pressed into a chocolate cake', w: 1024, h: 1280 } },
      { id: 'opera', size: 'sm', href: 'course-opera.html', title: 'The Royal Opera',
        line: 'How do you get 20-year-olds to pick the opera over Netflix?',
        num: '3', numLabel: 'posters, 2 AI films', tags: ['#Concept', '#AIFilm', '#Geofencing'],
        img: { src: 'images/fotboll.webp', alt: 'Royal Opera poster: an opera singer in tails in front of a stand with flares', w: 1200, h: 1783 } },
      { id: 'posterlab', size: 'lg', href: 'case-posterlab.html', title: 'PosterLab',
        line: 'My own AI company. Upload a photo, get a painting.',
        num: 'V2', numLabel: 'rebuilt around zero friction', tags: ['#PLG', '#AI', '#Ecommerce'],
        // TODO Viking: en hjältebild för PosterLab (t.ex. en färdig tavla). Saknas filen visas texten stort i stället.
        img: { src: '' /* TODO Viking: t.ex. 'images/posterlab-hero.webp' */, alt: 'A PosterLab oil painting made from a photo', w: 1200, h: 1500 } },
    ],

    // The two doors. Thumbs that are missing on the server are swapped for
    // the number tiles in `fallback`, in order.
    doors: [
      { id: 'projects', href: 'projects.html', title: 'My own projects', line: 'My own time, my own money, my own numbers.',
        thumbs: [
          { src: '' /* TODO Viking: t.ex. 'images/swedenai-cover.webp' */, alt: 'Sweden AI on TikTok', w: 1200, h: 1500 },
          { src: '' /* TODO Viking: t.ex. 'images/posterlab-hero.webp' */, alt: 'A PosterLab painting', w: 1200, h: 1500 },
          { src: '' /* TODO Viking: t.ex. 'images/manor-hero.webp' */,     alt: 'A William Manor belt', w: 1200, h: 1500 },
        ],
        fallback: [{ num: '41.8M', label: 'views' }, { num: '500', label: 'belts' }, { num: '1.3M', label: 'SEK in sneakers' }] },
      { id: 'berghs', href: 'berghs.html', title: 'Berghs, course by course', line: 'Method, tracking and real client briefs.',
        thumbs: [
          { src: 'images/wall/fotboll.webp',  alt: 'Royal Opera poster', w: 540, h: 802 },
          { src: 'images/wall/choco.webp',    alt: 'Aroma Roast ad', w: 540, h: 675 },
          { src: 'images/wall/rostning.webp', alt: 'The suburbs woke up, data story', w: 540, h: 302 },
        ],
        fallback: [{ num: '3', label: 'courses done' }, { num: '2', label: 'real clients' }, { num: '19', label: 'events tracked' }] },
    ],

    // Watch: four films. vertical: true = shown 9:16.
    watch: [
      { youtube: 'NgQOyPT9oE8', title: 'Heart rate – The Royal Opera',               channel: 'heartrate',   href: 'course-opera.html',                 vertical: false },
      { youtube: '7hQMbcbGAZM', title: 'Madame O – The Royal Opera',                 channel: 'madameo',     href: 'course-opera.html',                 vertical: false },
      // TODO Viking: YouTube svarar 403 på OsPaCz2UoCY (privat eller inbäddning avstängd). Sätt filmen till "Olistad" på YouTube och ta sedan bort noThumb så visas YouTubes egen miniatyr.
      { youtube: 'OsPaCz2UoCY', title: 'Aroma Roast – campaign film',                channel: 'aroma_short', href: 'course-performance-marketing.html', vertical: true, noThumb: true },
      { youtube: 'u7_VxeoVWJ0', title: 'The suburbs woke up – data story',           channel: 'fororten',    href: 'fororten.html',                     vertical: false },
    ],

    // What I can do. live = run for real, learned = covered at Berghs.
    skills: [
      { id: 'analytics', title: 'Analytics & data', href: 'course-growth-toolbox.html', where: 'Growth Toolbox',
        live: ['Google Tag Manager', 'GA4', '19 custom dataLayer events', 'Looker Studio', 'Chart.js', 'Web scraping (Node.js + Cheerio)'],
        learned: ['UTM conventions', 'KPI hierarchy', 'CRO'] },
      { id: 'content', title: 'Content & growth', href: 'course-performance-marketing.html', where: 'Performance Marketing',
        live: ['Meta Ads Manager', 'TikTok organic (41.8M views)', 'Stop / Interest / Action funnel', 'AI ad creative'],
        learned: ['Google Ads (search, PMax, YouTube)', { label: 'ChatGPT Ads', badge: 'New' }, 'SEO & GEO', 'UGC and influencer briefs'] },
      { id: 'build', title: 'Build & AI', href: 'projects.html', where: 'My own projects',
        live: ['HTML / CSS / JS', 'GitHub Pages', 'Claude Code', 'n8n', 'Shopify', 'Seedream API', 'Gemini API'],
        learned: [],
        production: ['Midjourney', 'Seedance', 'Kling', 'Nano Banana', 'Higgsfield', 'ElevenLabs'] },
    ],
    skillsLegend: { live: 'Run live', learned: 'Learned', production: 'AI production', where: 'Where I did it →' },

    ticker: ['Google Tag Manager', 'GA4', 'Looker Studio', 'Chart.js', 'Node.js', 'Cheerio', 'Meta Ads Manager', 'TikTok', 'Google Ads', 'ChatGPT Ads',
      'HTML / CSS / JS', 'GitHub Pages', 'Claude Code', 'n8n', 'Shopify', 'Seedream API', 'Gemini API',
      'Midjourney', 'Seedance', 'Kling', 'Nano Banana', 'Higgsfield', 'ElevenLabs', 'PlentyLabs', 'Canva', 'CapCut', 'Figma'],

    about: {
      portrait: { src: 'images/portrait.webp', alt: 'Viking Kadar', w: 900, h: 1602 },
      paragraphs: [
        'I love two things equally: the idea that makes people stop, and the number that proves it worked. Strategy without impact is a pretty deck. Impact without an idea is a spreadsheet. I want both.',
        'I started selling sneakers at 15, grew a TikTok to 41.8 million views, sold out my own belt brand and built my own AI company. Now I\'m studying Growth Marketing at Berghs to put method behind the instinct.',
        'Give me a problem, a deadline and access to the data.',
      ],
    },
  },

  /* ==========================================================================
     OWN PROJECTS  (projects.html)
     ========================================================================== */
  projects: {
    title: 'My own projects',
    sub: 'My own time, my own money, my own numbers.',
    cards: [
      { id: 'sweden_ai', href: 'case-sweden-ai.html', title: 'Sweden AI', num: '41.8M', numLabel: 'views in four months',
        line: 'My own TikTok. Idea, production and editing, all me.', tags: ['#Content', '#Hooks', '#AIVideo'],
        img: { src: '' /* TODO Viking: t.ex. 'images/swedenai-cover.webp' */, alt: 'The Sweden AI TikTok account', w: 1200, h: 1500 } },
      { id: 'posterlab', href: 'case-posterlab.html', title: 'PosterLab', num: 'V2', numLabel: 'rebuilt around zero friction',
        line: 'My own AI company. Upload a photo, get a painting.', tags: ['#PLG', '#CRO', '#AI', '#Ecommerce'],
        img: { src: '' /* TODO Viking: t.ex. 'images/posterlab-hero.webp' */, alt: 'A PosterLab oil painting made from a photo', w: 1200, h: 1500 } },
      { id: 'manor', href: 'case-william-manor.html', title: 'William Manor', num: '500', numLabel: 'belts sold out',
        line: 'My own belt brand. Guerrilla marketing sold out the whole stock in four months.', tags: ['#DTC', '#Guerrilla', '#Brand'],
        img: { src: '' /* TODO Viking: t.ex. 'images/manor-hero.webp' */, alt: 'A William Manor belt', w: 1200, h: 1500 } },
      { id: 'amida', href: 'case-amida.html', title: 'Amida', num: '0', numLabel: 'stock, nothing to sell', flag: 'SHOW_AMIDA',
        line: 'An AI product I\'m building. A growth loop that runs on email.', tags: ['#AIProduct', '#GeminiAPI', '#GrowthLoop'],
        img: { src: '' /* TODO Viking: t.ex. 'images/amida-hero.webp' */, alt: 'The Amida web app', w: 1200, h: 1500 } },
    ],
    sneakers: {
      title: 'Where it started',
      sub: 'Sneakers, Stockholm, age 15.',
      num: 'SEK 1.3M', numLabel: 'in sales over two years',
      stations: ['Odenplan', 'T-Centralen', 'Södermalm', 'Mall of Scandinavia'],
      steps: [
        'Started reselling sneakers at 15, school at Odenplan.',
        'Release days between Odenplan and the stores.',
        'Roughly 1,000 pairs over two years. Over SEK 1.3 million in sales, about SEK 150,000 a month at the peak.',
        'Early 2023 the Yeezy collapse and Nike flooding the market killed resale margins. The best sales training I could have had.',
      ],
    },
  },

  /* ==========================================================================
     BERGHS  (berghs.html)
     ========================================================================== */
  berghs: {
    title: 'Berghs, course by course',
    sub: 'Growth Marketing, Berghs School of Communication, 2026–2027.',
    // TODO Viking: kolla kursnamn och datum i Canvas.
    timeline: [
      { id: 'communication', title: 'Communication According to Berghs', when: 'Aug 2026', status: 'done' },
      { id: 'opera', title: 'The Royal Opera', sub: 'Cross-programme brief', when: 'Aug 2026', status: 'done', href: 'course-opera.html',
        line: 'How do you get 20-year-olds to pick the opera over Netflix?', tags: ['#Concept', '#AIFilm', '#Geofencing'],
        img: { src: 'images/wall/fotboll.webp', alt: 'Royal Opera poster', w: 540, h: 802 } },
      { id: 'growth_toolbox', title: 'Growth Toolbox', when: 'Aug–Sep 2026', status: 'done', href: 'course-growth-toolbox.html',
        line: 'GTM, GA4, scraping, an API and a data story. This site is the deliverable.', tags: ['#GTM', '#GA4', '#Data'],
        img: { src: 'images/wall/rostning.webp', alt: 'The suburbs woke up, data story', w: 540, h: 302 } },
      { id: 'performance_marketing', title: 'Performance Marketing', sub: 'Aroma Roast', when: 'Sep–Oct 2026', status: 'done', href: 'course-performance-marketing.html',
        line: 'Paid social for a real coffee brand. Six ads, three stages, one clear winner.', tags: ['#MetaAds', '#AIProduction', '#Funnel'],
        img: { src: 'images/wall/choco.webp', alt: 'Aroma Roast ad', w: 540, h: 675 } },
      { id: 'seo', title: 'SEO & Content Marketing', sub: 'Byggalliansen', when: 'Oct 2026', status: 'done', href: 'course-seo.html', flag: 'SEO_READY',
        line: 'Search, GEO and a content strategy for a network of local builders.', tags: ['#SEO', '#GEO', '#Content'] },
      { id: 'cro', title: 'CRO & Analytics', when: 'Nov 2026', status: 'ongoing' },
      { id: 'internship', title: 'Internship', when: 'Mar–Apr 2027', status: 'next' },
    ],
    statusLabel: { done: 'Done', ongoing: 'In progress', next: 'Next' },
  },

  /* ==========================================================================
     SWEDEN AI  (case-sweden-ai.html)
     ========================================================================== */
  swedenAI: {
    title: 'Sweden AI',
    num: '41.8M', numValue: 41.8, numDec: 1, numSuf: 'M', numLabel: 'views',
    kicker: 'four months, almost all of it organic',
    role: 'My own TikTok, @sweden_ai',
    period: '30 Dec 2025 – 28 Apr 2026',
    tags: ['#Content', '#Hooks', '#AIVideo'],
    inShort: ['Idea, production, editing and posting, all me.', '3–5 videos a week.', 'Brands started reaching out.'],
    challenge: 'AI video was exploding, but most accounts only showed the wow. Almost nobody showed how.',
    strategy: 'Every post teaches one concrete AI video skill you can use the same evening. Audience first: useful before impressive.',
    execution: 'Concepts like Vikings attacking New York and dark fantasy castles, shot found-footage and phone-POV style so they felt real in the feed. Made with Nano Banana, Kling and ElevenLabs. Three to five videos a week, every one built around a single skill.',
    tools: ['Nano Banana', 'Kling', 'ElevenLabs', 'CapCut'],
    clipsHeading: 'The videos weren\'t pretty. The hooks were.',
    // TODO Viking: klistra in 2–4 av dina starkaste videor, hela adressen duger.
    // Shape: { url: 'https://www.tiktok.com/@sweden_ai/video/7300000000000000000', views: '4.2M views', why: 'One line on why it worked.' }
    tiktoks: [],
    // TODO Viking: korta mp4-loopar (9:16, utan ljud, max ~2 MB) + en poster-bild per klipp. De dyker upp här och i väggen på startsidan.
    // Shape: { src: 'images/clips/vikings.mp4', poster: 'images/clips/vikings.webp', alt: 'Vikings attacking New York', w: 540, h: 960 }
    clips: [],
    stats: [
      { value: 41.8, dec: 1, suf: 'M', text: '41.8M',   label: 'Post views' },
      { value: 3.3,  dec: 1, suf: 'M', text: '3.3M',    label: 'Likes' },
      { value: 872400,                 text: '872,400', label: 'Shares' },
      { value: 282700,                 text: '282,700', label: 'Profile views' },
      { value: 30700,                  text: '30,700',  label: 'Comments' },
      { value: 23000,                  text: '23,000',  label: 'Followers' },
    ],
    forYou: { pct: 89.5, label: 'of views came from the For You feed' },
    statsCaption: 'Sweden AI on TikTok, 30 December 2025 to 28 April 2026. Almost all of the reach is earned, not paid.',
    outcomes: [
      'Brands started reaching out for collaborations.',
      'I was about to launch my own AI course. When I got into Berghs, I put it on hold.',
    ],
    reflection: 'Looking back, it maps onto the viewer journey we later learned at Berghs: hook in the first second, make the premise clear, give a reason to care, deliver the value, be remembered. I did it on instinct. Now I can do it on purpose.',
    account: { label: 'See the account →', href: 'https://www.tiktok.com/@sweden_ai' },
  },

  /* ==========================================================================
     POSTERLAB  (case-posterlab.html)
     ========================================================================== */
  posterlab: {
    title: 'PosterLab',
    kicker: 'My own AI company',
    role: 'Founder, product and growth',
    period: '2025 –',   // TODO Viking: när startade PosterLab? Tom sträng döljer raden.
    tags: ['#PLG', '#CRO', '#AI', '#Ecommerce'],
    // TODO Viking: en hjältebild, t.ex. en färdig tavla på en vägg.
    hero: { src: '' /* TODO Viking: t.ex. 'images/posterlab-hero.webp' */, alt: 'A PosterLab oil painting made from a photo', w: 1600, h: 1000 },
    inShort: ['V1 failed.', 'One sale showed the real product.', 'V2 rebuilt around zero friction.'],
    challenge: 'Version 1 burned ad money and sold almost nothing. Three reasons: it was positioned as a prompt tool instead of ready-made gifts, you had to create an account before you saw anything, and the flow had bugs that killed checkout.',
    insight: 'The only sale that went through was a memorial portrait. PosterLab doesn\'t sell AI images. It sells emotional gifts.',
    strategy: 'No account. Upload a photo on the start page and see your preview right away. Separate funnels per audience: pets as royal oil paintings, men as vikings and gladiators, each with ready-made templates. Print-on-demand through Prodigi, so there is no stock and no manual handling.',
    strategyLabel: 'V2, product-led growth',
    tech: ['Seedream API', 'Claude Code in VS Code', 'Shopify', 'Prodigi'],
    // Before / after slider. Both files needed, otherwise the whole block hides.
    // TODO Viking: ett hundfoto och samma hund som oljemålning, samma mått.
    before: { src: '' /* TODO Viking: t.ex. 'images/posterlab-before.webp' */, alt: 'The photo of the dog that was uploaded', w: 1200, h: 1500 },
    after:  { src: '' /* TODO Viking: t.ex. 'images/posterlab-after.webp' */,  alt: 'The same dog as a royal oil painting',   w: 1200, h: 1500 },
    sliderLabels: { before: 'Photo', after: 'Painting', hint: 'Drag to compare' },
    status: 'On hold since I started at Berghs. V2 is built and a US relaunch is planned.',
    lesson: 'Remove everything that stands between the customer and the aha moment.',
    next: 'Relaunch in the US with the pet funnel first, one audience and one template set at a time, and measure upload-to-preview before anything else.',
  },

  /* ==========================================================================
     WILLIAM MANOR  (case-william-manor.html)
     ========================================================================== */
  manor: {
    title: 'William Manor',
    num: '500', numValue: 500, numLabel: 'belts sold out',
    kicker: 'My own belt brand',
    role: 'Founder',
    tags: ['#DTC', '#Guerrilla', '#Brand'],
    // TODO Viking: en hjältebild av bältet eller kampanjen.
    hero: { src: '' /* TODO Viking: t.ex. 'images/manor-hero.webp' */, alt: 'A William Manor belt', w: 1600, h: 1000 },
    inShort: ['Founded the brand.', 'Ran social media and most of everything else.', 'All 500 belts sold out in four months.'],
    text: 'I founded William Manor and ran social media and most of everything else. Guerrilla marketing sold out all 500 belts in four months.',
    challenge: 'A new belt brand with no budget and no audience, in a category nobody scrolls for.',
    strategy: 'Guerrilla marketing: find where people are already looking, then show up where they least expect it.',
    // Each of these hides when empty.
    year: '',        // TODO Viking: vilket år? t.ex. '2024'
    views: '',       // TODO Viking: hur många visningar fick kampanjerna? t.ex. '4.2M views'
    platform: '',    // TODO Viking: vilken plattform? t.ex. 'TikTok and Instagram'
    clips: [],       // TODO Viking: loopar från kampanjen. Shape: { src: 'images/clips/manor-1.mp4', poster: 'images/clips/manor-1.webp', alt: '', w: 540, h: 960 }
    photos: [],      // TODO Viking: foton. Shape: { src: 'images/manor-1.webp', alt: '', w: 1200, h: 1500 }
    lesson: 'Attention is cheaper than media. You pay for it with ideas instead.',
    next: 'If I did it again I would track every drop from first view to checkout, so the stunts that sold could be told apart from the stunts that only got watched.',
  },

  /* ==========================================================================
     AMIDA  (case-amida.html, only when flags.SHOW_AMIDA is true)
     ========================================================================== */
  amida: {
    title: 'Amida',
    kicker: 'An AI product I\'m building',
    role: 'Founder, product and growth',
    period: '2026 –',
    tags: ['#AIProduct', '#GeminiAPI', '#GrowthLoop'],
    // TODO Viking: en skärmdump av appen.
    hero: { src: '' /* TODO Viking: t.ex. 'images/amida-hero.webp' */, alt: 'The Amida web app', w: 1600, h: 1000 },
    inShort: ['Research is scattered and hard to read.', 'A minimal app that builds structured protocols.', 'Free on screen, full version by email.'],
    challenge: 'Peptide research is scattered and hard to read.',
    product: 'A minimal web app that builds structured protocols from a curated research database. Two modes: research and practical. Hard safety limits built into the logic, and every piece of deep content is AI-drafted and then reviewed by me.',
    loop: ['Free preview on screen', 'Email to unlock the full protocol', 'Protocol and PDF by email with partner links'],
    loopNote: 'Amida sells nothing itself and holds no stock.',
    tech: ['Python engine on Render', 'Gemini API'],
    next: 'Measure the loop step by step: preview to email, email to open, open to partner click. Then fix the weakest step first.',
  },

  /* ==========================================================================
     THE ROYAL OPERA  (course-opera.html)
     ========================================================================== */
  opera: {
    title: 'The Royal Opera',
    kicker: 'How do you get 20-year-olds to pick the opera over Netflix?',
    role: 'My role: idea and concept; the group refined and packaged it together.',
    period: 'Aug 2026',
    course: 'Cross-programme brief, Berghs',
    tags: ['#Concept', '#AIFilm', '#Geofencing'],
    hero: { src: 'images/fotboll.webp', alt: 'Campaign poster: an opera singer in tails in front of a stand with flares. Same passion, different song.', w: 1200, h: 1783 },
    heroWide: { src: 'images/hero.webp', alt: 'Campaign poster, wide version: Same passion, different song', w: 1344, h: 752 },
    inShort: [
      'Idea and concept: Same feeling, different stage. Three posters, two AI films and the AI guide Madame O.',
      'A funnel with a metric at every step: UTM per placement, and Madame O logging every chat as an event.',
      'A concept is a format, not a picture. And recognition without a next step is wasted.',
    ],
    challenge: 'The opera doesn\'t have a relevance problem. It has a recognition problem. Young adults already live on drama: series, football, the group chat. They know every feeling the opera is built on. The question isn\'t "will I like it?" but "will I fit in?"',
    strategy: 'Same feeling, different stage. One familiar feeling, one real performance, another stage. Football, gossip, heartbreak. A format, so it can run forever. We don\'t change the art. We change how it\'s introduced.',
    posters: [
      { src: 'images/fotboll.webp',    w: 1200, h: 1783, title: 'Same passion. Different song.',    text: 'Think about the final whistle of a football match. The crowd rises and releases everything. A ballet finale creates that same collective release: the audience stands and the room erupts.', alt: 'Poster: an opera singer in tails in front of a stand with flares' },
      { src: 'images/gossip.webp',     w: 1200, h: 1783, title: 'Same whispers. Different walls.',  text: 'La Traviata is basically a group chat drama. Violetta leaves Alfredo without explaining why. He thinks she never cared; the truth comes out much later. Ghosting and misunderstandings, just on an opera stage.', alt: 'Poster: two women whispering over a martini' },
      { src: 'images/hearthbreak.webp', w: 1200, h: 1783, title: 'Same heartbreak. Different act.', text: 'Cio-Cio-San is abandoned by the man she loves. She waits years for him to return, and when he finally does, he has a new wife. Same heartbreak, different act.', alt: 'Poster: roses in a rubbish bin' },
    ],
    postersHint: 'AI visualisations of the concept; a live campaign would be produced with real people and real photography.',
    // The concept film. TODO Viking: ladda upp konceptfilmen olistad på YouTube och klistra in id:t här.
    conceptFilm: { youtube: '', title: 'Concept film: Same passion, different song', channel: 'conceptfilm',
      caption: 'National team fans singing in the stands. Cut. Same men, same song, now in tailcoats on the Opera stage. Fifteen seconds that tell the whole campaign. Made in Seedance, to show how a full production would feel.' },
    trio: [
      { tag: 'Media', title: 'Geofencing', img: { src: 'images/fotboll.webp', alt: 'Same passion different song poster placed as outdoor media', w: 1200, h: 1783 },
        text: 'The football poster shows up on phones around the stadiums on match nights. Gossip and heartbreak run downtown on nights out. We meet people in the middle of the feeling, not after it.' },
      { tag: 'Proof', title: 'Heart rate', video: { youtube: 'NgQOyPT9oE8', title: 'Heart rate, concept film for the Royal Swedish Opera', channel: 'heartrate' },
        text: 'We track heart rates during what people think are everyday moments: a job interview, a first date, a decisive match. Then the reveal: the spike came from a seat inside the Opera. The concept proves itself. Made in Seedance.' },
      { tag: 'Conversion', title: 'Madame O', video: { youtube: '7hQMbcbGAZM', title: 'Madame O, AI guide for the Royal Swedish Opera', channel: 'madameo' },
        images: [],   // TODO Viking: två små bilder av Madame O. Shape: { src, alt, w, h }
        text: 'An AI guide that asks: love, betrayal, jealousy or murder? She matches you with a performance, spills the tea on the plot and answers everything a first-timer doesn\'t dare to ask.' },
    ],
    measurement: 'A funnel with a metric at every step: UTM per placement, and Madame O logging every chat as an event, from picked drama to ticket click. So we learn what converts, not just what gets seen.',
    // Client feedback as summarised on the previous version of this page.
    // TODO Viking: exakt citat samt namn och titel på den som sa det. Tom text döljer blocket.
    quote: { text: 'Outside the box, but with a through-line. That\'s the balance I chase: as far out as you can go without losing grip of what\'s being sold.', name: '', title: '',
      fallbackCredit: 'Client feedback from the Royal Swedish Opera brief, summarised.' },
    takeaways: [
      { t: 'Format beats picture.', b: 'A strong concept is a format. That\'s what lets it grow.' },
      { t: 'Recognition needs a next step.', b: 'Madame O takes you from "that\'s so me" to a ticket.' },
      { t: 'Placement is the message.', b: 'The same poster means more outside a stadium at 9 pm than at a bus stop at 10 am.' },
    ],
    ideasIntro: 'We developed three ideas in the group and chose one to build out.',
    ideas: [
      { n: '01', title: 'You already know the opera', status: 'Pitched', text: 'Flash mob: two people from the target group start arguing in the street and slide into opera and ballet. Filmed, spread, and it shatters the image of opera as boring.' },
      { n: '02', title: 'Same feeling, different stage', status: 'Built out', on: true, text: 'Posters, tabloid covers and merch take the feeling from the stage out into the city. Became the whole campaign.' },
      { n: '03', title: 'Human certified', status: 'Pitched', text: 'Once AI content has to be labelled in the EU, the Opera labels its performances with the opposite: Human made.' },
    ],
    pitch: [],    // TODO Viking: 4–8 bilder från pitchfasen. Shape: { src, alt, w, h }
    aiWork: [],   // TODO Viking: AI-arbetet. Shape: { src, alt, w, h, title, tool } eller { youtube, title, tool, type: 'video' }
    learned: [
      { t: 'A concept is a format', b: 'Not a picture. A format is what lets an idea run for years instead of one campaign.' },
      { t: 'Recognition needs a next step', b: '"That\'s so me" is worth nothing on its own. Madame O is what turns it into a ticket.' },
    ],
    next: 'Run the football poster for real on one match night with geofenced placements and a UTM per screen, and let Madame O\'s chat log show which feeling actually sells a ticket.',
  },

  /* ==========================================================================
     PERFORMANCE MARKETING / AROMA ROAST  (course-performance-marketing.html)
     ========================================================================== */
  performance: {
    title: 'Aroma Roast',
    kicker: 'Six ads, three stages, one clear winner.',
    role: 'Group 4: Clara, Tuva, Lowe, Viking and Rahel. My part: the creative concept and all of the ad creative.',
    period: 'Sep–Oct 2026',
    course: 'Performance Marketing, Berghs',
    tags: ['#MetaAds', '#AIProduction', '#Funnel'],
    hero: { src: 'images/aroma/choco.webp', alt: 'Aroma Roast ad: a coffee bag pressed into a chocolate cake', w: 1024, h: 1280 },
    brand: { blue: '#1A0089', pink: '#FF8FD8' },
    folder: 'images/aroma/',
    inShort: [
      'Paid social for the coffee brand Aroma Roast with group 4. Six still ads and three films across a Stop, Interest and Action funnel, then the follow-up on what the numbers said.',
      'Three days, 972 SEK. One ad out of six took 75 % of the budget, 84 % of the link clicks and all three purchases. Too short to crown a winner, clear enough to know where to dig next.',
      'Show the taste, don\'t describe it. And keep what the data shows apart from what we think it means.',
    ],
    problem: [
      'People think decaf tastes weak and boring. That belief stops the first purchase before anyone has tasted it. So we made the taste impossible to miss.',
      'Audience: women 20 to 30 with a clean-girl lifestyle. Our hypothesis: they want to cut down on caffeine, not on taste or on the coffee moment.',
      'Strategy: taste first, no caffeine as the bonus. Like Coke Zero and Heineken 0.0, don\'t sell what is missing, sell that nothing is missing. Full coffee taste. Without the caffeine.',
    ],
    // TODO Viking: YouTube svarar 403 på OsPaCz2UoCY (privat eller inbäddning avstängd). Sätt filmen till "Olistad" på YouTube och ta sedan bort noThumb.
    film: { youtube: 'OsPaCz2UoCY', title: 'Aroma Roast campaign film', channel: 'aroma_short', vertical: true, noThumb: true,
      caption: '' },   // TODO Viking: vad visar filmen? Tom sträng = ingen bildtext.
    landing: null,     // TODO Viking: skärmdump av landningssidan, t.ex. { src: 'images/aroma/landing.webp', alt: 'Aroma Roast landing page', w: 1200, h: 800 }
    adsHeading: 'Six ads, three stages, one clear winner.',
    stages: [
      { id: 'stop',     name: 'Stop',     job: 'Stop the scroll',     result: 'Awareness ads: zero purchases and almost no spend. Meta moved the budget elsewhere on its own.' },
      { id: 'interest', name: 'Interest', job: 'Spark the craving',   result: 'Choco Roast took 75 % of the budget, 84 % of link clicks and all 3 purchases.' },
      { id: 'action',   name: 'Action',   job: 'Make buying easy',    result: '' },   // TODO Viking: fyll i från Ads Manager om du har siffror.
    ],
    // sv = the headline as it ran, en = translation, thinking = the idea. win = the winner.
    ads: [
      { id: 'claw',     stage: 'stop',     img: 'claw.webp',     sv: 'Vinst i varje kopp', en: 'A win in every cup',
        thinking: 'A claw machine in a coffee ad does not belong, and that is the point: the brain stops on things that do not fit. The bags are the prize, so the picture tells the message before the copy does.', result: '' },
      { id: 'suitcase', stage: 'stop',     img: 'suitcase.webp', sv: 'Nästa stopp: kaffestund. Utan koffeinet.', en: 'Next stop: coffee break. Without the caffeine.',
        thinking: 'The whole range in one frame, and the first ad to say "without the caffeine", with a wink. The travel frame makes decaf feel like a small trip, not a sacrifice.', result: '' },
      { id: 'caramel',  stage: 'interest', img: 'caramel.webp',  sv: 'Säg hej till din nya kaffefavorit', en: 'Say hi to your new favourite coffee',
        thinking: 'Salted caramel is a trend flavour. The bag sits on the real thing, so you taste it with your eyes before reading a word. Aimed at someone still looking for a favourite.', result: '' },
      { id: 'choco',    stage: 'interest', img: 'choco.webp',    win: true, sv: 'Smakkombon du inte visste att du saknade', en: 'The flavour combo you didn\'t know you were missing',
        thinking: 'The bag pressed into a chocolate cake. The taste is understood in under a second, and there is no caffeine talk at all, only craving.', result: '75 % of budget · 84 % of link clicks · 3 of 3 purchases' },
      { id: 'everyday', stage: 'action',   img: 'everyday.webp', sv: 'Börja dagen på rätt sätt. Beställ idag!', en: 'Start the day the right way. Order today!',
        thinking: 'Clearest product, clearest CTA: one bag on a bed of beans and a button-shaped "Order today". Built for retargeting people who have already seen the brand.', result: '' },
      { id: 'tv',       stage: 'action',   img: 'tv.webp',       sv: 'Byt kanal på kaffevanorna – klicka hem din favoritsmak direkt', en: 'Change channel on your coffee habits – order your favourite flavour now',
        thinking: 'Three screens, three ways to drink it. Switching coffee should feel as easy as changing channel, and the copy says exactly what to do next.', result: '' },
    ],
    // The video ads. Without a YouTube id the thumbnail is shown as a still.
    videoAds: [
      { id: 'v-caramel', stage: 'stop',     img: 'v-caramel.jpg', w: 720, h: 1280, youtube: '', title: 'The sticker',       thinking: 'Movement catches the eye faster than a still.', result: '' },
      { id: 'v-mug',     stage: 'stop',     img: 'v-mug.jpg',     w: 720, h: 1280, youtube: '', title: 'The cup character', thinking: 'The brand\'s own character, out in the world.', result: '' },
      { id: 'v-barbie',  stage: 'interest', img: 'v-barbie.jpg',  w: 356, h: 634,  youtube: '', title: 'The Barbie morning', thinking: 'Borrowed recognition from pop culture.', result: '' },
    ],
    rule: 'The further down the funnel, the less play and the clearer the call to action.',
    tests: ['Playful ↔ product focus', 'Chocolate ↔ caramel', 'Still ↔ video', 'Soft message ↔ clear CTA'],
    // Results: three headline numbers big, the rest in a small table.
    headline: [
      { value: 7192, text: '7,192', label: 'Reach' },
      { value: 0.99, dec: 2, suf: ' %', text: '0.99 %', label: 'CTR' },
      { value: 3, text: '3', label: 'days to find the winning ad', note: 'Winning ad found in 3 days' },
    ],
    stats: [
      { text: '10,296',   label: 'Impressions' },
      { text: '102',      label: 'Link clicks' },
      { text: '9.53 SEK', label: 'CPC' },
      { text: '3',        label: 'Purchases' },
      { text: '324 SEK',  label: 'CPA, cost per purchase' },
      { text: '2.9 %',    label: 'Click to purchase' },
      { text: '0.66',     label: 'ROAS, SEK back per SEK spent' },
      { text: '972 SEK',  label: 'Total spend' },
    ],
    statsCaption: 'Meta Ads Manager, three days live. Meta recommends around two weeks for the algorithm to learn, so these numbers are a compass, not a verdict. A ROAS under 1 means the test lost money, which is what a three-day test usually does. Break-even ROAS for the brand was 3. Three days and 972 SEK is a test, not a verdict: the job was to find what to scale.',
    bars: [
      { label: 'Choco Roast: share of budget',      value: 75,  unit: '%' },
      { label: 'Choco Roast: share of link clicks', value: 84,  unit: '%' },
      { label: 'Choco Roast: share of purchases',   value: 100, unit: '%' },
    ],
    analysis: {
      see:      ['Choco took 75 % of the budget, 84 % of the clicks and every purchase.', 'The awareness ads: zero purchases, almost no spend.', 'The videos got less engagement than we expected.'],
      think:    ['The taste is understood in under a second.', 'The middle of the funnel sits closer to the purchase.', 'A still and a straight message beat motion.'],
      dontKnow: ['Whether it was the picture, the flavour or the budget that decided it.', 'The ads differed on several things at once.', 'Purchases that came after day three are not in the data.'],
    },
    analysisHeads: { see: 'What I see', think: 'What I think it means', dontKnow: 'What I cannot tell' },
    beyond: [
      'The hero says nothing about taste. The ad promises taste and the site talks about something else. The message has to hold all the way to checkout.',
      'The discount shows up in the wrong place. The subscription (−10 %) is only mentioned on the start page. The choice should sit right above "Add to cart".',
    ],
    nextSteps: [
      { t: 'Build on Choco',             b: 'Same look, new situations and messages. Even more chocolate, even more coffee in the frame.' },
      { t: 'A clearer CTA',              b: 'Say exactly what the person should do: "Buy now".' },
      { t: 'One thing at a time',        b: 'A/B test hooks with everything else equal, so we know what makes the difference.' },
      { t: 'UGC at the top of the funnel', b: 'Creators who taste it and say it holds up against regular coffee.' },
      { t: 'Scale out',                  b: 'TikTok and YouTube once we know which combination sells.' },
    ],
    passes: [
      { n: '01', when: '21 Sep', t: 'Performance marketing',        k: ['Every krona tied to a business goal', 'Traditional vs performance', 'Push vs pull', 'The channels'], hi: 0 },
      { n: '02', when: '22 Sep', t: 'Audience, channel mix, KPIs',  k: ['Awareness → Consideration → Conversion → Loyalty', 'Channels reinforce each other', 'No demand without push', 'Measure across channels in GA4'], hi: 2 },
      { n: '03', when: '23 Sep', t: 'Paid social',                  k: ['Organic vs paid', 'The campaign goal steers optimisation', 'Meta, TikTok, LinkedIn'], hi: 1 },
      { n: '04', when: '24 Sep', t: 'Paid social, part 2',          k: ['Campaign → ad set → ad', 'Stop · Interest · Action', 'Retargeting', 'One audience, many triggers'], hi: 1 },
      { n: '05', when: '28 Sep', t: 'Best practice & PlentyLabs',   k: ['4:5 feed, 9:16 Reels', 'Safe zones', 'Copy: simple, relevant, on brand', 'AI for hooks and variants'], hi: 1 },
      { n: '06', when: '29 Sep', t: 'Feedback with the client',     k: ['Show the client early', 'Iterate before launch', 'The client\'s goal is our goal'], hi: 2 },
      { n: '07', when: '30 Sep', t: 'Campaign in Meta',             k: ['Set up the campaign ourselves', 'One goal, ads for the whole customer journey', 'The algorithm moves budget on its own'], hi: 2 },
      { n: '08', when: '1 Oct',  t: 'Google Ads, part 1',           k: ['SEM vs SEO', 'Auction & CPC', 'Search intent', 'Keyword research'], hi: 2 },
      { n: '09', when: '5 Oct',  t: 'Google Ads, part 2',           k: ['Ad strength', 'Pinning headlines', 'Data segments', 'YouTube · PMax · ChatGPT Ads'], hi: 3 },
      { n: '10', when: '6 Oct',  t: 'Optimisation, analysis & CRO', k: ['The KPI hierarchy', 'Data vs interpretation', 'Analysis in five steps', 'Lots of clicks, few purchases? Check the site'], hi: 1 },
    ],
    core: [
      { t: 'The funnel steers the message', b: 'Stop the scroll, spark the craving, make buying easy.' },
      { t: 'Show, don\'t tell',             b: 'The picture is the flavour description.' },
      { t: 'Start with purchases',          b: 'Purchases and CPA first. Reach explains, it proves nothing.' },
      { t: 'Data ≠ interpretation',         b: 'Say what you see, what you think and what you don\'t know.' },
    ],
    notes: [
      { q: 'What am I proud of?',            items: ['The concept and all the ads, mostly made with AI in a few days.', 'The Choco image, which drove every purchase.', 'A visual language the whole group could build on.'] },
      { q: 'What would I do differently?',   items: ['Test one variable at a time.', 'Give every ad enough budget and time to be comparable.', 'Proofread AI images like text: everything on the pack has to be right.'] },
      { q: 'What do I want to get better at?', items: ['Google Ads in practice, not just in theory.', 'A/B tests and CRO on landing pages.', 'Reading Ads Manager faster and drawing conclusions myself.'] },
    ],
    tools: ['Meta Ads Manager', 'Higgsfield', 'PlentyLabs', 'Canva', 'CapCut', 'Google Ads', 'GA4', 'ChatGPT / Claude'],
    credit: 'Group 4: Clara, Tuva, Lowe, Viking and Rahel. My part was the creative concept and all of the ad creative, mostly made with AI in Higgsfield and combined with real footage. Campaign setup and budget were shared. The analysis on this page is my own.',
  },

  /* ==========================================================================
     GROWTH TOOLBOX  (course-growth-toolbox.html)
     ========================================================================== */
  toolbox: {
    title: 'Growth Toolbox',
    kicker: 'Measurement, tracking and analysis. Three weeks, ten sessions.',
    role: 'Everything on this page is mine. Data-driven ways of working: GA4, Google Tag Manager, data collection, visualisation and AI-assisted analysis.',
    period: 'Aug–Sep 2026',
    course: 'Growth Toolbox, Berghs',
    tags: ['#GTM', '#GA4', '#Scraping', '#DataStory'],
    hero: { src: 'images/rostning.webp', alt: 'The suburbs woke up: the hero image of the data story', w: 1200, h: 671 },
    num: '19', numValue: 19, numLabel: 'custom events on this site',
    inShort: [
      'Built this portfolio in plain HTML, published it via GitHub Pages and put custom dataLayer events behind Google Tag Manager. Then scraped 20 sources into an API and turned election data into a story.',
      'Every event on this site is listed below, with what it fires on and why it is worth measuring. The data story and the API project have their own pages.',
      'Measure first, guess second. And there are a thousand ways a tag does not fire, so everything has to match exactly.',
    ],
    challenge: 'Learn to measure before guessing: set up tracking from scratch, collect data that does not exist yet, and turn it into something a reader actually wants to look at.',
    strategy: 'Use my own site as the lab. Every click, view and scroll on vikingkadar.github.io is a custom event I defined, so every report answers a question I actually have.',
    film: { youtube: 'u7_VxeoVWJ0', title: 'The suburbs woke up, 10 seconds', channel: 'fororten', caption: 'Same data, ten seconds. Made to travel in the feed.' },
    dashboard: null,        // TODO Viking: skärmdump av Looker Studio-dashboarden, t.ex. { src: 'images/measurement.webp', alt: 'Looker Studio dashboard for this site', w: 1200, h: 800 }
    dashboardUrl: '',       // TODO Viking: den delade Looker Studio-länken. Tom = ingen knapp.
    contentAssignmentUrl: '', // TODO Viking: länken till innehållsuppgiften. Tom = raden döljs.
    apiDemoUrl: '',         // TODO Viking: adressen till webbappen som hämtar från ett API. Tom = raden döljs.
    showPeptideApi: true,   // false hides the API card and its row for visitors. toolbox.html#api still works.
    deliverables: [
      { what: 'Portfolio published on GitHub Pages', status: 'done', href: 'index.html', label: 'This site', note: 'Plain HTML and CSS, no framework, deployed from the repo.' },
      { what: 'GTM and GA4 tracking', status: 'done', href: '#measure', label: 'How I measure this site', note: 'One container, custom dataLayer events on every page.' },
      { what: 'Dashboard in Looker Studio', status: 'done', href: 'DASHBOARD_URL', label: 'Open the dashboard', note: 'Built on the events listed below.' },
      { what: 'Scraped data file', status: 'done', href: 'scaping/pubmed.txt', label: 'pubmed.txt', note: 'Search results scraped from PubMed, raw output kept as handed in.' },
      { what: 'Content assignment', status: 'done', href: 'CONTENT_ASSIGNMENT_URL', label: 'Open the assignment', note: 'Handed in separately.' },
      { what: 'API mashup', status: 'documented', href: 'toolbox.html#api', label: 'Peptide Data API', note: 'Twenty sources scraped and put behind one API, documented on its own page.', api: true },
      { what: 'Data story', status: 'done', href: 'fororten.html', label: 'The suburbs woke up', note: 'Swedish election turnout 2022 against 2026, in Chart.js, with its own tracking.' },
      { what: 'Distinction: my own dataLayer events', status: 'done', href: '#measure', label: 'The event table', note: 'Nineteen events, each one tied to a question worth answering.' },
      { what: 'Distinction: a web app that fetches an API, published on the site', status: 'done', href: 'API_DEMO_URL', label: 'Open the demo', note: 'The API itself is documented on the Peptide Data API page.' },
    ],
    statusLabel: { done: 'Done', documented: 'Documented' },
    measureIntro: 'This site does not rely on automatic events only. Each page pushes its own page_meta with a page_type before the GTM container loads, and every click, section view and scroll milestone is pushed to window.dataLayer from assets/site.js. Google Tag Manager picks them up and forwards them to GA4.',
    bigOnes: [
      { href: 'fororten.html', title: 'The suburbs woke up', num: '67 → 10', line: 'Turnout fell across Sweden in 2026. In the big-city suburbs the opposite happened. Chart.js, sources and caveats.', channel: 'fororten',
        img: { src: 'images/rostning-800.webp', alt: 'Chart from the election turnout data story', w: 800, h: 448 } },
      { href: 'toolbox.html#api', title: 'Peptide Data API', num: '20 sources', line: 'Twenty sources that had never spoken to each other, scraped and put behind one API that answers a single question.', channel: 'api', api: true },
    ],
    learned: [
      { t: 'Growth is planned',      b: 'Rarely luck. Tricks, processes and loops.' },
      { t: 'Measure the right thing', b: 'What, why, and how it connects to a decision.' },
      { t: 'Data becomes a story',   b: 'Find the angle, visualise it, pitch it.' },
      { t: 'AI is leverage',         b: 'A good prompt plus my own judgement is faster work.' },
    ],
    learnedMore: { label: 'All ten sessions and my reflection →', href: 'toolbox.html#learned' },
    next: 'Finish the Looker Studio dashboard on top of these events and publish the API demo, so every row in the deliverables table has something to click.',
  },

  /* ---------- The event spec, shared by the Growth Toolbox page ---------- */
  events: [
    { e: 'page_meta',     when: 'On every page load, pushed before the GTM container', p: 'page_type', why: 'Lets me split every report by type of page, so a case page is never averaged together with the homepage.' },
    { e: 'section_view',  when: 'A section becomes 30 % visible, once per page view', p: 'section_id', why: 'Shows how far into a case people actually get, which tells me where to cut.' },
    { e: 'scroll_depth',  when: 'At 25, 50, 75 and 100 % of the page, once each', p: 'percent', why: 'Separates a real read from a bounce. A visit that reaches 75 % is worth more than ten that stop at 25 %.' },
    { e: 'contact_click', when: 'Any email, LinkedIn, TikTok, GitHub or CV link is clicked', p: 'channel', why: 'The only real conversion on this site. I am looking for an internship, so a click here is the whole point and everything else is a step towards it.' },
    { e: 'case_open',     when: 'A tile in Selected work, or a case link anywhere, is clicked', p: 'channel', why: 'Tells me which case earns the click, so the strongest one goes first.' },
    { e: 'course_open',   when: 'A course card or course link is clicked', p: 'channel', why: 'Shows which course an agency actually cares about, as opposed to which one I am proudest of.' },
    { e: 'project_open',  when: 'A project card or project link is clicked', p: 'channel', why: 'Separates interest in my own work from interest in schoolwork.' },
    { e: 'door_open',     when: 'One of the two doors on the homepage is clicked', p: 'channel: projects | berghs', why: 'The first fork in the road. Do visitors want my own work or the school work? That decides what the homepage should lead with.' },
    { e: 'feed_stop',     when: '"Can you stop the scroll?" is stopped, by the button or a tap on the phone', p: 'channel: the ad or poster it stopped on', why: 'Which piece of creative people stop on when they decide to stop. Feedback on the work, not on the page.' },
    { e: 'counter_seen',  when: 'The first animated number on a page scrolls into view, once per page', p: 'page_type', why: 'Did the proof get seen at all? A page where this never fires has a hero that is too tall.' },
    { e: 'skill_open',    when: '"Where I did it" under a skill pillar is clicked', p: 'channel: analytics | content | build', why: 'Which of the three skills agencies want the evidence for. That is what I should put more of on the site.' },
    { e: 'video_play',    when: 'A film is started, YouTube facade or local file', p: 'channel', why: 'The films are the heaviest thing here. If nobody plays them, they should not load.' },
    { e: 'video_hover',   when: 'A silent loop starts playing on hover or on scroll, once per loop', p: 'channel', why: 'Tells me whether the moving tiles earn their weight or whether a still would do.' },
    { e: 'poster_open',   when: 'A poster or ad is opened full size', p: 'poster_title', why: 'Which of the posters holds attention. That is feedback on the idea, not on the page.' },
    { e: 'ad_open',       when: 'An Aroma Roast ad is opened full size', p: 'channel: the ad id', why: 'Which ad people want to look at closely, which I can compare with which ad actually sold.' },
    { e: 'posterlab_flip', when: 'The before/after slider on the PosterLab case is dragged, once per page', p: 'none', why: 'Does the product demo get touched? If not, the slider is decoration.' },
    { e: 'sneaker_run',   when: 'The metro animation on the projects page is tapped', p: 'none', why: 'A curiosity check: do people touch a playful detail, or ignore it. Cheap to measure, honest answer.' },
    { e: 'data_story_open', when: 'A link to the data story or the API page is clicked', p: 'channel', why: 'Tells me whether the coursework gets read or just listed.' },
    { e: 'story_back',    when: 'A back link is clicked', p: 'channel', why: 'Shows where people go when they are done reading, and which pages are dead ends.' },
    { e: 'chart_filter, chart_toggle, source_click', when: 'On the data story: filtering a city, toggling the estimate, opening a source', p: 'varies', why: 'Which city people look up and whether anyone checks the sources. The last one tells me if the story is trusted.' },
  ],

  /* ==========================================================================
     SEO & CONTENT MARKETING  (course-seo.html, only when flags.SEO_READY is true)
     Every section below hides while it is empty.
     ========================================================================== */
  seo: {
    title: 'SEO & Content Marketing',
    kicker: 'Case: Byggalliansen',
    caseLine: 'Byggalliansen is a quality-assured network of local builders in Stockholm.',
    role: '',            // TODO Viking: din roll i gruppen.
    period: 'Oct 2026',
    course: 'SEO & Content Marketing, Berghs',
    tags: ['#SEO', '#GEO', '#Content'],
    hero: null,          // TODO Viking: en bild. Shape: { src, alt, w, h }
    inShort: [],         // TODO Viking: tre punkter.
    goal: '',            // TODO Viking: vilket av casemålen ni valde.
    keywords: [],        // TODO Viking: 1–5 sökord. Shape: { kw: 'byggfirma stockholm', volume: '1,900 / month', intent: 'Commercial' }
    serp: null,          // TODO Viking: skärmdump av SERP:en. Shape: { src, alt, w, h }
    meta: { title: '', description: '', url: '' },   // TODO Viking: titel ≤ 60 tecken, beskrivning ≤ 150, URL.
    geo: '',             // TODO Viking: hur texten optimerats för AI-sök: korta citerbara svar under frågerubriker.
    measure: '',         // TODO Viking: hur ni mäter.
    groupCase: '',       // TODO Viking: contentstrategin för två kanaler.
    next: '',            // TODO Viking: vad du skulle göra härnäst.
  },
};
