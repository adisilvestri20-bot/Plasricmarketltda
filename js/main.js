// menú Servicios: se abre al tocar (móvil) o con clic; en escritorio también al pasar el mouse
document.querySelectorAll('.dd>a').forEach(a=>a.addEventListener('click',e=>{const dd=a.parentElement;if(window.matchMedia('(max-width:960px)').matches||!dd.classList.contains('open')&&e.detail===0){e.preventDefault();const o=dd.classList.toggle('open');a.setAttribute('aria-expanded',o)}}));
document.addEventListener('click',e=>{document.querySelectorAll('.dd.open').forEach(d=>{if(!d.contains(e.target)){d.classList.remove('open');d.firstElementChild.setAttribute('aria-expanded','false')}})});
document.querySelector('.burger')?.addEventListener('click',e=>{e.stopPropagation();const o=document.querySelector('.nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o);e.currentTarget.textContent=o?'✕':'☰'});
document.addEventListener('click',e=>{const n=document.querySelector('.nav');if(n&&n.classList.contains('open')&&!n.contains(e.target)){n.classList.remove('open');const b=document.querySelector('.burger');b.textContent='☰';b.setAttribute('aria-expanded','false')}});
// buscador de productos (nombre, descripción, usos) + filtro por industria
const s=document.getElementById('q');
let ind='all';
const nz=x=>x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function filtrar(){const ws=nz(s?s.value:'').split(/\s+/).filter(Boolean);let n=0;
 document.querySelectorAll('.prod[data-s]').forEach(c=>{const h=nz(c.dataset.s||c.dataset.name);const ok=ws.every(w=>h.includes(w))&&(ind==='all'||c.dataset.tags.includes(ind));c.style.display=ok?'':'none';if(ok)n++});
 const ct=document.getElementById('qcount'),nn=document.getElementById('qnone');
 if(ct)ct.textContent=ws.length||ind!=='all'?(n+(n===1?' producto encontrado':' productos encontrados')):'';
 if(nn)nn.style.display=n?'none':'block'}
if(s)s.addEventListener('input',filtrar);
// industry filter
document.querySelectorAll('[data-ind]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();ind=b.dataset.ind;document.querySelectorAll('.chip').forEach(c=>c.style.outline=c===b?'2px solid #a3e600':'');filtrar()}));
// map tabs (Google Maps embed + enlaces a Google Maps y Waze)
const places={scl:'Av. Quilín 2746, Macul, Santiago, Chile',mia:'2 S Biscayne Blvd Ste 3200, Miami, FL 33131, USA'};
const setPlace=k=>{const a=places[k],e=encodeURIComponent(a);const f=document.getElementById('mapf');if(!f)return;f.src='https://www.google.com/maps?q='+e+'&z=16&output=embed';document.getElementById('gmaps').href='https://www.google.com/maps/search/?api=1&query='+e;document.getElementById('waze').href='https://waze.com/ul?q='+e+'&navigate=yes';document.getElementById('maddr').textContent=a.replace(', Macul','').replace(', USA','')};
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');setPlace(b.dataset.m)}));
// file drop
const fi=document.getElementById('file');if(fi){const d=document.getElementById('drop');d.onclick=()=>fi.click();fi.onchange=()=>{if(fi.files[0])d.querySelector('span').textContent=fi.files[0].name}}
// formulario -> correo (FormSubmit) con adjunto; si falla, abre el correo del usuario
const f=document.getElementById('cf'),EMAIL='ventas@plastic-market.com';
const say=(t,ok)=>{const el=document.getElementById('fstatus');if(!el)return;el.style.display='block';el.textContent=t;el.style.background=ok?'#e8f7d4':'#fdecec';el.style.color=ok?'#1e5a0f':'#8a1f1f'};
if(f)f.addEventListener('submit',async e=>{
  e.preventDefault();
  const g=n=>f.elements[n].value,file=f.elements['archivo']&&f.elements['archivo'].files[0],btn=document.getElementById('sendbtn');
  if(file&&file.size>5*1024*1024){say('El archivo supera los 5 MB. Envíalo por correo a '+EMAIL+' o por WhatsApp.',false);return}
  const fd=new FormData(f);
  fd.append('_subject','Solicitud de cotización - '+g('empresa'));fd.append('_template','table');fd.append('_captcha','false');fd.append('_replyto',g('correo'));
  btn.disabled=true;const old=btn.textContent;btn.textContent='Enviando…';
  try{
    const r=await fetch('https://formsubmit.co/ajax/'+EMAIL,{method:'POST',body:fd,headers:{'Accept':'application/json'}});
    const j=await r.json().catch(()=>({}));
    if(!r.ok||j.success==='false'||j.success===false)throw new Error('send');
    f.reset();const sp=document.querySelector('#drop span');if(sp)sp.textContent='o arrástralo aquí';
    say('¡Gracias! Recibimos tu solicitud y te responderemos a la brevedad.',true);
  }catch(err){
    const body=`Nombre: ${g('nombre')}\nEmpresa: ${g('empresa')}\nCargo: ${g('cargo')}\nTeléfono: ${g('tel')}\nCorreo: ${g('correo')}\n\n${g('desc')}`;
    say('No pudimos enviar el formulario automáticamente. Abrimos tu correo con el mensaje listo; si tienes un archivo, adjúntalo allí.',false);
    location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Solicitud de cotización - '+g('empresa'))+'&body='+encodeURIComponent(body);
  }finally{btn.disabled=false;btn.textContent=old}
});
// product gallery
document.querySelectorAll('.th').forEach(b=>b.addEventListener('click',()=>{const m=document.getElementById('gmain');if(m){m.style.display='';m.src=b.dataset.src}document.querySelectorAll('.th').forEach(x=>x.classList.remove('on'));b.classList.add('on')}));
// prefill contact from ?producto=<name>
try{const q=new URLSearchParams(location.search).get('producto'),d=document.querySelector('#cf textarea');if(q&&d&&!d.value)d.value='Quiero cotizar: '+q+'\n\nMedidas / cantidades:'}catch(e){}
// agenda de reuniones: correo (FormSubmit) + WhatsApp con el mensaje listo
(()=>{const f=document.getElementById('af');if(!f)return;
const d=document.getElementById('afecha');if(d){const t=new Date();t.setDate(t.getDate()+1);d.min=t.toISOString().slice(0,10)}
const H={sem:['14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30'],sab:['10:00','10:30','11:00','11:30','12:00','12:30']};
const sel=f.elements['hora'];
const fill=()=>{const v=f.elements['fecha'].value;if(!v){sel.innerHTML='<option value="">Primero elige la fecha</option>';return}
 const w=new Date(v+'T12:00:00').getDay();
 if(w===0){sel.innerHTML='<option value="">Domingo: sin reuniones</option>';return}
 const l=w===6?H.sab:H.sem;sel.innerHTML='<option value="">Horario ('+(w===6?'10:00 a 13:00':'14:30 a 19:00')+' hrs)</option>'+l.map(h=>'<option>'+h+'</option>').join('')};
f.elements['fecha'].addEventListener('change',fill);fill();
const st=(m,ok)=>{const e=document.getElementById('astatus');e.style.display='block';e.textContent=m;e.style.background=ok?'#e8f7d4':'#fdecec';e.style.color=ok?'#1e5a0f':'#8a1f1f'};
f.addEventListener('submit',async ev=>{ev.preventDefault();
 const g=n=>f.elements[n].value.trim();
 if(!g('nombre')||!g('tel')||!g('correo')||!g('fecha')||!g('hora')){st('Completa nombre, teléfono, correo, fecha y horario.',false);return}
 const dia=new Date(g('fecha')+'T12:00:00');if(dia.getDay()===0){st('Elige un día de lunes a sábado.',false);return}
 const fecha=dia.toLocaleDateString('es-CL',{weekday:'long',day:'numeric',month:'long'});
 const msg=`Hola PlasticMarket, quiero agendar una reunión por Google Meet.\nNombre: ${g('nombre')}${g('empresa')?'\nEmpresa: '+g('empresa'):''}\nFecha: ${fecha}\nHorario: ${g('hora')} hrs (hora de Chile)\nTeléfono: ${g('tel')}\nCorreo: ${g('correo')}${g('desc')?'\nProyecto: '+g('desc'):''}`;
 const wa='https://wa.me/56995019832?text='+encodeURIComponent(msg);
 const w=window.open('','_blank');const btn=document.getElementById('asend');btn.disabled=true;
 const fd=new FormData();fd.append('nombre',g('nombre'));fd.append('empresa',g('empresa'));fd.append('telefono',g('tel'));fd.append('correo',g('correo'));fd.append('fecha',fecha);fd.append('horario',g('hora'));fd.append('proyecto',g('desc'));fd.append('_subject','Solicitud de reunión Google Meet - '+g('nombre'));fd.append('_template','table');fd.append('_captcha','false');fd.append('_replyto',g('correo'));
 let ok=false;try{const r=await fetch('https://formsubmit.co/ajax/ventas@plastic-market.com',{method:'POST',body:fd,headers:{Accept:'application/json'}});const j=await r.json().catch(()=>({}));ok=r.ok&&j.success!=='false'&&j.success!==false}catch(e){}
 if(w)w.location=wa;else location.href=wa;
 st(ok?'¡Listo! Enviamos tu solicitud por correo y abrimos WhatsApp con el mensaje: envíalo y te confirmaremos la reunión por Google Meet.':'Abrimos WhatsApp con tu solicitud; envíala para confirmar tu reunión. (No pudimos enviar el correo automáticamente.)',ok);
 btn.disabled=false;if(ok)f.reset()})})();
// buscador del sitio
(()=>{const b=document.querySelector('.srchbtn');if(!b)return;
const box=document.createElement('div');box.className='sbox';box.innerHTML='<div class="pn" role="dialog" aria-label="Buscar en el sitio"><div class="row"><input type="text" autocomplete="off" placeholder="Busca por palabra clave: tablas, PVC, matricería…" aria-label="Buscar"><button class="x" type="button" aria-label="Cerrar">✕</button></div><div class="res"></div></div>';
document.body.appendChild(box);
const inp=box.querySelector('input'),res=box.querySelector('.res');
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const open=()=>{box.classList.add('open');inp.focus();run()};
const close=()=>box.classList.remove('open');
b.addEventListener('click',open);box.querySelector('.x').addEventListener('click',close);
box.addEventListener('click',e=>{if(e.target===box)close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
const hl=(t,ws)=>{let o=esc(t);ws.forEach(w=>{o=o.replace(new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>')});return o};
function run(){const q=norm(inp.value.trim());const idx=window.PM_INDEX||[];
 if(!q){res.innerHTML='<p class="none">Escribe una palabra clave para buscar productos, servicios e información.</p>';return}
 const ws=q.split(/\s+/).filter(w=>w.length>1);if(!ws.length){res.innerHTML='';return}
 const r=idx.map(p=>{const t=norm(p.t),d=norm(p.d),x=norm(p.x);let sc=0;
  for(const w of ws){let s=0;if(t.includes(w))s+=10;if(d.includes(w))s+=4;if(x.includes(w))s+=1;if(!s)return null;sc+=s}
  return{p,sc}}).filter(Boolean).sort((a,b)=>b.sc-a.sc).slice(0,12);
 if(!r.length){res.innerHTML='<p class="none">No encontramos resultados para “'+esc(inp.value)+'”. Prueba con otra palabra o <a href="https://wa.me/56995019832" target="_blank" rel="noopener">escríbenos por WhatsApp</a>.</p>';return}
 res.innerHTML=r.map(({p})=>{const x=norm(p.x);let i=x.indexOf(ws[0]);const sn=(i>60?'…':'')+p.x.substr(Math.max(0,i-60),150)+'…';
  return '<a href="'+p.u+'"><b>'+hl(p.t,ws)+'</b><small>'+hl(p.d||sn,ws)+'</small></a>'}).join('')}
inp.addEventListener('input',run)})();
