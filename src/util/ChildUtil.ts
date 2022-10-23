import { ChildProcess, fork } from "child_process";
import { VideoSearchResult } from "yt-search";
import { ChildRequest } from "../commands/children/play";
import { AudioUtil } from "./AudioUtil";
import { queue } from "./Queue";

export class ChildUtil {
    private static readonly child: ChildProcess = this.setupChild();
    
    private static setupChild(): ChildProcess {
        const child: ChildProcess = fork("./dist/commands/children/play.js");
        child.on('message', (video: VideoSearchResult) => {
            console.log('Message from child', video.title);
            queue.add(video);
            if (!AudioUtil.isPlaying()) { AudioUtil.play() }
        });
        return child;
    }

    public static send(payload: ChildRequest) {
        this.child.send(payload);
    }
}