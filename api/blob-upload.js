import { handleUpload } from "@vercel/blob/client";

const COOKIE="syriatech_admin";
const secret=()=>process.env.ADMIN_SECRET||"";
const crypto=require("crypto");
const sign=v=>crypto.createHmac("sha256",secret()).update(v).digest("hex");
const token=()=>Buffer.from("admin").toString("base64url")+"."+sign("admin");

function authed(req){
  const raw=req.headers.cookie||"";
  const c=raw.split(";").map(x=>x.trim()).find(x=>x.startsWith(COOKIE+"="));
  return !!secret()&&!!process.env.ADMIN_PASSWORD&&!!c&&c.slice(COOKIE.length+1)===token();
}

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  if(!authed(req)) return res.status(401).json({error:"Unauthorized"});
  try{
    const body=typeof req.body==="string"?JSON.parse(req.body||"{}"):(req.body||{});
    const jsonResponse=await handleUpload({
      body,
      request:req,
      onBeforeGenerateToken:async(pathname)=>{
        if(!String(pathname||"").startsWith("products/")) throw new Error("Invalid upload path");
        return {
          allowedContentTypes:["image/jpeg","image/png","image/webp","image/gif"],
          maximumSizeInBytes:8*1024*1024,
          addRandomSuffix:true,
        };
      },
    });
    return res.status(200).json(jsonResponse);
  }catch(e){
    return res.status(400).json({error:e?.message||"Upload initialization failed"});
  }
}
