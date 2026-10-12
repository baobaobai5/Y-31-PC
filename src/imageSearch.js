function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('图片无法读取，请换一张图片'));
    image.src = src;
  });
}
function signature(image, crop) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 24;
  const context = canvas.getContext('2d', {willReadFrequently: true});
  context.drawImage(image, ...crop, 0, 0, 24, 24);
  const pixels = context.getImageData(0, 0, 24, 24).data;
  return Array.from({length: pixels.length}, (_, i) => pixels[i]).filter((_, i) => i % 4 !== 3);
}
// Match against the actual local cover crops; no image or search data leaves the browser.
export async function matchSiteCover(src, items, type = '全部') {
  const [uploaded, posters, comics] = await Promise.all([loadImage(src), loadImage('/assets/reference.png'), loadImage('/assets/comic-covers.png')]);
  const query = signature(uploaded, [0, 0, uploaded.naturalWidth, uploaded.naturalHeight]);
  let best = {score: 0, title: ''};
  for (const item of items) {
    const crops = [
      [posters, [item.x, 615, 169, 169 * 9 / 16]],
      [posters, [item.x + 17, 610, 135, 180]],
      [posters, [item.x, 615, 169, 169 * 2 / 5]],
      [comics, [((item.id - 1) % 5) * comics.naturalWidth / 5, Math.floor((item.id - 1) / 5) * comics.naturalHeight / 2, comics.naturalWidth / 5, comics.naturalHeight / 2]],
    ];
    const selected = type === '全部' ? crops : [crops[{'长视频':0, '短视频':1, '帖子':2, '漫画':3}[type]]];
    for (const [image, crop] of selected) {
      const sample = signature(image, crop);
      const distance = query.reduce((sum, value, i) => sum + (value - sample[i]) ** 2, 0) / query.length;
      const score = 1 - Math.sqrt(distance) / 255;
      if (score > best.score) best = {score, title: item.title};
    }
  }
  return best.score >= 0.88 ? best : null;
}

export async function saveImageSearchPreview(src, title, type) {
  const image = await loadImage(src);
  const scale = Math.min(1, 480 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  const id = crypto.randomUUID();
  sessionStorage.setItem(`wanxiang-image-search-${id}`, JSON.stringify({preview: canvas.toDataURL('image/png'), title, type}));
  return id;
}
