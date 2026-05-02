const providers = [
    {
        id: 0,
        name: 'Animes Online',
        url: 'https://animesonlinecc.to',
        selectors: [
            'iframe[src*="player"]',
            'iframe[src*="video"]',
            '.video-player iframe',
            '.player iframe',
            '.main_div_video iframe'
        ],
        clickSelectors: ['.ppVepb', '.play-button', 'button[aria-label*="play"]'],
        getSearchUrl(title) {
            const formattedTitle = title.replace(/\s+/g, '+');
            return `${this.url}/search/${formattedTitle}`;
        },
        resultSelector: '.content a',
        episodeSelector: 'ul.episodios li .episodiotitle a'
    },
    {
        id: 1,
        name: 'AnimeFire',
        url: 'https://animefire.io',
        selectors: [
            'iframe[src*="player"]',
            'iframe[src*="video"]',
            '.video-container iframe',
            'video',
            '.main_div_video iframe'
        ],
        clickSelectors: ['.ppVepb', '.play-button', 'button[aria-label*="play"]'],
        getSearchUrl(title) {
            const formattedTitle = title.replace(/\s+/g, '-').toLowerCase();
            return `${this.url}/pesquisar/${formattedTitle}`;
        },
        resultSelector: 'div.row.ml-1.mr-1 a',
        episodeSelector: 'div.div_video_list a'
    }
];

export default providers;
