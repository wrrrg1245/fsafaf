/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

// Default configuration based on puke444.com live api/config.php
const DEFAULT_CONFIG = {
  site: {
    title: "WPK俱乐部 - WePoker官方推荐俱乐部"
  },
  banner: {
    club_label: "WPK俱乐部",
    club_id: "8760606",
    ent_label: "轻序协同企业号",
    ent_id: "1314",
    qr_label: "三条二维码",
    qr_link_text: "点击查看",
    text_wpk: "WPK下载",
    text_qoytlw: "轻序协同下载(联系客服)",
    text_santiao: "三条(联系客服)",
    link_wpk: "https://www.wpk.com",
    link_qoytlw: "https://qoytlw.cn",
    link_santiao: "https://baimokeji.cn/share/index.html?scheme_type=1&qrtype=qr/qiyunxin/person/-PpOKY2BtoRWx9_6fjS7lc3IlPA5cJ-X&verification_code=e5ac2698c445051c0489c927ec5146d3"
  },
  qr: {
    santiao: {
      label: "三条--------直接下载轻序协同联系可客服",
      title: "扫描二维码添加三条",
      image: "/uploads/qr/santiao-1790497235379-a728e0.jpg",
      link: ""
    }
  },
  modal: {
    service: {
      title: "联系在线客服",
      desc: "扫描三条二维码添加好友",
      image: "/uploads/qr/service-1790497384099-a4bb30.jpg"
    },
    id: {
      title: "官方平台 ID"
    }
  },
  contact: {
    telegram: "https://t.me/woshidayu"
  },
  welfare: {
    tag: "新玩家限时礼遇",
    title: "联系客服直接领两百",
    subtext: "无门槛体验礼金 · 真实有效 · 极速到账",
    btn_text: "立即联系领取"
  }
};

type LangType = 'zh-CN' | 'zh-TW' | 'en';

const I18N: Record<LangType, Record<string, string>> = {
  'zh-CN': {
    'nav-home': '首页',
    'nav-download': '游戏下载',
    'nav-support': '在线客服',
    'text-club-id': 'WPK俱乐部',
    'text-yxt-id': '轻序协同企业号',
    'text-st-id': '三条二维码',
    'copy-hint': '点击右侧按钮复制',
    'copy-btn': '复制',
    'contact-st': '联系三条客服',
    'back-to-qr': '< 返回',
    'copied': '复制成功: ',
    'open-link': '打开对应链接',
    'admin-title': '站点快速配置面板',
    'admin-save': '保存配置',
    'admin-reset': '恢复默认配置',
    'admin-close': '关闭',
    'welfare-tag': '新玩家限时礼遇',
    'welfare-title': '联系客服直接领两百',
    'welfare-sub': '无门槛体验礼金 · 真实有效 · 极速到账',
    'welfare-btn': '立即联系领取',
    'welfare-copy-id': '复制客服ID'
  },
  'zh-TW': {
    'nav-home': '首頁',
    'nav-download': '遊戲下載',
    'nav-support': '在線客服',
    'text-club-id': 'WPK俱樂部',
    'text-yxt-id': '輕序協同企業號',
    'text-st-id': '三條二維碼',
    'copy-hint': '點擊右側按鈕復制',
    'copy-btn': '復制',
    'contact-st': '聯系三條客服',
    'back-to-qr': '< 返回',
    'copied': '復制成功: ',
    'open-link': '打開對應鏈接',
    'admin-title': '站點快速配置面板',
    'admin-save': '保存配置',
    'admin-reset': '恢復默認配置',
    'admin-close': '關閉',
    'welfare-tag': '新玩家限時禮遇',
    'welfare-title': '聯系客服直接領兩百',
    'welfare-sub': '無門檻體驗禮金 · 真实有效 · 極速到賬',
    'welfare-btn': '立即聯系領取',
    'welfare-copy-id': '復制客服ID'
  },
  'en': {
    'nav-home': 'Home',
    'nav-download': 'Download Game',
    'nav-support': 'Customer Support',
    'text-club-id': 'WPK Club',
    'text-yxt-id': 'Enterprise ID',
    'text-st-id': 'Santiao QR',
    'copy-hint': 'Click button on the right to copy',
    'copy-btn': 'Copy',
    'contact-st': 'Contact Santiao Support',
    'back-to-qr': '< Back',
    'copied': 'Copied successfully: ',
    'open-link': 'Open link',
    'admin-title': 'Site Configuration Settings',
    'admin-save': 'Save Settings',
    'admin-reset': 'Reset to Default',
    'admin-close': 'Close',
    'welfare-tag': 'Exclusive Bonus',
    'welfare-title': 'Contact Support to Claim 200 Directly',
    'welfare-sub': 'Free Trial Bonus · Verified & Instant · 24/7 Available',
    'welfare-btn': 'Claim 200 Now',
    'welfare-copy-id': 'Copy Support ID'
  }
};

