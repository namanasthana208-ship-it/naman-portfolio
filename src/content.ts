export const PROFILE = {
  name: 'Naman Asthana',
  role: 'Growth Marketer',
  email: 'namanasthana208@gmail.com',
  phone: '+91 91612 11377',
  phoneHref: 'tel:+919161211377',
  linkedin: 'https://www.linkedin.com/in/naman-asthana-a1874722a/',
  x: 'https://x.com/deewanaasthana',
  letterboxd: 'https://letterboxd.com/namanasthana/',
  cv: '/Naman_Asthana_CV.pdf',
  pokemon: 'https://naman-asthana-portfolio.vercel.app/',
}

export const INTRO = [
  "I call myself a creative person. Nobody gave me that title, I just decided it. I'm always experimenting with something, mostly coffee and food, and at work it's funnels.",
  "That's why I like growth. I used to think content was the only place my ideas could go. Growth lets me try something, look at the numbers and keep going till it works. Bear Grylls has improvise, adapt, overcome. Mine is experiment, analyse, overcome.",
]

export type Stat = { value: string; label: string }
export type Part = { qty: string; name: string; color: string }
export type Para = { text: string; note?: string }

export type SubAssembly = {
  id: 'game' | 'cac'
  title: string
  teaser: string
  body: Para[]
  stats?: Stat[]
}

export type Step = {
  n: number
  stage: string
  kicker: string
  title: string
  when: string
  parts: Part[]
  body: Para[]
  stats?: Stat[]
  subs?: SubAssembly[]
  visual?: 'brands' | 'growth' | 'dms' | 'activation' | 'streams'
}

