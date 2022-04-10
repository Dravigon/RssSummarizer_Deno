build:
	mkdir target
	deno compile --allow-net --allow-write --allow-read --output=target/rss_batch src/index.js 