'use strict';
const $ = id => document.getElementById(id);
const palette={red:'#c8352f',amber:'#ce8127',green:'#2e9a60'};
const defaults={mode:'analog',color:'red',bright:55,dim:40,wake:true,seconds:false,showWeather:true};
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
  const analog=state.mode==='analog';document.body.classList.toggle('numeric-mode',!analog);$('dial').style.display=analog?'block':'none';$('digital').style.display=analog?'none':'flex';
  $('analog').classList.toggle('active',analog);$('numeric').classList.toggle('active',!analog);
  document.documentElement.style.setProperty('--color',palette[state.color]||palette.red);
  document.documentElement.style.setProperty('--bright',Math.max(.05,Number(state.bright)/100));
  document.documentElement.style.setProperty('--dim',Math.min(.95,Number(state.dim)/100));
  $('bright').value=state.bright;$('dim').value=state.dim;$('wake').checked=state.wake;$('seconds').checked=state.seconds;$('showWeather').checked=state.showWeather;$('weather').style.display=state.showWeather?'':'none';
  $('secondHand').style.display=state.seconds?'':'none';
  document.querySelectorAll('.swatch').forEach(el=>el.classList.toggle('active',el.dataset.color===state.color));store();
}
function clock(){
  const d=new Date(),s=d.getSeconds()+d.getMilliseconds()/1000,m=d.getMinutes()+s/60,h=d.getHours()%12+m/60;
  $('hourHand').setAttribute('transform',`rotate(${h*30} 200 200)`);
  $('minuteHand').setAttribute('transform',`rotate(${m*6} 200 200)`);
  $('secondHand').setAttribute('transform',`rotate(${s*6} 200 200)`);
  const hh=String(d.getHours()).padStart(2,'0'),mm=String(d.getMinutes()).padStart(2,'0');
  const updateFlip=(id,card,value)=>{const el=$(id);if(el.textContent!==value){el.textContent=value;const panel=$(card);panel.classList.remove('changed');void panel.offsetWidth;panel.classList.add('changed')}};
  updateFlip('flipHours','hourCard',hh);
  updateFlip('flipMinutes','minuteCard',mm);
  $('digital').setAttribute('aria-label',hh+' heures '+mm);
  $('date').textContent=d.toLocaleDateString('fr-CA',{weekday:'long',day:'numeric',month:'long'});
}
clock();setInterval(clock,1000);
let panelTimer;
function showControls(show){$('panel').classList.toggle('hidden',!show);$('top').classList.toggle('hidden',!show);clearTimeout(panelTimer);if(show)panelTimer=setTimeout(()=>showControls(false),16000)}
$('clockArea').addEventListener('click',()=>showControls($('panel').classList.contains('hidden')));
$('hide').addEventListener('click',()=>showControls(false));
$('panel').addEventListener('pointerdown',()=>clearTimeout(panelTimer));
$('panel').addEventListener('pointerup',()=>{clearTimeout(panelTimer);panelTimer=setTimeout(()=>showControls(false),16000)});
$('analog').addEventListener('click',()=>{state.mode='analog';render()});
$('numeric').addEventListener('click',()=>{state.mode='numeric';render()});
document.querySelectorAll('.swatch').forEach(el=>el.addEventListener('click',()=>{state.color=el.dataset.color;render()}));
['bright','dim'].forEach(id=>$(id).addEventListener('input',e=>{state[id]=Number(e.target.value);render()}));
$('seconds').addEventListener('change',e=>{state.seconds=e.target.checked;render()});
$('showWeather').addEventListener('change',e=>{state.showWeather=e.target.checked;render();if(state.showWeather)updateWeather(true)});
let weatherLast=0,weatherBusy=false;
const weatherButton=$('weather');
const weatherIcons=code=>code===0?'☀':code<=3?'☁':code===45||code===48?'≋':code>=51&&code<=67?'☂':code>=71&&code<=86?'❄':code>=95?'⚡':'☁';
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
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,weather_code&temperature_unit=celsius&timezone=auto`;
    const response=await fetch(url,{cache:'no-store'});
    if(!response.ok)throw new Error('Météo indisponible');
    const data=await response.json(),temp=data.current?.temperature_2m,code=data.current?.weather_code;
    if(typeof temp!=='number')throw new Error('Température indisponible');
    weatherButton.textContent=`${weatherIcons(code)} ${Math.round(temp)}°C`;
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
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')acquireWake()});
window.addEventListener('pageshow',()=>acquireWake());
document.addEventListener('pointerdown',()=>{if(state.wake && !wakeLock)acquireWake()},{passive:true});
render();acquireWake();showControls(true);
updateWeather();
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
