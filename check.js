const url = 'https://tvlibre-online.com/html/fl/?get=Rm94U3BvcnRz';
fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  .then(r => r.text())
  .then(t => {
    console.log(t);
  })
  .catch(console.error);