export const STEPS: Step[] = [
  {
    n: 1,
    visual: 'brands',
    stage: 'Foundation',
    kicker: 'The Indian Idiot',
    title: 'Content Creation Intern',
    when: 'Feb 2023 – Apr 2024',
    parts: [
      { qty: '150x', name: 'Posts', color: 'red' },
      { qty: '20x', name: 'Brand collabs', color: 'yellow' },
      { qty: '1x', name: 'Founder to report to', color: 'blue' },
    ],
    body: [
      {
        text: 'My first proper gig was at The Indian Idiot, a meme page with over a million followers. There were three of us interns, reporting straight to the founder. I wrote 150+ posts, a lot of them brand collabs with Netflix, Prime Video, Spotify and others. I also ran campaigns from scratch for Masters’ Union and ISBF.',
      },
      {
        text: 'For another campaign I went through 5,000+ user responses to pick out the ones worth turning into posts.',
        note: 'yes, I read all 5,000',
      },
    ],
    stats: [
      { value: '150+', label: 'posts written' },
      { value: '100M+', label: 'accounts reached' },
      { value: '20+', label: 'brands' },
    ],
  },
  {
    n: 2,
    visual: 'growth',
    stage: 'Lower wings',
    kicker: 'DGBet',
    title: 'Marketing Intern',
    when: 'Jun 2024 – Feb 2025',
    parts: [
      { qty: '1x', name: 'Football meme page', color: 'green' },
      { qty: '1x', name: 'X account', color: 'black' },
      { qty: '2x', name: 'Tournaments', color: 'yellow' },
    ],
    body: [
      {
        text: 'I joined DGBet as a marketing intern. My first job was starting a football meme page on Instagram to pull people in. I ran all of it, and in four months monthly impressions went from 368K to 3.7M.',
        note: 'meme pages again. I know.',
      },
      {
        text: 'I had the football content on X too. That went from 875K to 6M impressions a month, and from 110 followers to 5,000+. For Euro 2024 and Wimbledon we ran contests on X, Discord and Telegram, and that month did $150K+ in betting volume.',
      },
    ],
    stats: [{ value: '$150K+', label: 'betting volume in a single month, Euro 2024 and Wimbledon' }],
  },
  {
    n: 3,
    visual: 'dms',
    stage: 'Piers and minarets',
    kicker: 'DG3',
    title: 'Affiliates',
    when: 'Growth Associate · Feb 2025 – now',
    parts: [
      { qty: '1x', name: 'InboxApp', color: 'navy' },
      { qty: '1000x', name: 'Replies', color: 'white' },
      { qty: '1x', name: 'Founding team', color: 'red' },
    ],
    body: [
      {
        text: 'In February 2025 I became Growth Associate. Affiliates came first, and it’s the most hands-on thing I’ve done. We set up automated cold DMs on X through InboxApp, and then I went through 1,000+ replies myself, negotiating and closing. Once someone came on board, I’d find out what they were struggling with and make assets for their audience.',
      },
      {
        text: 'I was on the founding team of this channel. It’s brought in 1,600+ users and $661K+ in trading volume.',
        note: '1,000+ replies. by hand.',
      },
    ],
    stats: [
      { value: '1,000+', label: 'replies handled' },
      { value: '1,600+', label: 'users' },
      { value: '$661K+', label: 'trading volume' },
    ],
  },
  {
    n: 4,
    stage: 'The main arch',
    kicker: 'DG3',
    title: 'Paid acquisition',
    when: 'Growth Associate',
    parts: [
      { qty: '1x', name: 'Meta', color: 'blue' },
      { qty: '1x', name: 'Reddit', color: 'red' },
      { qty: '1x', name: 'YouTube', color: 'red' },
      { qty: '1x', name: 'Clarity', color: 'navy' },
    ],
    body: [{ text: 'Next up was paid, and it came with a catch.' }],
    stats: [
      { value: '$9.5K', label: 'ad spend' },
      { value: '7', label: 'countries' },
      { value: '2.1M+', label: 'impressions' },
      { value: '1,900+', label: 'signups' },
    ],
    subs: [
      {
        id: 'game',
        title: 'The prediction game',
        teaser: 'Meta doesn’t let you run betting ads.',
        body: [
          {
            text: 'Meta doesn’t let you run betting ads, which is a problem when you’re marketing a betting platform. So we made a free football prediction game and ran ads for that. People signed up to play and gave us their email. Once they were hooked, we told them about the platform.',
          },
        ],
      },
      {
        id: 'cac',
        title: 'The CAC fix',
        teaser: '$23.55 a signup. Way too high.',
        body: [
          {
            text: 'Our cost per signup was $23.55. Way too high. I sat watching Clarity recordings of people signing up, and most of them were dropping off at the OTP screen. We fixed that with the tech team, then fixed deep linking, then had to fix the fix. It came down to $6.10.',
          },
        ],
      },
    ],
  },
  {
    n: 5,
    visual: 'activation',
    stage: 'Upper galleries',
    kicker: 'DG3',
    title: 'Activation',
    when: 'Growth Associate',
    parts: [
      { qty: '1x', name: 'Onboarding journey', color: 'yellow' },
      { qty: '1x', name: 'Win-back offers', color: 'green' },
      { qty: '1x', name: 'Teammate', color: 'blue' },
    ],
    body: [
      {
        text: 'Getting signups is half of it. A lot of people signed up and never placed a trade. I took over activation with one person on my team, built the onboarding emails, and ran offers to bring back the ones who’d gone quiet. Monthly activation went from 20% to 35%.',
        note: 'open rates stayed above 25% and peaked at 35%',
      },
    ],
  },
  {
    n: 6,
    visual: 'streams',
    stage: 'Upper wall',
    kicker: 'DG3',
    title: 'Content, KOLs and live',
    when: 'Growth Associate',
    parts: [
      { qty: '1x', name: 'Content calendar', color: 'yellow' },
      { qty: '1x', name: 'Creator brief each', color: 'green' },
      { qty: '1x', name: 'X algorithm repo', color: 'black' },
      { qty: '1x', name: 'Microphone', color: 'darkGrey' },
    ],
    body: [
      {
        text: 'I plan the DG3 content calendar and run our KOL distribution, and every creator gets their own brief. I also went through X’s open-sourced ranking algorithm and rebuilt our content playbook around what it actually rewards.',
        note: 'reading the algorithm code was genuinely fun. yes, really.',
      },
      {
        text: 'And I’ve hosted and produced our live streams and podcasts through the FIFA World Cup 2026, Wimbledon 2026 and the Premier League.',
      },
    ],
  },
  {
    n: 7,
    stage: 'Flared crown',
    kicker: 'DG3',
    title: 'Analytics',
    when: 'Growth Associate',
    parts: [
      { qty: '1x', name: 'Python', color: 'yellow' },
      { qty: '1x', name: 'PostgreSQL', color: 'blue' },
      { qty: '1x', name: 'GTM + GA4', color: 'green' },
      { qty: '1x', name: 'UTM bug', color: 'red' },
    ],
    body: [
      { text: 'I did a B.Com. Never thought I’d end up writing SQL and Python scripts. Work taught me that, college didn’t.' },
      {
        text: 'Now there’s a Python reporting system for our X pages with weekly dashboards and UTM attribution. I set up GTM, GA4 and Clarity, and wrote the SQL that tracks signups by channel. My favourite find was a bug where the terminal was quietly stripping UTMs off links. Traced it back to the SPA router.',
        note: 'AI helped with the code. not going to pretend it didn’t',
      },
    ],
  },
]

