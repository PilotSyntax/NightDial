'use strict';
const $ = id => document.getElementById(id);
const palette={red:'#c8352f',amber:'#ce8127',green:'#2e9a60',blue:'#4a82eb',violet:'#ad78df',cyan:'#35bdc5',pink:'#db6399',white:'#e8e8ee'};
const flipThemes={
red:['#422326','#573134','#221416','#ffd7d4','#88464a','#b74c53'],
amber:['#453020','#5b4028','#211710','#ffe1ab','#8b6746','#bb8545'],
green:['#1c372d','#294a3a','#112019','#d1ffe7','#407b60','#44b780'],
blue:['#1d2a48','#293b61','#101728','#d8e5ff','#46639d','#5283de'],
violet:['#382544','#473152','#1c1524','#f0d9ff','#6c4b7c','#ad78df'],
cyan:['#17373b','#245158','#102124','#d2fbff','#3b7b82','#40aeb9'],
pink:['#452536','#60314b','#21131d','#ffe0ef','#965270','#dc689e'],
white:['#33343c','#494a55','#1b1c22','#f2f2f7','#787a8a','#a5a7bb']
};
const defaults={mode:'analog',color:'red',bright:55,dim:40,wake:true,seconds:false,showWeather:true,smartNight:true,nightStart:'22:00',nightEnd:'07:00',nightDim:75,nightMinimal:false,flipPro:true,oledShift:true,sunrise:false,wakeTime:'07:00',sunriseDuration:30};
let saved={};try{saved=JSON.parse(localStorage.getItem('nightdial-v1')||'{}')||{}}catch{}
const state={...defaults,...saved};
const svgNS='http://www.w3.org/2000/svg';
for(let i=0;i<60;i++){
  const a=i*Math.PI/30-Math.PI/2,major=i%5===0;
  const line=document.createElementNS(svgNS,'line');
  const r1=major?174:182,r2=190;
  Object.entries({x1:200+r1*Math.cos(a),y1:200+r1*Math.sin(a),x2:200+r2*Math.cos(a),y2:200+r2*Math.sin(a)}).forEach(([k,v])=>line.setAttribute(k,v));
  if(major)line.setAttribute('class','major');$('ticks').append(line);
}
for(let i=1;i<=12;i++){
  const a=i*Math.PI/6-Math.PI/2,t=document.createElementNS(svgNS,'text');
  t.setAttribute('x',200+151*Math.cos(a));t.setAttribute('y',200+151*Math.sin(a));t.textContent=i;$('numbers').append(t);
}
const store=()=>{try{localStorage.setItem('nightdial-v1',JSON.stringify(state))}catch{}};
const notify=msg=>{$('notice').textContent=msg;$('notice').classList.add('visible');clearTimeout(notify.timeout);notify.timeout=setTimeout(()=>$('notice').classList.remove('visible'),4500)};
function render(){
  const mode=['analog','numeric','flip'].includes(state.mode)?state.mode:'analog';
  document.body.classList.toggle('numeric-mode',mode==='numeric');
  document.body.classList.toggle('flip-mode',mode==='flip');
  $('dial').style.display=mode==='analog'?'block':'none';
  $('classicDigital').style.display=mode==='numeric'?'block':'none';
  $('digital').style.display=mode==='flip'?'flex':'none';
  $('analog').classList.toggle('active',mode==='analog');
  $('numeric').classList.toggle('active',mode==='numeric');
  $('flip').classList.toggle('active',mode==='flip');
  const color=palette[state.color]?state.color:'red';
  document.documentElement.style.setProperty('--color',palette[color]);
  const flip=flipThemes[color];
  ['--flip-top','--flip-mid','--flip-bottom','--flip-foreground','--flip-border','--flip-glow'].forEach((name,i)=>document.documentElement.style.setProperty(name,flip[i]));
  // Night and sunrise apply visual settings without overwriting saved daytime preferences.
  updateAdaptiveDisplay();
  $('bright').value=state.bright;$('dim').value=state.dim;$('wake').checked=state.wake;$('seconds').checked=state.seconds;$('showWeather').checked=state.showWeather;$('weather').style.display=state.showWeather?'':'none';
  $('secondHand').style.display=state.seconds?'':'none';
  for(const id of ['smartNight','nightMinimal','flipPro','oledShift','sunrise'])$(id).checked=Boolean(state[id]);
  for(const id of ['nightStart','nightEnd','wakeTime'])$(id).value=state[id];
  $('nightDim').value=state.nightDim;
  $('sunriseDuration').value=String(state.sunriseDuration);
  document.querySelectorAll('.swatch').forEach(el=>el.classList.toggle('active',el.dataset.color===state.color));
  store();
}


