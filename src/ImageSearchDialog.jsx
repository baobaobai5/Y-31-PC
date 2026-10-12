import React, {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {Check, X, UploadSimple} from '@phosphor-icons/react';
import {matchSiteCover, saveImageSearchPreview} from './imageSearch';
import './image-search-dialog.css';

export default function ImageSearchDialog({items, onClose, onSearch}) {
  const dialog = useRef(null), input = useRef(null), url = useRef(null), request = useRef(0);
  const [type, setType] = useState('长视频');
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState({preview: '', busy: false, result: null, error: ''});
  useEffect(() => {
    dialog.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {request.current++; if (url.current) URL.revokeObjectURL(url.current); document.body.style.overflow = previous;};
  }, []);
  async function recognize(preview, selectedType) {
    const ticket = ++request.current;
    setState({preview, busy: true, result: null, error: ''});
    try {
      // Let the browser paint the loading state before processing the image.
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const result = await matchSiteCover(preview, items, selectedType);
      if (request.current !== ticket) return;
      const title = result?.title || '';
      const imageId = await saveImageSearchPreview(preview, title, selectedType);
      if (request.current === ticket) onSearch(title, selectedType, imageId);
    } catch (error) { if (request.current === ticket) setState({preview, busy: false, result: null, error: error.message}); }
  }
  function upload(file) {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      setState(current => ({...current, error: '请上传不超过 10MB 的 JPG、PNG 或 WebP 图片'})); return;
    }
    if (url.current) URL.revokeObjectURL(url.current);
    url.current = URL.createObjectURL(file);
    recognize(url.current, type);
  }
  return createPortal(<dialog ref={dialog} className="image-search-dialog" aria-labelledby="image-search-title" onCancel={e => {e.preventDefault(); onClose();}} onClick={e => {if (e.target === dialog.current) {const rect = dialog.current.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) onClose();}}}>
    <header className="image-dialog-heading"><h2 id="image-search-title"><span className="search-picture-icon" aria-hidden="true"/>以图搜图</h2><button className="image-dialog-close" aria-label="关闭以图搜图" onClick={onClose}><X size={18}/></button></header>
    <div className="image-dialog-body">
      <p className="image-type-label">内容类型选择：</p>
      <div className="image-type-options" role="group" aria-label="图片搜索内容类型">{['长视频','短视频','漫画','帖子'].map(value => <button key={value} className={type === value ? 'selected' : ''} aria-pressed={type === value} onClick={() => {setType(value); if (state.preview) recognize(state.preview, value);}}>{value}{type === value && <Check size={14}/>}</button>)}</div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={e => {upload(e.target.files?.[0]); e.target.value = '';}}/>
      <button disabled={state.busy} aria-busy={state.busy} className={`image-dialog-dropzone${dragging ? ' dragging' : ''}`} onClick={() => input.current?.click()} onDragOver={e => {e.preventDefault(); setDragging(true);}} onDragLeave={() => setDragging(false)} onDrop={e => {e.preventDefault(); setDragging(false); upload(e.dataTransfer.files?.[0]);}}>
        {state.busy ? <><span className="image-upload-spinner" aria-hidden="true"/><span role="status">图片上传中，请稍后</span></> : state.preview ? <img src={state.preview} alt="待识别的封面图片"/> : <span className="image-upload-circle"><UploadSimple size={20}/></span>}
        {!state.busy && <span>{state.preview ? '重新上传图片' : '拖拽图片到此处，或'} {!state.preview && <b>点击上传</b>}</span>}
        <small>支持 JPG、PNG、WebP，最大 10MB</small>
      </button>
      <div className="image-dialog-status" role="status">{state.busy ? '' : state.error || (state.result ? `匹配到：${state.result.title}` : '')}</div>
    </div>
  </dialog>, document.body);
}
