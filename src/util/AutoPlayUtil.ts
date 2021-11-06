import { ChildUtil } from "./ChildUtil";
import getArtistTitle from "get-artist-title";
import yts from "yt-search";

export class AutoPlayUtil {
    private static _artists: Set<string> = new Set();
    private static autoPlaying: boolean = true;

    public static addArtist(video: yts.VideoSearchResult) {
        const [front, back] = getArtistTitle(video.title, { defaultArtist: video.author.name });
        const artistsFromFront = front.split(","); // Sometimes two artists
        const artistsFromBack = [] //back.split("ft.")[1].split(",")
        const artists = [...artistsFromFront, ...artistsFromBack]
        artists.forEach((a) => this._artists.add(a));
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
        this._artists = new Set<string>();
    }

    public static stopAutoPlay() {
        this.autoPlaying = false;
    }

    private static randIndex(len: number): number {
        return Math.floor(Math.random() * len);
    }
}