/* v14: clock-local time schedules, CSS-only dimming, and infrequent pixel shifting.
   No hardware screen brightness changes or background alarm guarantees. */
const minuteOfDay=value=>{
  const match=/^(\d{2}):(\d{2})$/.exec(value||'');
  if(!match)return null;
  const h=Number(match[1]),m=Number(match[2]);
  return h<24&&m<60?h*60+m:null;
};
const isInSchedule=(minute,start,end)=>{
  if(start===null||end===null||start===end)return false;
  return start<end?minute>=start&&minute<end:minute>=start||minute<end;
};
const clamp=(number,min,max)=>Math.max(min,Math.min(max,number));
let nightActive=false;
let lastShiftStep=-1;
let lastAdaptiveMinute=-1;
let sunriseIntensity=0;
let sunrisePreviewUntil=0;
function updateAdaptiveDisplay(now=new Date()){
  const minute=now.getHours()*60+now.getMinutes();
  const start=minuteOfDay(state.nightStart),end=minuteOfDay(state.nightEnd);
  nightActive=Boolean(state.smartNight)&&isInSchedule(minute,start,end);
  const savedDim=clamp(Number(state.dim)||0,0,95)/100;
  const nightDim=clamp(Number(state.nightDim)||75,25,95)/100;
  let dim=nightActive?Math.max(savedDim,nightDim):savedDim;
  sunriseIntensity=0;
  const wake=minuteOfDay(state.wakeTime);
  const duration=clamp(Number(state.sunriseDuration)||30,15,60);
  if(state.sunrise&&wake!==null){
    const minutesBefore=(wake-minute+1440)%1440;
    // Begin only inside the configured lead-up, and hold briefly after the target time.
    const elapsed=(minute-wake+1440)%1440;
    if(minutesBefore<=duration){
      sunriseIntensity=1-minutesBefore/duration;
    }else if(elapsed<=10){
      sunriseIntensity=1;
    }
    if(sunriseIntensity>0){
      // Smoothly lessen visual attenuation; never modify system brightness.
      dim=dim*(1-sunriseIntensity)+Math.min(savedDim,.12)*sunriseIntensity;
    }
  }
  if(Date.now()<sunrisePreviewUntil){
    sunriseIntensity=1;
    dim=Math.min(savedDim,.12);
  }
  document.documentElement.style.setProperty('--bright',clamp(Number(state.bright)/100,.05,1).toFixed(3));
  document.documentElement.style.setProperty('--dim',clamp(dim,0,.95).toFixed(3));
  document.documentElement.style.setProperty('--sunrise-strength',(sunriseIntensity*.85).toFixed(3));
  const minimal=nightActive&&Boolean(state.nightMinimal)&&$('panel').classList.contains('hidden')&&sunriseIntensity===0;
  document.body.classList.toggle('night-minimal',minimal);
  const status=nightActive?'Nuit active':'Mode jour';
  $('nightStatus').textContent=status+(sunriseIntensity>0?' • lever de soleil visuel '+Math.round(sunriseIntensity*100)+' %':'')+'. NightDial doit rester visible pour fonctionner.';
  const shiftStep=state.oledShift&&document.visibilityState==='visible'?Math.floor(now.getTime()/120000):-1;
  if(shiftStep!==lastShiftStep){
    lastShiftStep=shiftStep;
    const positions=[[0,0],[2,-2],[-2,1],[1,2],[-1,-2],[-2,-1],[2,1]];
    const [x,y]=shiftStep<0?[0,0]:positions[shiftStep%positions.length];
    document.documentElement.style.setProperty('--oled-x',x+'px');
    document.documentElement.style.setProperty('--oled-y',y+'px');
  }
  lastAdaptiveMinute=minute;
}

