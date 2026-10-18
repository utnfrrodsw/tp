import type { ReactNode } from 'react';
import IconCheck from '@/assets/check.svg';
import styles from './DataCard.module.css';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export interface CardFieldConfig<T extends object = object> {
  key: keyof T | 'actions';
  label: string;
  format?: (value: unknown) => string;
  render?: (item: T) => ReactNode;
}

interface DataCardProps<T extends object> {
  data: T[];
  idField: keyof T;
  titleField?: keyof T;
  descriptionField?: keyof T;
  imageField?: keyof T;
  fields: CardFieldConfig<T>[];
  renderAction?: (item: T) => ReactNode;
  renderFooter?: (item: T) => ReactNode;
  caption?: string;
  onCardClick?: (item: T) => void;
  onSelectItem?: (item: T) => void;
  selectedId?: T[keyof T];
  selectedIds?: T[keyof T][];
}

const getValue = <T extends object>(item: T, key: CardFieldConfig<T>['key'],): unknown => {
  return key === 'actions' ? undefined : item[key];
};

function DataCard<T extends object>({
  data,
  idField,
  titleField,
  descriptionField,
  imageField,
  fields,
  renderAction,
  renderFooter,
  caption,
  onCardClick,
  onSelectItem,
  selectedId,
  selectedIds = [],
}: DataCardProps<T>) {
  return (
    <div className={styles.container}>
      {caption && <div className={styles.caption}>{caption}</div>}

      {data.length === 0 ? (
        <div className={styles.empty}>
          No hay registros para mostrar.
        </div>
      ) : (
        <div className={styles.grid}>
          {data.map((item) => {
            const id = item[idField];
            const isSelected = selectedId !== undefined && id === selectedId;
            const isMultiSelected = selectedIds.includes(id);

            const titleValue =
              titleField !== undefined ? item[titleField] : undefined;

            const descriptionValue =
              descriptionField !== undefined
                ? item[descriptionField]
                : undefined;
            const imageValue = imageField !== undefined ? item[imageField] : undefined;
            const imageUrl = typeof imageValue === 'string' ? imageValue.trim() : '';

            return (
              <Card
                key={String(id)}
                className={[
                  styles.card,
                  onCardClick ? styles.clickable : '',
                  isMultiSelected ? styles.selected : isSelected ? styles.individuallySelected : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onCardClick?.(item)}
              >
                {onSelectItem && (
                  <button
                    type="button"
                    className={styles.selectionCheckbox}
                    aria-pressed={isMultiSelected}
                    aria-label={`Seleccionar elemento ${String(id)}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectItem(item);
                    }}
                  >
                    {isMultiSelected && <img src={IconCheck} alt="" />}
                  </button>
                )}
                {(titleField || descriptionField || renderAction) && (
                  <CardHeader>
                    {imageUrl && (
                      <span className={styles.headerImageSlot}>
                        <img src={imageUrl} alt="" />
                      </span>
                    )}

                    <div className={styles.heading}>
                      {titleField && (
                        <CardTitle>
                          {String(titleValue ?? '')}
                        </CardTitle>
                      )}

                      {descriptionField && (
                        <CardDescription>
                          {String(descriptionValue ?? '')}
                        </CardDescription>
                      )}
                    </div>

                    {renderAction && (
                      <CardAction
                        onClick={(e) => e.stopPropagation()}
                      >
                        {renderAction(item)}
                      </CardAction>
                    )}
                  </CardHeader>
                )}

                <CardContent>
                  <div className={styles.fields}>
                    {fields.map((field) => {
                      const value = getValue(item, field.key);

                      return (
                        <div
                          key={String(field.key)}
                          className={styles.field}
                        >
                          <span className={styles.label}>
                            {field.label}
                          </span>

                          <div className={styles.value}>
                            {field.render
                              ? field.render(item)
                              : field.format
                                ? field.format(value)
                                : String(value ?? '')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>

                {renderFooter && (
                  <CardFooter onClick={(e) => e.stopPropagation()}>
                    {renderFooter(item)}
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DataCard;