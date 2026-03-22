import { useState, useEffect, useRef } from "react";
import { zmgPostalCodes } from "@/utils/zmgPostalCodes";

const DEBOUNCE_MS = 500;
const API_TIMEOUT_MS = 3000;
const API_URL = "https://api.zippopotam.us/MX";

const usePostalCodeLookup = (postalCode) => {
  const [colonias, setColonias] = useState([]);
  const [municipio, setMunicipio] = useState("");
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!postalCode || postalCode.length !== 5 || !/^\d{5}$/.test(postalCode)) {
      setColonias([]);
      setMunicipio("");
      setEstado("");
      setError(null);
      return;
    }

    const timer = setTimeout(() => {
      lookupPostalCode(postalCode);
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [postalCode]);

  const lookupPostalCode = async (cp) => {
    setLoading(true);
    setError(null);

    try {
      abortRef.current = new AbortController();
      const timeoutId = setTimeout(() => abortRef.current?.abort(), API_TIMEOUT_MS);

      const res = await fetch(`${API_URL}/${cp}`, {
        signal: abortRef.current.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const places = data.places || [];
        if (places.length > 0) {
          const stateValue = places[0]["state"] || "";
          const coloniasFromApi = places.map((p) => p["place name"]);
          if (stateValue.toLowerCase().includes("jalisco")) {
            setColonias(coloniasFromApi);
            setMunicipio(extractMunicipio(cp));
            setEstado("Jalisco");
            setLoading(false);
            return;
          }
        }
        fallbackOrReject(cp);
        return;
      }
      fallbackLocal(cp);
    } catch {
      fallbackLocal(cp);
    }
  };

  const extractMunicipio = (cp) => {
    const local = zmgPostalCodes[cp];
    if (local) return local.municipio;
    return "";
  };

  const fallbackLocal = (cp) => {
    const local = zmgPostalCodes[cp];
    if (local) {
      setColonias(local.colonias);
      setMunicipio(local.municipio);
      setEstado("Jalisco");
      setError(null);
    } else {
      setColonias([]);
      setMunicipio("");
      setEstado("");
      setError("Código postal no encontrado en la Zona Metropolitana de Guadalajara.");
    }
    setLoading(false);
  };

  const fallbackOrReject = (cp) => {
    const local = zmgPostalCodes[cp];
    if (local) {
      setColonias(local.colonias);
      setMunicipio(local.municipio);
      setEstado("Jalisco");
      setError(null);
    } else {
      setColonias([]);
      setMunicipio("");
      setEstado("");
      setError("Código postal no encontrado en la Zona Metropolitana de Guadalajara.");
    }
    setLoading(false);
  };

  return { colonias, municipio, estado, loading, error };
};

export default usePostalCodeLookup;
