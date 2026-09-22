import crypto from "crypto";
import { handleUpload } from "@vercel/blob/client";
export default async function handler(req,res){
 try{
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const c=(req.headers.cookie||"").split(";").map(x=>x.trim()).find(x=>x.startsWith("syriatech_admin="));
  const value=c?c.slice("syriatech_admin=".length):"";
  const expected=Buffer.from("admin").toString("base64url")+"."+crypto.createHmac("sha256",process.env.ADMIN_SECRET||"").update("admin").digest("hex");
  if(!process.env.ADMIN_SECRET||!process.env.ADMIN_PASSWORD||!c||value!==expected)return res.status(401).json({error:"Unauthorized"});
  const body=typeof req.body==="string"?JSON.parse(req.body||"{}"):(req.body||{});
  const result=await handleUpload({body,request:req,onBeforeGenerateToken:async(pathname)=>{
   if(!pathname.startsWith("products/"))throw new Error("Invalid upload path");
   return {allowedContentTypes:["image/jpeg","image/png","image/webp","image/gif"],maximumSizeInBytes:10*1024*1024,addRandomSuffix:true};
  }});
  return res.status(200).json(result);
 }catch(e){return res.status(400).json({error:e?.message||"Upload initialization failed"});}
}