import yts, { VideoSearchResult } from "yt-search";

process.on('message', async (query: string) => {
    console.log('Message from parent:', query);
    const video: VideoSearchResult = await loadVideo(query);
    process.send(video);
});

// let counter = 0;

// setInterval(() => {
//   process.send({ counter: counter++ });
// }, 1000);

async function loadVideo(query: string) {
    const videoResult = await yts(query);
    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
}