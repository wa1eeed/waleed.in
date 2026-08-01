/* waleed.in - shared site behaviour (theme, reveal, counters, share, nav, tabs, gallery) */

(function(){
var root=document.documentElement,ti=document.getElementById('ti');
function st(t){root.setAttribute('data-theme',t);ti.textContent=t==='dark'?'\u25d1':'\u25d0';try{localStorage.setItem('wt',t);}catch(e){}}
var s;try{s=localStorage.getItem('wt');}catch(e){}
st(s||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));
document.getElementById('tb').onclick=function(){st(root.getAttribute('data-theme')==='dark'?'light':'dark');};
document.getElementById('yr').textContent=new Date().getFullYear();
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.1});
document.querySelectorAll('.rv').forEach(function(el){io.observe(el);});
var cnt=false;
function rc(){if(cnt)return;cnt=true;document.querySelectorAll('.n[data-c]').forEach(function(el){var t=+el.getAttribute('data-c'),sf=el.getAttribute('data-s')||'',d=1300,t0=null;function s(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/d,1),e=1-Math.pow(1-p,3);el.innerHTML=Math.floor(e*t)+'<span>'+sf+'</span>';if(p<1)requestAnimationFrame(s);}requestAnimationFrame(s);});}
var me=document.querySelector('.metrics');if(me){var mo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){rc();mo.disconnect();}})},{threshold:.3});mo.observe(me);}
var toast=document.getElementById('toast'),tt;
function show(m){toast.textContent=m;toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on');},2200);}
var isAR=(document.documentElement.lang||'en').indexOf('ar')===0;
var url='https://waleed.in'+location.pathname;
var txt=isAR?'\u0648\u0644\u064a\u062f \u0627\u0644\u062d\u0631\u0628\u064a \u2014 \u0642\u064a\u0627\u062f\u064a \u062a\u0646\u0641\u064a\u0630\u064a \u0641\u064a \u0627\u0644\u062a\u062d\u0648\u0651\u0644 \u0627\u0644\u0645\u0624\u0633\u0633\u064a \u0648\u0645\u0646\u0635\u0651\u0627\u062a \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a':'Waleed Al Harbi - Chief Executive Officer';
var T=isAR?{copied:'\u062a\u0645 \u0646\u0633\u062e \u0627\u0644\u0631\u0627\u0628\u0637',ok:'\u062a\u0645',useBtns:'\u0627\u0633\u062a\u062e\u062f\u0645 \u0627\u0644\u0623\u0632\u0631\u0627\u0631'}:{copied:'Link copied',ok:'Link copied',useBtns:'Use share buttons'};
document.getElementById('wa').href='https://wa.me/?text='+encodeURIComponent(txt+' '+url);
document.getElementById('tg').href='https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(txt);
document.getElementById('cp').onclick=function(){navigator.clipboard?navigator.clipboard.writeText(url).then(function(){show(T.copied);}):(show(T.ok));};
document.getElementById('ns').onclick=function(){if(navigator.share)navigator.share({title:txt,url:url}).catch(function(){});else show(T.useBtns);};
})();

(function(){
  var docEl=document.documentElement;
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var prog=document.getElementById('sprog'),nav=document.querySelector('nav'),ticking=false;
  function upd(){ticking=false;var max=docEl.scrollHeight-docEl.clientHeight,p=max>0?docEl.scrollTop/max:0;if(prog)prog.style.transform='scaleX('+p.toFixed(4)+')';if(nav)nav.classList.toggle('scrolled',docEl.scrollTop>8);}
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(upd);}}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});upd();
  if(!reduce){
    document.querySelectorAll('.sg,.plats,.tl,.two').forEach(function(g){
      var kids=[].filter.call(g.children,function(c){return c.classList&&c.classList.contains('rv');});
      kids.forEach(function(c,i){c.style.setProperty('--d',(i*0.07).toFixed(2)+'s');});
    });
    var hero=document.querySelector('.hero');
    if(hero&&matchMedia('(hover:hover) and (pointer:fine)').matches){
      hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();hero.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');hero.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');});
    }
  }
})();

