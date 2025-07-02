// pages/index.tsx

import { useEffect, useState } from 'react';
import { auth, provider, db, collection, getDocs } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [ideaCount, setIdeaCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserIdeas();
    }
  }, [user]);

  const fetchUserIdeas = async () => {
    const snapshot = await getDocs(collection(db, 'ideas'));
    const userIdeas = snapshot.docs.filter(doc => doc.data().userId === user.uid);
    setIdeaCount(userIdeas.length);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleExplore = () => {
    router.push('/explore');
  };

  const handlePost = () => {
    router.push('/post-idea');
  };

  return (
    <main style={styles.main}>
      <div style={styles.center}>
        <h1 style={styles.heading}>
          🚀 Welcome to <span style={{ color: '#f37000' }}>CollabSphere</span>
        </h1>
        <p style={styles.subtitle}>
          Connect with collaborators and bring your ideas to life.
        </p>

        {!user ? (
          <button style={styles.button} onClick={handleLogin}>
            🔐 Sign in with Google
          </button>
        ) : (
          <>
            <p style={styles.loggedIn}>Welcome, {user.displayName}</p>

            {/* ✅ Dashboard Section */}
            <div style={styles.dashboard}>
              <h3 style={{ color: '#e8edbe' }}>📊 Dashboard</h3>
              <p><strong>Name:</strong> {user.displayName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Ideas Posted:</strong> {ideaCount}</p>

              <div style={{ marginTop: 20 }}>
                <button style={styles.button} onClick={handleExplore}>🌐 Explore Ideas</button>
                <button style={styles.button} onClick={handlePost}>📝 Post New Idea</button>
                <button style={styles.button} onClick={() => router.push('/profile')}>👤 Profile</button> {/* ✅ Add this */}
                <button style={styles.logout} onClick={handleLogout}>🚪 Logout</button>
              </div>

            </div>
          </>
        )}
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 2rem',
    background: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
  },
  center: {
    textAlign: 'center',
    maxWidth: '700px',
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
  },
  heading: {
    fontSize: '2.2rem',
    marginBottom: '20px',
    color: '#222',
  },
  subtitle: {
    fontSize: '1rem',
    marginBottom: '30px',
    color: '#555',
  },
  loggedIn: {
    fontSize: '1.1rem',
    color: '#333',
    marginBottom: '20px',
  },
  button: {
    display: 'inline-block',
    margin: '10px',
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  logout: {
    marginTop: '15px',
    padding: '8px 16px',
    fontSize: '0.95rem',
    backgroundColor: '#e63946',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  dashboard: {
    marginTop: '30px',
    padding: '20px',
    border: '1px solid #bbb',
    borderRadius: '10px',
    backgroundColor: '#400638',
    textAlign: 'left',
  },
};
