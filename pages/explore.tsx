// pages/explore.tsx

import { useEffect, useState } from 'react';
import {
  db,
  auth,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface Idea {
  id: string;
  title: string;
  abstract: string;
  userId: string;
}

export default function ExploreIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAbstract, setEditAbstract] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    fetchIdeas();
    return () => unsubscribe();
  }, []);

  const fetchIdeas = async () => {
    const snapshot = await getDocs(collection(db, 'ideas'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Idea));
    setIdeas(data);
  };

  const handleInterest = (id: string) => {
    setRevealedIds(prev => [...prev, id]);
  };

  const startEditing = (idea: Idea) => {
    setEditingId(idea.id);
    setEditTitle(idea.title);
    setEditAbstract(idea.abstract);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditAbstract('');
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    await updateDoc(doc(db, 'ideas', editingId), {
      title: editTitle,
      abstract: editAbstract,
    });
    setEditingId(null);
    fetchIdeas();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'ideas', id));
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div style={styles.container}>
      <h2>🌐 Explore Project Ideas</h2>
      {ideas.map((idea) => (
        <div key={idea.id} style={styles.card}>
          {editingId === idea.id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={styles.input}
              />
              <textarea
                value={editAbstract}
                onChange={(e) => setEditAbstract(e.target.value)}
                style={{ ...styles.input, height: 80 }}
              />
              <button onClick={handleUpdate} style={styles.btn}>✅ Save</button>
              <button onClick={cancelEditing} style={{ ...styles.btn, backgroundColor: '#aaa' }}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{idea.title}</h3>
              {revealedIds.includes(idea.id) ? (
                <>
                  <p><strong>Abstract:</strong> {idea.abstract}</p>
                  {user?.uid === idea.userId && (
                    <>
                      <button onClick={() => startEditing(idea)} style={styles.btn}>✏️ Edit</button>
                      <button onClick={() => handleDelete(idea.id)} style={{ ...styles.btn, backgroundColor: '#e63946' }}>🗑 Delete</button>
                    </>
                  )}
                </>
              ) : (
                <button onClick={() => handleInterest(idea.id)} style={styles.btn}>👀 I’m Interested</button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 30,
    maxWidth: 800,
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#660a3e'
  },
  input: {
    width: '100%',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    border: '1px solid #ccc'
  },
  btn: {
    marginRight: 10,
    padding: '6px 12px',
    border: 'none',
    borderRadius: 5,
    backgroundColor: '#0070f3',
    color: '#fff',
    cursor: 'pointer'
  }
};
