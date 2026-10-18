// src/components/EntityHeader/EntityHeader.tsx
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import Wrapper from '@/components/Wrapper/Wrapper';
import { ViewToggle, type ViewMode } from './ViewToggle';
import styles from './EntityHeader.module.css';

interface EntityHeaderProps {
  title: string;
  children?: ReactNode;
  view?: ViewMode;
  onViewChange?: (view: ViewMode) => void;
}

export const EntityHeader = ({
  title,
  children,
  view,
  onViewChange,
}: EntityHeaderProps) => {
  const [actionsOpen, setActionsOpen] = useState(false);
  const [useActionsMenu, setUseActionsMenu] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const actionListRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const actionGroup = actionsRef.current;
    const actionList = actionListRef.current;
    if (!actionGroup || !actionList) return;
    const row = actionGroup.parentElement;
    const titleElement = row?.firstElementChild;
    if (!row || !titleElement) return;
    const viewToggle = row.querySelector<HTMLElement>(`.${styles.toggle}`);

    const updateLayout = () => {
      const rowStyle = getComputedStyle(row);
      const gap = parseFloat(rowStyle.columnGap) || 0;
      const fixedWidth = titleElement.getBoundingClientRect().width + (viewToggle?.getBoundingClientRect().width ?? 0);
      const occupiedGaps = gap * (viewToggle ? 2 : 1);
      const availableWidth = row.clientWidth - fixedWidth - occupiedGaps;
      const actionStyle = getComputedStyle(actionList);
      const actionGap = parseFloat(actionStyle.columnGap) || 0;
      const actionItems = Array.from(actionList.children) as HTMLElement[];
      const requiredWidth = actionItems.reduce((width, item) => {
        const style = getComputedStyle(item);
        return width + item.getBoundingClientRect().width +
          (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
      }, actionGap * Math.max(0, actionItems.length - 1));

      setUseActionsMenu(requiredWidth > availableWidth + 1);
    };

    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(row);
    resizeObserver.observe(actionList);
    resizeObserver.observe(titleElement);
    if (viewToggle) resizeObserver.observe(viewToggle);
    Array.from(actionList.children).forEach((item) => resizeObserver.observe(item));
    updateLayout();

    return () => resizeObserver.disconnect();
  }, [children, title, view, onViewChange]);

  useEffect(() => {
    if (!actionsOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActionsOpen(false);
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) setActionsOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsideClick);
    };
  }, [actionsOpen]);

  return (
    <Wrapper>
      <h1 className={styles.title}>{title}</h1>

      <div
        ref={actionsRef}
        className={`${styles.actionGroup} ${useActionsMenu ? styles.actionMenuMode : ''}`}
      >
        {children && (
          <><button
            type="button"
            className={styles.mobileActionsTrigger}
            aria-label="Acciones disponibles"
            aria-expanded={actionsOpen}
            aria-controls={actionsOpen ? 'entity-actions-panel' : undefined}
            onClick={() => setActionsOpen((open) => !open)}
          >
            <Menu size={16} aria-hidden="true" />
            Acciones
            <ChevronDown
              size={15}
              aria-hidden="true"
              className={actionsOpen ? styles.actionsChevronOpen : styles.actionsChevron} />
          </button><div
            ref={actionListRef}
            id={actionsOpen && useActionsMenu ? 'entity-actions-panel' : undefined}
            className={`${styles.actions} ${actionsOpen ? styles.actionsMenuOpen : ''}`}
            role={useActionsMenu ? 'group' : undefined}
            aria-label={useActionsMenu ? `Acciones de ${title}` : undefined}
            onClick={(event) => {
              if (useActionsMenu && (event.target as HTMLElement).closest('button:not(:disabled)')) {
                setActionsOpen(false);
              }
            }}
          >
              {children}
            </div></>
        )}
      </div>


      {view && onViewChange && <ViewToggle value={view} onChange={onViewChange} />}
    </Wrapper>
  );
};