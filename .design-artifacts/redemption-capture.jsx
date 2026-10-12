import React from 'react';
import {createRoot} from 'react-dom/client';
import RedemptionDialog from '../src/RedemptionDialog';
import '../src/styles.css';
const empty=new URLSearchParams(location.search).get('empty')==='1';
sessionStorage.setItem('wanxiang-redemptions-figma-export',JSON.stringify(empty?[]:Array.from({length:4},(_,i)=>({code:'KIOUY0987766',date:'2025-09-12',reward:'VIP 体验卡',id:`export-${i}`}))));
createRoot(document.getElementById('root')).render(<RedemptionDialog account="figma-export" onClose={()=>{}}/>);
