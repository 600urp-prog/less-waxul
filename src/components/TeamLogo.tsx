import { useState, useEffect } from 'react';

const cache = new Map<string, string | null>();

// Uses TheSportsDB free API to fetch team badges
async function fetchTeamBadge(teamName: string): Promise<string | null> {
  if (cache.has(teamName)) return cache.get(teamName)!;
  
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`
    );
    const data = await res.json();
    const badge = data?.teams?.[0]?.strBadge || null;
    cache.set(teamName, badge);
    return badge;
  } catch {
    cache.set(teamName, null);
    return null;
  }
}

async function fetchPlayerThumb(playerName: string): Promise<string | null> {
  if (cache.has(`player:${playerName}`)) return cache.get(`player:${playerName}`)!;

  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(playerName)}`
    );
    const data = await res.json();
    const thumb = data?.player?.[0]?.strCutout || data?.player?.[0]?.strThumb || null;
    cache.set(`player:${playerName}`, thumb);
    return thumb;
  } catch {
    cache.set(`player:${playerName}`, null);
    return null;
  }
}

// Individual sports where "teams" are actually players
const INDIVIDUAL_SPORTS = ['tennis', 'mma', 'boxing', 'golf', 'darts', 'snooker', 'table_tennis'];

interface TeamLogoProps {
  name: string;
  sportKey: string;
  size?: number;
  className?: string;
}

export function TeamLogo({ name, sportKey, size = 20, className = '' }: TeamLogoProps) {
  const [src, setSrc] = useState<string | null>(null);

  const isPlayer = INDIVIDUAL_SPORTS.some(s => sportKey.startsWith(s));

  useEffect(() => {
    let mounted = true;
    const fn = isPlayer ? fetchPlayerThumb : fetchTeamBadge;
    fn(name).then(url => { if (mounted) setSrc(url); });
    return () => { mounted = false; };
  }, [name, isPlayer]);

  if (!src) return null;

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      className={`object-contain rounded-sm ${className}`}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
}
