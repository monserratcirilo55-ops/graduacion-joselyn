const eventDate = new Date('2026-11-07T15:00:00-06:00');
function updateCountdown() {
  const remaining = Math.max(0, eventDate.getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const values = [Math.floor(totalSeconds / 86400), Math.floor(totalSeconds / 3600) % 24, Math.floor(totalSeconds / 60) % 60, totalSeconds % 60];
  ['days','hours','minutes','seconds'].forEach((id,i) => { document.getElementById(id).textContent = String(values[i]).padStart(2,'0'); });
  if (remaining === 0) document.getElementById('count-note').textContent = Date.now() < eventDate.getTime() + 86400000 ? '¡Hoy celebramos juntos!' : 'Gracias por ser parte de este momento.';
}
updateCountdown();
setInterval(updateCountdown, 1000);
function celebrate() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.getElementById('confetti');
  layer.replaceChildren();
  for (let i=0; i<55; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetto';
    piece.style.setProperty('--left', `${Math.random()*100}%`);
    piece.style.setProperty('--duration', `${2.5+Math.random()*2}s`);
    piece.style.setProperty('--drift', `${Math.random()*220-110}px`);
    piece.style.setProperty('--color', ['#bc9657','#244c8f','#e8d6af','#8fa8cb'][i%4]);
    layer.append(piece);
  }
  const pieces = [...layer.children];
  setTimeout(()=>pieces.forEach(piece=>piece.remove()),5000);
}
document.getElementById('open').addEventListener('click', () => {
  const invitation = document.getElementById('invitacion');
  invitation.classList.add('opened');
  invitation.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  celebrate();
});
function sparkle(x, y) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.getElementById('confetti');
  for(let i=0; i<14; i++) {
    const star = document.createElement('span');
    star.className = 'sparkle';
    star.textContent = i % 3 === 0 ? '✧' : '✦';
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    const angle = (i / 14) * Math.PI * 2;
    const distance = 35 + Math.random() * 75;
    star.style.setProperty('--x', `${Math.cos(angle)*distance}px`);
    star.style.setProperty('--y', `${Math.sin(angle)*distance}px`);
    star.style.setProperty('--turn', `${Math.random()*160-80}deg`);
    layer.append(star);
    setTimeout(()=>star.remove(),1000);
  }
}
document.getElementById('celebrate').addEventListener('click', celebrate);
document.getElementById('photo-spark').addEventListener('click', (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  sparkle(rect.left+rect.width/2, rect.top+rect.height/2);
  celebrate();
});
document.querySelector('.portrait img').addEventListener('click', (event) => sparkle(event.clientX,event.clientY));
document.addEventListener('click', (event) => {
  if(event.target.closest('a,button,.portrait')) return;
  sparkle(event.clientX,event.clientY);
});
document.getElementById('share').addEventListener('click', async () => {
  const feedback = document.getElementById('feedback');
  if (!/^https?:$/.test(location.protocol) || ['localhost','127.0.0.1'].includes(location.hostname)) {
    feedback.textContent = 'Cuando la invitación esté publicada podrás compartir su enlace desde aquí.'; return;
  }
  const data = {title:'Graduación de Joselyn Ortiz',text:'¡Te invito a celebrar mi graduación! 7 de noviembre de 2026, 3:00 p. m.',url:location.href.split('#')[0]};
  try {
    if(navigator.share) { await navigator.share(data); feedback.textContent=''; }
    else { await navigator.clipboard.writeText(data.url); feedback.textContent='¡Enlace copiado! Ya puedes enviarlo a tus invitados.'; }
  } catch(error) {
    if(error.name !== 'AbortError') feedback.textContent='Copia el enlace de la barra de direcciones para compartir la invitación.';
  }
});
