# YouTube Age Restriction Bypass
Bypasses YouTube content restriction in the EU negating the need to provide identification to watch age or other restricted videos.
 
This project uses `youtubedl` accessed through a web API to download videos and serve them through a custom CDN. The content is then played seamlessly through the browser plugin replacing the original YouTube player with a HTML5 player containing the restricted content.

#### Browser Plugin
The browser plugin is an unpacked extension built for Chrome and Chromium based browsers that has also been tested with Firefox, similarly this plugin can also be adapted to work with Tampermonkey.

#### Web API
The API can be found in a separate repository and works in combination with the browser extension to download and share restricted videos.
https://github.com/CplNathan/YouTube-Age-Restriction-Bypass-Server

## Why?
As of recent YouTube now requires citizens of the European Union to provide a valid credit card or government issued personal identification card to watch age restricted videos, personally I do not like the idea of providing either to Google if I do not have to. This extension works regardless of if you are logged in or not.

In addition, you used to be able to bypass the restrictions simply by changing the /watch URL to an /embed URL however I have found that this is unfortunately no longer possible.

## Images
#### Downloading
![Downloading](https://i.imgur.com/BzIqyJu.png)
#### Playing
![Playing](https://i.imgur.com/X26qFKq.png)
#### Error
![Error](https://i.imgur.com/SAnRHNi.png)
