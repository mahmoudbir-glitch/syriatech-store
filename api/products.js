import { get } from "@vercel/blob";
const EMPTY={overrides:{},additions:[],deleted:[]};
export default async function handler(req,res){
 if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
 try{
  const blob=await get("data/store-state.json",{access:"private",useCache:false});
  if(!blob) return res.status(200).json(EMPTY);
  const state=JSON.parse(await new Response(blob.stream).text());
  return res.status(200).json({overrides:state.overrides||{},additions:Array.isArray(state.additions)?state.additions:[],deleted:Array.isArray(state.deleted)?state.deleted:[]});
 }catch(e){return res.status(200).json(EMPTY);}
}
