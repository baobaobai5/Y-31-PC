const p=new URLSearchParams(location.search),mode=p.get('mode'),manualCapture=p.get('captureId');
p.delete('mode');p.delete('captureId');history.replaceState(null,'','/aggregation?'+p+location.hash);
await import('../src/main.jsx');
function applyState(){
 const root=document.querySelector('.aggregation-page');
 if(!root){setTimeout(applyState,100);return}
 if(mode==='expanded'||mode==='expanded-all') {root.querySelector('.aggregation-words+ .aggregation-more button')?.click();root.querySelector('.aggregation-load-more')?.click()}
 if(mode==='expanded-only') root.querySelector('.aggregation-words+ .aggregation-more button')?.click();
 if(mode==='loaded') root.querySelector('.aggregation-load-more')?.click();
 if(['长视频','短视频','漫画','帖子'].includes(mode)) [...root.querySelectorAll('.aggregation-content-filters button')].find(b=>b.textContent===mode)?.click();
 function submit(){if(manualCapture) setTimeout(()=>window.figma.captureForDesign({captureId:manualCapture,endpoint:`https://mcp.figma.com/mcp/capture/${manualCapture}/submit?bindVariables=true`,selector:'body'}),1200)}
 if(mode==='expanded-all'){
  function loadRemaining(){const more=root.querySelector('.aggregation-load-more');if(more&&!more.disabled){more.click();setTimeout(loadRemaining,200)}else submit()}
  setTimeout(loadRemaining,200);
 }else submit();
}
setTimeout(applyState,500);
