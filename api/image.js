import { get } from "@vercel/blob";
import { Readable } from "stream";

export default async function handler(req,res){
  if(req.method!=="GET") return res.status(405).end();
  try{
    const pathname=String((req.query&&req.query.pathname)||"");
    if(!/^products\/[\w.-]+$/.test(pathname)||pathname.includes("..")) return res.status(400).json({error:"Invalid image"});
    const result=await get(pathname,{access:"private",useCache:false});
    if(!result) return res.status(404).end();
    const type=result.blob?.contentType||"image/jpeg";
    res.statusCode=200;
    res.setHeader("Content-Type",type);
    if(result.blob?.size) res.setHeader("Content-Length",String(result.blob.size));
    res.setHeader("Content-Disposition","inline; filename=\"product-image\"");
    res.setHeader("X-Content-Type-Options","nosniff");
    res.setHeader("Content-Security-Policy","default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox");
    res.setHeader("Cache-Control","public, max-age=31536000, immutable");
    Readable.fromWeb(result.stream).pipe(res);
  }catch(e){
    return res.status(404).end();
  }
}