(function(){
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var links=[].slice.call(document.querySelectorAll('.nav-links a'));
  // mark the link for the page currently being viewed
  (function(){
    function norm(p){return p.replace(/index\.html$/,'').replace(/\/+$/,'')||'/';}
    var here=norm(location.pathname);
    links.forEach(function(a){
      var h=a.getAttribute('href')||'';
      if(h.charAt(0)==='#') return;
      if(norm(new URL(h,location.href).pathname)===here) a.classList.add('active');
    });
  })();
  if(links.length){
    var map={};links.forEach(function(a){var id=a.getAttribute('href').slice(1),s=document.getElementById(id);if(s)map[id]=a;});
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('active');});var a=map[e.target.id];if(a)a.classList.add('active');}});},{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(map).forEach(function(id){so.observe(document.getElementById(id));});
  }
  if(!reduce&&fine){
    [].forEach.call(document.querySelectorAll('.btn'),function(b){
      b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*0.18).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*0.28).toFixed(1)+'px)';});
      b.addEventListener('pointerleave',function(){b.style.transform='';});
    });
    [].forEach.call(document.querySelectorAll('.sc,.plat,.imp'),function(c){
      c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--gx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');c.style.setProperty('--gy',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');});
    });
  }
  var tabs=[].slice.call(document.querySelectorAll('.xp-tab')),panes=[].slice.call(document.querySelectorAll('.xp-pane'));
  tabs.forEach(function(t,i){t.addEventListener('click',function(){tabs.forEach(function(x){x.classList.remove('on');});panes.forEach(function(p){p.classList.remove('on');});t.classList.add('on');if(panes[i])panes[i].classList.add('on');});});
})();

(function(){
  var isAR=(document.documentElement.lang||'ar').indexOf('ar')===0;
  var url='https://waleed.in'+location.pathname;
  var txt=isAR?'وليد الحربي - قيادي تنفيذي في التحوّل المؤسسي ومنصّات الأعمال المدعومة بالذكاء الاصطناعي':'Waleed Al Harbi - Executive Business Leader & Enterprise Transformation';
  var pop=document.getElementById('wa-share-pop');
  function open(){pop.classList.add('open');}
  function close(){pop.classList.remove('open');}
  var btn=document.getElementById('wa-share-btn'); if(btn) btn.onclick=open;
  document.getElementById('wsh-close').onclick=close;
  pop.addEventListener('click',function(e){if(e.target===pop)close();});
  document.getElementById('wsh-wa').onclick=function(){window.open('https://wa.me/?text='+encodeURIComponent(txt+' '+url),'_blank');};
  document.getElementById('wsh-tg').onclick=function(){window.open('https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(txt),'_blank');};
  document.getElementById('wsh-em').onclick=function(){window.location.href='mailto:?subject='+encodeURIComponent(txt)+'&body='+encodeURIComponent(url);};
  document.getElementById('wsh-cp').onclick=function(){if(navigator.clipboard){navigator.clipboard.writeText(url);} var b=document.getElementById('wsh-cp'); var old=b.innerHTML; b.style.borderColor='#25D366'; setTimeout(function(){b.style.borderColor='';},1200);};
})();

(function(){
  var frame=document.getElementById('cc-frame');
  if(!frame) return;
  var slides=frame.querySelectorAll('.cc-slide'), dots=frame.querySelectorAll('.cc-dot'), i=0;
  setInterval(function(){
    slides[i].classList.remove('active'); if(dots[i])dots[i].classList.remove('on');
    i=(i+1)%slides.length;
    slides[i].classList.add('active'); if(dots[i])dots[i].classList.add('on');
  },3000);
  // حماية: منع القائمة والسحب
  frame.addEventListener('contextmenu',function(e){e.preventDefault();return false;});
  frame.addEventListener('dragstart',function(e){e.preventDefault();return false;});
})();

/* solution cards -> detail modal (landing page) */
(function(){
  var mdl=document.getElementById('mdl'); if(!mdl) return;
  var body=mdl.querySelector('.mdl-c'), last=null;
  function open(card){
    var tpl=document.getElementById(card.getAttribute('data-detail'));
    if(!tpl) return;
    last=card;
    body.innerHTML='<button class="mdl-x" type="button" aria-label="Close">&#10005;</button>'+tpl.innerHTML;
    body.querySelector('.mdl-x').addEventListener('click',close);
    mdl.classList.add('on');
    document.body.style.overflow='hidden';
    body.setAttribute('tabindex','-1'); body.focus();
  }
  function close(){
    mdl.classList.remove('on');
    document.body.style.overflow='';
    if(last){last.focus();last=null;}
  }
  document.querySelectorAll('.sol-c').forEach(function(c){
    c.addEventListener('click',function(){open(c);});
  });
  mdl.querySelector('.mdl-bd').addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&mdl.classList.contains('on'))close();});
})();
