import React, { useState, useEffect } from 'react';

interface WechatRedirectProps {
  forceShow?: boolean;
  onClosePreview?: () => void;
}

export default function WechatRedirect({ forceShow = false, onClosePreview }: WechatRedirectProps) {
  const [isWeChat, setIsWeChat] = useState(() => {
    if (forceShow) return true;
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    const isWxBrowser = /micromessenger/i.test(ua);
    const isQQBrowser = /qq\//i.test(ua);
    const searchParams = new URLSearchParams(window.location.search);
    const isTestMode = searchParams.has('wechat') || searchParams.has('wx');
    return isWxBrowser || isQQBrowser || isTestMode;
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setIsWeChat(true);
    }
  }, [forceShow]);

  if (!isWeChat) return null;

  const handleCopyLink = () => {
    const url = window.location.href.split('?')[0];
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
    } else {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-white text-[#222222] flex flex-col items-center justify-between py-6 px-4 sm:py-8 sm:px-6 select-none overflow-y-auto min-h-screen">
      {/* Top Right Curved Dashed Arrow */}
      <div className="absolute top-2 right-4 sm:top-4 sm:right-8 w-28 h-28 pointer-events-none z-10">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Curved dashed line pointing towards upper right corner */}
          <path
            d="M 12 78 C 30 50, 52 28, 86 16"
            stroke="#2d7ef7"
            strokeWidth="2.5"
            strokeDasharray="4 3"
            strokeLinecap="round"
          />
          {/* Arrowhead */}
          <polygon
            points="82,8 96,12 88,25"
            fill="#2d7ef7"
          />
        </svg>
      </div>

      {/* Header Guidance Text */}
      <div className="w-full max-w-md pt-8 sm:pt-12 text-center z-10">
        <div className="text-xl sm:text-2xl text-[#222222] font-medium tracking-wide flex items-center justify-center gap-2">
          <span>点击右上角</span>
          <span className="font-black text-2xl sm:text-3xl tracking-widest text-[#111111]">···</span>
        </div>

        <div className="mt-4 sm:mt-5 text-2xl sm:text-3xl font-bold tracking-wider text-[#111111] flex items-center justify-center gap-2">
          <span>选择在</span>
          <span className="text-[#2d7ef7] font-black underline decoration-[#2d7ef7]/30 underline-offset-4">浏览器</span>
          <span>打开</span>
        </div>
      </div>

      {/* Center Phone Illustration with WeChat Action Sheet */}
      <div className="relative w-full max-w-[340px] my-6 flex justify-center items-center">
        {/* Smartphone Mockup */}
        <div className="relative w-[280px] h-[480px] rounded-[44px] border-[5px] border-[#d1d5db] bg-[#f9fafb] shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
          {/* Top Speaker slit and Camera */}
          <div className="w-full flex items-center justify-center gap-2 py-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#d1d5db]" />
            <div className="w-12 h-1.5 rounded-full bg-[#d1d5db]" />
          </div>

          {/* Screen Content Simulation */}
          <div className="w-full flex-1 bg-[#ffffff] rounded-2xl border border-[#e5e7eb] flex flex-col justify-end overflow-hidden relative">
            {/* Blank page placeholder */}
            <div className="flex-1 bg-[#f3f4f6] flex items-center justify-center">
              <span className="text-[#9ca3af] text-xs">页面受限，请在浏览器中打开</span>
            </div>

            {/* WeChat Action Sheet Simulation */}
            <div className="bg-[#f3f4f6]/95 backdrop-blur border-t border-[#e5e7eb] p-3 space-y-3">
              {/* Row 1 Icons */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-[#4b5563]">
                <div className="flex flex-col items-center gap-1 opacity-70">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center text-emerald-500 text-sm">
                    <i className="fas fa-comment-dots" />
                  </div>
                  <span>转发给朋友</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-70">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center text-orange-400 text-sm">
                    <i className="fas fa-circle-notch" />
                  </div>
                  <span>分享到朋友圈</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-70">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center text-amber-500 text-sm">
                    <i className="fas fa-cube" />
                  </div>
                  <span>收藏</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-9 h-9 rounded-xl bg-white border-2 border-[#2d7ef7] flex items-center justify-center text-[#2d7ef7] text-sm shadow-sm">
                    <i className="fas fa-globe" />
                  </div>
                  <span className="text-[#2d7ef7] font-semibold">浏览器</span>
                </div>
              </div>

              {/* Row 2 Icons */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-[#6b7280] pt-1 border-t border-[#e5e7eb]/60">
                <div className="flex flex-col items-center gap-1 opacity-60">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center text-gray-600 text-sm">
                    <i className="fas fa-copy" />
                  </div>
                  <span>复制链接</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-60">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center text-gray-600 text-xs font-bold font-serif">
                    Aa
                  </div>
                  <span>调整字体</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-60">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center text-gray-600 text-sm">
                    <i className="fas fa-book-open" />
                  </div>
                  <span>阅读模式</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-60">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#e5e7eb] flex items-center justify-center text-gray-600 text-sm">
                    <i className="fas fa-rotate" />
                  </div>
                  <span>刷新</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Home Button */}
          <div className="w-full flex justify-center py-1">
            <div className="w-8 h-8 rounded-full border border-[#cbd5e1] bg-white shadow-inner" />
          </div>
        </div>

        {/* Highlight Callout Bubble (Magnifying circle over Browser option) */}
        <div className="absolute top-[32%] left-[4%] sm:left-[8%] -translate-y-1/2 w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-white/95 backdrop-blur shadow-[0_12px_36px_rgba(0,0,0,0.18)] border border-[#e2e8f0] flex flex-col items-center justify-center p-3 text-center pointer-events-none transform -rotate-3 animate-[pulse_3s_ease-in-out_infinite]">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2563eb] to-[#38bdf8] flex items-center justify-center text-white text-3xl shadow-lg mb-2">
            <i className="fas fa-globe" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#1e293b] tracking-tight leading-tight">
            在浏览器中<br />打开
          </span>
        </div>
      </div>

      {/* Bottom Auxiliary Actions & Fast Link Copy */}
      <div className="w-full max-w-sm flex flex-col items-center gap-3 pb-4 z-10">
        <button
          type="button"
          onClick={handleCopyLink}
          className="w-full py-3.5 px-6 rounded-full bg-[#2d7ef7] hover:bg-[#1d6fe6] active:scale-[0.98] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fas fa-link text-xs" />
          <span>{copied ? '✓ 网址已复制，请在浏览器地址栏粘贴打开' : '点此一键复制网址'}</span>
        </button>

        <p className="text-xs text-[#94a3b8] text-center">
          推荐使用 Safari、Chrome、Edge 或手机自带浏览器
        </p>

        {/* Preview Dismiss for Testing */}
        {(onClosePreview || forceShow || window.location.search.includes('wechat') || window.location.search.includes('wx')) && (
          <button
            type="button"
            onClick={() => {
              setIsWeChat(false);
              if (onClosePreview) onClosePreview();
            }}
            className="text-xs text-[#64748b] hover:text-[#0f172a] underline mt-1 py-1 px-3 cursor-pointer"
          >
            [关闭引导，进入网站首页预览]
          </button>
        )}
      </div>
    </div>
  );
}
