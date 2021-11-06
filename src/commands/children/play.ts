import yts, { VideoSearchResult } from "yt-search";

interface ChildRequest {
    query: string,
    random?: boolean;
}

process.on('message', async (request: ChildRequest) => {
    console.log('Message from parent:', request.query);
    const video: VideoSearchResult | null = await fetchVideo(request);
    process.send(video);
});

// let counter = 0;

// setInterval(() => {
//   process.send({ counter: counter++ });
// }, 1000);

async function fetchVideo(request: ChildRequest): Promise<yts.VideoSearchResult | null> {
    // Temporary fix to get more relevant videos
    // request.query = request.random ? request.query + " music" : request.query;
    const videoResult = await yts({query: request.query, category: 'music'});
    const numVid = videoResult.videos.length;
    // If random return random result, if not return first if there is one
    return request.random ? videoResult.videos[randIndex(numVid)] : 
        ((videoResult.videos.length > 1) ? videoResult.videos[0] : null);
}

// Returns a random number [0, len)
function randIndex(len: number): number {
    return Math.floor(Math.random() * len);
}