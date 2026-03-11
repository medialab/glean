import type { TrailPoint } from '$lib/utils/types';

type TrailEvent = PointerEvent | MouseEvent | TouchEvent;

const eventPoint = (event: TrailEvent) => {
	if ('touches' in event || 'changedTouches' in event) {
		const touchEvent = event as TouchEvent;
		const touch = touchEvent.touches?.[0] ?? touchEvent.changedTouches?.[0];
		if (!touch) return null;
		return { x: touch.clientX, y: touch.clientY };
	}

	return { x: event.clientX, y: event.clientY };
};

export const createPointerTrailMask = (trailDuration = 1000) => {
	const trailMap = new WeakMap<HTMLElement, TrailPoint[]>();

	const hasPointerEvents = () =>
		typeof window !== 'undefined' && typeof window.PointerEvent !== 'undefined';

	const applyTrailMask = (target: HTMLElement) => {
		const now = performance.now();
		const existing = trailMap.get(target) ?? [];
		const points = existing.filter((point) => now - point.t <= trailDuration);

		if (!points.length) {
			trailMap.delete(target);
			target.style.removeProperty('-webkit-mask-image');
			target.style.removeProperty('mask-image');
			return;
		}

		trailMap.set(target, points);

		const gradients = points
			.map((point) => {
				const age = (now - point.t) / trailDuration;
				const opacity = Math.max(0, 1 - age);
				const inner = 7;
				const outer = 14;

				return `radial-gradient(
					circle at ${point.x}% ${point.y}%,
					rgba(0,0,0,${opacity}) 0%,
					rgba(0,0,0,${opacity}) ${inner}%,
					rgba(0,0,0,0) ${outer}%,
					rgba(0,0,0,0) 100%
				)`;
			})
			.join(', ');

		target.style.webkitMaskImage = gradients;
		target.style.maskImage = gradients;

		requestAnimationFrame(() => applyTrailMask(target));
	};

	const updateClipFromInput = (event: TrailEvent) => {
		const target = event.currentTarget as HTMLElement | null;
		if (!target) return;

		const point = eventPoint(event);
		if (!point) return;

		const rect = target.getBoundingClientRect();
		const x = ((point.x - rect.left) / rect.width) * 100;
		const y = ((point.y - rect.top) / rect.height) * 100;

		const now = performance.now();
		const existing = trailMap.get(target) ?? [];
		existing.push({ x, y, t: now });
		trailMap.set(target, existing);

		applyTrailMask(target);
	};

	const resetClip = (event: TrailEvent) => {
		const target = event.currentTarget as HTMLElement | null;
		if (!target) return;

		setTimeout(() => {
			if (!trailMap.has(target)) return;
			trailMap.delete(target);
			target.style.removeProperty('-webkit-mask-image');
			target.style.removeProperty('mask-image');
		}, trailDuration);
	};

	const handlePointerEnter = (event: PointerEvent) => {
		if (!hasPointerEvents()) return;
		updateClipFromInput(event);
	};

	const handlePointerMove = (event: PointerEvent) => {
		if (!hasPointerEvents()) return;
		updateClipFromInput(event);
	};

	const handlePointerLeave = (event: PointerEvent) => {
		if (!hasPointerEvents()) return;
		resetClip(event);
	};

	const handleMouseEnter = (event: MouseEvent) => {
		if (hasPointerEvents()) return;
		updateClipFromInput(event);
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (hasPointerEvents()) return;
		updateClipFromInput(event);
	};

	const handleMouseLeave = (event: MouseEvent) => {
		if (hasPointerEvents()) return;
		resetClip(event);
	};

	const handleTouchStart = (event: TouchEvent) => {
		if (hasPointerEvents()) return;
		updateClipFromInput(event);
	};

	const handleTouchMove = (event: TouchEvent) => {
		if (hasPointerEvents()) return;
		updateClipFromInput(event);
	};

	const handleTouchEnd = (event: TouchEvent) => {
		if (hasPointerEvents()) return;
		resetClip(event);
	};

	return {
		handlePointerEnter,
		handlePointerMove,
		handlePointerLeave,
		handleMouseEnter,
		handleMouseMove,
		handleMouseLeave,
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd
	};
};
