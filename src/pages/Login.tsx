import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (mode: 'login' | 'register') => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했어요');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh bg-background max-w-md mx-auto flex flex-col items-center justify-center px-8 gap-4">
      <h1 className="text-xl font-bold mb-2">🛒 우리집 장보기</h1>

      <Input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoComplete="email"
      />
      <Input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit('login')}
        autoComplete="current-password"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2 w-full">
        <Button className="flex-1" onClick={() => handleSubmit('login')} disabled={loading}>
          로그인
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => handleSubmit('register')} disabled={loading}>
          회원가입
        </Button>
      </div>
    </div>
  );
};

export default Login;
