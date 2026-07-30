
(function(){
  "use strict";
  var EP = window.WALEED_ASSISTANT_ENDPOINT;
  var isAR = (document.documentElement.lang||"ar").indexOf("ar")===0;

  var fab=document.getElementById('wa-fab'),
      tag=document.getElementById('wa-tag'),
      overlay=document.getElementById('wa-overlay'),
      closeBtn=document.getElementById('wa-close'),
      msgsEl=document.getElementById('wa-msgs'),
      chipsEl=document.getElementById('wa-chips'),
      textEl=document.getElementById('wa-text'),
      sendBtn=document.getElementById('wa-send'),
      micBtn=document.getElementById('wa-mic'),
      voiceNote=document.getElementById('wa-voice-note'),
      headAva=document.getElementById('wa-head-ava');

  // صورة الهيدر = صورة البروفايل بالموقع
  var av=document.querySelector('.av'); if(av&&av.src) headAva.src=av.src;
  var history=[];
  var greeted=false;
  var L = isAR ? {
    greet:"هلا والله، حيّاك الله في موقع وليد الحربي! أنا مساعده الذكي، وأقدر أعرّفك على خبراته ومهاراته ومجالاته، ووش يقدر يقدّمه. وش تحب تعرف عنه؟",
    chips:["وش خبرات وليد؟","مجالاته التقنية","خبرته بالربط الحكومي","وش يقدر وليد يسويه؟","كيف أتواصل معه؟"],
    err:"عذرًا، صار خلل بسيط بالاتصال. جرّب مرة ثانية لو سمحت.",
    noEP:"المساعد ما تم ربطه بعد. لازم تضيف رابط الـ Worker.",
    listening:"أسمعك الحين... تكلّم",
    nospeech:"المتصفح ما يدعم التعرّف الصوتي. استخدم الكتابة لو سمحت.",
    speak:"استمع",
    tagHTML:'تعرّف على وليد أكثر <b>عبر مساعده الذكي</b> <span class="wa-x">✦</span>',
    hName:"مساعد وليد الذكي", hSub:"يعرف خبرات وليد ومجالاته",
    placeholder:"اسأل عن خبرات وليد ومجالاته...", micTitle:"تحدّث صوتيًا"
  } : {
    greet:"Hello and welcome to Waleed Al Harbi's site! I'm his AI assistant — I can tell you about his experience, skills, domains, and what he can do. What would you like to know?",
    chips:["What's Waleed's experience?","His tech domains","Government integration","What can Waleed do?","How to contact him?"],
    err:"Sorry, a connection issue occurred. Please try again.",
    noEP:"The assistant isn't connected yet. Add the Worker URL.",
    listening:"Listening... speak now",
    nospeech:"Your browser doesn't support voice input. Please type instead.",
    speak:"Listen",
    tagHTML:'Learn more about Waleed <b>via his AI assistant</b> <span class="wa-x">✦</span>',
    hName:"Waleed's AI Assistant", hSub:"Knows Waleed's experience & domains",
    placeholder:"Ask about Waleed's experience & domains...", micTitle:"Speak"
  };

  // طبّق نصوص اللغة
  tag.innerHTML=L.tagHTML;
  tag.setAttribute('aria-label', isAR?'افتح المساعد':'Open assistant');
  document.querySelector('#wa-head .wa-name').textContent=L.hName;
  document.querySelector('#wa-head .wa-sub').innerHTML='<span class="wa-dot"></span> '+L.hSub;
  textEl.setAttribute('placeholder',L.placeholder);
  micBtn.setAttribute('title',L.micTitle);
  micBtn.setAttribute('aria-label',L.micTitle);

  function openChat(){
    overlay.classList.add('open');
    document.body.style.overflow='hidden';
    document.getElementById('wa-fab-wrap').style.display='none';
    if(!greeted){ greeted=true; addBot(L.greet); renderChips(L.chips); }
    setTimeout(function(){textEl.focus();},300);
  }
  function closeChat(){
    overlay.classList.remove('open');
    document.body.style.overflow='';
    document.getElementById('wa-fab-wrap').style.display='flex';
    stopSpeak();
  }
  fab.onclick=openChat; tag.onclick=openChat; closeBtn.onclick=closeChat;
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&overlay.classList.contains('open')) closeChat(); });

  function scrollDown(){ msgsEl.scrollTop=msgsEl.scrollHeight; }
  function addBot(t){
    var d=document.createElement('div'); d.className='wa-bubble wa-bot'; d.textContent=t;
    var sp=document.createElement('button'); sp.className='wa-speakbtn';
    sp.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg>'+L.speak;
    sp.onclick=function(){ speak(t); };
    var wrap=document.createElement('div'); wrap.style.alignSelf='flex-start';wrap.style.display='flex';wrap.style.flexDirection='column';
    wrap.appendChild(d); wrap.appendChild(sp);
    msgsEl.appendChild(wrap); scrollDown();
  }
  function addUser(t){
    var d=document.createElement('div'); d.className='wa-bubble wa-user'; d.textContent=t;
    msgsEl.appendChild(d); scrollDown();
  }
  function renderChips(arr){
    chipsEl.innerHTML='';
    arr.forEach(function(c){
      var b=document.createElement('button'); b.className='wa-chip'; b.textContent=c;
      b.onclick=function(){ chipsEl.innerHTML=''; send(c); };
      chipsEl.appendChild(b);
    });
  }
  function showTyping(){
    var d=document.createElement('div'); d.className='wa-typing'; d.id='wa-typing';
    d.innerHTML='<span></span><span></span><span></span>';
    msgsEl.appendChild(d); scrollDown(); return d;
  }
  function hideTyping(){ var t=document.getElementById('wa-typing'); if(t) t.remove(); }

  function autosize(){ textEl.style.height='auto'; textEl.style.height=Math.min(textEl.scrollHeight,120)+'px'; }
  textEl.addEventListener('input',function(){ autosize(); sendBtn.disabled=!textEl.value.trim(); });
  textEl.addEventListener('keydown',function(e){ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); if(textEl.value.trim()) send(textEl.value.trim()); }});
  sendBtn.onclick=function(){ if(textEl.value.trim()) send(textEl.value.trim()); };

  function send(text){
    chipsEl.innerHTML='';
    addUser(text);
    history.push({role:'user',content:text});
    textEl.value=''; autosize(); sendBtn.disabled=true;
    if(!EP || EP.indexOf('REPLACE')>-1){ addBot(L.noEP); return; }
    var typing=showTyping();
    fetch(EP,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history})})
      .then(function(r){ return r.json().then(function(j){return{ok:r.ok,status:r.status,j:j};}); })
      .then(function(res){
        hideTyping();
        if(res.j&&res.j.reply){ history.push({role:'assistant',content:res.j.reply}); addBot(res.j.reply); return; }
        var detail = res.j&&(res.j.detail||res.j.error) ? (' ('+(res.j.error||'')+(res.j.detail?': '+res.j.detail:'')+')') : (' ['+res.status+']');
        addBot(L.err+detail);
      })
      .catch(function(e){ hideTyping(); addBot(L.err+' ('+(e&&e.message?e.message:'network')+')'); });
  }

  /* ===== الإدخال الصوتي (Speech-to-Text) ===== */
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition, rec=null, recording=false;
  if(SR){
    rec=new SR(); rec.lang=isAR?'ar-SA':'en-US'; rec.interimResults=true; rec.continuous=false;
    var finalTxt='';
    rec.onstart=function(){ recording=true; micBtn.classList.add('rec'); voiceNote.textContent=L.listening; finalTxt=''; };
    rec.onresult=function(e){
      var interim='';
      for(var i=e.resultIndex;i<e.results.length;i++){
        if(e.results[i].isFinal) finalTxt+=e.results[i][0].transcript;
        else interim+=e.results[i][0].transcript;
      }
      textEl.value=finalTxt+interim; autosize(); sendBtn.disabled=!textEl.value.trim();
    };
    rec.onerror=function(){ stopRec(); };
    rec.onend=function(){ stopRec(); if(textEl.value.trim()) send(textEl.value.trim()); };
  }
  function startRec(){ if(!rec){ voiceNote.textContent=L.nospeech; return;} try{ stopSpeak(); rec.start(); }catch(e){} }
  function stopRec(){ recording=false; micBtn.classList.remove('rec'); voiceNote.textContent=''; }
  micBtn.onclick=function(){ if(!rec){ voiceNote.textContent=L.nospeech; return;} if(recording){ rec.stop(); } else { startRec(); } };

  /* ===== النطق الصوتي (Text-to-Speech) بلهجة عربية ===== */
  var synth=window.speechSynthesis;
  function speak(t){
    if(!synth){ return; }
    stopSpeak();
    var u=new SpeechSynthesisUtterance(t);
    u.lang=isAR?'ar-SA':'en-US'; u.rate=isAR?0.98:1; u.pitch=1;
    var vs=synth.getVoices();
    var arv=vs.filter(function(v){return v.lang&&v.lang.indexOf('ar')===0;});
    if(isAR&&arv.length){ var sa=arv.find(function(v){return v.lang==='ar-SA';}); u.voice=sa||arv[0]; }
    synth.speak(u);
  }
  function stopSpeak(){ if(synth&&synth.speaking) synth.cancel(); }
  if(synth){ synth.onvoiceschanged=function(){}; }
})();
