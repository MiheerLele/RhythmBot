import yts, { VideoSearchResult } from "yt-search";
import { randIndex } from "../../util/Math"

export interface ChildRequest {
    query: string,
    random?: boolean;
}

process.on('message', async (request: ChildRequest) => {
    console.log('Message from parent:', request.query);
    const video: VideoSearchResult | null = await fetchVideo(request);
    process.send(video);
});

async function fetchVideo(request: ChildRequest): Promise<yts.VideoSearchResult | null> {
    const videoResult = await yts({query: request.query, category: 'music'});
    // If random return random result, if not return first if there is one
    return request.random ? getRandomVideo(videoResult) : getFirstVideo(videoResult);
}

function getRandomVideo(results: yts.SearchResult): yts.VideoSearchResult {
    let cutoff = 300; // 5:00 min 
    let filteredVideos = results.videos.filter(video => video.seconds <= cutoff);
    while (filteredVideos.length == 0) { // In case all videos are filtered out
        cutoff += 30; // Add 30 seconds to the cutoff
        filteredVideos = results.videos.filter(video => video.seconds <= cutoff);
    }
    console.log(`Videos filtered out: ${results.videos.length - filteredVideos.length}`);
    console.log(`Filtered Videos Length: ${filteredVideos.length}`);
    return filteredVideos[randIndex(filteredVideos.length)];
}

function getFirstVideo(results: yts.SearchResult): yts.VideoSearchResult | null {
    return results.videos.length > 1 ? results.videos[0] : null;
}