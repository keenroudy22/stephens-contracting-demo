(function(root){'use strict';
 const E=root.Estimate,copy=x=>structuredClone(x),statuses=['Draft','Sent','Accepted','Declined'];
 const uid=()=>crypto.randomUUID(),now=()=>new Date().toISOString();
 function blank(type='blank'){
  const s=copy(E.seed);Object.assign(s,{jobType:'general',scenario:null,title:'Untitled job',customer:'',location:'',timing:'',width:1,depth:1,opening:0,waste:0,baselineDimensions:null,budget:0,materialTax:0,scope:'',exclusions:'Final measurements, product selections, access, permits and tax treatment require review.',privateNotes:'',customerEmail:'',customerPhone:'',validUntil:'',terms:'',rows:[]});
  const add=(name,kind,unit)=>s.rows.push({id:uid(),name,kind,unit,qty:1,cost:0});
  if(type==='repair'){s.title='Home repair';add('Repair materials','Material','lot');add('Repair labor','Labor','person-hr');add('Travel / disposal','Other','lot');}
  else if(type==='remodel'){s.title='Room remodel';add('Finish materials','Material','lot');add('Fixtures & hardware','Material','lot');add('Preparation / demolition labor','Labor','person-hr');add('Installation labor','Labor','person-hr');add('Cleanup / disposal','Other','lot');}
  else{add('Materials','Material','lot');add('Installation labor','Labor','person-hr');add('Other job costs','Other','lot');}return s;
 }
 function makeJob(estimate){const id=uid();return{id,ref:'SC-'+id.slice(0,8).toUpperCase(),status:'Draft',archived:false,created:now(),updated:now(),estimate:copy(estimate),history:[]}}
 function initial(){const deck=E.scenario('resurface');Object.assign(deck,{jobType:'deck',title:'30 × 40 deck — sample quote',customer:'Sample homeowner',location:'Sample property — address to confirm',customerEmail:'',customerPhone:'',validUntil:'',terms:''});const job=makeJob(deck);return{format:'stephens-public-demo-v1',jobs:[job],customers:[],templates:[],profile:{name:"Stephen's Contracting",email:'',phone:'',address:'',terms:'',footer:''}}}
 function estimate(s){E.validate(s);if(!['deck','general'].includes(s.jobType))throw Error('Choose a valid job type.');for(const k of ['customerEmail','customerPhone','validUntil','terms'])if(s[k]!==undefined&&(typeof s[k]!=='string'||s[k].length>6000))throw Error('Invalid quote details.');return s}
 function validate(data){
  const str=(v,n)=>typeof v==='string'&&v.length<=n,id=v=>str(v,80)&&/^[\w-]+$/.test(v);
  if(!data||data.format!=='stephens-public-demo-v1'||!Array.isArray(data.jobs)||data.jobs.length<1||data.jobs.length>100)throw Error('Backup must contain 1–100 demo jobs.');
  const ids=new Set();for(const j of data.jobs){if(!j||!id(j.id)||ids.has(j.id)||!str(j.ref,80)||!str(j.created,60)||!str(j.updated,60)||!statuses.includes(j.status)||typeof j.archived!=='boolean')throw Error('Invalid job record.');ids.add(j.id);estimate(j.estimate);if(!Array.isArray(j.history)||j.history.length>10)throw Error('Invalid revision history.');for(const h of j.history){if(!h||!id(h.id)||!str(h.date,60)||!str(h.label,150))throw Error('Invalid revision.');estimate(h.estimate);}}
  if(!data.profile||typeof data.profile!=='object')throw Error('Missing business profile.');for(const k of ['name','email','phone','address','terms','footer'])if(!str(data.profile[k],6000))throw Error('Invalid business profile.');
  if(!Array.isArray(data.customers)||data.customers.length>200)throw Error('Maximum 200 customers.');const cids=new Set();for(const c of data.customers){if(!c||!id(c.id)||cids.has(c.id))throw Error('Invalid customer.');cids.add(c.id);for(const k of ['name','email','phone','address','notes'])if(!str(c[k],k==='notes'?6000:1000))throw Error('Invalid customer details.');}
  if(!Array.isArray(data.templates)||data.templates.length>30)throw Error('Maximum 30 templates.');const tids=new Set();for(const t of data.templates){if(!t||!id(t.id)||tids.has(t.id)||!str(t.name,150))throw Error('Invalid template.');tids.add(t.id);estimate(t.estimate)}
  if(JSON.stringify(data).length>2500000)throw Error('Workspace is full. Export a backup and remove unneeded revisions before adding more.');return data;
 }
 function revision(job,label='Saved revision'){job.history.unshift({id:uid(),date:now(),label,estimate:copy(job.estimate)});job.history=job.history.slice(0,10)}
 function template(job,name){const s=copy(job.estimate);Object.assign(s,{customer:'',location:'',customerEmail:'',customerPhone:'',privateNotes:'',validUntil:'',timing:''});return{id:uid(),name,estimate:s}}
 root.Demo={copy,uid,now,blank,makeJob,initial,validate,estimate,revision,template,statuses};
 if(typeof module!=='undefined')module.exports=root.Demo;
})(typeof window!=='undefined'?window:globalThis);
