// menú Servicios: se abre al tocar (móvil) o con clic; en escritorio también al pasar el mouse
document.querySelectorAll('.dd>a').forEach(a=>a.addEventListener('click',e=>{const dd=a.parentElement;if(window.matchMedia('(max-width:960px)').matches||!dd.classList.contains('open')&&e.detail===0){e.preventDefault();const o=dd.classList.toggle('open');a.setAttribute('aria-expanded',o)}}));
document.addEventListener('click',e=>{document.querySelectorAll('.dd.open').forEach(d=>{if(!d.contains(e.target)){d.classList.remove('open');d.firstElementChild.setAttribute('aria-expanded','false')}})});
document.querySelector('.burger')?.addEventListener('click',()=>document.querySelector('.nav').classList.toggle('open'));
// product search
const s=document.getElementById('q');
if(s)s.addEventListener('input',()=>{const v=s.value.toLowerCase();document.querySelectorAll('[data-name]').forEach(c=>c.style.display=c.dataset.name.toLowerCase().includes(v)?'':'none')});
// industry filter
document.querySelectorAll('[data-ind]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const k=b.dataset.ind;document.querySelectorAll('.chip').forEach(c=>c.style.outline=c===b?'2px solid #a3e600':'');document.querySelectorAll('[data-tags]').forEach(c=>c.style.display=(k==='all'||c.dataset.tags.includes(k))?'':'none')}));
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
