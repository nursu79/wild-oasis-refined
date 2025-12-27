"use client";

import { useState, useCallback, useEffect, useRef } from "react";

// Helper to calculate distance between two points in meters
function getDistance(p1, p2) {
  if (!p1 || !p2) return 0;
  const R = 6371e3; // metres
  const φ1 = p1[0] * Math.PI/180;
  const φ2 = p2[0] * Math.PI/180;
  const Δφ = (p2[0]-p1[0]) * Math.PI/180;
  const Δλ = (p2[1]-p1[1]) * Math.PI/180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function useRouting() {
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [error, setError] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const watcherRef = useRef(null);
  const lastCabinPos = useRef(null);

  const fetchRoute = useCallback(async (start, end, silent = false) => {
    if (!start || !end) return;
    if (!silent) setIsLoading(true);
    else setIsRecalculating(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      );
      
      if (!response.ok) throw new Error("OSRM server unreachable");
      const data = await response.json();
      
      if (data.code !== "Ok" || !data.routes[0]) throw new Error("No driving route found");
      
      const pathPoints = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      setRoute({
        points: pathPoints,
        distance: data.routes[0].distance,
        duration: data.routes[0].duration,
        isFallback: false
      });
    } catch (err) {
      console.warn("OSRM Failure, falling back to straight-line distance:", err);
      // Fail-Safe: Straight line distance
      const distance = getDistance(start, end);
      setRoute({
        points: [start, end], // Just a straight line
        distance: distance,
        duration: (distance / 40) * 3600, // Estimate based on 40km/h avg
        isFallback: true
      });
    } finally {
      setIsLoading(false);
      setIsRecalculating(false);
    }
  }, []);

  const startNavigation = useCallback((startPos, destinationPos) => {
    setIsNavigating(true);
    lastCabinPos.current = destinationPos;
    fetchRoute(startPos, destinationPos);

    if (typeof window !== "undefined" && navigator.geolocation) {
      watcherRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setCurrentPosition(newPos);
          
          // Recalculation logic: if user is > 50m away from the start of current route (or nearest point)
          // For simplicity, we trigger if they move significantly from current pos
          // In a real app we'd find the distance to the polyline.
          // Here we'll trigger if they move more than 100m from the last "starting" point of the fetch
        },
        (err) => console.error("Nav watcher error:", err),
        { enableHighAccuracy: true }
      );
    }
  }, [fetchRoute]);

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
    setRoute(null);
    setCurrentPosition(null);
    if (watcherRef.current !== null) {
      navigator.geolocation.clearWatch(watcherRef.current);
    }
  }, []);

  // Effect to handle recalculation when moving far from start
  useEffect(() => {
    if (isNavigating && currentPosition && lastCabinPos.current && route) {
       const distToPathStart = getDistance(currentPosition, route.points[0]);
       if (distToPathStart > 100) { // 100m deviation trigger
          fetchRoute(currentPosition, lastCabinPos.current, true);
       }
    }
  }, [currentPosition, isNavigating, route, fetchRoute]);

  useEffect(() => {
    return () => stopNavigation();
  }, [stopNavigation]);

  return { 
    route, 
    isLoading, 
    isRecalculating, 
    error, 
    isNavigating, 
    currentPosition,
    startNavigation, 
    stopNavigation 
  };
}
