const mealData=[
{id:1,name:"Berry oat bowl",type:"Breakfast",time:"10 min",tag:"Fresh start",desc:"Oats, berries and creamy yogurt",img:"https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=700&q=85"},
{id:2,name:"Avocado toast",type:"Breakfast",time:"8 min",tag:"Quick & easy",desc:"Whole-grain toast with avocado",img:"https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=85"},
{id:3,name:"Rainbow nourish bowl",type:"Lunch",time:"20 min",tag:"Colourful",desc:"Greens, grains and crunchy veg",img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=85"},
{id:4,name:"Fresh garden salad",type:"Lunch",time:"15 min",tag:"Light & fresh",desc:"Leafy greens and seasonal veg",img:"https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=85"},
{id:5,name:"Veggie rice bowl",type:"Dinner",time:"25 min",tag:"Comfort food",desc:"Rice, vegetables and herbs",img:"https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=85"},
{id:6,name:"Pasta primavera",type:"Dinner",time:"25 min",tag:"Family favourite",desc:"Pasta tossed with colourful veg",img:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=85"},
{id:7,name:"Fruit & nut snack",type:"Snack",time:"5 min",tag:"Little boost",desc:"Seasonal fruit and a few nuts",img:"https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=700&q=85"},
{id:8,name:"Green smoothie",type:"Snack",time:"5 min",tag:"Sip something fresh",desc:"Fruit, greens and yogurt",img:"https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=700&q=85"}];
let plan=[],water=0,liked=new Set(),activeFilter="All",currentUser="";
const $=id=>document.getElementById(id);
const toast=$("toast");
let toastTimer;
function notify(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2100)}
function showPage(name){
  if(name==="login"){ $("appShell").style.display="none"; $("loginPage").classList.add("active");return; }
  $("loginPage").classList.remove("active");$("appShell").style.display="grid";
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+name));
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
  const labels={home:"YOUR DAILY WELLNESS SPACE",meals:"FIND SOMETHING DELICIOUS",planner:"YOUR DAILY MENU",habits:"LITTLE THINGS THAT HELP",settings:"YOUR NUTRIPLANNER"};
  $("topLabel").textContent=labels[name]||labels.home;
  if(name==="meals")renderMeals();
  window.scrollTo(0,0);
}
document.querySelectorAll("[data-page]").forEach(btn=>btn.addEventListener("click",()=>showPage(btn.dataset.page)));
document.querySelectorAll("[data-goto]").forEach(btn=>btn.addEventListener("click",()=>showPage(btn.dataset.goto)));
function renderMeals(){
 const target=$("mealGrid");target.innerHTML="";
 mealData.filter(m=>activeFilter==="All"||m.type===activeFilter).forEach(m=>{
  const added=plan.some(p=>p.id===m.id),favorite=liked.has(m.id);
  const card=document.createElement("article");card.className="meal-card";
  card.innerHTML=`<div class="meal-image" style="background-image:url('${m.img}')"><span class="badge">${m.type}</span><button class="heart" data-like="${m.id}" aria-label="Toggle favourite">${favorite?"♥":"♡"}</button></div><div class="meal-info"><h3>${m.name}</h3><p>${m.desc}</p><div class="meal-meta"><span>${m.tag}</span><span>${m.time}</span></div><button class="add-meal ${added?"added":""}" data-add="${m.id}">${added?"✓ Added to plan":"+ Add to my plan"}</button></div>`;
  target.appendChild(card);
 });
}
function renderPlan(){
 const target=$("planList");
 if(!plan.length)target.innerHTML='<div class="empty"><span class="empty-mark" aria-hidden="true">NP</span><b>Your plan starts here</b><p>Explore meals and add your favourites to this list.</p></div>';
 else{target.innerHTML="";plan.forEach((m,i)=>{const row=document.createElement("div");row.className="plan-item";row.innerHTML=`<div class="plan-thumb" style="background-image:url('${m.img}')"></div><div class="plan-info"><b>${m.name}</b><small>${m.type} · ${m.time} · ${m.desc}</small></div><button class="remove" data-remove="${i}">Remove</button>`;target.appendChild(row)})}
 const label=`${plan.length} meal${plan.length===1?"":"s"}`;
 $("planCount").textContent=`${label} planned`;$("statMeals").textContent=label;
 renderMeals();
}
function updateWater(){
 const pct=water/8*100;
 $("waterLabel").textContent=`${water}/8`;$("statWater").textContent=`${water} of 8 glasses`;
 $("waterFill").style.width=pct+"%";const tinyWater=$("tinyWater");if(tinyWater)tinyWater.style.width=pct+"%";
 $("waterMessage").textContent=water===8?"Goal reached — great job!":"A sip is a good start";
 $("waterSub").textContent=water===8?"Lovely work today!":"Stay hydrated through your day";
}
$("mealGrid").addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add){const m=mealData.find(x=>x.id===+add.dataset.add);if(plan.some(x=>x.id===m.id)){notify("That meal is already in your plan.");return}plan.push(m);renderPlan();notify(m.name+" added to your plan!");return}
 const like=e.target.closest("[data-like]");if(like){const id=+like.dataset.like;liked.has(id)?liked.delete(id):liked.add(id);renderMeals();notify(liked.has(id)?"Saved to favourites!":"Removed from favourites.");}
});
$("planList").addEventListener("click",e=>{const btn=e.target.closest("[data-remove]");if(!btn)return;const removed=plan.splice(+btn.dataset.remove,1)[0];renderPlan();notify(removed.name+" removed.");});
document.querySelectorAll("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{activeFilter=btn.dataset.filter;document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b===btn));renderMeals()}));
document.querySelectorAll("[data-clear]").forEach(btn=>btn.addEventListener("click",()=>{plan=[];renderPlan();notify("Meal plan cleared.");}));
$("addWater").addEventListener("click",()=>{if(water<8)water++;updateWater();notify(water===8?"Water tracker goal reached!":"Water tracker updated.");});
$("todayDate").textContent=new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
function setLoginMessage(message,isError=false){$("loginMessage").textContent=message;$("loginMessage").style.color=isError?"#b4534b":"#347653";}
$("loginForm").addEventListener("submit",e=>{
 e.preventDefault();const email=$("email").value.trim(),password=$("password").value;
 if(!email||!password){setLoginMessage("Please enter your email and password.",true);return}
 currentUser=email.split("@")[0];$("userName").textContent=currentUser;
 localStorage.setItem("nutriplannerDemoUser",currentUser);
 setLoginMessage("Signed in for this demo. Opening your dashboard…");
 setTimeout(()=>{showPage("home");notify("Welcome to NutriPlanner, "+currentUser+"!");},500);
});
$("signupForm").addEventListener("submit",e=>{
 e.preventDefault();const name=$("signupName").value.trim(),email=$("signupEmail").value.trim(),password=$("signupPassword").value;
 if(name.length<2||!email||password.length<4){$("signupMessage").textContent="Enter your name, a valid email, and a password with at least 4 characters.";return}
 currentUser=name;localStorage.setItem("nutriplannerDemoUser",name);$("userName").textContent=name;
 $("signupMessage").textContent="Demo account created. Opening dashboard…";
 setTimeout(()=>{showPage("home");notify("Welcome, "+name+"!");},500);
});
$("showPassword").addEventListener("click",()=>{const field=$("password");field.type=field.type==="password"?"text":"password";$("showPassword").textContent=field.type==="password"?"Show":"Hide"});
$("forgotPassword").addEventListener("click",()=>setLoginMessage("Demo mode: use any email and password to sign in."));
$("signUpLink").addEventListener("click",()=>{ $("loginForm").style.display="none";$("signupForm").style.display="block";$("loginHeading").textContent="Create your account";$("loginSub").textContent="A fresh start begins here.";});
$("backToLogin").addEventListener("click",()=>{ $("signupForm").style.display="none";$("loginForm").style.display="block";$("loginHeading").textContent="Welcome back!";$("loginSub").textContent="Sign in to make your day a little healthier.";});
$("logoutBtn").addEventListener("click",()=>{showPage("login");$("loginForm").reset();setLoginMessage("You are signed out of this demo.");notify("Signed out.");});
const savedUser=localStorage.getItem("nutriplannerDemoUser");
if(savedUser){currentUser=savedUser;$("userName").textContent=savedUser;}
renderMeals();renderPlan();updateWater();


// Dark mode: synced toggle buttons, saved between visits.
function applyTheme(isDark){
  document.body.classList.toggle("dark",isDark);
  const symbol=isDark?"☼":"◐",label=isDark?"Light mode":"Dark mode";
  ["themeSymbol","loginThemeSymbol"].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=symbol});
  ["themeText","loginThemeText"].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=label});
  localStorage.setItem("nutriplannerTheme",isDark?"dark":"light");
}
const savedTheme=localStorage.getItem("nutriplannerTheme");
applyTheme(savedTheme==="dark");
["themeToggle","loginThemeToggle"].forEach(id=>{
 const btn=document.getElementById(id);
 if(btn)btn.addEventListener("click",()=>applyTheme(!document.body.classList.contains("dark")));
});
