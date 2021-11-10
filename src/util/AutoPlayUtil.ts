import { ChildUtil } from "./ChildUtil";
import getArtistTitle from "get-artist-title";
import yts from "yt-search";

export class AutoPlayUtil {
    private static _artists: Set<string> = new Set();
    private static autoPlaying: boolean = true;

    public static addArtist(video: yts.VideoSearchResult) {
        const [artist, title] = getArtistTitle(video.title, { defaultArtist: video.author.name });
        let artists = artist.split(","); // Sometimes two artists
        // artists = artists.forEach((a) => a.split(""))
        // const artists = this.parseArtists(artist);
        artists.forEach((a) => this._artists.add(a));
    }

    private static parseArtists(orig: string): string[] {
        const delimiters = [",", "&", "ft.", "Feat.", "feat."]
        let artists = [orig];
        delimiters.forEach((delim) => {
            artists.forEach((artist) => {
                artist.split(delim) // have to collect all of these splits and put into array
            })
        });
        return artists;
    }

    public static removeArtist(artist: string) {
        this._artists.delete(artist);
    }

    public static autoPlay() {
        if (this._artists.size == 0) { return }
        const artists = Array.from(this._artists);
        console.log(artists);
        ChildUtil.child.send({query: artists[this.randIndex(artists.length)], random: true});
    }

    public static isAutoPlaying() {
        return this.autoPlaying;
    }

    public static toggleAutoPlay() {
        this.autoPlaying = !this.autoPlaying;
    }

    public static stopAutoPlay() {
        this.autoPlaying = false;
        this._artists = new Set<string>();
    }

    private static randIndex(len: number): number {
        return Math.floor(Math.random() * len);
    }
}