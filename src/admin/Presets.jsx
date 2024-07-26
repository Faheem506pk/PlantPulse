import React, { useEffect, useState } from 'react';
import { db } from '../hooks/useFirebaseData'; // Adjust the import path as necessary
import { collection, getDocs } from 'firebase/firestore';


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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="presets-container">
      {presets.length > 0 ? (
        <div className="presets-grid">
          {presets.map(preset => (
            <div key={preset.id} className="preset-card">
              <img src={preset.photo || './assets/images/default-photo.png'} alt={preset.name} className="preset-card-img" />
              <div className="preset-card-body">
                <h5 className="preset-card-title">{preset.name}</h5>
                <p className="preset-card-text">Temperature Up: {preset.tempup}°C</p>
                <p className="preset-card-text">Temperature Down: {preset.tempdown}°C</p>
                <p className="preset-card-text">Moisture Up: {preset.moistureup}%</p>
                <p className="preset-card-text">Moisture Down: {preset.moisturedown}%</p>
                <p className="preset-card-text">Humidity Up: {preset.humidup}%</p>
                <p className="preset-card-text">Humidity Down: {preset.humiddown}%</p>
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
