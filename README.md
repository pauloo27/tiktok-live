# TikTok Live Downloader

This package downloads a `.mp4` video file from TikTok Lives. It will not download the whole live,
but from when you started the process until you close it.

## How to install

First, clone the repository:

> git clone https://github.com/Pauloo27/tiktok-live.git

Then install ffmpeg (used for converting the live to a .mp4 file): https://ffmpeg.org/

## How to use

In the repository folder, run the command:

> npm install

This will download the dependencies. Now, you can download tiktok lives, run:

> node index.js \<username\>

Here the `<username>` is the username of the live, without the `@` symbol.

For more advanced usage, run:
> node index.js --help
