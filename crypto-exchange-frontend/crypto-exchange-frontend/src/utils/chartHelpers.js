// Generate price data for charts
export const generatePriceData = (basePrice = 67842, points = 120) => {
  const data = [];
  let price = basePrice - 3000;
  
  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.46) * 800;
    price = Math.max(basePrice - 5000, Math.min(basePrice + 5000, price));
    data.push(price);
  }
  
  data.push(basePrice);
  return data;
};

// Generate sparkline data
export const generateSparklineData = (basePrice, length = 12, isUp = true) => {
  const data = Array.from({ length }, () => 
    basePrice * (0.97 + Math.random() * 0.06)
  );
  if (isUp) data[data.length - 1] = data[data.length - 2] * 1.01;
  return data;
};

// Draw chart on canvas
export const drawPriceChart = (canvas, data, color = '#00e5ff') => {
  if (!canvas) return;
  
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  const W = rect.width;
  const H = rect.height;
  
  const min = Math.min(...data) * 0.998;
  const max = Math.max(...data) * 1.002;
  
  const toX = (i) => (i / (data.length - 1)) * W;
  const toY = (v) => H - ((v - min) / (max - min)) * H * 0.85 - H * 0.05;
  
  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(0,229,255,0.18)');
  grad.addColorStop(0.5, 'rgba(0,229,255,0.06)');
  grad.addColorStop(1, 'rgba(0,229,255,0)');
  
  ctx.beginPath();
  data.forEach((p, i) => i === 0 ? ctx.moveTo(toX(i), toY(p)) : ctx.lineTo(toX(i), toY(p)));
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  
  // Line
  ctx.beginPath();
  data.forEach((p, i) => i === 0 ? ctx.moveTo(toX(i), toY(p)) : ctx.lineTo(toX(i), toY(p)));
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  
  // Current price dot
  const lastX = toX(data.length - 1);
  const lastY = toY(data[data.length - 1]);
  
  ctx.beginPath();
  ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
  // Handle both hex and rgba color formats
  if (color.startsWith('rgba')) {
    ctx.strokeStyle = color.replace(/[\d.]+\)$/, '0.3)');
  } else if (color.startsWith('#')) {
    ctx.strokeStyle = color + '4d';
  } else {
    ctx.strokeStyle = 'rgba(0,229,255,0.3)';
  }
  ctx.lineWidth = 2;
  ctx.stroke();
};