const segmentMap={
'0':[0,1,2,3,4,5],'1':[1,2],'2':[0,1,6,4,3],
'3':[0,1,6,2,3],'4':[5,6,1,2],'5':[0,5,6,2,3],
'6':[0,5,6,4,2,3],'7':[0,1,2],'8':[0,1,2,3,4,5,6],
'9':[0,1,2,3,5,6]
};
const polygons=[
'25,9 126,9 139,22 123,36 28,36 12,23',
'139,28 151,41 151,126 136,143 123,126 123,44',
'139,151 151,168 151,247 139,262 123,247 123,169',
'28,258 123,258 139,273 125,285 24,285 12,273',
'12,151 28,169 28,247 12,262 0,247 0,169',
'12,28 28,44 28,126 12,143 0,126 0,42',
'27,137 124,137 137,150 123,164 28,164 13,150'
];
const alarmGroup=$('segmentDigits');
const segmentElements=[];
for(let digitIndex=0;digitIndex<4;digitIndex++){
  const x=[7,204,462,659][digitIndex];
  const group=document.createElementNS(svgNS,'g');
  group.setAttribute('transform','translate('+x+',0) scale(.91,1)');
  const parts=[];
  for(let i=0;i<7;i++){
    const polygon=document.createElementNS(svgNS,'polygon');
    polygon.setAttribute('points',polygons[i]);
    polygon.setAttribute('class','off');
    group.append(polygon);
    parts.push(polygon);
  }
  alarmGroup.append(group);
  segmentElements.push(parts);
}
for(const y of [95,203]){
  const dot=document.createElementNS(svgNS,'circle');
  dot.setAttribute('cx','419');dot.setAttribute('cy',String(y));
  dot.setAttribute('r','13');dot.setAttribute('class','lit');
  alarmGroup.append(dot);
}
let lastAlarmText='';
function renderAlarmDigits(value){
  if(value===lastAlarmText)return;
  const animate=lastAlarmText!==''&&state.mode==='flip'&&state.flipPro&&document.visibilityState==='visible'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  lastAlarmText=value;
  for(let digit=0;digit<4;digit++){
    const on=segmentMap[value[digit]]||[];
    for(let seg=0;seg<7;seg++)segmentElements[digit][seg].setAttribute('class',on.includes(seg)?'lit':'off');
  }
  if(animate){
    const face=$('alarmSvg');
    face.classList.remove('minute-flip');
    void face.offsetWidth;
    face.classList.add('minute-flip');
  }
}

