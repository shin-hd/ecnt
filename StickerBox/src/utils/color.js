export const getRandomBrightColor = () => {
  const minContrastRatio = 4.5; // 최소 콘트라스트 비율
  let color;

  do {
    color = getRandomColor();
  } while (getContrastRatio(color, '#000000') < minContrastRatio);

  return color;
};

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// 콘트라스트 비율 계산 함수
function getContrastRatio(color1, color2) {
  const luminance1 = getLuminance(color1) + 0.05;
  const luminance2 = getLuminance(color2) + 0.05;
  return luminance1 > luminance2
    ? luminance1 / luminance2
    : luminance2 / luminance1;
}

// 밝기 계산 함수
function getLuminance(color) {
  const rgb = parseInt(color.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const sRGB = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });

  return sRGB[0] * 0.2126 + sRGB[1] * 0.7152 + sRGB[2] * 0.0722;
}
