import { get } from "@vercel/blob";
export default async function handler(req,res){
 if(req.method!=="GET") return res.status(405).end();
 try{
  const pathname=String((req.query&&req.query.pathname)||"");
  if(!pathname.startsWith("products/")||pathname.includes("..")) return res.status(400).json({error:"Invalid image"});
  const blob=await get(pathname,{access:"private"});
  if(!blob) return res.status(404).end();
  const type=blob.blob?.contentType||"application/octet-stream";
  return new Response(blob.stream,{status:200,headers:{"Content-Type":type,"Cache-Control":"public, max-age=31536000, immutable"}});
 }catch(e){return res.status(404).end();}
}
