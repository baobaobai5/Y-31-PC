import React from 'react';
import {createRoot} from 'react-dom/client';
import {X} from '@phosphor-icons/react';
import CoinRecharge from '../src/CoinRecharge.jsx';
createRoot(document.getElementById('root')).render(<dialog open className="coin-recharge-dialog" style={{position:'relative',margin:'48px auto'}}><button className="close icon" aria-label="关闭"><X/></button><CoinRecharge wallet={{coins:3840}} onBack={()=>{}}/></dialog>);
