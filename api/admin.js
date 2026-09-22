import crypto from "crypto";
import { get, put } from "@vercel/blob";
const COOKIE="syriatech_admin"; const EMPTY={overrides:{},additions:[],deleted:[]};
const secret=()=>process.env.ADMIN_SECRET||"";
const sign=v=>crypto.createHmac("sha256",secret()).update(v).digest("hex");
const token=()=>Buffer.from("admin").toString("base64url")+"."+sign("admin");
function authed(req){const c=(req.headers.cookie||"").split(";").map(x=>x.trim()).find(x=>x.startsWith(COOKIE+"="));return !!secret()&&!!process.env.ADMIN_PASSWORD&&!!c&&c.slice(COOKIE.length+1)===token();}
async function readState(){try{const b=await get("data/store-state.json",{access:"public",useCache:false});if(!b)return structuredClone(EMPTY);return {...EMPTY,...JSON.parse(await new Response(b.stream).text())};}catch{return structuredClone(EMPTY);}}
async function writeState(s){await put("data/store-state.json",JSON.stringify(s),{access:"public",addRandomSuffix:false,allowOverwrite:true,contentType:"application/json"});}
const fail=(res,c,m)=>res.status(c).json({ok:false,error:m});
export default async function handler(req,res){
 try{
  const action=(req.query&&req.query.action)||"";
  if(req.method==="POST"&&action==="login"){
   const body=typeof req.body==="string"?JSON.parse(req.body||"{}"):(req.body||{});
   if(!process.env.ADMIN_PASSWORD||!process.env.ADMIN_SECRET)return fail(res,500,"Admin environment variables are missing");
   if(String(body.password||"")!==String(process.env.ADMIN_PASSWORD))return fail(res,401,"Invalid password");
   res.setHeader("Set-Cookie",`${COOKIE}=${token()}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`);
   return res.status(200).json({ok:true});
  }
  if(req.method==="POST"&&action==="logout"){res.setHeader("Set-Cookie",`${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);return res.status(200).json({ok:true});}
  if(!authed(req))return fail(res,401,"Unauthorized");
  if(req.method==="GET"&&action==="state")return res.status(200).json(await readState());
  if(req.method==="POST"&&action==="save"){
   const body=typeof req.body==="string"?JSON.parse(req.body||"{}"):(req.body||{}); const p=body.product;
   if(!p||!p.id||!p.name)return fail(res,400,"Product id and name are required");
   p.id=Number(p.id);p.price=Number(p.price||0);p.oldPrice=Number(p.oldPrice||p.price);
   const s=await readState();
   if(body.mode==="add"){s.additions=s.additions.filter(x=>Number(x.id)!==p.id);s.additions.push(p);delete s.overrides[String(p.id)];s.deleted=s.deleted.filter(x=>Number(x)!==p.id);}
   else{s.overrides[String(p.id)]=p;s.deleted=s.deleted.filter(x=>Number(x)!==p.id);}
   await writeState(s);return res.status(200).json({ok:true,state:s});
  }
  if(req.method==="POST"&&action==="delete"){
   const body=typeof req.body==="string"?JSON.parse(req.body||"{}"):(req.body||{});const id=Number(body.id);if(!id)return fail(res,400,"Product id required");
   const s=await readState();s.additions=s.additions.filter(x=>Number(x.id)!==id);delete s.overrides[String(id)];if(!s.deleted.includes(id))s.deleted.push(id);await writeState(s);return res.status(200).json({ok:true,state:s});
  }
  if(req.method==="POST"&&action==="upload"){
   const body=typeof req.body==="string"?JSON.parse(req.body||"{}"):(req.body||{});
   const name=String(body.name||"product.jpg");
   const type=String(body.type||"image/jpeg");
   const data=String(body.data||"");
   if(!data)return fail(res,400,"Image data is required");
   if(!type.startsWith("image/"))return fail(res,400,"Only image files are allowed");
   const raw=data.includes(",")?data.split(",").pop():data;
   const buffer=Buffer.from(raw,"base64");
   if(buffer.length>8*1024*1024)return fail(res,400,"Maximum image size is 8MB");
   const ext=(name.split(".").pop()||"jpg").replace(/[^a-z0-9]/gi,"").toLowerCase()||"jpg";
   const pathname=`products/${Date.now()}-${crypto.randomBytes(5).toString("hex")}.${ext}`;
   const b=await put(pathname,buffer,{access:"public",addRandomSuffix:false,contentType:type});
   return res.status(200).json({ok:true,url:b.url});
  }
  return fail(res,404,"Unknown action");
 }catch(e){return res.status(500).json({ok:false,error:e?.message||"Server error"});}
}
