build:
	mkdir -p target
	deno compile --allow-env --allow-net --allow-write --allow-read --output=target/rss_batch src/index.js 