export default function App() {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('PUKE444_CONFIG');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_CONFIG;
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [lang, setLang] = useState<LangType>('zh-CN');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editConfig, setEditConfig] = useState(config);

  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from remote API if available
  useEffect(() => {
    fetch('/api/config.php')
      .then(res => res.json())
      .then(data => {
        if (data && data.ok && data.config) {
          // Merge with local config if not customized
          if (!localStorage.getItem('PUKE444_CONFIG')) {
            setConfig((prev: typeof DEFAULT_CONFIG) => ({ ...prev, ...data.config }));
          }
        }
      })
      .catch(() => {});
  }, []);

  // Update document title
  useEffect(() => {
    if (config.site?.title) {
      document.title = config.site.title;
    }
  }, [config.site?.title]);

  // Slideshow auto-advance
  useEffect(() => {
    const startTimer = () => {
      if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev === 0 ? 1 : 0));
      }, 5000);
    };

    startTimer();

    return () => {
      if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    };
  }, []);

  const moveSlide = (dir: number) => {
    if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    setCurrentSlide(prev => {
      if (dir > 0) return prev === 0 ? 1 : 0;
      return prev === 1 ? 0 : 1;
    });
    // Restart interval
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev === 0 ? 1 : 0));
    }, 5000);
  };

  const copyText = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const input = document.createElement('input');
      input.setAttribute('value', text);
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    const msg = `${I18N[lang]['copied']}${text}`;
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const openModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig(editConfig);
    localStorage.setItem('PUKE444_CONFIG', JSON.stringify(editConfig));
    setShowAdminModal(false);
    setToastMessage('配置保存成功！');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleResetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    setEditConfig(DEFAULT_CONFIG);
    localStorage.removeItem('PUKE444_CONFIG');
    setShowAdminModal(false);
    setToastMessage('已恢复官方默认配置！');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const langLabel = lang === 'en' ? 'EN' : lang === 'zh-TW' ? 'HK' : 'CN';

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[2000] bg-[#02afa7] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-semibold border border-white/20 animate-bounce">
          <i className="fas fa-check-circle" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header>
        <div className="header-content">
          <div className="logo-section">
            <a href="#" className="logo-link flex items-center">
              <img src="/static/picture/logo.webp" alt="WPK Logo" />
            </a>
            <div className="certification-badge">
              <img src="/static/picture/Labs.webp" alt="Certified" />
            </div>
          </div>
          <nav>
            <ul>
              <li>
                <a href="#" className="active">
                  {I18N[lang]['nav-home']}
                </a>
              </li>
              <li>
                <a href={config.banner?.link_wpk || "https://www.wpk.com"} target="_blank" rel="noreferrer">
                  {I18N[lang]['nav-download']}
                </a>
              </li>
              <li className="lang-switch-container group">
                <div className="lang-current flex items-center gap-1.5" id="langBtn">
                  <i className="fas fa-globe" />
                  <span id="currentLangText">{langLabel}</span>
                  <i className="fas fa-chevron-down text-[10px] opacity-70 ml-0.5" />
                </div>
                <ul className="lang-dropdown group-hover:block hidden">
                  <li onClick={() => setLang('zh-CN')}>简体中文</li>
                  <li onClick={() => setLang('zh-TW')}>繁體中文</li>
                  <li onClick={() => setLang('en')}>English</li>
                </ul>
              </li>
              {/* Discreet site settings cog */}
              <li>
                <button
                  type="button"
                  title="配置站点参数"
                  onClick={() => {
                    setEditConfig(config);
                    setShowAdminModal(true);
                  }}
                  className="text-white/40 hover:text-white transition-colors p-1 text-sm flex items-center"
                >
                  <i className="fas fa-sliders" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Banner Container */}
      <section className="banner-container">
        <div className="slider-wrapper" id="sliderWrapper">
          {/* Slide 1 */}
          <div className={`slide ${currentSlide === 0 ? 'active' : ''}`}>
            <img src="/static/picture/beijing1.webp" className="layer-bg" alt="背景1" />
            <img src="/static/picture/10003.webp" className="layer-float item-char-1" alt="人物1" />
            <img src="/static/picture/10004.webp" className="layer-float item-text-1" alt="标题1" />
          </div>

          {/* Slide 2 */}
          <div className={`slide ${currentSlide === 1 ? 'active' : ''}`}>
            <img src="/static/picture/10006.webp" className="layer-bg" alt="背景2" />
            <img src="/static/picture/10007.webp" className="layer-float item-char-2" alt="人物2" />
            <img src="/static/picture/10008.webp" className="layer-float item-text-2" alt="标题2" />
          </div>
        </div>

        {/* Carousel Arrows */}
        <button className="arrow prev" onClick={() => moveSlide(-1)} aria-label="Previous Slide">
          &#10094;
        </button>
        <button className="arrow next" onClick={() => moveSlide(1)} aria-label="Next Slide">
          &#10095;
        </button>

        {/* Banner Bottom Section: 福利说明框 + 下载按钮组 */}
        <div className="banner-bottom-section">
          {/* 福利说明框 (Welfare Promo Box) */}
          <div className="welfare-card p-3 md:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-3 md:gap-3.5 w-full sm:w-auto">
              {/* Glowing Gift/Coin Emblem */}
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 flex items-center justify-center text-gray-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)] shrink-0">
                <i className="fas fa-gift text-base md:text-lg animate-pulse" />
              </div>

              {/* Welfare content */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] md:text-[11px] font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {config.welfare?.tag || I18N[lang]['welfare-tag']}
                  </span>
                  <span className="text-[10px] text-white/30 hidden md:inline">|</span>
                  <span className="text-[11px] text-white/60 hidden md:inline">
                    {config.welfare?.subtext || I18N[lang]['welfare-sub']}
                  </span>
                </div>
                <div className="text-base md:text-lg font-bold text-white tracking-wide flex items-center gap-1 mt-0.5">
                  <span>联系客服直接领</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200 text-xl md:text-2xl font-black drop-shadow-[0_2px_10px_rgba(250,204,21,0.6)]">
                    两百
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Claim Button + One-Click ID Copy */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => copyText(config.banner?.ent_id || '1314')}
                title="一键复制企业客服ID"
                className="hidden lg:flex items-center gap-1.5 text-xs text-amber-200/90 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-full border border-amber-400/25 transition-all cursor-pointer"
              >
                <i className="fas fa-copy text-[11px] text-amber-400" />
                <span>{I18N[lang]['welfare-copy-id']}: <strong className="text-[#4db8ff] font-mono">{config.banner?.ent_id || '1314'}</strong></span>
              </button>

              <button
                type="button"
                onClick={() => openModal('serviceModal')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-gray-950 font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.45)] hover:shadow-[0_0_30px_rgba(245,158,11,0.75)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <i className="fas fa-comments text-xs" />
                <span>{config.welfare?.btn_text || I18N[lang]['welfare-btn']}</span>
                <i className="fas fa-chevron-right text-xs" />
              </button>
            </div>
          </div>

          {/* Banner Action Buttons */}
          <div className="action-buttons-container">
            {/* Button 1: WPK下载 */}
            <div className="banner-btn-item">
              <a
                href={config.banner?.link_wpk || "https://www.wpk.com"}
                className="download-btn"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fas fa-gamepad" />
                <span>{config.banner?.text_wpk || 'WPK下载'}</span>
              </a>
              <div
                className="id-display-text cursor-pointer hover:border-white/40 transition-colors"
                onClick={() => copyText(config.banner?.club_id || '8760606')}
                title="点击复制俱乐部ID"
              >
                <span>{config.banner?.club_label || I18N[lang]['text-club-id']}</span>:
                <span className="highlight-id">{config.banner?.club_id || '8760606'}</span>
              </div>
            </div>

            {/* Button 2: 轻序协同下载(联系客服) */}
            <div className="banner-btn-item">
              <a
                href={config.banner?.link_qoytlw || "https://qoytlw.cn"}
                className="download-btn"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fas fa-comment-dots" />
                <span>{config.banner?.text_qoytlw || '轻序协同下载(联系客服)'}</span>
              </a>
              <div
                className="id-display-text cursor-pointer hover:border-white/40 transition-colors"
                onClick={() => copyText(config.banner?.ent_id || '1314')}
                title="点击复制企业号"
              >
                <span>{config.banner?.ent_label || I18N[lang]['text-yxt-id']}</span>:
                <span className="highlight-id">{config.banner?.ent_id || '1314'}</span>
              </div>
            </div>

            {/* Button 3: 三条(联系客服) */}
            <div className="banner-btn-item">
              <a
                href={config.banner?.link_santiao || "#"}
                className="download-btn"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fas fa-layer-group" />
                <span>{config.banner?.text_santiao || '三条(联系客服)'}</span>
              </a>
              <div className="id-display-text">
                <span>{config.banner?.qr_label || I18N[lang]['text-st-id']}</span>:
                <span
                  className="highlight-id cursor-pointer underline hover:text-[#7ad0ff]"
                  onClick={() => openModal('qrModal')}
                >
                  {config.banner?.qr_link_text || '点击查看'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Site Footer */}
      <footer className="site-footer">
        <div className="footer-logo">
          <img src="/static/picture/logo.webp" alt="WPK俱乐部" />
        </div>
        <div className="footer-divider" />
        <div className="copyright">Copyright © WePoker. All Rights Reserved.</div>
      </footer>

      {/* Modal 1: Service Modal (联系在线客服) */}
      <div
        id="serviceModal"
        className={`modal-overlay ${activeModal === 'serviceModal' ? 'show' : ''}`}
        onClick={closeModal}
      >
        <div
          className="modal-content"
          onClick={e => e.stopPropagation()}
        >
          <span className="close-btn" onClick={closeModal}>
            &times;
          </span>
          <h3 className="modal-title">{config.modal?.service?.title || '联系在线客服'}</h3>
          <button
            type="button"
            onClick={() => openModal('idModal')}
            className="contact-btn whatsapp-btn mt-4"
          >
            <i className="fas fa-id-card" />
            <span>{config.banner?.ent_label || '轻序协同'}ID {config.banner?.ent_id || '1314'}</span>
          </button>
        </div>
      </div>

      {/* Modal 2: ID Modal (官方平台 ID) */}
      <div
        id="idModal"
        className={`modal-overlay ${activeModal === 'idModal' ? 'show' : ''}`}
        onClick={closeModal}
      >
        <div
          className="modal-content"
          onClick={e => e.stopPropagation()}
        >
          <span className="close-btn" onClick={closeModal}>
            &times;
          </span>
          <h3 className="modal-title">{config.modal?.id?.title || '官方平台 ID'}</h3>
          <p className="modal-desc">{I18N[lang]['copy-hint']}</p>
          <div className="id-row-item">
            <div className="id-info">
              <span className="id-label">{config.banner?.ent_label || '轻序协同企业号'}:</span>
              <span className="id-value" id="idModalValue">
                {config.banner?.ent_id || '1314'}
              </span>
            </div>
            <button
              type="button"
              className="copy-btn"
              onClick={() => copyText(config.banner?.ent_id || '1314')}
            >
              {I18N[lang]['copy-btn']}
            </button>
          </div>
          <a
            href={config.banner?.link_santiao || "https://baimokeji.cn"}
            className="copy-btn block text-center !w-full !py-3 !rounded-lg !text-sm !font-semibold mb-3 hover:opacity-90"
            target="_blank"
            rel="noreferrer"
          >
            {I18N[lang]['contact-st']}
          </a>
          <div className="mt-3.5">
            <button
              type="button"
              onClick={() => openModal('serviceModal')}
              className="text-[13px] text-[#666] hover:text-[#999] transition-colors bg-transparent border-0 cursor-pointer"
            >
              {I18N[lang]['back-to-qr']}
            </button>
          </div>
        </div>
      </div>

      {/* Modal 3: QR Modal (扫描二维码添加三条) */}
      <div
        id="qrModal"
        className={`modal-overlay ${activeModal === 'qrModal' ? 'show' : ''}`}
        onClick={closeModal}
      >
        <div
          className="modal-content light-theme"
          onClick={e => e.stopPropagation()}
        >
          <span className="close-btn" onClick={closeModal}>
            &times;
          </span>
          <h2
            id="qrModalTitle"
            className="text-lg font-bold text-gray-800 mb-3.5"
          >
            {config.qr?.santiao?.title || '扫描二维码添加三条'}
          </h2>
          <img
            id="qrModalImage"
            src={config.qr?.santiao?.image || '/uploads/qr/santiao-1790497235379-a728e0.jpg'}
            alt="二维码"
            className="qr-image"
          />
          <p
            id="qrModalLabel"
            className="modal-desc text-xs text-[#999] mt-1.5 mb-2 px-2 break-words"
          >
            {config.qr?.santiao?.label || '三条--------直接下载轻序协同联系可客服'}
          </p>
          {config.qr?.santiao?.link && (
            <a
              id="qrModalLink"
              href={config.qr.santiao.link}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2.5 text-[13px] text-[#02afa7] underline"
            >
              {I18N[lang]['open-link']}
            </a>
          )}
        </div>
      </div>

      {/* Modal 4: Fast Admin Config Modal */}
      {showAdminModal && (
        <div
          className="modal-overlay show"
          onClick={() => setShowAdminModal(false)}
        >
          <div
            className="modal-content !max-w-[480px] text-left max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <i className="fas fa-sliders text-[#02afa7]" />
                {I18N[lang]['admin-title']}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-white text-xl"
                onClick={() => setShowAdminModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">网站标题 (Page Title)</label>
                <input
                  type="text"
                  value={editConfig.site?.title || ''}
                  onChange={e => setEditConfig({
                    ...editConfig,
                    site: { ...editConfig.site, title: e.target.value }
                  })}
                  className="w-full bg-[#111] border border-gray-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 mb-1">俱乐部名称</label>
                  <input
                    type="text"
                    value={editConfig.banner?.club_label || ''}
                    onChange={e => setEditConfig({
                      ...editConfig,
                      banner: { ...editConfig.banner, club_label: e.target.value }
                    })}
                    className="w-full bg-[#111] border border-gray-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">俱乐部 ID</label>
                  <input
                    type="text"
                    value={editConfig.banner?.club_id || ''}
                    onChange={e => setEditConfig({
                      ...editConfig,
                      banner: { ...editConfig.banner, club_id: e.target.value }
                    })}
                    className="w-full bg-[#111] border border-gray-700 rounded px-2.5 py-1.5 text-white text-[#4db8ff] font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 mb-1">企业客服名称</label>
                  <input
                    type="text"
                    value={editConfig.banner?.ent_label || ''}
                    onChange={e => setEditConfig({
                      ...editConfig,
                      banner: { ...editConfig.banner, ent_label: e.target.value }
                    })}
                    className="w-full bg-[#111] border border-gray-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">企业号 ID</label>
                  <input
                    type="text"
                    value={editConfig.banner?.ent_id || ''}
                    onChange={e => setEditConfig({
                      ...editConfig,
                      banner: { ...editConfig.banner, ent_id: e.target.value }
                    })}
                    className="w-full bg-[#111] border border-gray-700 rounded px-2.5 py-1.5 text-white text-[#4db8ff] font-bold"
                  />
                </div>
              </div>

              <div className="border border-amber-500/30 p-2.5 rounded-lg bg-amber-950/20 space-y-2">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <i className="fas fa-gift text-xs" />
                  <span>福利说明框配置</span>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">福利说明主要内容 (Headline)</label>
                  <input
                    type="text"
                    value={editConfig.welfare?.title || '联系客服直接领两百'}
                    onChange={e => setEditConfig({
                      ...editConfig,
                      welfare: { ...editConfig.welfare, title: e.target.value }
                    })}
                    className="w-full bg-[#111] border border-gray-700 rounded px-2.5 py-1.5 text-white font-semibold text-amber-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-400 mb-1">福利标签 (Tag)</label>
                    <input
                      type="text"
                      value={editConfig.welfare?.tag || '新玩家限时礼遇'}
                      onChange={e => setEditConfig({
                        ...editConfig,
                        welfare: { ...editConfig.welfare, tag: e.target.value }
                      })}
                      className="w-full bg-[#111] border border-gray-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">按钮文字</label>
                    <input
                      type="text"
                      value={editConfig.welfare?.btn_text || '立即联系领取'}
                      onChange={e => setEditConfig({
                        ...editConfig,
                        welfare: { ...editConfig.welfare, btn_text: e.target.value }
                      })}
                      className="w-full bg-[#111] border border-gray-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">微说明 (Subtext)</label>
                  <input
                    type="text"
                    value={editConfig.welfare?.subtext || '无门槛体验礼金 · 真实有效 · 极速到账'}
                    onChange={e => setEditConfig({
                      ...editConfig,
                      welfare: { ...editConfig.welfare, subtext: e.target.value }
                    })}
                    className="w-full bg-[#111] border border-gray-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Telegram 客服链接</label>
                <input
                  type="text"
                  value={editConfig.contact?.telegram || ''}
                  onChange={e => setEditConfig({
                    ...editConfig,
                    contact: { ...editConfig.contact, telegram: e.target.value }
                  })}
                  className="w-full bg-[#111] border border-gray-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">WPK 下载链接</label>
                <input
                  type="text"
                  value={editConfig.banner?.link_wpk || ''}
                  onChange={e => setEditConfig({
                    ...editConfig,
                    banner: { ...editConfig.banner, link_wpk: e.target.value }
                  })}
                  className="w-full bg-[#111] border border-gray-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">轻序协同下载链接</label>
                <input
                  type="text"
                  value={editConfig.banner?.link_qoytlw || ''}
                  onChange={e => setEditConfig({
                    ...editConfig,
                    banner: { ...editConfig.banner, link_qoytlw: e.target.value }
                  })}
                  className="w-full bg-[#111] border border-gray-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">三条联系链接</label>
                <input
                  type="text"
                  value={editConfig.banner?.link_santiao || ''}
                  onChange={e => setEditConfig({
                    ...editConfig,
                    banner: { ...editConfig.banner, link_santiao: e.target.value }
                  })}
                  className="w-full bg-[#111] border border-gray-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">客服二维码图片路径</label>
                <input
                  type="text"
                  value={editConfig.modal?.service?.image || ''}
                  onChange={e => setEditConfig({
                    ...editConfig,
                    modal: {
                      ...editConfig.modal,
                      service: { ...editConfig.modal.service, image: e.target.value }
                    }
                  })}
                  className="w-full bg-[#111] border border-gray-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/10 gap-2">
                <button
                  type="button"
                  onClick={handleResetConfig}
                  className="px-3 py-1.5 rounded bg-red-900/50 hover:bg-red-900 text-red-200 transition-colors"
                >
                  {I18N[lang]['admin-reset']}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(false)}
                    className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
                  >
                    {I18N[lang]['admin-close']}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-[#02afa7] hover:bg-[#02958e] text-white font-semibold"
                  >
                    {I18N[lang]['admin-save']}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
