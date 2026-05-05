import { useState, useEffect } from 'react';
import { getLessons } from '../services/api';
 
export function useLessons(token) {
  const [zones,      setZones]      = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
 
  useEffect(() => {
    if (!token) return;
 
    async function fetchLessons() {
      setLoading(true);
      setError(null);
      try {
        const lessons = await getLessons(token);
 
        // Build zone map preserving insertion order
        const zoneMap = new Map();
 
        for (const lesson of lessons) {
          const zoneId = lesson.zone?.id ?? 'uncategorised';
          if (!zoneMap.has(zoneId)) {
            zoneMap.set(zoneId, {
              id:       zoneId,
              label:    lesson.zone?.label    ?? 'Other',
              subtitle: lesson.zone?.subtitle ?? '',
              modules:  [],
            });
          }
          const zone = zoneMap.get(zoneId);
          // Avoid duplicates
          if (!zone.modules.find(m => m.id === lesson.id)) {
            zone.modules.push({ id: lesson.id, title: lesson.title, icon: lesson.icon ?? '' });
          }
        }
 
        const builtZones  = Array.from(zoneMap.values());
        const builtModules = builtZones.flatMap(z => z.modules);
 
        setZones(builtZones);
        setAllModules(builtModules);
      } catch (err) {
        console.error('useLessons fetch error:', err);
        setError(err.message ?? 'Failed to load lessons');
      } finally {
        setLoading(false);
      }
    }
 
    fetchLessons();
  }, [token]);
 
  return { zones, allModules, loading, error };
}
 