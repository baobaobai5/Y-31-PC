// In-memory demonstration only: no network requests or stored credentials.
export const DEMO_ACCOUNT = { account: 'Wanx1234', password: 'Wanx1234' };
const accounts = new Map([[DEMO_ACCOUNT.account.toLowerCase(), { ...DEMO_ACCOUNT }]]);

export function validateAuth(values, register = false) {
  const errors = {};
  const account = values.account.trim();
  if (!account) errors.account = '请输入账号';
  else if (register && !/^[A-Za-z0-9]{4,10}$/.test(account)) errors.account = '账号需4–10位，仅限英文、数字或组合';
  if (!values.password) errors.password = '请输入密码';
  else if (register && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,8}$/.test(values.password)) errors.password = '密码需6–8位，包含大小写字母和数字';
  if (register && !values.confirm) errors.confirm = '请再次输入密码';
  else if (register && values.password !== values.confirm) errors.confirm = '两次输入的密码不一致';
  return errors;
}

export function submitMockAuth(values, register = false) {
  const errors = validateAuth(values, register);
  if (Object.keys(errors).length) return { errors };
  const account = values.account.trim();
  const key = account.toLowerCase();
  if (register) {
    if (accounts.has(key)) return { errors: { account: '该账号已被注册，请更换' } };
    accounts.set(key, { account, password: values.password });
    return { user: { account } };
  }
  const user = accounts.get(key);
  if (!user) return { errors: { account: '账号不存在，请检查或立即注册' } };
  if (user.password !== values.password) return { errors: { password: '密码不正确，请重新输入' } };
  return { user: { account: user.account } };
}
