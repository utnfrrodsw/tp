import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { cn } from './../../lib/utils.js';

const alertVariants = cva(
  // Removed grid classes from here
  'relative w-full rounded-lg border px-4 py-3 text-sm',
  {
    variants: {
      variant: {
        default: 'bg-gray-200 text-gray-900 border-gray-400',
        danger:
          'text-destructive bg-red-200 text-red-900 border-red-400 [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
        info: 'bg-blue-200 text-blue-900 border-blue-400',
        success: 'bg-green-200 text-green-900 border-green-400',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Alert({
  className, //prop para aplicar los estilos que se deseen si las variantes no satisfacen
  variant, // prop para definir la variante del alert, puede ser "default", "danger", "info" o "success"
  onClose, //prop para manejar el cierre del alert. Lo que se pasa es el seter del useState booleano para controlar la visibilidad del alert
  autoClose, //prop para controlar si el alert se cierra automáticamente true/false
  autoCloseDelay = 5000, //prop para definir el tiempo de espera antes de cerrar el alert automáticamente. Por defecto es 5000ms.
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof alertVariants> & {
    onClose?: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
  }) {
  const [isClosing, setIsClosing] = useState(false);

  const DURACION_ANIMACION = 300;
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => onClose?.(), DURACION_ANIMACION);
  }, [onClose]);

  useEffect(() => {
    if (autoClose && onClose) {
      const t = setTimeout(handleClose, autoCloseDelay);
      return () => clearTimeout(t);
    }
  }, [autoClose, handleClose, autoCloseDelay, onClose]);

  return (
    <div
      data-slot="alert"
      role="alert"
      data-testid="alert"
      className={cn(
        alertVariants({ variant }),
        'pr-10 transition-all duration-300 transform-gpu',
        isClosing
          ? 'opacity-0 scale-95 -translate-y-3 ease-in' // Faster ease-in for exit
          : 'opacity-100 scale-100 translate-y-0 ease-out',
        className
      )}
      {...props}
    >
      {/* Content wrapper WITH grid (was previously on root) */}
      <div className="grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current">
        {props.children}
      </div>

      {onClose && (
        <button
          type="button"
          aria-label="Close notification"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          data-testid="close-button"
          className={cn(
            'absolute top-2 right-2 w-6 h-6',
            'flex items-center justify-center rounded-full',
            'bg-black/5 hover:bg-black/10 active:bg-black/15',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-black/20',
            'cursor-pointer pointer-events-auto z-50'
          )}
        >
          <X className="h-4 w-4 pointer-events-none" />
        </button>
      )}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
        className
      )}
      {...props}
      data-testid="alert-title"
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className
      )}
      {...props}
      data-testid="alert-description"
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
