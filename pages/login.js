import { auth, provider, signInWithPopup } from '../lib/firebase';

export default function LoginPage() {
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User logged in:", result.user);
      alert(`Welcome ${result.user.displayName}`);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Login to CollabSphere</h1>
      <button onClick={loginWithGoogle} style={{ padding: '10px 20px', marginTop: '20px', background: '#4285F4', color: '#fff', border: 'none', borderRadius: '5px' }}>
        Sign in with Google
      </button>
    </div>
  );
}
