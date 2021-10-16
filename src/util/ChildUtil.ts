import { ChildProcess, fork } from "child_process";
import { Message, MessageEmbed } from "discord.js";
import { VideoSearchResult } from "yt-search";
import { AudioUtil } from "./AudioUtil";
import { queue } from "./Queue";

export class ChildUtil {
    public static readonly child: ChildProcess = this.setupChild();
    
    private static setupChild(): ChildProcess {
        const child: ChildProcess = fork("./dist/commands/children/play.js");
        child.on('message', (video: VideoSearchResult) => {
            console.log('Message from child', video.title);
            // AudioUtil.subscription has a chance of being undefined here
            if (video) {
                queue.add(video);
                if (!AudioUtil.isPlaying()) { queue.play() }
            }
        });
        return child;
    }
}