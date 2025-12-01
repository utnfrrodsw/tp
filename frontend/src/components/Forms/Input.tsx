import { cn } from '../../lib/utils.js';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        '!w-36 text-secondary text-base font-medium bg-white border-2 border-gray-300 rounded-md px-4 py-1 shadow-2xl transition duration-300 outline-none',
        // Focus and invalid states
        'focus:border-naranja-1 focus:ring-2 focus:ring-naranja-1/50',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        // Disabled state
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
export { Input };
