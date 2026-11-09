// Deterministic browser integration check. All catalog responses are local
// fixtures: this never creates or changes a customer's product in Supabase.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const mainId = '11111111-1111-4111-8111-111111111111';
const image = name => `/images/produto/${name}-960.webp`;
function row(id, name, category = '22222222-2222-4222-8222-222222222222') {
  const photos = ['principal', 'editorial-frente', 'editorial-verso', 'galeria-2', 'galeria-3', 'galeria-4', 'galeria-5', 'look-principal', 'principal', 'editorial-frente', 'editorial-verso', 'principal'];
  return { id, seller_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', categoria_id: category, nome: name, modelo: 'Marrom Casual', preco: 389.9, preco_parcelado_texto: '3x de R$ 129,97 sem juros', descricao: 'Descrição cadastrada pelo vendedor.\n\nAcabamento em couro e solado confortável para o dia a dia.', ficha_tecnica: 'Ficha técnica cadastrada: couro natural, solado de borracha.', beneficios_texto: 'Benefícios cadastrados: conforto e versatilidade.', modo_uso_cuidados: 'Cuidados cadastrados: secar à sombra.', sku: 'CAD-2026', status: 'publicado', vendas_count: 0, created_at: '2026-11-09T10:00:00Z', updated_at: '2026-11-09T10:00:00Z', detalhes: { nomeLoja: 'Loja cadastrada', conteudoAnuncio: 'Resumo do anúncio salvo no cadastro, exibido automaticamente neste modelo.', qualidade: 'Qualidade cadastrada: costuras reforçadas.', precificacao: { afiliadoAtivo: true, freteAtivo: true, freteGratis: true, cupomAtivo: true, cupomNome: 'BEMVINDO', cupomPercentual: 15 }, paginaProduto: { complementares: ['33333333-3333-4333-8333-333333333333', '44444444-4444-4444-8444-444444444444', '55555555-5555-4555-8555-555555555555'] } }, product_images: [...photos.map((photo, i) => ({ id: `${id}-${i}`, product_id: id, url: image(photo), ordem: i, papel: i < 2 ? 'destaque' : 'galeria' })), ...['editorial-frente','editorial-verso'].map((photo,i)=>({ id:`body-${id}-${i}`,product_id:id,url:image(photo),ordem:20+i,papel:'corpo' }))], product_attribute_selections: [] };
}
const products = [row(mainId, 'Sapatênis cadastrado em couro marrom com acabamento e costura reforçada'), ...['33333333-3333-4333-8333-333333333333', '44444444-4444-4444-8444-444444444444', '55555555-5555-4555-8555-555555555555'].map((id,i)=>row(id,`Complementar cadastrado ${i+1}`,'66666666-6666-4666-8666-666666666666')), ...Array.from({length:6},(_,i)=>row(`77777777-7777-4777-8777-77777777777${i}`,`Recomendado cadastrado ${i+1}`))];
const categories = [{ id:'99999999-9999-4999-8999-999999999999',parent_id:null,nivel:0,nome:'Produto',ativo:true }, {id:'88888888-8888-4888-8888-888888888888',parent_id:'99999999-9999-4999-8999-999999999999',nivel:1,nome:'Calçados',ativo:true},{id:'22222222-2222-4222-8222-222222222222',parent_id:'88888888-8888-4888-8888-888888888888',nivel:2,nome:'Tênis Casual',ativo:true}];

(async()=>{
 const {createServer}=await import('vite');
 const server=await createServer({server:{host:'127.0.0.1',port:8182,strictPort:true}});
 await server.listen();
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const results=[];
 try {
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['small-mobile',320,740]]){
   const page=await browser.newPage({viewport:{width,height}});
   const errors=[];const requests=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/rest/v1/**',async route=>{
    const url=new URL(route.request().url()); requests.push(url.pathname+'?'+url.searchParams.toString());
    let data=url.pathname.endsWith('/product_categories')?categories:products;
    for(const [key,value] of url.searchParams){
     if(['id','status','categoria_id','seller_id'].includes(key)){
      if(value.startsWith('eq.'))data=data.filter(item=>String(item[key])===value.slice(3));
      else if(value.startsWith('neq.'))data=data.filter(item=>String(item[key])!==value.slice(4));
      else if(value.startsWith('in.')){const ids=value.slice(4,-1).split(',');data=data.filter(item=>ids.includes(String(item[key])));}
     }
    }
    if(url.searchParams.has('limit'))data=data.slice(0,Number(url.searchParams.get('limit')));
    const object=route.request().headers().accept?.includes('vnd.pgrst.object');
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(object?(data[0]||null):data),headers:{'access-control-allow-origin':'*'}});
   });
   await page.goto(`http://127.0.0.1:8182/produto/${mainId}`,{waitUntil:'networkidle'});
   await page.getByRole('heading',{name:products[0].nome,exact:true,level:1}).waitFor();
   await page.getByRole('link',{name:'Recomendado cadastrado 1 Marrom Casual R$ 389,90'}).waitFor();
   await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
   await page.screenshot({path:`qa/produto/template-${name}.png`,fullPage:true});
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>!i.naturalWidth).length,thumbnails:document.querySelectorAll('.pp-thumbnail-list button').length,conditions:[...document.querySelectorAll('.pp-conditions li')].map(x=>x.textContent),actionsVisible:getComputedStyle(document.querySelector('.pp-actions')).display!=='none',galleryHeight:document.querySelector('.pp-gallery').getBoundingClientRect().height}));
   const last=page.getByRole('button',{name:'Ver foto 12',exact:true});await last.click();
   await page.getByRole('img',{name:`${products[0].nome} — foto 12`,exact:true}).waitFor();
   await page.getByRole('link',{name:'Recomendado cadastrado 1 Marrom Casual R$ 389,90'}).click();
   await page.getByRole('heading',{name:'Recomendado cadastrado 1',exact:true,level:1}).waitFor();
   if(requests.some(r=>r.includes('product_pricing')))throw Error('Private relation requested');
   results.push({name,...state,errors,publicQueriesOnly:true,twelfthPhoto:true,navigatedToRecommendation:true});
   await page.close();
  }
  if(process.env.PRODUCT_LIVE_ID){
   const live=await browser.newPage({viewport:{width:1440,height:1000}});
   const liveErrors=[];live.on('pageerror',e=>liveErrors.push(e.message));
   await live.goto(`http://127.0.0.1:8182/produto/${encodeURIComponent(process.env.PRODUCT_LIVE_ID)}`,{waitUntil:'networkidle'});
   await live.locator('.pp-title-row h1').waitFor();
   const title=await live.locator('h1').textContent();
   await live.screenshot({path:'qa/produto/template-live.png',fullPage:true});
   results.push({name:'live-public-catalog',title,errors:liveErrors,overflow:await live.evaluate(()=>document.documentElement.scrollWidth>innerWidth),publicQueriesOnly:true});
   await live.close();
  }
  fs.writeFileSync('qa/produto/template-checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
  if(results.some(r=>r.overflow||r.brokenImages||r.errors.length))process.exitCode=1;
 } finally{await browser.close();await server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
