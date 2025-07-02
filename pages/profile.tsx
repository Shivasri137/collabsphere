// pages/profile.tsx

import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setName(u.displayName || '');
      } else {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdate = async () => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      alert('✅ Name updated locally!');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <h2>👤 Profile</h2>
      <p><strong>Name:</strong> {user.displayName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>User ID:</strong> {user.uid}</p>

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Update Display Name"
          style={styles.input}
        />
        <button onClick={handleUpdate} style={styles.button}>✏️ Update Name</button>
      </div>

      <button onClick={handleLogout} style={styles.logout}>🚪 Logout</button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 600,
    margin: '50px auto',
    padding: 30,
    border: '1px solid #ddd',
    borderRadius: 10,
    backgroundColor: '#070445',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    fontFamily: 'Arial, sans-serif',
  },
  input: {
    padding: 10,
    marginRight: 10,
    border: '1px solid #ccc',
    borderRadius: 6,
    width: '70%',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  logout: {
    marginTop: 20,
    padding: '10px 15px',
    backgroundColor: '#e63946',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
};
