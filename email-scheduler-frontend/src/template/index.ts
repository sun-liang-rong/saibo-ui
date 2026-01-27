const hua = `<div style="position:relative; width:320px; height:420px; transform-style:preserve-3d; perspective:1000px; margin:0 auto;">

  <!-- 花茎 -->
  <div style="position:absolute; bottom:0; left:50%; width:12px; height:260px; background:linear-gradient(to top, #2e7d32, #4caf50); border-radius:6px; transform:translateX(-50%); box-shadow:0 10px 20px rgba(0,0,0,0.15);"></div>

  <!-- 叶子 -->
  <div style="position:absolute; width:60px; height:140px; background:radial-gradient(circle at 30% 20%, #66bb6a, #388e3c 60%, #2e7d32); border-radius:50% 50% 0 50%; box-shadow:inset 0 10px 20px rgba(0,0,0,0.1); left:10px; bottom:80px; transform:rotate(-35deg);"></div>
  <div style="position:absolute; width:60px; height:140px; background:radial-gradient(circle at 30% 20%, #66bb6a, #388e3c 60%, #2e7d32); border-radius:50% 50% 0 50%; box-shadow:inset 0 10px 20px rgba(0,0,0,0.1); right:10px; bottom:100px; transform:rotate(35deg);"></div>

  <!-- 花朵容器 + 动画 -->
  <div style="position:absolute; top:0; left:50%; transform:translateX(-50%) rotate(-12deg); transform-origin:bottom center; animation:sway 6s ease-in-out infinite alternate; animation-delay:0s;">
    <!-- 玫瑰 -->
    <div style="position:relative; width:140px; height:140px;">
      <div style="position:absolute; width:70px; height:100px; background:linear-gradient(135deg, #e91e63, #c2185b); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(0deg);"></div>
      <div style="position:absolute; width:70px; height:100px; background:linear-gradient(135deg, #e91e63, #c2185b); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(45deg);"></div>
      <div style="position:absolute; width:70px; height:100px; background:linear-gradient(135deg, #e91e63, #c2185b); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(90deg);"></div>
      <div style="position:absolute; width:70px; height:100px; background:linear-gradient(135deg, #e91e63, #c2185b); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(135deg);"></div>
      <div style="position:absolute; width:70px; height:100px; background:linear-gradient(135deg, #e91e63, #c2185b); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(180deg);"></div>
      <div style="position:absolute; width:70px; height:100px; background:linear-gradient(135deg, #e91e63, #c2185b); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(225deg);"></div>
      <div style="position:absolute; width:70px; height:100px; background:linear-gradient(135deg, #e91e63, #c2185b); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(270deg);"></div>
      <div style="position:absolute; width:70px; height:100px; background:linear-gradient(135deg, #e91e63, #c2185b); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(315deg);"></div>
      <div style="position:absolute; top:50%; left:50%; width:38px; height:38px; background:radial-gradient(circle, #ffeb3b 20%, #fbc02d 70%); border-radius:50%; transform:translate(-50%, -50%); box-shadow:0 0 20px rgba(255,235,59,0.6);"></div>
    </div>
  </div>

  <div style="position:absolute; top:0; left:50%; transform:translateX(-50%) rotate(0deg); transform-origin:bottom center; animation:sway 6s ease-in-out infinite alternate; animation-delay:1.2s;">
    <!-- 牡丹 -->
    <div style="position:relative; width:140px; height:140px;">
      <div style="position:absolute; width:80px; height:110px; background:linear-gradient(135deg, #ab47bc, #7b1fa2); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(22.5deg);"></div>
      <div style="position:absolute; width:80px; height:110px; background:linear-gradient(135deg, #ab47bc, #7b1fa2); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(67.5deg);"></div>
      <div style="position:absolute; width:80px; height:110px; background:linear-gradient(135deg, #ab47bc, #7b1fa2); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(112.5deg);"></div>
      <div style="position:absolute; width:80px; height:110px; background:linear-gradient(135deg, #ab47bc, #7b1fa2); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(157.5deg);"></div>
      <div style="position:absolute; width:80px; height:110px; background:linear-gradient(135deg, #ab47bc, #7b1fa2); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(202.5deg);"></div>
      <div style="position:absolute; width:80px; height:110px; background:linear-gradient(135deg, #ab47bc, #7b1fa2); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(247.5deg);"></div>
      <div style="position:absolute; width:80px; height:110px; background:linear-gradient(135deg, #ab47bc, #7b1fa2); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(292.5deg);"></div>
      <div style="position:absolute; width:80px; height:110px; background:linear-gradient(135deg, #ab47bc, #7b1fa2); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(337.5deg);"></div>
      <div style="position:absolute; top:50%; left:50%; width:38px; height:38px; background:radial-gradient(circle, #fff176, #ffca28); border-radius:50%; transform:translate(-50%, -50%); box-shadow:0 0 20px rgba(255,241,118,0.6);"></div>
    </div>
  </div>

  <div style="position:absolute; top:0; left:50%; transform:translateX(-50%) rotate(12deg); transform-origin:bottom center; animation:sway 6s ease-in-out infinite alternate; animation-delay:2.4s;">
    <!-- 郁金香 -->
    <div style="position:relative; width:140px; height:140px;">
      <div style="position:absolute; width:70px; height:100px; background:linear-gradient(135deg, #ff7043, #f4511e); border-radius:60% 60% 40% 40% / 80% 80% 20% 20%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(0deg);"></div>
      <div style="position:absolute; width:70px; height:100px; background:linear-gradient(135deg, #ff7043, #f4511e); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(72deg);"></div>
      <div style="position:absolute; width:70px; height:100px; background:linear-gradient(135deg, #ff7043, #f4511e); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(144deg);"></div>
      <div style="position:absolute; width:70px; height:100px; background:linear-gradient(135deg, #ff7043, #f4511e); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(216deg);"></div>
      <div style="position:absolute; width:70px; height:100px; background:linear-gradient(135deg, #ff7043, #f4511e); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; box-shadow:inset -10px -10px 20px rgba(0,0,0,0.15); transform-origin:bottom center; transform:rotate(288deg);"></div>
      <div style="position:absolute; top:50%; left:50%; width:38px; height:38px; background:radial-gradient(circle, #ffee58, #fdd835); border-radius:50%; transform:translate(-50%, -50%); box-shadow:0 0 20px rgba(255,238,88,0.6);"></div>
    </div>
  </div>

  <!-- 丝带 -->
  <div style="position:absolute; bottom:20px; left:50%; width:180px; height:60px; background:linear-gradient(to right, #d81b60, #f06292, #d81b60); border-radius:30px; transform:translateX(-50%) rotateX(20deg); box-shadow:0 8px 16px rgba(216,27,96,0.3); z-index:-1;">
    <div style="position:absolute; width:80px; height:100px; background:linear-gradient(to right, #d81b60, #f06292, #d81b60); border-radius:50%; top:-30px; left:-40px; transform:rotate(-35deg);"></div>
    <div style="position:absolute; width:80px; height:100px; background:linear-gradient(to right, #d81b60, #f06292, #d81b60); border-radius:50%; top:-30px; right:-40px; transform:rotate(35deg);"></div>
  </div>

  <!-- 文字（可选，根据需要删除或修改） -->
  <div style="position:absolute; bottom:-80px; left:50%; transform:translateX(-50%); font-size:1.4rem; color:#37474f; text-shadow:0 2px 8px rgba(0,0,0,0.15); white-space:nowrap;">
    送给最可爱的你 🌸
  </div>

</div>

<style>
  @keyframes sway {
    0%   { transform: translateX(-50%) rotate(-12deg) translateY(0); }
    100% { transform: translateX(-50%) rotate(12deg)  translateY(-8px); }
  }
</style>`;
