import { useEffect, useRef } from 'react';

export default function Cursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    };

    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    };

    document.addEventListener('mousemove', onMove);
    animRing();

    const enterHover = () => {
      cursor.style.width = '18px'; cursor.style.height = '18px';
      ring.style.width = '56px'; ring.style.height = '56px';
      ring.style.borderColor = 'rgba(137,170,204,0.7)';
    };
    const leaveHover = () => {
      cursor.style.width = '10px'; cursor.style.height = '10px';
      ring.style.width = '36px'; ring.style.height = '36px';
      ring.style.borderColor = 'rgba(137,170,204,0.45)';
    };

    const attachListeners = () => {
      const hoverEls = document.querySelectorAll('a,button,.bento-item,.play-btn');
      hoverEls.forEach(el => {
        el.addEventListener('mouseenter', enterHover);
        el.addEventListener('mouseleave', leaveHover);
      });
    };
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    attachListeners();

    return () => {
      document.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
