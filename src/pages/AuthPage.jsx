import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage() {
  const { signIn, signUp, supabaseConfigured } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  if (!supabaseConfigured) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#06040e', color: '#f5f0ff' }}>
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 22, color: '#d4af37', marginBottom: 12 }}>牌感日记</div>
          <p style={{ color: '#ddd6f0', lineHeight: 1.7, marginBottom: 16 }}>
            请配置 Supabase 环境变量后重启开发服务器。
          </p>
          <code style={{ display: 'block', textAlign: 'left', background: '#130f22', padding: 16, borderRadius: 8, fontSize: 14, color: '#c0b8d8' }}>
            VITE_SUPABASE_URL=...<br />
            VITE_SUPABASE_ANON_KEY=...
          </code>
          <p style={{ color: '#b8aed4', fontSize: 14, marginTop: 16 }}>复制 .env.example 为 .env 并填入你的 Supabase 项目密钥</p>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setMsg('注册成功！请查收邮件确认（若已开启），或直接登录。');
        setMode('login');
      }
    } catch (err) {
      setMsg(err.message || '操作失败');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'radial-gradient(ellipse at 50% 0%, rgba(155,114,207,0.12) 0%, #06040e 60%)' }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#130f22', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 12, padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 13, color: '#d4af37', letterSpacing: '0.2em', marginBottom: 8 }}>✦ ✦ ✦</div>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 22, color: '#f5f0ff' }}>牌感日记</div>
          <div style={{ fontSize: 13, color: '#b8aed4', marginTop: 4 }}>Tarot Journal</div>
        </div>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#ddd6f0', marginBottom: 6 }}>邮箱</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: '#0d0a1a', border: '1px solid rgba(120,100,200,0.2)', borderRadius: 7, color: '#f5f0ff', fontSize: 16 }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#ddd6f0', marginBottom: 6 }}>密码</label>
            <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: '#0d0a1a', border: '1px solid rgba(120,100,200,0.2)', borderRadius: 7, color: '#f5f0ff', fontSize: 16 }} />
          </div>
          {msg && <p style={{ fontSize: 14, color: msg.includes('成功') ? '#27ae60' : '#e07070', marginBottom: 12 }}>{msg}</p>}
          <button type="submit" disabled={busy}
            style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg, #d4af37, #8a6f20)', border: 'none', borderRadius: 7, color: '#06040e', fontWeight: 600, cursor: busy ? 'wait' : 'pointer', fontSize: 16 }}>
            {busy ? '请稍候...' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#b8aed4' }}>
          {mode === 'login' ? '还没有账号？' : '已有账号？'}
          <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMsg(''); }}
            style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer', marginLeft: 6, fontSize: 14 }}>
            {mode === 'login' ? '注册' : '登录'}
          </button>
        </p>
      </div>
    </div>
  );
}
