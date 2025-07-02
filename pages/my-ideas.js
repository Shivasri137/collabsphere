// pages/post-idea.js

import { useState, useEffect } from 'react';
import { db, collection, addDoc, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function PostIdea() {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else router.push('/login');
    });

    return () => unsubscribe();
  }, [router]);

  const handlePost = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage('❌ Please log in to post an idea.');
      return;
    }

    try {
      await addDoc(collection(db, 'ideas'), {
        title,
        abstract,
        interestedUsers: [],
        createdAt: new Date(),
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName
      });

      setMessage('✅ Idea posted successfully!');
      setTitle('');
      setAbstract('');
    } catch (error) {
      console.error('Error posting idea:', error);
      setMessage('❌ Failed to post idea.');
    }
  };

  return (
    <div style={pageStyle}>
      <h2 style={headingStyle}>🧠 Post a New Project Idea</h2>
      <form onSubmit={handlePost}>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Project Abstract (visible only after interest)"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          required
          style={{ ...inputStyle, height: 100 }}
        />
        <button type="submit" style={btnStyle}>📤 Post Idea</button>
      </form>
      {message && <p style={msgStyle}>{message}</p>}
    </div>
  );
}

// 🎨 Styling
const pageStyle = {
  padding: '30px',
  maxWidth: '600px',
  margin: '40px auto',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  fontFamily: 'sans-serif',
  color: '#111',
};

const headingStyle = {
  fontSize: '1.8rem',
  marginBottom: '20px',
  textAlign: 'center',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '15px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  color: '#333',
  backgroundColor: '#fff',
};

const btnStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '1rem',
  backgroundColor: '#0070f3',
  color: '#ffffff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const msgStyle = {
  marginTop: '15px',
  fontSize: '0.95rem',
  color: '#0070f3',
  textAlign: 'center',
};