export const PARTS: { group: string; items: Part[] }[] = [
  {
    group: 'Ads',
    items: [
      { qty: '1x', name: 'Meta', color: 'blue' },
      { qty: '1x', name: 'Reddit', color: 'red' },
      { qty: '1x', name: 'YouTube', color: 'red' },
      { qty: '1x', name: 'Google Ads', color: 'yellow' },
      { qty: '1x', name: 'Telegram', color: 'blue' },
    ],
  },
  {
    group: 'Data',
    items: [
      { qty: '1x', name: 'GA4', color: 'yellow' },
      { qty: '1x', name: 'GTM', color: 'blue' },
      { qty: '1x', name: 'Clarity', color: 'navy' },
      { qty: '1x', name: 'PostgreSQL', color: 'navy' },
      { qty: '1x', name: 'Python', color: 'yellow' },
      { qty: '1x', name: 'Excel', color: 'green' },
    ],
  },
  {
    group: 'Lifecycle and outreach',
    items: [
      { qty: '1x', name: 'Email journeys', color: 'terracotta' },
      { qty: '1x', name: 'InboxApp', color: 'navy' },
      { qty: '1x', name: 'Discord', color: 'blue' },
    ],
  },
  { group: 'AI', items: [{ qty: '1x', name: 'Claude', color: 'terracotta' }] },
]

export const ALBUMS = [
  { title: 'The Dark Side of the Moon', artist: 'Pink Floyd', year: '1973', art: '/art/album-dsotm.png', spotify: '4LH4d3cOWNNsVw41Gqt2kv' },
  { title: "(What's the Story) Morning Glory?", artist: 'Oasis', year: '1995', art: '/art/album-morning-glory.jpg', spotify: '2u30gztZTylY4RG7IvfXs8' },
  { title: 'The New Abnormal', artist: 'The Strokes', year: '2020', art: '/art/album-new-abnormal.png', spotify: '2xkZV2Hl1Omi8rk2D7t5lN' },
  { title: 'Wish You Were Here', artist: 'Pink Floyd', year: '1975', art: '/art/album-wywh.jpg', spotify: '0bCAjiUamIFqKJsekOYuRw' },
]

export const FILMS_TOP4 = [
  { title: 'The Return of the King', year: '2003', art: '/art/film-rotk.jpg', note: 'in my letterboxd top 4. obviously.' },
  { title: 'Back to the Future', year: '1985', art: '/art/film-bttf.jpg', note: 'rewatched it more times than marty time travelled' },
  { title: 'About Time', year: '2013', art: '/art/film-about-time.jpg' },
  { title: 'Piku', year: '2015', art: '/art/film-piku.jpg' },
]

export const FILMS_MORE = [
  { title: 'Swades', year: '2004', art: '/art/film-swades.jpg' },
  { title: 'The Batman', year: '2022', art: '/art/film-batman.jpg' },
  { title: 'Star Wars', year: '1977', art: '/art/film-starwars.jpg' },
]

export const SHOWS = [
  { title: 'The Office', art: '/art/tv-office.jpg' },
  { title: 'House MD', art: '/art/tv-house.jpg' },
  { title: 'Avatar: The Last Airbender', art: '/art/tv-atla.jpg' },
  { title: 'Doctor Who', art: '/art/tv-doctor-who.png' },
  { title: 'Lanterns', art: '/art/tv-lanterns.png', now: true },
  { title: 'Severance', art: null, now: true },
]

export const COMICS = [
  { title: 'All-Star Superman', by: 'Grant Morrison, Frank Quitely', art: '/art/comic-all-star-superman.jpg', spine: '#2c5fb3', ink: '#fff' },
  { title: 'Batman: The Court of Owls', by: 'Scott Snyder, Greg Capullo', art: '/art/comic-court-of-owls.jpg', spine: '#2b2f3a', ink: '#e9e4d8' },
  { title: 'Green Lantern: Emerald Twilight', by: 'Ron Marz', art: '/art/comic-emerald-twilight.jpg', spine: '#13853f', ink: '#fff' },
  { title: 'Bleach', by: 'Tite Kubo · Vol. 1', art: '/art/comic-bleach.jpg', spine: '#f4f1ea', ink: '#1d1d1f', note: 'the best of the big three. not up for debate' },
]

export const PHOTOS = [
  { src: '/photos/street-5.jpg', alt: 'A construction worker on a half-built roof, rebar against the sky' },
  { src: '/photos/street-2.jpg', alt: 'A band member in uniform under canopy lights, black and white' },
  { src: '/photos/street-3.jpg', alt: 'An old man alone in a waiting room full of empty chairs' },
  { src: '/photos/street-1.jpg', alt: 'A man sitting by a railing, looking away, black and white' },
  { src: '/photos/street-4.jpg', alt: 'A man with a cart at night as traffic streaks past' },
  { src: '/photos/street-6.jpg', alt: 'A man walking along the beach in a checked shirt' },
]
