const providers = [
  {
    name: 'Animes Online',
    url: 'https://animesonlinecc.to',
    selectors: [
      'iframe[src*="player"]',
      'iframe[src*="video"]',
      '.video-player iframe',
      '.player iframe',
      '.main_div_video iframe'
    ],
    clickSelectors: ['.ppVepb', '.play-button', 'button[aria-label*="play"]']
  },
  {
    name: 'AnimeFire',
    url: 'https://animefire.io',
    selectors: [
      'iframe[src*="player"]',
      'iframe[src*="video"]',
      '.video-container iframe',
      'video',
      '.main_div_video iframe'
    ],
    clickSelectors: ['.ppVepb', '.play-button', 'button[aria-label*="play"]']
  }
];

export default providers;
