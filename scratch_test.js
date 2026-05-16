const https = require('https');

https.get('https://tvlibr3.com/agenda/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /<li class="[^"]+">\s*<a href="#">\s*([^<]+)\s*<span class="t">([^<]+)<\/span><\/a>\s*<ul>([\s\S]*?)<\/ul>\s*<\/li>/g;
    let match;
    const eventos = [];
    while ((match = regex.exec(data)) !== null) {
      const title = match[1].trim();
      const time = match[2].trim();
      const optionsHtml = match[3];
      
      const optionsRegex = /<a href="([^"]+)"[^>]*>([^<]+)<span>([^<]*)<\/span><\/a>/g;
      const links = [];
      let optMatch;
      while ((optMatch = optionsRegex.exec(optionsHtml)) !== null) {
        links.push({ url: optMatch[1], name: optMatch[2].trim(), quality: optMatch[3].trim() });
      }
      eventos.push({ title, time, links });
    }
    console.log(JSON.stringify(eventos, null, 2));
  });
});
