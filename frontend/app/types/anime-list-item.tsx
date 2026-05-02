export default interface AnimeListItem {
    mal_id: number;
    title: string;
    title_english?: string;
    images: {
        jpg: {
            image_url: string,
            large_image_url: string,
            small_image_url: string
        },
        webp: {
            image_url: string,
            large_image_url: string,
            small_image_url: string
        }
    };
    score?: number;
    rank?: number;
    episodes?: number;
    year?: number;
    genres?: string[];
}