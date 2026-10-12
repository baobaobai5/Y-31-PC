import React, {useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {X} from '@phosphor-icons/react';

export default function ImagePreview({src, onClose}) {
  const dialog = useRef(null);
  useEffect(() => {
    dialog.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {document.body.style.overflow = previous;};
  }, []);
  return createPortal(<dialog className="search-large-image" ref={dialog} aria-label="上传图片大图预览" onCancel={e => {e.preventDefault(); onClose();}} onClick={e => {if (e.target === dialog.current) onClose();}}>
    <button className="search-large-image-close" aria-label="关闭大图预览" onClick={onClose}><X size={24}/></button>
    <img src={src} alt="上传图片大图"/>
  </dialog>, document.body);
}
