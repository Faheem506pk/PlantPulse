import React, { useEffect, useState } from 'react';
import { db, rtdb } from '../hooks/useFirebaseData'; // Adjust the import path as necessary
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, update, remove } from 'firebase/database';

export default function Presets() {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const presetsCollection = collection(db, 'presets');
        const presetsSnapshot = await getDocs(presetsCollection);
        const presetsList = presetsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPresets(presetsList);
      } catch (error) {
        console.error('Error fetching presets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresets();
  }, []);

  const handleSaveToRealtimeDB = async (preset) => {
    try {
      // Construct the data to update
      const dataToUpdate = {
        tempup: preset.tempup,
        tempdown: preset.tempdown,
        moistureup: preset.moistureup,
        moisturedown: preset.moisturedown,
        humidup: preset.humidup,
        humiddown: preset.humiddown
      };

      // Directly update the data at the root level (no additional node)
      const dataRef = ref(rtdb);
      await update(dataRef, dataToUpdate);
      alert(`Preset data successfully updated in Realtime Database`);
    } catch (error) {
      console.error('Error updating data in Realtime Database:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Delete from Firestore
      const presetDocRef = doc(db, 'presets', id);
      await deleteDoc(presetDocRef);

      // Delete from Realtime Database (you should ensure that `id` corresponds to the correct node)
      const dataRef = ref(rtdb, id); // Adjust path as necessary
      await remove(dataRef);

      // Update local state
      setPresets(prevPresets => prevPresets.filter(preset => preset.id !== id));

      alert('Preset successfully deleted');
    } catch (error) {
      console.error('Error deleting preset:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="presets-container">
      {presets.length > 0 ? (
        <div className="presets-grid">
          {presets.map(preset => (
            <div key={preset.id} className="preset-card">
              <div className="preset-card-left">
                <img src={preset.photo || './assets/images/default-photo.png'} alt={preset.name} className="preset-card-img" />
              </div> 
              <div className="preset-card-right">
                <h5 className="preset-card-title">{preset.name}</h5>
                <div className="preset-card-details">
                  <p className="preset-card-text">Temperature Up: {preset.tempup}°C</p>
                  <p className="preset-card-text">Temperature Down: {preset.tempdown}°C</p>
                  <p className="preset-card-text">Moisture Up: {preset.moistureup}%</p>
                  <p className="preset-card-text">Moisture Down: {preset.moisturedown}%</p>
                  <p className="preset-card-text">Humidity Up: {preset.humidup}%</p>
                  <p className="preset-card-text">Humidity Down: {preset.humiddown}%</p>
                </div>
                <button className="save-button" onClick={() => handleSaveToRealtimeDB(preset)}>Update in Realtime Database</button>
                <button className="delete-button" onClick={() => handleDelete(preset.id)}>Delete Preset</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No presets available</p>
      )}
    </div>
  );
}