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
        userName: user.displayName,
        userEmail: user.email
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
    <div style={{ padding: 30, maxWidth: 600, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: 10 }}>Post a New Project Idea</h2>

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
          placeholder="Project Abstract (will be hidden until someone shows interest)"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          required
          style={{ ...inputStyle, height: 100 }}
        />

        <button type="submit" style={btnStyle}>📤 Post Idea</button>
      </form>

      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: 10,
  marginBottom: 15,
  borderRadius: 5,
  border: '1px solid #ccc'
};

const btnStyle = {
  padding: '10px 16px',
  fontSize: '1rem',
  backgroundColor: '#0070f3',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer'
};
