import { useLayoutEffect, useRef } from 'react';
import styles from './Wrapper.module.css';


const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const updateHeight = () => {
      const style = getComputedStyle(wrapper);
      const verticalPadding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      wrapper.style.height = `${content.offsetHeight + verticalPadding}px`;
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(content);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={contentRef} className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default Wrapper;