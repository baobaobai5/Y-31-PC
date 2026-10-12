import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeSlash, CheckCircle, CircleNotch } from '@phosphor-icons/react';
import { DEMO_ACCOUNT, validateAuth, submitMockAuth } from './mockAuth';
import './auth.css';

export default function AuthPanel({ onAuthenticated, onContinue }) {
  const [register, setRegister] = useState(false);
  const [values, setValues] = useState({ account: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState({});
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();
  const firstInput = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (!success) firstInput.current?.focus(); }, [register, success]);
  const fields = register ? ['account', 'password', 'confirm'] : ['account', 'password'];
  const canSubmit = fields.every(key => values[key].trim()) && !busy;
  const changeMode = () => {
    setRegister(value => !value); setSuccess(false); setErrors({}); setVisible({});
    setValues(value => ({ account: success ? value.account : '', password: '', confirm: '' }));
  };
  function submit(event) {
    event.preventDefault();
    if (busy) return;
    const nextErrors = validateAuth(values, register);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.getElementById(`auth-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }
    setBusy(true);
    timer.current = setTimeout(() => {
      const result = submitMockAuth(values, register);
      setBusy(false);
      if (result.errors) {
        setErrors(result.errors);
        document.getElementById(`auth-${Object.keys(result.errors)[0]}`)?.focus();
      } else {
        setSuccess(true);
        setValues(value => ({ ...value, password: '', confirm: '' }));
        if (!register) onAuthenticated(result.user);
      }
    }, 500);
  }
  return <div className="auth-panel">
    <img className="auth-brand" src="/assets/logo.svg" alt="万象" width="108" height="32" />
    <div className="auth-heading" aria-live="polite">
      {success && <CheckCircle className="auth-success-icon" size={40} weight="duotone" />}
      <h2>{success ? (register ? '注册成功' : '登录成功') : register ? '账号注册' : '欢迎登录'}</h2>
      <p>{success ? (register ? '账号已创建，欢迎加入万象' : '欢迎回来，继续探索你的万象世界') : register ? '创建账号，开启你的万象世界' : '欢迎回来，请登录您的账号'}</p>
    </div>
    {success ? <div className="auth-success" role="status">
      <p>账号：<strong>{values.account.trim()}</strong></p>
      {register && <p>使用刚创建的账号登录，即可继续浏览与收藏。</p>}
      <button className="auth-submit" autoFocus onClick={register ? changeMode : onContinue}>{register ? '立即登录' : '开始探索'}</button>
    </div> : <form onSubmit={submit} noValidate aria-busy={busy}>
      {fields.map(key => {
        const password = key !== 'account';
        const label = { account: '账号', password: '密码', confirm: '确认密码' }[key];
        const placeholder = key === 'account' ? (register ? '4–10位英文、数字或组合' : '请输入账号') : key === 'confirm' ? '请再次输入密码' : register ? '6–8位，包含大小写字母和数字' : '请输入密码';
        return <div className="auth-field" key={key}>
          <label htmlFor={`auth-${key}`}>{label}</label>
          <div className={`auth-input-wrap${errors[key] ? ' has-error' : ''}`}>
            <input ref={key === 'account' ? firstInput : undefined} id={`auth-${key}`} name={key} type={password && !visible[key] ? 'password' : 'text'} value={values[key]} placeholder={placeholder} autoComplete={password ? (register ? 'new-password' : 'current-password') : 'username'} autoCapitalize="none" spellCheck={false} disabled={busy} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `auth-${key}-error` : undefined} onChange={event => {
              setValues(value => ({ ...value, [key]: event.target.value }));
              setErrors(current => ({ ...current, [key]: undefined, ...(key === 'password' ? { confirm: undefined } : {}) }));
            }} />
            {password && <button type="button" className="auth-eye" aria-label={`${visible[key] ? '隐藏' : '显示'}${label}`} aria-pressed={!!visible[key]} disabled={busy} onClick={() => setVisible(value => ({ ...value, [key]: !value[key] }))}>{visible[key] ? <Eye size={20} /> : <EyeSlash size={20} />}</button>}
          </div>
          {errors[key] && <p className="auth-error" id={`auth-${key}-error`} role="alert">{errors[key]}</p>}
        </div>;
      })}
      <p className="auth-switch">{register ? '已有账号？' : '还没有账号？'}<button type="button" onClick={changeMode} disabled={busy}>{register ? '立即登录' : '立即注册'}</button></p>
      <button type="submit" className="auth-submit" disabled={!canSubmit}>{busy && <CircleNotch size={18} className="auth-spinner" />}{busy ? (register ? '注册中…' : '登录中…') : register ? '注册' : '登录'}</button>
      <div className="auth-demo"><span>本地演示 · 注册账号刷新后重置</span>{!register && <button type="button" disabled={busy} onClick={() => { setValues({ ...DEMO_ACCOUNT, confirm: '' }); setErrors({}); }}>填入演示账号</button>}</div>
    </form>}
  </div>;
}
