import React, {createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {BookOpen, Eye, Heart, Play} from '@phosphor-icons/react';
import './content-card-preview.css';

const PreviewContext = createContext(null);
const storageKey = 'wanxiang-content-preferences';

function readPreferences() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}

export function ContentPreviewProvider({children}) {
  const [preview, setPreview] = useState(null);
  const [position, setPosition] = useState(null);
  const [preferences, setPreferences] = useState(readPreferences);
  const [announcement, setAnnouncement] = useState('');
  const panel = useRef(null);
  const active = useRef(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);
  const previewId = useId();

  const keepOpen = useCallback(() => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  }, []);
  const close = useCallback((restoreFocus = false) => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    const anchor = active.current?.anchor;
    active.current = null;
    setPreview(null);
    setPosition(null);
    if (restoreFocus && anchor?.isConnected) anchor.focus({preventScroll:true});
  }, []);
  const leave = useCallback(() => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => close(), 120);
  }, [close]);
  const open = useCallback((data, anchor, keyboard = false) => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    if (active.current?.anchor === anchor) return;
    const show = () => {
      if (!anchor?.isConnected || document.querySelector('dialog[open]')) return;
      const next = {...data, anchor, keyboard};
      active.current = next;
      setPosition(null);
      setAnnouncement('');
      setPreview(next);
    };
    if (keyboard) show();
    else openTimer.current = setTimeout(show, 200);
  }, []);

  useEffect(() => () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (!preview) return;
    const dismiss = event => {
      if (panel.current?.contains(event.target) || preview.anchor.contains(event.target)) return;
      close();
    };
    const onScroll = event => { if (!panel.current?.contains(event.target)) close(); };
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close(panel.current?.contains(document.activeElement));
      }
    };
    const onResize = () => close();
    const onVisibility = () => { if (document.hidden) close(); };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [preview, close]);

  useLayoutEffect(() => {
    if (!preview || !panel.current) return;
    const cover = preview.anchor.querySelector('.video-cover') || preview.anchor;
    const rect = cover.getBoundingClientRect();
    const width = Math.min(window.innerWidth - 24, Math.max(340, Math.min(400, rect.width * 1.22)));
    panel.current.style.width = `${width}px`;
    const height = panel.current.getBoundingClientRect().height;
    const headerBottom = document.querySelector('.header')?.getBoundingClientRect().bottom || 0;
    const maxTop = Math.max(12, window.innerHeight - height - 28);
    const top = Math.min(maxTop, Math.max(Math.min(headerBottom + 12, maxTop), rect.top - 32));
    const left = Math.max(12, Math.min(window.innerWidth - width - 12, rect.left + (rect.width - width) / 2));
    setPosition({width, top, left});
  }, [preview]);

  useLayoutEffect(() => {
    if (preview?.keyboard && position) panel.current?.querySelector('button')?.focus({preventScroll:true});
  }, [preview, position]);

  function toggleLike() {
    const key = `${preview.type}:${preview.item.id}`;
    const nextValue = !preferences[key]?.liked;
    const next = {...preferences, [key]: {...preferences[key], liked: nextValue}};
    setPreferences(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Keep controls usable when browser storage is unavailable. */ }
    setAnnouncement(nextValue ? '已喜欢' : '已取消喜欢');
  }

  function openDetail() {
    const current = preview;
    close();
    current.onOpen(current.item);
  }

  function handlePanelKeyDown(event) {
    if (event.key !== 'Tab') return;
    const buttons = [...panel.current.querySelectorAll('button')];
    if (event.shiftKey && event.target === buttons[0]) {
      event.preventDefault();
      close(true);
    } else if (!event.shiftKey && event.target === buttons.at(-1)) {
      // Return to the source card so normal tab order continues at the next card.
      close(true);
    }
  }

  const selected = preview ? preferences[`${preview.type}:${preview.item.id}`] || {} : {};
  const isReading = preview && ['漫画', '帖子'].includes(preview.type);
  const primaryLabel = isReading ? (preview.type === '漫画' ? '查看漫画' : '阅读帖子') : '立即播放';
  return <PreviewContext.Provider value={{open, leave, keepOpen, close, previewId, activeAnchor:preview?.anchor, panel}}>
    {children}
    {preview && createPortal(<section
      ref={panel} id={previewId} role="dialog" aria-modal="false" aria-label={`${preview.item.title}内容预览`}
      className={`content-card-preview${position ? ' is-positioned' : ''}`}
      style={position || {visibility:'hidden'}}
      onPointerEnter={keepOpen} onPointerLeave={leave} onFocus={keepOpen}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== preview.anchor && !event.currentTarget.matches(':hover')) leave(); }}
      onKeyDown={handlePanelKeyDown}
    >
      <div className="content-preview-cover">
        <div className="content-preview-art" aria-hidden="true">{preview.art}</div>
        {preview.aggregation ? <span className="content-preview-type is-trending">{(preview.item.id-1)%4===0 ? 'HOT' : 'NEW'}</span> : preview.accessLabel ? <span className={`video-access content-preview-access access-type-${preview.accessType}`} aria-label={`付费标识：${preview.accessLabel}`}>{preview.accessLabel}</span> : <span className="content-preview-type">{preview.type}</span>}
        <h3>{preview.item.title}</h3>
        <button className="content-preview-cover-link" aria-label={`${isReading ? '查看' : '播放'}${preview.item.title}详情`} onClick={openDetail}/>
      </div>
      <div className="content-preview-body">
        <div className="content-preview-tags">{preview.details.tags.slice(0,3).map(tag => <span key={tag}>{tag}</span>)}</div>
        <p className="content-preview-description">{preview.item.description}</p>
        <div className="content-preview-status"><span aria-label={`${isReading ? '阅读量' : '播放量'} ${preview.details.views}`}>{isReading ? <Eye aria-hidden="true"/> : <Play aria-hidden="true"/>}{preview.details.views}</span><span aria-label={`喜欢量 ${preview.details.likes}`}><Heart aria-hidden="true"/>{preview.details.likes}</span></div>
        <div className="content-preview-actions">
          <button className="content-preview-primary" onClick={openDetail}>{isReading ? <BookOpen size={21} weight="fill"/> : <Play size={22} weight="fill"/>}<span>{primaryLabel}</span></button>
          <button className={`content-preview-icon${selected.liked ? ' is-selected' : ''}`} aria-label={selected.liked ? '取消喜欢' : '喜欢'} title={selected.liked ? '取消喜欢' : '喜欢'} aria-pressed={Boolean(selected.liked)} onClick={toggleLike}><Heart size={22} weight={selected.liked ? 'fill' : 'regular'}/></button>
        </div>
        <span className="content-preview-announcement" role="status">{announcement}</span>
      </div>
    </section>, document.body)}
  </PreviewContext.Provider>;
}

export function useContentPreview(data) {
  const context = useContext(PreviewContext);
  const anchor = useRef(null);
  const expanded = Boolean(context && context.activeAnchor === anchor.current);
  return {
    ref:anchor,
    'aria-haspopup':context ? 'dialog' : undefined,
    'aria-expanded':context ? expanded : undefined,
    'aria-controls':expanded ? context.previewId : undefined,
    onPointerEnter:event => {
      if (event.pointerType === 'mouse' && window.matchMedia('(any-hover: hover)').matches) context?.open(data, anchor.current);
    },
    onPointerLeave:() => context?.leave(),
    onKeyDown:event => {
      if (!context) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (expanded) context.panel.current?.querySelector('button')?.focus();
        else context.open(data, anchor.current, true);
      } else if (event.key === 'Tab' && !event.shiftKey && expanded) {
        event.preventDefault();
        context.panel.current?.querySelector('button')?.focus();
      }
    }
  };
}
