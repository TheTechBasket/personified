import avatars from './index.json' with { type: 'json' };

export { avatars };

const SIZES = [512, 256, 128];

/** Avatars matching every option given. `hair` matches each key given; `skin` is one tone (1 light to 5 dark) or a [min, max] range. */
export function find({ region, country, gender, band, mood, skin, hair, backdrop, trait, person } = {}) {
	const [lo, hi] = Array.isArray(skin) ? skin : [skin, skin];
	return avatars.filter(
		(a) =>
			(!region || a.region === region) &&
			(!country || a.country === country) &&
			(!gender || a.gender === gender) &&
			(!band || a.band === band) &&
			(!mood || a.mood === mood) &&
			(!person || a.person === person) &&
			(!trait || a.traits.includes(trait)) &&
			(!backdrop || a.backdrop === backdrop) &&
			(!hair || Object.entries(hair).every(([k, v]) => a.hair[k] === v)) &&
			(skin == null || (a.skin >= lo && a.skin <= hi)),
	);
}

/** Same avatar for the same seed, for example a user email or id. Same hash as the allsvgicons.com playground. */
export function pick(seed, options) {
	const list = options ? find(options) : avatars;
	let h = 0;
	for (const ch of String(seed)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
	return list[h % list.length];
}

/** URL of an avatar image inside this package (file: URL in Node, asset URL in bundlers). */
export function file(id, px = 512) {
	if (!SIZES.includes(px)) throw new Error(`px must be one of ${SIZES.join(', ')}`);
	return new URL(`./img/${px}/${id}.webp`, import.meta.url).href;
}
