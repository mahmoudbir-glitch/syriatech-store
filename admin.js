const $=s=>document.querySelector(s);let state={overrides:{},additions:[],deleted:[]},editing=null;
async function api(action,options={}){const r=await fetch("/api/admin?action="+action,options);const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"حدث خطأ");return d}
async function load(){const r=await fetch("/api/products?x="+Date.now());state=await r.json();state.overrides||={};state.additions||=[];state.deleted||=[]}
function merged(){return (state.additions||[]).concat(Object.values(state.overrides||{}))}
function esc(v){return String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function render(){const q=($("#filter").value||"").toLowerCase();const rows=merged().filter(p=>!q||String(p.name).toLowerCase().includes(q));$("#products").innerHTML=rows.map(p=>'<div class="item"><img src="'+(p.image||"assets/product-accessories.svg")+'"><div><strong>'+esc(p.name)+'</strong><small>$'+Number(p.price||0).toFixed(2)+' · '+esc(p.category||"")+'</small></div><div><button onclick="editProduct('+Number(p.id)+')">تعديل</button><button class="danger" onclick="deleteProduct('+Number(p.id)+')">حذف</button></div></div>').join("")||"<p>لا توجد منتجات مضافة من لوحة التحكم.</p>"}
function reset(){editing=null;$("#productForm").reset();$("#brand").value="Anker";$("#formTitle").textContent="إضافة منتج";$("#preview").hidden=true}
function fill(p){editing=p;$("#name").value=p.name||"";$("#description").value=p.description||"";$("#price").value=p.price??"";$("#oldPrice").value=p.oldPrice??"";$("#category").value=p.category||"accessories";$("#brand").value=p.brand||"Anker";$("#image").value=p.image||"";$("#preview").src=p.image||"";$("#preview").hidden=!p.image;$("#formTitle").textContent="تعديل المنتج"}
window.editProduct=id=>{const p=merged().find(x=>Number(x.id)===Number(id));if(p)fill(p)}
window.deleteProduct=async id=>{if(!confirm("حذف المنتج؟"))return;try{await api("delete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});await load();render()}catch(e){alert(e.message)}}
$("#loginBtn").onclick=async()=>{try{await api("login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:$("#password").value})});$("#loginView").hidden=true;$("#adminView").hidden=false;await load();render()}catch(e){$("#loginMsg").textContent=e.message}}
$("#logoutBtn").onclick=async()=>{await api("logout",{method:"POST"});location.reload()}
$("#uploadBtn").onclick=async()=>{
  const f=$("#imageFile").files[0];
  if(!f)return alert("اختر صورة");
  if(!f.type.startsWith("image/"))return alert("اختر ملف صورة");
  try{
    $("#uploadBtn").disabled=true;
    $("#saveMsg").textContent="جاري إنشاء رابط الرفع الآمن...";
    const token=await api("upload",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:f.name,type:f.type})});
    $("#saveMsg").textContent="جاري رفع الصورة مباشرة إلى Vercel Blob...";
    const put=await fetch(token.presignedUrl,{method:"PUT",body:f,headers:{"Content-Type":f.type}});
    if(!put.ok){const msg=await put.text().catch(()=>"");throw new Error("Vercel Blob رفض الرفع ("+put.status+") "+msg.slice(0,180))}
    $("#saveMsg").textContent="تم رفع الملف، جاري تثبيت الرابط...";
    let resolved=null;
    for(let i=0;i<8;i++){
      try{const d=await api("resolve&pathname="+encodeURIComponent(token.pathname),{method:"GET"});if(d.url){resolved=d.url;break}}catch(e){}
      await new Promise(r=>setTimeout(r,700));
    }
    if(!resolved)throw new Error("تم رفع الصورة لكن تعذر الحصول على رابطها");
    $("#image").value=resolved;$("#preview").src=resolved;$("#preview").hidden=false;
    $("#saveMsg").textContent="تم رفع الصورة إلى Vercel Blob بنجاح";
  }catch(e){$("#saveMsg").textContent="فشل رفع الصورة: "+(e.message||"خطأ غير معروف")}
  finally{$("#uploadBtn").disabled=false}
};
$("#productForm").onsubmit=async e=>{e.preventDefault();const p={id:editing?Number(editing.id):Date.now(),name:$("#name").value.trim(),description:$("#description").value.trim(),price:Number($("#price").value),oldPrice:Number($("#oldPrice").value||$("#price").value),category:$("#category").value,brand:$("#brand").value.trim()||"Anker",image:$("#image").value.trim(),badge:"NEW"};try{await api("save",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:editing?"edit":"add",product:p})});$("#saveMsg").textContent="تم حفظ المنتج";reset();await load();render()}catch(e){$("#saveMsg").textContent=e.message}}
$("#resetBtn").onclick=reset;$("#filter").oninput=render;