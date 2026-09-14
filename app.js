const form=document.getElementById("form"),status=document.getElementById("status");
form.addEventListener("submit",async e=>{
 e.preventDefault(); status.textContent="جاري إرسال الطلب...";
 const data=Object.fromEntries(new FormData(form).entries());
 try{
  const r=await fetch("/api/apply",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
  const j=await r.json();
  if(!r.ok) throw new Error(j.message||"حدث خطأ");
  status.textContent="✅ تم إرسال طلبك بنجاح إلى Discord.";
  form.reset();
 }catch(err){status.textContent="❌ "+err.message}
});
