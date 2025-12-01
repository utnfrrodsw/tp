import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  MouseEvent,
  ChangeEvent,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Search, X } from 'lucide-react';

interface ComboItem {
  id: number;
  nombreTarea: string;
}

interface ComboInputProps {
  items?: ComboItem[];
  placeholder?: string;
  onSelect?: (item: ComboItem) => void;
  className?: string;
}

export interface ComboInputRef {
  clearInput: () => void;
}

const DEFAULT_ITEMS: ComboItem[] = [];

const ComboInput = forwardRef<ComboInputRef, ComboInputProps>(
  (
    { items = [], placeholder = 'Buscar tarea', onSelect, className = '' },
    ref
  ) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [filteredItems, setFilteredItems] = useState<ComboItem[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const sampleItems = useMemo(() => {
      return items.length > 0 ? items : DEFAULT_ITEMS;
    }, [items]);

    useEffect(() => {
      if (inputValue.trim() === '') {
        setFilteredItems(sampleItems);
      } else {
        const filtered = sampleItems.filter((item: ComboItem) =>
          item.nombreTarea.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredItems(filtered);
      }
      setSelectedIndex(0);
    }, [inputValue, sampleItems]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
      setInputValue(e.target.value);
      setIsOpen(true);
    };

    const handleInputFocus = (): void => {
      setIsOpen(true);
    };

    const handleItemClick = (item: ComboItem): void => {
      setInputValue(item.nombreTarea);
      setIsOpen(false);
      console.log('Selected item:', item);
      onSelect?.(item);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev: number) =>
            prev < filteredItems.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev: number) =>
            prev > 0 ? prev - 1 : filteredItems.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            handleItemClick(filteredItems[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    };

    const clearInput = (): void => {
      setInputValue('');
      setIsOpen(false);
      inputRef.current?.blur();
    };

    useImperativeHandle(ref, () => ({
      clearInput,
    }));

    const handleClickOutside = (e: Event): void => {
      const target = e.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const highlightMatch = (
      text: string,
      query: string
    ): (React.ReactElement | string)[] => {
      if (!query.trim()) return [text];

      const regex = new RegExp(`(${query})`, 'gi');
      const parts = text.split(regex);

      return parts.map((part: string, i: number) =>
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200 text-yellow-800">
            {part}
          </span>
        ) : (
          part
        )
      );
    };

    const handleItemMouseClick =
      (item: ComboItem) =>
      (e: MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();
        handleItemClick(item);
      };

    return (
      <div className="relative">
        {/* Input Field */}
        <div className={`relative ${className}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-3 w-4 text-gray-700" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white shadow-sm"
          />
          {inputValue && (
            <button
              onClick={clearInput}
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          >
            {filteredItems.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                No se encontraron tareas con: "{inputValue}"
              </div>
            ) : (
              <div className="py-2">
                {filteredItems.map((item: ComboItem, index: number) => (
                  <div
                    key={item.id}
                    onClick={handleItemMouseClick(item)}
                    className={`px-4 py-2 cursor-pointer transition-colors flex items-center gap-3 ${
                      index === selectedIndex
                        ? 'bg-blue-50 border-r-2 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {highlightMatch(item.nombreTarea, inputValue)}
                      </div>
                    </div>
                    {index === selectedIndex && (
                      <div className="text-xs text-blue-600 font-medium">
                        Enter to select
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {filteredItems.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
                Use ↑↓ arrow keys to navigate • Enter to select • Esc to close
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

ComboInput.displayName = 'ComboInput';

export default ComboInput;
