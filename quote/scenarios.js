(function(root){
'use strict';
const legacy=structuredClone(root.Estimate.seed);
const sources={
 wood:{price:15.79,label:'Schillings · 5/4 × 6 × 16 ft premium treated decking · SKU 54616PT',url:'https://schillings.com/products/decking/natural-deck-boards/54-x-6-x-16-premium-pressure-treated-lumber/',note:'Page total per 16 ft board; rounded linear-foot display differs slightly.'},
 composite:{price:35.18,label:'Home Depot · Trex Enhance Basics Saddle 16 ft square edge · SD010616E2S01',url:'https://www.homedepot.com/p/316975760',note:'Direct product page price; search index previously showed $31.98. Store not selected.'},
 frame:{price:34.99,label:'Schillings · #1 treated 2 × 10 × 16 ft · 21016T',url:'https://schillings.com/products/lumber/framing-lumber/treated/2-x-10-x-16-1-pressure-treated-lumber/',note:'Reference unit price only. Member sizes, lengths and quantities need a designed framing plan.'},
 posts:{price:32.50,label:'Schillings · #2 treated 6 × 6 × 8 ft · 668T',url:'https://schillings.com/products/lumber/framing-lumber/treated/6-x-6-x-8-2-pressure-treated-lumber/',note:'Reference product, not a confirmed post specification.'},
 concrete:{price:6.47,label:'Home Depot · Quikrete 80 lb concrete mix · 110180',url:'https://www.homedepot.com/b/Building-Materials-Concrete-Cement-Masonry-Concrete/Quikrete/All-Purpose/See-Packaging/N-5yc1vZcdptZ2kjZ1z0sa47Z1z19a7j',note:'Retail web listing. Bag count is an allowance, not a footing design.'},
 railing:{price:105.24,label:'Home Depot · ProWood 3 × 6 ft wood/aluminum line rail kit · 177039',url:'https://www.homedepot.com/p/204606980',note:'Line kits only. Separate post/hardware and stair allowances are included. Final layout/guard height unconfirmed.'}
};
const definitions=[{id:'wood',title:'New treated-wood deck',description:'New frame and foundations. Wood decking, wood/aluminum rails, one modest stair flight.'},{id:'composite',title:'New composite deck',description:'Same preliminary structure and rails, with Trex surface and extra fastening allowance.'},{id:'resurface',title:'Reuse frame · treated wood',description:'Conditional: existing frame, ledger and footings must pass inspection. New surface and rails; limited repairs.'}];
function scenario(id){
 if(!definitions.some(d=>d.id===id))throw Error('Unknown scenario');
 const s=structuredClone(legacy);Object.assign(s,{revision:2,scenario:id,materialTax:7,budget:35000,baselineDimensions:'40|30|10|4'});
 const row=(id,name,qty,cost,unit='lot',source=null,kind='Material')=>({id,name,qty,cost,unit,source,kind});
 s.rows=[row('decking',id==='composite'?'Trex Enhance 16 ft surface boards':'Treated 16 ft surface boards',180,sources[id==='composite'?'composite':'wood'].price,'board',id==='composite'?'composite':'wood'),row('frame','Framing stock budget · 2 × 10 × 16 ft equivalent',110,34.99,'board','frame'),row('posts','Structural post stock budget · 6 × 6 × 8 ft',18,32.5,'post','posts'),row('concrete','Footing concrete budget · 80 lb',144,6.47,'bag','concrete'),row('forms','Footing forms / gravel / reinforcement allowance',1,500),row('connectors','Structural connectors, flashing & fasteners allowance',1,id==='composite'?2100:1500),row('railing','ProWood nominal 6 ft line railing kits',18,105.24,'kit','railing'),row('railposts','Guard posts, caps & mounting hardware allowance',1,700),row('stairs','One modest stair flight incl. stair rails · allowance',1,1800),row('finishmat','Wood finish / end-cut preservative allowance',1,id==='composite'?300:600),...structuredClone(legacy.rows.filter(r=>r.kind!=='Material'))];
 if(id==='resurface'){
  s.rows=s.rows.filter(r=>!['frame','posts','concrete','forms','layout'].includes(r.id));
  s.rows.splice(1,0,row('repairs','Limited framing repairs · material allowance',1,1000));
  s.rows.find(r=>r.id==='carpentry').qty=112;
  s.rows.push(row('demolition','Remove old surface & rails · labor allowance',32,45,'person-hr',null,'Labor'));
 }
 s.scope=definitions.find(d=>d.id===id).description+' Preliminary rectangular 40 × 30 ft (1,200 sq ft) budget, with 10% surface waste, 96 linear ft of exposed railing and one modest stair flight. Installation and cleanup included. Deck height and exact stair configuration remain unknown.';
 s.exclusions='Planning estimate, not a binding offer. Retail web prices researched October 15, 2026; local stock, delivery ZIP and summer 2027 pricing are not confirmed. Quantities, labor and unpriced items are editable budget assumptions. Structural plan, footing sizes, beam/post layout, ledger attachment and guard requirements require site/design review. No 30 ft unsupported joist span is assumed. Demolition of an entire existing structure, major repairs, difficult excavation, drainage, electrical, landscaping and multi-flight/tall stairs are excluded. A 7% material purchase tax allowance is included in costs, assuming Indiana; customer tax treatment and business/payment terms require contractor review.'+(id==='resurface'?' Reuse is conditional on a qualified inspection of all existing structure, connections and footings; replacement is excluded.':'');
 return s;
}
const round=root.Estimate.round;
function totals(s){const categories={Material:0,Labor:0,Other:0};s.rows.forEach(r=>categories[r.kind]+=round(r.qty*r.cost));for(const k in categories)categories[k]=round(categories[k]);const materialTax=round(categories.Material*(s.materialTax||0)/100),lineCost=round(Object.values(categories).reduce((a,b)=>a+b,0)),direct=round(lineCost+materialTax),overhead=round(direct*s.overhead/100),contingency=round(direct*s.contingency/100),basis=round(direct+overhead+contingency),profit=round(basis*s.markup/100),subtotal=round(basis+profit),tax=round(subtotal*s.tax/100),total=round(subtotal+tax);return{categories,materialTax,lineCost,direct,overhead,contingency,basis,profit,subtotal,tax,total,deposit:round(total*s.deposit/100),margin:subtotal?profit/subtotal*100:0,hours:round(s.rows.filter(r=>r.kind==='Labor').reduce((a,r)=>a+r.qty,0))};}
const oldValidate=root.Estimate.validate;
function validate(s){oldValidate(s);for(const [key,max]of [['materialTax',100],['budget',10000000]])if(s[key]!==undefined&&(typeof s[key]!=='number'||!Number.isFinite(s[key])||s[key]<0||s[key]>max))throw Error('Invalid '+key);for(const r of s.rows)if(r.source!=null&&!Object.hasOwn(sources,r.source))throw Error('Unknown price source');return s;}
function surfaceQty(s){return Math.ceil(root.Estimate.takeoff(s).coverage/(16*5.5/12)-1e-9)}
Object.assign(root.Estimate,{legacy,sources,definitions,scenario,seed:scenario('wood'),totals,validate,surfaceQty});
})(typeof window!=='undefined'?window:globalThis);
