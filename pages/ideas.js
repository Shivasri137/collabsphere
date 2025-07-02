// pages/ideas.js

import { useEffect, useState } from 'react';
import { db, collection, getDocs, updateDoc, doc } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [revealedIds, setRevealedIds] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else setUser(null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchIdeas = async () => {
      const snapshot = await getDocs(collection(db, 'ideas'));
      const ideasList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIdeas(ideasList);
    };

    fetchIdeas();
  }, []);

  const handleInterest = async (id) => {
    if (!user) return alert('Please login to show interest.');

    const ideaRef = doc(db, 'ideas', id);
    const currentIdea = ideas.find(i => i.id === id);

    const existingUsers = currentIdea.interestedUsers || [];

    const alreadyInterested = existingUsers.some(u => u.email === user.email);
    if (alreadyInterested) return alert("You’ve already shown interest.");

    const updatedUsers = [...existingUsers, {
      name: user.displayName,
      email: user.email
    }];

    await updateDoc(ideaRef, { interestedUsers: updatedUsers });
    setRevealedIds(prev => [...prev, id]);
  };

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
      <h2>Explore Project Ideas</h2>
      {ideas.map((idea) => (
        <div key={idea.id} style={{ border: '1px solid #ccc', padding: 15, marginBottom: 20, borderRadius: 8 }}>
          <h3>{idea.title}</h3>
          {revealedIds.includes(idea.id) ? (
            <p><strong>Abstract:</strong> {idea.abstract}</p>
          ) : (
            <button onClick={() => handleInterest(idea.id)}>I'm Interested</button>
          )}
        </div>
      ))}
    </div>
  );
}
