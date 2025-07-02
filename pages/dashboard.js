// pages/dashboard.js

import { useEffect, useState } from 'react';
import { auth, signOut } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else router.push('/login'); // redirect to login if not signed in
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (!user) return <p>Loading user...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user.displayName}</h2>
      <img src={user.photoURL} alt="Profile" style={{ borderRadius: '50%', width: 80 }} />
      <p>Email: {user.email}</p>
      <button onClick={handleLogout} style={{ marginTop: 20 }}>Logout</button>
    </div>
  );
}
