import React, { useEffect, useState } from 'react';
import { db, rtdb } from '../hooks/useFirebaseData'; // Adjust the import path as necessary
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, update, remove } from 'firebase/database';

const HARDCODED_PASSWORD = "mcb121450"; // Set your hardcoded password here

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

  const handlePasswordCheck = (action, preset) => {
    const enteredPassword = prompt("Enter password to proceed:");
    if (enteredPassword === HARDCODED_PASSWORD) {
      action(preset);
    } else {
      alert("Incorrect password. Action denied.");
    }
  };

  const handleSaveToRealtimeDB = async (preset) => {
    try {
      const dataToUpdate = {
        tempup: preset.tempup,
        tempdown: preset.tempdown,
        moistureup: preset.moistureup,
        moisturedown: preset.moisturedown,
        humidup: preset.humidup,
        humiddown: preset.humiddown
      };

      const dataRef = ref(rtdb);
      await update(dataRef, dataToUpdate);
      alert(`Preset data successfully updated in Realtime Database`);
    } catch (error) {
      console.error('Error updating data in Realtime Database:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const presetDocRef = doc(db, 'presets', id);
      await deleteDoc(presetDocRef);

      const dataRef = ref(rtdb, id); // Adjust path as necessary
      await remove(dataRef);

      setPresets(prevPresets => prevPresets.filter(preset => preset.id !== id));

      alert('Preset successfully deleted');
    } catch (error) {
      console.error('Error deleting preset:', error);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="presets-container">
      <ToastContainer />
      {presets.length > 0 ? (
        <div className="presets-grid">
          {presets.map(preset => (
            <div key={preset.id} className="preset-card">
              <div className="preset-card-left">
                <img src={preset.photo || './assets/images/default-photo.png'} alt={preset.name} className="preset-card-img card-img-top rounded-circle mx-auto mt-3" />
                <h5 className="preset-card-title">{preset.name}</h5>
              </div>
              <div className="preset-card-right">
                <div className="preset-card-details">
                  <p className="preset-card-text"><strong> Temperature Up:</strong> {preset.tempup}°C</p>
                  <p className="preset-card-text"><strong>Temperature Down:</strong> {preset.tempdown}°C</p>
                  <p className="preset-card-text"><strong>Moisture Up:</strong> {preset.moistureup}%</p>
                  <p className="preset-card-text"><strong>Moisture Down:</strong> {preset.moisturedown}%</p>
                  <p className="preset-card-text"><strong>Humidity Up:</strong> {preset.humidup}%</p>
                  <p className="preset-card-text"><strong>Humidity Down:</strong> {preset.humiddown}%</p>
                </div>
                <button className="save-button" onClick={() => handlePasswordCheck(handleSaveToRealtimeDB, preset)}>Update in Realtime Database</button>
                <button className="delete-button" onClick={() => handlePasswordCheck(handleDelete, preset.id)}>Delete Preset</button>
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
