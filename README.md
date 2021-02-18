# YouTube Age Restriction Bypass
Bypasses YouTube content restriction in the EU negating the need to provide identification to watch age or other restricted videos.
 
This project uses `youtubedl` accessed through a web API to download videos and serve them through a custom CDN. The content is then played seamlessly through the browser plugin replacing the original YouTube player with a HTML5 player containing the restricted content.

#### Browser Plugin
The browser plugin is an unpacked extension built for Chrome and Chromium based browsers that has also been tested with Firefox, similarly this plugin can also be adapted to work with Tampermonkey.

#### Web API
The API can be found in a seperate repository and works in combination with the browser extension to download and share restricted videos.
https://github.com/CplNathan/YouTube-Age-Restriction-Bypass-Server