function clock(){
  const d=new Date(),s=d.getSeconds()+d.getMilliseconds()/1000,m=d.getMinutes()+s/60,h=d.getHours()%12+m/60;
  $('hourHand').setAttribute('transform',`rotate(${h*30} 200 200)`);
  $('minuteHand').setAttribute('transform',`rotate(${m*6} 200 200)`);
  $('secondHand').setAttribute('transform',`rotate(${s*6} 200 200)`);
  const hh=String(d.getHours()).padStart(2,'0'),mm=String(d.getMinutes()).padStart(2,'0');
  renderAlarmDigits(hh+mm);
  $('alarmMeridiem').textContent=d.getHours()<12?'AM':'PM';
  $('classicDigital').textContent=hh+':'+mm;
  $('digital').setAttribute('aria-label',hh+' heures '+mm);
  $('date').textContent=d.toLocaleDateString('fr-CA',{weekday:'long',day:'numeric',month:'long'});
  // One adaptive refresh per minute is enough for night schedule and sunrise.
  if(lastAdaptiveMinute!==d.getHours()*60+d.getMinutes())updateAdaptiveDisplay(d);
}
let clockTimer;
function scheduleClock(){
  clearTimeout(clockTimer);
  // Align updates with the next minute when the seconds hand is hidden.
  const delay=state.seconds?1000:60000-Date.now()%60000+30;
  clockTimer=setTimeout(()=>{clock();scheduleClock()},delay);
}
function startClockTimer(){
  clearTimeout(clockTimer);
  clock();
  scheduleClock();
}
startClockTimer();
setInterval(()=>{if(document.visibilityState==='visible')updateAdaptiveDisplay()},60000);
let panelTimer;
function showControls(show){$('panel').classList.toggle('hidden',!show);$('top').classList.toggle('hidden',!show);clearTimeout(panelTimer);if(show)panelTimer=setTimeout(()=>showControls(false),16000);updateAdaptiveDisplay()}
// Horizontal swipe navigation: analog → numeric → flip → analog.
// A real swipe must not be mistaken for the tap that opens settings.
const clockModes=['analog','numeric','flip'];
let gestureStart=null;
let suppressClockTapUntil=0;
function switchClockMode(direction){
  const currentIndex=Math.max(0,clockModes.indexOf(state.mode));
  state.mode=clockModes[(currentIndex+direction+clockModes.length)%clockModes.length];
  render(); // render() also persists the selected mode
  showControls(false);
}
$('clockArea').addEventListener('touchstart',event=>{
  if(event.touches.length!==1||event.target.closest('button')){gestureStart=null;return}
  const touch=event.touches[0];
  gestureStart={x:touch.clientX,y:touch.clientY,id:touch.identifier};
},{passive:true});
$('clockArea').addEventListener('touchend',event=>{
  if(!gestureStart)return;
  const start=gestureStart;gestureStart=null;
  const touch=Array.from(event.changedTouches).find(t=>t.identifier===start.id);
  if(!touch)return;
  const dx=touch.clientX-start.x;
  const dy=touch.clientY-start.y;
  if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.35)return;
  // iOS dispatches a synthetic click after touchend; suppress that click only.
  suppressClockTapUntil=Date.now()+650;
  switchClockMode(dx<0?1:-1);
},{passive:true});
$('clockArea').addEventListener('touchcancel',()=>{gestureStart=null},{passive:true});
$('clockArea').addEventListener('click',event=>{
  if(Date.now()<suppressClockTapUntil){
    suppressClockTapUntil=0;
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  showControls($('panel').classList.contains('hidden'));
});
$('hide').addEventListener('click',()=>showControls(false));
$('panel').addEventListener('pointerdown',()=>clearTimeout(panelTimer));
$('panel').addEventListener('pointerup',()=>{clearTimeout(panelTimer);panelTimer=setTimeout(()=>showControls(false),16000)});
$('analog').addEventListener('click',()=>{state.mode='analog';render()});
$('numeric').addEventListener('click',()=>{state.mode='numeric';render()});
$('flip').addEventListener('click',()=>{state.mode='flip';render()});
document.querySelectorAll('.swatch').forEach(el=>el.addEventListener('click',()=>{state.color=el.dataset.color;render()}));
['bright','dim'].forEach(id=>$(id).addEventListener('input',e=>{state[id]=Number(e.target.value);render()}));
$('seconds').addEventListener('change',e=>{state.seconds=e.target.checked;render();startClockTimer()});
for(const id of ['smartNight','nightMinimal','flipPro','oledShift','sunrise']){
  $(id).addEventListener('change',e=>{state[id]=e.target.checked;render()});
}
for(const id of ['nightStart','nightEnd','wakeTime','sunriseDuration']){
  $(id).addEventListener('change',e=>{state[id]=id==='sunriseDuration'?Number(e.target.value):e.target.value;render()});
}
$('nightDim').addEventListener('input',e=>{state.nightDim=Number(e.target.value);render()});
$('sunrisePreview').addEventListener('click',()=>{
  sunrisePreviewUntil=Date.now()+8000;
  updateAdaptiveDisplay();
  setTimeout(()=>updateAdaptiveDisplay(),8100);
});
$('showWeather').addEventListener('change',e=>{state.showWeather=e.target.checked;render();if(state.showWeather)updateWeather(true)});
let weatherLast=0,weatherBusy=false;
const weatherButton=$('weather');
const weatherIcons=(code,isDay)=>{
  if(code===0)return isDay?'☀':'☾';
  if(code===1)return isDay?'🌤':'☾';
  if(code===2)return isDay?'⛅':'☁';
  if(code===3)return '☁';
  if(code===45||code===48)return '≋';
  if(code>=51&&code<=67)return '☂';
  if(code>=71&&code<=86)return '❄';
  if(code>=95)return '⚡';
  return '☁';
};
const locationPosition=()=>new Promise((resolve,reject)=>{
  if(!navigator.geolocation){reject(new Error('Localisation indisponible'));return}
  navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:false,timeout:12000,maximumAge:600000});
});
async function updateWeather(force=false){
  if(!state.showWeather||weatherBusy||(!force && Date.now()-weatherLast<15*60*1000))return;
  if(!navigator.onLine){weatherButton.title='Hors ligne : météo non actualisée';return}
  weatherBusy=true;weatherButton.textContent='◌ …°C';
  try{
    const pos=await locationPosition();
    const lat=pos.coords.latitude,lon=pos.coords.longitude;
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,weather_code,is_day&temperature_unit=celsius&timezone=auto`;
    const response=await fetch(url,{cache:'no-store'});
    if(!response.ok)throw new Error('Météo indisponible');
    const data=await response.json(),temp=data.current?.temperature_2m,code=data.current?.weather_code;
    if(typeof temp!=='number')throw new Error('Température indisponible');
    weatherButton.textContent=`${weatherIcons(code,data.current?.is_day===1)} ${Math.round(temp)}°C`;
    weatherButton.title='Température extérieure actuelle (Open-Meteo) • toucher pour actualiser';
    weatherLast=Date.now();
  }catch(error){
    weatherButton.textContent='☁ --°C';
    weatherButton.title='Touchez pour autoriser la localisation et récupérer la météo';
    if(force)notify('Impossible d’obtenir la température. Autorise la localisation du site dans Safari et vérifie la connexion Internet.');
  }finally{weatherBusy=false}
}
weatherButton.addEventListener('click',e=>{e.stopPropagation();updateWeather(true)});
setInterval(()=>updateWeather(),15*60*1000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')updateWeather()});
let wakeLock=null;
const wakeStatus=(message)=>{$('wakeStatus').textContent=message};
async function releaseWake(){if(wakeLock){try{await wakeLock.release()}catch{}wakeLock=null}wakeStatus('Maintien écran : désactivé')}
async function acquireWake(){
  if(!state.wake){await releaseWake();return}
  if(document.visibilityState!=='visible')return;
  if(!('wakeLock' in navigator)){wakeStatus('Maintien écran : non pris en charge');return}
  try{
    if(wakeLock && !wakeLock.released)return;
    wakeLock=await navigator.wakeLock.request('screen');
    wakeStatus('Maintien écran : actif');
    wakeLock.addEventListener('release',()=>{wakeLock=null;wakeStatus('Maintien écran : interrompu')},{once:true});
  }catch(error){wakeStatus('Maintien écran : indisponible');notify('iOS ne permet pas actuellement de maintenir l’écran éveillé. Vérifier le mode économie d’énergie ou les réglages de verrouillage automatique.')}
}
$('wake').addEventListener('change',async e=>{state.wake=e.target.checked;render();if(state.wake)await acquireWake();else await releaseWake()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){acquireWake();clock();updateAdaptiveDisplay()}else updateAdaptiveDisplay()});
window.addEventListener('pageshow',()=>acquireWake());
document.addEventListener('pointerdown',()=>{if(state.wake && !wakeLock)acquireWake()},{passive:true});
render();acquireWake();showControls(true);
updateWeather();
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
