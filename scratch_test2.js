const fs = require('fs');

function mapTvlibr3Link(link) {
  if (link.url.includes('/eventos/?r=')) {
    try {
      const base64 = link.url.split('?r=')[1];
      const decoded = Buffer.from(base64, 'base64').toString('utf8');
      return decoded; // This is a streamtp URL usually
    } catch(e) {
      return link.url;
    }
  } else if (link.url.startsWith('/en-vivo/')) {
    // /en-vivo/espn-3/ -> espn3
    let channelId = link.url.replace('/en-vivo/', '').replace(/\//g, '');
    channelId = channelId.replace(/-/g, ''); // espn3
    // We can simulate streamtpnew URL so our frontend automatically links it to CANALES
    return `https://streamtpnew.com/global1.php?stream=${channelId}`;
  }
  return link.url;
}

console.log(mapTvlibr3Link({ url: '/eventos/?r=aHR0cHM6Ly9zdHJlYW10cDEwLmNvbS9nbG9iYWwxLnBocD9zdHJlYW09ZGlzbmV5MQ==' }));
console.log(mapTvlibr3Link({ url: '/en-vivo/espn-3/' }));
console.log(mapTvlibr3Link({ url: '/en-vivo/tyc-sports/' }));
