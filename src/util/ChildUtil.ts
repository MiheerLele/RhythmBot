import { ChildProcess, fork } from "child_process";
import { VideoSearchResult } from "yt-search";
import { AudioUtil } from "./AudioUtil";
import { queue } from "./Queue";

export class ChildUtil {
    public static readonly child: ChildProcess = this.setupChild();
    
    private static setupChild(): ChildProcess {
        const child: ChildProcess = fork("./dist/commands/children/play.js");
        child.on('message', (video: VideoSearchResult | null) => {
            // AudioUtil.subscription has a chance of being undefined here
            if (video) {
                console.log('Message from child', video.title);
                console.log(video.author.name);
                queue.add(video);
                if (!AudioUtil.isPlaying()) { queue.play() }
            }
        });
        return child;
    }
}