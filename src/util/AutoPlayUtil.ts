import { ChildUtil } from "./ChildUtil";
import { randIndex } from "./Math";
import getArtistTitle from "get-artist-title";
import yts from "yt-search";

export class AutoPlayUtil {
    private static _artists: Set<string> = new Set();
    private static autoPlaying: boolean = true;

    public static addArtist(video: yts.VideoSearchResult) {
        const [artist, title] = getArtistTitle(video.title, { defaultArtist: video.author.name });
        if (artist.trim() === '') { return; }
        const artists = artist.split(/[,&x]|ft\.|feat\.|Feat\./);
        artists.forEach((a) => this._artists.add(a.trim()));
    }

    public static removeArtist(artist: string) {
        this._artists.delete(artist);
    }

    public static autoPlay() {
        if (this._artists.size == 0) { return }
        const artists = Array.from(this._artists);
        console.log(artists);
        ChildUtil.child.send({query: artists[randIndex(artists.length)], random: true});
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

}